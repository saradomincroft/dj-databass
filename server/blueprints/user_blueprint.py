from flask import Blueprint
from flask_restful import Api
from server.resources.user_resource import Signup, Login, Logout, Me, Users, Favourites

user_blueprint = Blueprint('user_blueprint', __name__)
api = Api(user_blueprint)

# Define routes
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(Me, '/me')
api.add_resource(Users, '/users', '/users/<int:user_id>')
api.add_resource(Favourites, '/me/favourites')
