import MySQL

def get_db_connection():
    return MySQLdb.connect(
        host="localhost",
        user="root",
        passwd="Thapar27",
        db="mess_management_system"
    )
conn = get_db_connection()
print("Connection successful!")
conn.close() 