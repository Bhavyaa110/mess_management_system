from db_config import get_db_connection
from backend.db_config import get_db_connection

def execute_query(query, args=None, fetch=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, args)
    if fetch:
        result = cursor.fetchall()
        conn.close()
        return result
    else:
        conn.commit()
        conn.close()
        return True

def cancel_meal(user_id, meal_id, conn):
    try:
        with conn.cursor() as cursor:
            cursor.execute("CALL CancelMeals(%s, %s);", (user_id, meal_id))
        conn.commit()
    except Exception as e:
        print("Error in cancel_meal:", e)
        raise
