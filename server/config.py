import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt

# Initialize Flask app
app = Flask(__name__)

# Load configuration from environment variables or use defaults
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_default_secret_key_here')  # Replace with a more secure default

# Initialize extensions
db = SQLAlchemy(app)  # Database integration
migrate = Migrate(app, db)
api = Api(app)  # Flask-RESTful

# Configure CORS to allow requests from the frontend
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Initialize Flask-Bcrypt for bcrypt hashing for passwords (security)
bcrypt = Bcrypt(app)
