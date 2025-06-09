from flask import Flask
from flask_cors import CORS
from db import db, init_db
import os
from dotenv import load_dotenv
from models import Transaction
from routes.transactions import transactions_bp
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import User
from flask_bcrypt import Bcrypt
from routes.auth import auth_bp


load_dotenv()

app = Flask(__name__)
CORS(app)

bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Config MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

# Initialize DB
init_db(app)

app.register_blueprint(transactions_bp)
app.register_blueprint(auth_bp, url_prefix='/auth')


# Test route
@app.route('/')
def home():
    return {"message": "Backend is working!"}

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables
    app.run(debug=True)