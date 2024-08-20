from server.config import app, db
from server.models.dj import Dj, Genre, Subgenre, Venue

with app.app_context():
    # Delete all DJs
    db.session.query(Dj).delete()

    # Delete all Genres
    db.session.query(Genre).delete()

    # Delete all Subgenres
    db.session.query(Subgenre).delete()

    # Delete all Venues
    db.session.query(Venue).delete()

    # Commit all deletions
    db.session.commit()
    print("All DJs, genres, subgenres, venues, and producers have been deleted.")
