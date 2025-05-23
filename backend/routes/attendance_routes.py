import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from flask import Blueprint, request, jsonify
from backend.db_config import get_db_connection
from datetime import datetime

attendance_routes = Blueprint('attendance', __name__)

# Route: Get all attendance records
@attendance_routes.route('/attendance', methods=['GET'])
def get_all_attendance():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT a.attendance_id, u.full_name, m.meal_type, m.meal_date, a.scan_time
        FROM Attendance a
        JOIN Users u ON a.user_id = u.user_id
        JOIN Meals m ON a.meal_id = m.meal_id
        ORDER BY a.scan_time DESC
    """)
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results), 200



# Route: Get attendance by user_id
@attendance_routes.route('/attendance/user/<int:user_id>', methods=['GET'])
def get_user_attendance(user_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT m.meal_type, m.meal_date, a.scan_time
        FROM Attendance a
        JOIN Meals m ON a.meal_id = m.meal_id
        WHERE a.user_id = %s
        ORDER BY m.meal_date DESC
    """, (user_id,))
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results), 200

