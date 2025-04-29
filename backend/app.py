from flask import Flask, jsonify, request, send_from_directory
import mysql.connector
from flask_cors import CORS
import os
from backend.db_config import get_db_connection

# --------- App Setup ---------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST_DIR = os.path.join(os.path.dirname(BASE_DIR), 'frontend', 'dist')

app = Flask(__name__, static_folder=FRONTEND_DIST_DIR, static_url_path='/')
CORS(app)

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
    data = request.get_json()
    user_id = data.get('user_id')
    meal_id = data.get('meal_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.callproc('CancelMeals', [user_id, meal_id])
        conn.commit()
        response = {'success': True, 'message': 'Meal cancelled successfully.'}
    except mysql.connector.Error as err:
        conn.rollback()
        response = {'success': False, 'error': str(err)}
    finally:
        cursor.close()
        conn.close()

    return jsonify(response)
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
   


import bcrypt  # Add this import at the top

# Add these routes directly in app.py
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
          "SELECT user_id, full_name, roll_no, email, phone_number, role, hostel, password_hash "
          "FROM Users WHERE email=%s", (data['email'],)
        )
        row = cursor.fetchone()
        if row and bcrypt.checkpw(data['password'].encode(), row[7].encode()):
            user = {
              "user_id": row[0],
              "full_name": row[1],
              "roll_no": row[2],
              "email": row[3],
              "phone_number": row[4],
              "role": row[5],
              "hostel": row[6]
            }
            return jsonify({ "success": True, "user": user }), 200
        else:
            return jsonify({ "success": False, "message": "Invalid credentials" }), 401
    finally:
        cursor.close(); conn.close()

# … your existing imports …

@app.route('/api/auth/register', methods=['POST'])
def signup():
    data = request.get_json()
    required = ['full_name','roll_no','email','phone_number','password','role','hostel']
    if not all(field in data for field in required):
        return jsonify({'success':False,'message':'Missing fields'}), 400

    # hash password
    pw_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode()

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
            pw_hash,
            data['role'],
            data['hostel']
        ))
        conn.commit()
        return jsonify({'success':True, 'message':'User registered'}), 201

    except Exception as e:
        conn.rollback()
        # duplicate-key or other error
        return jsonify({'success':False,'message':str(e)}), 400

    finally:
        cursor.close()
        conn.close()


# --------- App Run ---------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

