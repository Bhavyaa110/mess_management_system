from flask import Flask

import sys, os
sys.path.append(os.path.dirname(__file__))  # Ensure backend is treated as a package

from backend.routes.auth_routes import auth
def create_app():
    app = Flask(__name__)


    app.register_blueprint(auth, url_prefix='/auth')

    return app
