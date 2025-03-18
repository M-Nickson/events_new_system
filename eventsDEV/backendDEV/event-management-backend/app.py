from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
from .Routes.auth import auth_bp
from .Routes.events import events_bp
from .Routes.users import users_bp

app = Flask(__name__)
app.config.from_object(Config)


db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)


app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(events_bp, url_prefix="/api/events")
app.register_blueprint(users_bp, url_prefix="/api/users")


def create_tables():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)