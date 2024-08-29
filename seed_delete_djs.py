from server.config import app, db
from server.models.dj import Dj

with app.app_context():
    # Delete all DJs
    db.session.query(Dj).delete()
    db.session.commit()
    print("All DJs have been deleted.")
