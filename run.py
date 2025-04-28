import sys
import os

# Add the project root directory to Python's path
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from backend.app import app

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=5001)