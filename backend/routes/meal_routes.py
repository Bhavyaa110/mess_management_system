from flask import Blueprint, request, jsonify
from backend.db_config import get_db_connection
from backend.models import cancel_meal  # Assuming the logic lives here
meal_routes = Blueprint('meal_routes', __name__)

@meal_routes.route('/cancel_meal', methods=['POST'])
def cancel_meal_route():
    data = request.get_json()
    user_id = data['user_id']
    meal_id = data['meal_id']
    conn = get_db_connection()
    cancel_meal(user_id, meal_id, conn)
    return jsonify({"status": "Meal cancelled"})
