from flask import Blueprint, request, jsonify
from db import db
from models import User
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    # Check if user exists
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already taken"}), 409

    # Hash password
    password_hash = generate_password_hash(password).decode('utf-8')

    # Create user
    user = User(username=username, password_hash=password_hash)
    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "User registered successfully"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password required"}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token)
