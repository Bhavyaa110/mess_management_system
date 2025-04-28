
import mysql.connector
# In backend/db_config.py
from backend.config import Config
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="Thapar27",
        database="mess_management_system"
    )
conn = get_db_connection()
print("Connection successful!")
conn.close() 