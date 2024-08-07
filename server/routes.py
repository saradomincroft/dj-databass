from flask import Blueprint, make_response
from server.blueprints.user_blueprint import user_blueprint
from server.blueprints.dj_blueprint import dj_blueprint

# Define a blueprint for general routes
main_blueprint = Blueprint('main', __name__)

@main_blueprint.route('/')
def index():
    return make_response({"message": "Welcome!"}, 200)

def register_routes(app):
    # Register the main blueprint
    app.register_blueprint(main_blueprint)
    # Register user blueprint with prefix
    app.register_blueprint(user_blueprint, url_prefix='/api')
    # Register dj blueprint with prefix
    app.register_blueprint(dj_blueprint, url_prefix='/api')
