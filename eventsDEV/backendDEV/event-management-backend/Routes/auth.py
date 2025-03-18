from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..Models.user import User
from ..Models.event import Event
from ..databaseDEV.db_configure import db
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists."}), 400

    
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid username or password."}), 400

    
    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token}), 200