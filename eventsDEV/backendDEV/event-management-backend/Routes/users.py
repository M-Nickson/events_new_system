from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash ,check_password_hash
from ..Models.user import User
from ..databaseDEV.db_configure import db
users_bp = Blueprint("users_bp", __name__)

@users_bp.route("/get_users", methods=["GET"])
def get_users():
    users = User.query.all()
    user_list = [{'username': user.username, 'email': user.email} for user in users]
    return jsonify(user_list)

@users_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user = get_jwt_identity()
    if current_user != "admin":
        return jsonify({"message": "Unauthorized."}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found."}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully!"}), 200

@users_bp.route("/register", methods=['POST'])
def register():
    data = request.get_json()
    # Input validation
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')  # Corrected to 'password'
    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({'message': 'User already exists'}), 400

    # Ensure password is a string
    if not isinstance(password, str):
        return jsonify({'message': 'Password must be a string'}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)
    # Create new user and add to database
    new_user = User(username=username, email=email, password=hashed_password)
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201  # 201 Created
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

@users_bp.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    if not user.check_password_hash(password):
        return jsonify({'message': 'Invalid credentials'}), 401
    return jsonify({'message': 'Login successful'}), 200

