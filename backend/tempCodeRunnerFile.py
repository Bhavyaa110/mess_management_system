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


if __name__ == '__main__':
    app.run(debug=True)
