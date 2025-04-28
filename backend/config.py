# config.py
import os

class Config:
    SECRET_KEY = os.environ.get('dev-key-replace-in-production')
    
    # Database settings
    DB_HOST = os.environ.get('localhost')
    DB_USER = os.environ.get('root')
    DB_PASSWORD = os.environ.get('Thapar27')
    DB_NAME = os.environ.get('mess_management_system')