from server.config import app, api
from server.routes import register_routes
from server.resources.user_resource import Signup, Login, Logout, Me, Users
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
register_routes(app)

# Register API resources
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(Me, '/me')
api.add_resource(Users, '/users', '/users/<string:identifier>')

if __name__ == "__main__":
    app.run(debug=True, port=4000)
