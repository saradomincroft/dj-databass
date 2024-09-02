from flask import Blueprint
from flask_restful import Api
from server.resources.dj_resource import (AddDj, ViewDjs, ViewDj, SearchDjs, UpdateDj, DeleteDj, GenreList, SubgenreList, VenueList, DJProfileImage, DeleteDJProfileImage)

dj_blueprint = Blueprint('dj_blueprint', __name__)
api = Api(dj_blueprint)

# Define routes
api.add_resource(AddDj, '/dj/add')
api.add_resource(ViewDjs, '/djs')
api.add_resource(ViewDj, '/dj/<int:dj_id>')
api.add_resource(SearchDjs, '/djs/search')
api.add_resource(UpdateDj, '/dj/<int:dj_id>')
api.add_resource(DeleteDj, '/dj/<int:dj_id>')
api.add_resource(DJProfileImage, '/dj/profile-image/<int:dj_id>')
api.add_resource(DeleteDJProfileImage, '/dj/delete-profile-image/<int:dj_id>')
api.add_resource(GenreList, '/genres')
api.add_resource(SubgenreList, '/genres/<string:genre_title>/subgenres')
api.add_resource(VenueList, '/venues')
