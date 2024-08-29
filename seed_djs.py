from server.config import app, db
from server.models.dj import Dj, Genre, Subgenre, Venue, DjGenre, DjSubgenre, DjVenue

# DJ Seed data
djs_data = [
    {
        "name": "DJ Eat",
        "produces": True,
        "city": "London",
        "genres": ["Dubstep", "House"],
        "subgenres": {
            "Dubstep": ["Brostep", "Post-Dubstep"],
            "House": ["Deep House", "Progressive House"]
        },
        "venues": ["Club Vibe", "Rave Arena"]
    },
    {
        "name": "DJ Sleep",
        "produces": True,
        "city": "London",
        "genres": ["Drum & Bass", "Techno"],
        "subgenres": {
            "Drum & Bass": ["Liquid", "Jump Up"],
            "Techno": ["Minimal Techno", "Detroit Techno"]
        },
        "venues": ["Max Watts", "Radio Bar"]
    },
    {
        "name": "DJ Rave",
        "produces": False,
        "city": "London",
        "genres": ["Trap", "Electro"],
        "subgenres": {
            "Trap": ["Classic Trap", "Future Trap"],
            "Electro": ["Electro House", "Electro Clash"]
        },
        "venues": ["Electric Lounge", "Bass House"]
    },
    {
        "name": "DJ Repeat",
        "produces": True,
        "city": "London",
        "genres": ["Progressive House", "Future Bass"],
        "subgenres": {
            "Progressive House": ["Melodic Progressive", "Big Room Progressive"],
            "Future Bass": ["Synthwave", "Chill Future Bass"]
        },
        "venues": ["Skyline Club", "Rooftop Bar"]
    },
    {
        "name": "DJ Hombre",
        "produces": True,
        "city": "London",        
        "genres": ["Tech House", "Bass House"],
        "subgenres": {
            "Tech House": ["Deep Tech House", "Groove Tech House"],
            "Bass House": ["Future House", "G-House"]
        },
        "venues": ["Underground Club", "VIP Lounge"]
    },
    {
        "name": "DJ Frog",
        "produces": False,
        "city": "London",
        "genres": ["Hardstyle", "Psytrance"],
        "subgenres": {
            "Hardstyle": ["Rawstyle", "Melodic Hardstyle"],
            "Psytrance": ["Goa Trance", "Full-On Psytrance"]
        },
        "venues": ["Festival Grounds", "Main Stage"]
    },
    {
        "name": "DJ Ambient",
        "produces": True,
        "city": "London",
        "genres": ["Ambient", "Chillout"],
        "subgenres": {
            "Ambient": ["Space Ambient", "Dark Ambient"],
            "Chillout": ["Lounge", "Downtempo"]
        },
        "venues": ["Zen Lounge", "Tranquil Space"]
    },
    {
        "name": "DJ Money",
        "produces": True,
        "city": "London",
        "genres": ["Garage", "Grime"],
        "subgenres": {
            "Garage": ["UK Garage", "2-Step Garage"],
            "Grime": ["Classic Grime", "Trap Grime"]
        },
        "venues": ["Urban Club", "Warehouse Party"]
    },
    {
        "name": "DJ EZ",
        "produces": False,
        "city": "London",
        "genres": ["House", "Jazz House"],
        "subgenres": {
            "House": ["Chicago House", "Acid House"],
            "Jazz House": ["Soulful Jazz House", "Deep Jazz House"]
        },
        "venues": ["Live Music Venue", "Jazz Club"]
    },
    {
        "name": "DJ Marshmello",
        "produces": True,
        "city": "London",
        "genres": ["Industrial", "EDM"],
        "subgenres": {
            "Industrial": ["Power Noise", "Rhythmic Noise"],
            "EDM": ["Classic EDM", "Future EDM"]
        },
        "venues": ["Industrial Club", "Alternative Venue"]
    }
]

with app.app_context():
    try:
        # Delete existing data
        db.session.query(DjGenre).delete()
        db.session.query(DjSubgenre).delete()
        db.session.query(DjVenue).delete()
        db.session.query(Subgenre).delete()
        db.session.query(Venue).delete()
        db.session.query(Genre).delete()
        db.session.query(Dj).delete()
        db.session.commit()
        print("All DJs, genres, subgenres, venues, and related entries have been deleted.")
        
        # Seed data
        for dj_data in djs_data:
            # Create or get genres
            genre_objects = []
            for genre in dj_data['genres']:
                existing_genre = Genre.query.filter_by(title=genre).first()
                if not existing_genre:
                    existing_genre = Genre(title=genre)
                    db.session.add(existing_genre)
                genre_objects.append(existing_genre)
            
            # Create or get subgenres
            subgenre_objects = []
            for genre_title, subgenre_list in dj_data['subgenres'].items():
                genre = Genre.query.filter_by(title=genre_title).first()
                if not genre:
                    raise ValueError(f"Genre '{genre_title}' not found in the database.")
                
                for subgenre_title in subgenre_list:
                    existing_subgenre = Subgenre.query.filter_by(subtitle=subgenre_title, genre_id=genre.id).first()
                    if not existing_subgenre:
                        existing_subgenre = Subgenre(subtitle=subgenre_title, genre_id=genre.id)
                        db.session.add(existing_subgenre)
                    subgenre_objects.append(existing_subgenre)
            
            # Create or get venues
            venue_objects = []
            for venue_name in dj_data['venues']:
                existing_venue = Venue.query.filter_by(venuename=venue_name).first()
                if not existing_venue:
                    existing_venue = Venue(venuename=venue_name)
                    db.session.add(existing_venue)
                venue_objects.append(existing_venue)
            
            # Create DJ
            dj = Dj(
                name=dj_data['name'],
                produces=dj_data['produces'],
                city=dj_data['city'],
                dj_profile_picture=None
            )
            db.session.add(dj)
            db.session.flush()  # Flush to get the DJ ID
            
            # Add genres and subgenres
            for genre in genre_objects:
                db.session.add(DjGenre(dj_id=dj.id, genre_id=genre.id))
            for subgenre in subgenre_objects:
                db.session.add(DjSubgenre(dj_id=dj.id, subgenre_id=subgenre.id))
            for venue in venue_objects:
                db.session.add(DjVenue(dj_id=dj.id, venue_id=venue.id))
            
            # Commit after each DJ
            db.session.commit()
        
        print("Seed data added successfully.")
        
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
