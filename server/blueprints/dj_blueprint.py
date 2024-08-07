from flask import Blueprint
from flask_restful import Api
from server.resources.dj_resource import AddDj, ViewDjs

dj_blueprint = Blueprint('dj_blueprint', __name__)
api = Api(dj_blueprint)

# Define routes
api.add_resource(AddDj, '/dj/add')
api.add_resource(ViewDjs, '/djs', '/djs/<int:dj_id>')
