from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
from .databaseDEV.db_configure import db  # Import your db instance
from .Routes.auth import auth_bp
from .Routes.events import events_bp
from .Routes.users import users_bp

app = Flask(__name__)
app.config.from_object(Config)

# Initialize the SQLAlchemy instance with the Flask app
db.init_app(app)

jwt = JWTManager(app)
CORS(app)

app.register_blueprint(auth_bp)
app.register_blueprint(events_bp)
app.register_blueprint(users_bp)

if __name__ == "__main__":
    app.run(debug=True)
