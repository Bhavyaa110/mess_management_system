from flask import Flask, jsonify, request, send_from_directory
import mysql.connector
from flask_cors import CORS
import os
from backend.db_config import get_db_connection
from datetime import datetime

# --------- App Setup ---------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend', 'dist')

app = Flask(__name__, static_folder=FRONTEND_DIST_DIR, static_url_path='/')
CORS(app, origins="http://localhost:5173", supports_credentials=True)

def auto_mark_present():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        now = datetime.now()
        two_hours_from_now = now + timedelta(hours=2)

        # Fetch meals starting in the next 2 hours
        cursor.execute("""
            SELECT meal_id
            FROM Meals M
            JOIN Meal_Timings T ON M.meal_type = T.meal_type
            WHERE TIME(T.start_time) BETWEEN %s AND %s
        """, (now.time(), two_hours_from_now.time()))
        meals = cursor.fetchall()

        for meal in meals:
            meal_id = meal['meal_id']

            # Auto-mark users with tickets but not cancelled as "present"
            cursor.execute("""
                INSERT INTO Attendance (user_id, meal_id, status, scan_time)
                SELECT user_id, %s, 'present', CURRENT_TIMESTAMP
                FROM Tickets
                WHERE meal_id = %s AND status != 'Cancelled'
                ON DUPLICATE KEY UPDATE status = 'present', scan_time = CURRENT_TIMESTAMP
            """, (meal_id, meal_id))
            conn.commit()

        print("Auto-mark present completed for meals starting soon.")
    except Exception as e:
        print("Error in auto-mark present:", e)
    finally:
        if conn:
            conn.close()

# --------- Frontend Serving ---------
@app.route('/')
def index():
    return "Mess Management System API is running."
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(FRONTEND_DIST_DIR, path)):
        return send_from_directory(FRONTEND_DIST_DIR, path)
    else:
        return send_from_directory(FRONTEND_DIST_DIR, 'index.html')

# --------- API Routes ---------
@app.route('/api/meals', methods=['GET'])
def get_meals_by_day():
    day = request.args.get('day')
    if not day:
        return jsonify({"error": "Day parameter is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        SELECT meal_type, menu 
        FROM Meals 
        WHERE day_of_week = %s 
        ORDER BY FIELD(meal_type, 'Breakfast', 'Lunch', 'Dinner')
    """
    cursor.execute(query, (day,))
    meals = cursor.fetchall()
    conn.close()

    response = {meal_type: menu for meal_type, menu in meals}
    return jsonify(response)

@app.route('/api/cancel_meal', methods=['POST'])
def cancel_meal():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Extract data from the POST request
        data = request.get_json()
        user_id = data['user_id']
        meal_type = data['meal_type']

        # Call the stored procedure
        cursor.callproc('CancelMealProcedure', [user_id, meal_type])

        # Initialize response to avoid scope issues
        response = None

        # Fetch results from the procedure
        for result in cursor.stored_results():
            response = result.fetchone()

        # Ensure the response data is correctly formatted
        if response:
            if 'message' in response:
                return jsonify({'message': response['message']}), 200
            elif 'error_message' in response:
                return jsonify({'error': response['error_message']}), 400

        # Generic fallback in case of unexpected result
        return jsonify({'error': 'Unexpected response from procedure.'}), 500

    except Exception as e:
        print("Error cancelling meal:", e)  # Log the error
        return jsonify({'error': str(e)}), 500

    finally:
        if conn:
            conn.close()


@app.route('/api/meal_timings', methods=['GET'])
def get_meal_timings():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch all meal timings
        cursor.execute("SELECT * FROM Meal_Timings")
        timings = cursor.fetchall()

        # Convert timing fields to string format
        for timing in timings:
            timing["start_time"] = str(timing["start_time"])  # Convert to string
            timing["end_time"] = str(timing["end_time"])      # Convert to string

        return jsonify(timings)  # Return the modified result
    except Exception as e:
        print("Error fetching meal timings:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()



@app.route('/api/mark_attendance', methods=['POST'])
def mark_attendance():
    data = request.get_json()
    user_id = data['user_id']
    meal_id = data['meal_id']
    status = data['status']

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if status == 'cancelled':
            penalty_points = 0
            penalty_type = 'Cancelled'
        elif status == 'attended':
            penalty_points = 50
            penalty_type = 'Attended'
        else:
            penalty_points = 20
            penalty_type = 'Missed'

        cursor.execute("""
            INSERT INTO Penalties (user_id, meal_id, penalty_type, points)
            VALUES (%s, %s, %s, %s)
        """, (user_id, meal_id, penalty_type, penalty_points))

        cursor.execute("""
            UPDATE Tickets
            SET penalty_points = %s
            WHERE user_id = %s AND meal_id = %s
        """, (penalty_points, user_id, meal_id))

        cursor.execute("CALL UpdatePointsForMealAttendance(%s, %s)", (user_id, meal_id))

        conn.commit()
    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({'message': 'Attendance marked and penalty applied successfully'}), 200

@app.route('/api/get_user_penalties', methods=['GET'])
def get_user_penalties():
    user_id = request.args.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(points) FROM Penalties WHERE user_id = %s", (user_id,))
    total_penalty = cursor.fetchone()[0] or 0

    cursor.close()
    conn.close()

    return jsonify({'user_id': user_id, 'total_penalty_points': total_penalty}), 200

@app.route('/api/get_user_status', methods=['GET'])
def get_user_status():
    user_id = request.args.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT SUM(points) FROM Penalties WHERE user_id = %s", (user_id,))
    total_penalty = cursor.fetchone()[0] or 0

    cursor.execute("SELECT max_semester_points FROM Users WHERE user_id = %s", (user_id,))
    max_semester_points = cursor.fetchone()[0]

    total_earned_points = max_semester_points - total_penalty

    cursor.close()
    conn.close()

    return jsonify({
        'user_id': user_id,
        'total_penalty_points': total_penalty,
        'total_earned_points': total_earned_points,
        'max_semester_points': max_semester_points
    }), 200
# Comment out these lines
# from backend.routes.attendance_routes import attendance_routes
# from backend.routes.auth_routes import auth_routes
# from backend.routes.meal_routes import meal_routes
# from backend.routes.ticket_routes import ticket_routes

# app.register_blueprint(attendance_routes, url_prefix='/api/attendance')
# app.register_blueprint(auth_routes, url_prefix='/api/auth')
# app.register_blueprint(meal_routes, url_prefix='/api/meals')
# app.register_blueprint(ticket_routes, url_prefix='/api/tickets')
   


# Add these routes directly in app.py
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Fetch user details based on email
        cursor.execute(
            "SELECT user_id, full_name, roll_no, email, phone_number, role, hostel, password_hash "
            "FROM Users WHERE email=%s", (data.get('email'),)
        )
        row = cursor.fetchone()

        if row:
            print("User found:", row)  # Debugging log
        else:
            print("User not found for email:", data.get('email'))
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        # Compare passwords (plain-text for testing purposes only)
        if data.get('password') == row[7]:  # row[7] = password_hash column
            user = {
                "user_id": row[0],
                "full_name": row[1],
                "roll_no": row[2],
                "email": row[3],
                "phone_number": row[4],
                "role": row[5],
                "hostel": row[6]
            }
            return jsonify({"success": True, "user": user}), 200
        else:
            print("Password mismatch for email:", data.get('email'))
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        print("Error during login:", e)  # Log any exceptions
        return jsonify({"success": False, "message": "Internal Server Error"}), 500
    finally:
        cursor.close()
        conn.close()


# … your existing imports …
@app.route('/api/auth/SignupStudent', methods=['POST'])
def signup():
    data = request.get_json()
    print("Received Data:", data)  

    required = ['full_name', 'roll_no', 'email', 'phone_number', 'password', 'role', 'hostel']
    if not all(field in data for field in required):
        print("Missing Fields:", [field for field in required if field not in data])  
        return jsonify({'success': False, 'message': 'Missing fields'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO Users
              (full_name, roll_no, email, phone_number, password_hash, role, hostel)
            VALUES (%s,%s,%s,%s,%s,%s,%s)
        """, (
            data['full_name'],
            data['roll_no'],
            data['email'],
            data['phone_number'],
            data['password'],  
            data['role'],
            data['hostel']
        ))
        conn.commit()
        return jsonify({'success': True, 'message': 'User registered'}), 201

    except Exception as e:
        conn.rollback()
        print("Error during registration:", e)  
        return jsonify({'success': False, 'message': str(e)}), 400

    finally:
        cursor.close()
        conn.close()

#will give you data on specific things could have been on admin/dashboard but im keeping it here 
@app.route('/api/AdminPage', methods=['GET'])
def admin_dashboard():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Example queries for admin dashboard data
        cursor.execute("SELECT COUNT(*) FROM Users WHERE role='Student'")
        total_students = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Users WHERE role='Staff'")
        total_staff = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM Meals")
        total_meals = cursor.fetchone()[0]

        data = {
            "total_students": total_students,
            "total_staff": total_staff,
            "total_meals": total_meals,
        }
        return jsonify(data), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/today-attendance', methods=['GET'])
def today_attendance():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Use scan_time from Attendance for filtering by today's date
        cursor.execute("""
            SELECT 
                M.meal_type,
                COUNT(
                    CASE 
                        WHEN A.scan_time IS NOT NULL 
                             AND TIME(A.scan_time) BETWEEN MT.start_time AND MT.end_time 
                        THEN 1 
                        ELSE NULL 
                    END
                ) AS attendance
            FROM Meals M
            JOIN Meal_Timings MT ON M.meal_type = MT.meal_type
            LEFT JOIN Attendance A 
                ON M.meal_id = A.meal_id 
                AND DATE(A.scan_time) = CURDATE()  -- Use scan_time for today's attendance
            GROUP BY M.meal_type;
        """)
        attendance = cursor.fetchall()
        
        # Format the result
        result = [
            {"meal_type": row[0], "attendance": row[1]}
            for row in attendance
        ]
        return jsonify(result), 200

    except Exception as e:
        print("Error fetching today's attendance:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/attendance/<roll_no>', methods=['GET'])
def attendance_by_roll_no(roll_no):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Query to fetch meal_type, date from scan_time, and attendance status for the given roll number
        cursor.execute("""
            SELECT 
                M.meal_type,
                DATE(A.scan_time) AS attendance_date,  -- Extract date from scan_time
                A.status
            FROM Attendance A
            JOIN Meals M ON A.meal_id = M.meal_id
            JOIN Users U ON A.user_id = U.user_id
            WHERE U.roll_no = %s
        """, (roll_no,))
        attendance = cursor.fetchall()

        # Format the response
        result = {
            "roll_no": roll_no,
            "details": [
                {
                    "meal_type": row[0],
                    "meal_date": row[1],  # Extracted from scan_time
                    "status": row[2]
                } for row in attendance
            ]
        }
        return jsonify(result), 200

    except Exception as e:
        print("Error fetching attendance by roll number:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()

@app.route('/api/user_wallet', methods=['POST'])
def user_wallet():
    data = request.get_json()
    user_id = data.get('user_id')
    print("Received user_id:", user_id)  # Debugging: Check if user_id is received

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Calculate balance using max_semester_points
        cursor.execute("""
            SELECT max_semester_points - IFNULL(SUM(points), 0) AS balance
            FROM Users U
            LEFT JOIN Penalties P ON U.user_id = P.user_id
            WHERE U.user_id = %s
            GROUP BY U.max_semester_points;
        """, (user_id,))
        result = cursor.fetchone()
        print("Balance query result:", result)  # Debugging

        balance = result[0] if result else 0  # Handle no result

        # Query to fetch penalty points
        cursor.execute("""
            SELECT IFNULL(SUM(points), 0) AS total_penalty_points
            FROM Penalties
            WHERE user_id = %s;
        """, (user_id,))
        penalty_points = cursor.fetchone()[0]
        print("Penalty points query result:", penalty_points)  # Debugging

        return jsonify({
            'balance': balance,
            'penalty_points': penalty_points
        }), 200

    except Exception as e:
        print("Error in user_wallet API:", str(e))  # Log the error
        return jsonify({'error': str(e)}), 500

    finally:
        cursor.close()
        conn.close()


# --------- App Run ---------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

