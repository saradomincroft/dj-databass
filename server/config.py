# server/config.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from flask_bcrypt import Bcrypt

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'secret_key')

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
bcrypt = Bcrypt()

