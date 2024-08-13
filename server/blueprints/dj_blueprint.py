# server/blueprints/dj_blueprint.py
from flask import Blueprint
from flask_restful import Api
from server.resources.dj_resource import AddDj, ViewDjs, ViewDj, SearchDjs, UpdateDj, DeleteDj

dj_blueprint = Blueprint('dj_blueprint', __name__)
api = Api(dj_blueprint)

# Define routes
api.add_resource(AddDj, '/dj/add')                
api.add_resource(ViewDjs, '/djs')      
api.add_resource(ViewDj, '/dj/<int:dj_id>')         
api.add_resource(SearchDjs, '/djs/search')     
api.add_resource(UpdateDj, '/dj/<int:dj_id>')    
api.add_resource(DeleteDj, '/dj/<int:dj_id>')
