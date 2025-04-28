from flask import Blueprint, request, jsonify
import qrcode
import io
import base64
from backend.db_config import get_db_connection

ticket_routes = Blueprint('ticket', __name__)

@ticket_routes.route('/generate_qr', methods=['POST'])
def generate_qr():
    data = request.get_json()
    user_id = data.get('user_id')
    meal_id = data.get('meal_id')

    payload = f"{user_id}:{meal_id}"

    qr = qrcode.make(payload)
    buffer = io.BytesIO()
    qr.save(buffer, format="PNG")
    qr_str = base64.b64encode(buffer.getvalue()).decode()

    return jsonify({'qr_code': qr_str})

@ticket_routes.route('/mark_attendance', methods=['POST'])
def mark_attendance():
    data = request.get_json()
    user_id, meal_id = data.get('user_id'), data.get('meal_id')

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        UPDATE Attendance
        SET status = 'Present'
        WHERE user_id = %s AND meal_id = %s
    """
    cursor.execute(query, (user_id, meal_id))
    conn.commit()

    return jsonify({'message': 'Attendance marked successfully'}), 200
