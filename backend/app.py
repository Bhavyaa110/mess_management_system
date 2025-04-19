from flask import Flask, jsonify, request
import MySQLdb
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from the frontend

def get_db_connection():
    return MySQLdb.connect(
        host="localhost",
        user="root",
        passwd="Thapar27",
        db="mess_management_system"
    )

@app.route('/meals', methods=['GET'])
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


@app.route('/cancel_meal', methods=['POST'])
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
    except MySQLdb.Error as err:
        conn.rollback()
        response = {'success': False, 'error': str(err)}
    finally:
        cursor.close()
        conn.close()

    return jsonify(response)

from backend.routes.meal_routes import meal_routes

app.register_blueprint(meal_routes)

@app.route('/mark_attendance', methods=['POST'])
def mark_attendance():
    user_id = request.json['user_id']
    meal_id = request.json['meal_id']
    status = request.json['status']  # 'attended', 'missed', or 'cancelled'

    conn = get_db_connection()
    cursor = conn.cursor()

    # Calculate penalty based on the status
    if status == 'cancelled':
        penalty_points = 0
        penalty_type = 'Cancelled'
    elif status == 'attended':
        penalty_points = 50
        penalty_type = 'Attended'
    else:  # If the user missed the meal without cancelling
        penalty_points = 20
        penalty_type = 'Missed'

    # Insert the penalty into the Penalties table
    cursor.execute("""
        INSERT INTO Penalties (user_id, meal_id, penalty_type, points)
        VALUES (%s, %s, %s, %s)
    """, (user_id, meal_id, penalty_type, penalty_points))

    # Update the penalty_points in the Tickets table
    cursor.execute("""
        UPDATE Tickets
        SET penalty_points = %s
        WHERE user_id = %s AND meal_id = %s
    """, (penalty_points, user_id, meal_id))

    cursor.execute("""
        CALL UpdatePointsForMealAttendance(%s, %s);
    """, (user_id, meal_id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Attendance marked and penalty applied successfully'}), 200

@app.route('/get_user_penalties', methods=['GET'])
def get_user_penalties():
    user_id = request.args.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT SUM(points) FROM Penalties WHERE user_id = %s
    """, (user_id,))
    total_penalty = cursor.fetchone()[0] or 0

    cursor.close()
    conn.close()

    return jsonify({'user_id': user_id, 'total_penalty_points': total_penalty}), 200

@app.route('/get_user_status', methods=['GET'])
def get_user_status():
    user_id = request.args.get('user_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get the user's total penalty points
    cursor.execute("""
        SELECT SUM(points) FROM Penalties WHERE user_id = %s
    """, (user_id,))
    total_penalty = cursor.fetchone()[0] or 0

    # Get the user's maximum semester points (22500 or dynamic)
    cursor.execute("""
        SELECT max_semester_points FROM Users WHERE user_id = %s
    """, (user_id,))
    max_semester_points = cursor.fetchone()[0]

    # Calculate the total earned points (max points minus penalties)
    total_earned_points = max_semester_points - total_penalty

    cursor.close()
    conn.close()

    return jsonify({
        'user_id': user_id,
        'total_penalty_points': total_penalty,
        'total_earned_points': total_earned_points,
        'max_semester_points': max_semester_points
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
