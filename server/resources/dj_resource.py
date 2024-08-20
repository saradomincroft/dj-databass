from flask_restful import Resource, reqparse
from flask import request, session, make_response
from ..models.dj import Dj, Genre, Subgenre, Venue, db
from ..models.user import User
from sqlalchemy import func

class AddDj(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True, help='DJ name cannot be blank')
        parser.add_argument('produces', type=bool, required=True, help='Music production status is required')
        parser.add_argument('genres', type=list, location='json', required=True, help='Genres are required')
        parser.add_argument('subgenres', type=dict, location='json', default={}, help='Subgenres by genre')
        parser.add_argument('venues', type=list, location='json', required=True, help='Venues are required')
        args = parser.parse_args()

        # Remove title case formatting
        name = args['name'].strip()
        produces = args['produces']
        genres = [genre.strip().title() for genre in args['genres']]
        subgenres = {genre.strip().title(): [subgenre.strip().title() for subgenre in subs] for genre, subs in args['subgenres'].items()}
        venues = [venue.strip().title() for venue in args['venues']]

        # Check for duplicates including case
        existing_dj = db.session.query(Dj).filter(func.lower(Dj.name) == name.lower()).first()
        if existing_dj:
            return {'error': f'{name} already exists in the database'}, 400

        new_dj = Dj(name=name, produces=produces)

        genre_mapping = {
            "drum n bass": "Drum & Bass",
            "dnb": "Drum & Bass",
            "d&b": "Drum & Bass",
            "drum and bass": "Drum & Bass",
            "d & b": "Drum & Bass",
            "d n b": "Drum & Bass",
            "dubstep": "Dubstep",
            "140": "Dubstep",
        }

        # Add genres
        for genre_title in genres:
            mapped_genre_title = genre_mapping.get(genre_title.lower(), genre_title)
            genre = db.session.query(Genre).filter(func.lower(Genre.title) == mapped_genre_title.lower()).first()
            if genre is None:
                genre = Genre(title=mapped_genre_title)
                db.session.add(genre)
            if genre not in new_dj.genres:
                new_dj.genres.append(genre)

            # Add subgenres
            for subgenre_title in subgenres.get(genre_title, []):
                mapped_subgenre_title = genre_mapping.get(subgenre_title.lower(), subgenre_title)
                subgenre = db.session.query(Subgenre).filter(
                    func.lower(Subgenre.subtitle) == mapped_subgenre_title.lower(),
                    Subgenre.genre_id == genre.id
                ).first()
                if not subgenre:
                    subgenre = Subgenre(subtitle=mapped_subgenre_title, genre=genre)
                    db.session.add(subgenre)
                if subgenre not in genre.subgenres:
                    genre.subgenres.append(subgenre)
                if subgenre not in new_dj.subgenres:
                    new_dj.subgenres.append(subgenre)

        # Add venues
        for venue_name in venues:
            venue = db.session.query(Venue).filter(func.lower(Venue.venuename) == venue_name.lower()).first()
            if venue is None:
                venue = Venue(venuename=venue_name)
                db.session.add(venue)
            if venue not in new_dj.venues:
                new_dj.venues.append(venue)

        db.session.add(new_dj)
        db.session.commit()
        return {'message': f'{name} added successfully'}, 201

class ViewDjs(Resource):
    def get(self):
        # Retrieve all DJs, sorted alphabetically by name
        djs = db.session.query(Dj).order_by(Dj.name).all()
        result = [dj.to_detailed_dict() for dj in djs]
        return make_response(result, 200)
    
class ViewDj(Resource):
    def get(self, dj_id):
        dj = Dj.query.get(dj_id)
        if dj:
            return dj.to_detailed_dict(), 200
        return {'message': 'DJ not found'}, 404

class SearchDjs(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('search', type=str, help='Search term for DJ names')
        args = parser.parse_args()

        search_term = args['search']
        
        if search_term:
            djs = db.session.query(Dj).filter(Dj.name.ilike(f'%{search_term}%')).order_by(Dj.name).all()
        else:
            djs = db.session.query(Dj).order_by(Dj.name).all()

        result = [dj.to_detailed_dict() for dj in djs]
        return make_response(result, 200)

class UpdateDj(Resource):
    def put(self, dj_id):
        if not self._is_admin():
            return {'error': 'Unauthorized'}, 403

        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str)
        parser.add_argument('produces', type=bool)
        parser.add_argument('genres', type=list, location='json')
        parser.add_argument('subgenres', type=dict, location='json', default={})
        parser.add_argument('venues', type=list, location='json')
        args = parser.parse_args()

        dj = db.session.query(Dj).get(dj_id)
        if not dj:
            return {'error': 'DJ not found'}, 404

        if args['name']:
            dj.name = args['name'].strip().title()
        if args['produces'] is not None:
            dj.produces = args['produces']

        # Update genres, subgenres, and venues
        db.session.commit()
        return {'message': 'DJ updated successfully'}, 200

    def _is_admin(self):
        return session.get('user_role') == 'admin'

class DeleteDj(Resource):
    def delete(self, dj_id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 401)

        current_user = User.query.get(user_id)
        if not current_user:
            return make_response({'error': 'Unauthorized'}, 401)

        # Proceed with deletion if user is admin
        dj_to_delete = Dj.query.get(dj_id)
        if not dj_to_delete:
            return make_response({'error': 'DJ not found'}, 404)
        
        if current_user.is_admin:
            db.session.delete(dj_to_delete)
            db.session.commit()
            return make_response({'message': 'DJ deleted successfully'}, 200)
        
        return make_response({'error': 'Forbidden'}, 403)

class GenreList(Resource):
    def get(self):
        try:
            genres = db.session.query(Genre).all()
            return [{'id': genre.id, 'title': genre.title} for genre in genres], 200
        except Exception as e:
            return {'error': str(e)}, 500
        
class SubgenreList(Resource):
    def get(self, genre_title):
        try:
            genre = db.session.query(Genre).filter(func.lower(Genre.title) == genre_title.lower()).first()
            if not genre:
                return {'message': 'Genre not found'}, 404
            subgenres = db.session.query(Subgenre).filter(Subgenre.genre_id == genre.id).all()
            return [{'id': subgenre.id, 'subtitle': subgenre.subtitle} for subgenre in subgenres]
        except Exception as e:
            return {'error': str(e)}, 500
        
class VenueList(Resource):
    def get(self):
        try:
            venues = db.session.query(Venue).all()
            return [{'id': venue.id, 'venuename': venue.venuename} for venue in venues], 200
        except Exception as e:
            return {'error': str(e)}, 500
