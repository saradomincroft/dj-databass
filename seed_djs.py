from server.config import app, db
from server.models.dj import Dj, Genre, Subgenre, Venue, DjGenre, DjSubgenre, DjVenue

with app.app_context():
    try:
        # Delete records from join tables first
        db.session.query(DjGenre).delete()
        db.session.query(DjSubgenre).delete()
        db.session.query(DjVenue).delete()

        # Delete records from child tables next
        db.session.query(Subgenre).delete()
        db.session.query(Venue).delete()
        db.session.query(Genre).delete()

        # Delete records from parent table last
        db.session.query(Dj).delete()

        # Commit all deletions
        db.session.commit()
        print("All DJs, genres, subgenres, venues, and related entries have been deleted.")
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred: {e}")
