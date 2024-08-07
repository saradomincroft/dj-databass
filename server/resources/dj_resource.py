from flask_restful import Resource, reqparse
from flask import request, session, make_response
from ..models.dj import Dj, Genre, Subgenre, Venue, db
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

        name = args['name']
        produces = args['produces']
        genres = [genre.title() for genre in args['genres']]
        subgenres = {genre.title(): [subgenre.title() for subgenre in subs] for genre, subs in args['subgenres'].items()}
        venues = [venue.title() for venue in args['venues']]

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
            "dubstep": "Dubstep/140",
            "140": "Dubstep/140",
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
    def get(self, dj_id=None):
        if dj_id:
            # Retrieve a specific DJ by ID
            dj = db.session.query(Dj).get(dj_id)
            if dj:
                return make_response(dj.to_detailed_dict(), 200)
            return make_response({"error": "DJ not found"}, 404)
        
        # Retrieve all DJs
        djs = db.session.query(Dj).all()
        result = [dj.to_detailed_dict() for dj in djs]
        return make_response(result, 200)