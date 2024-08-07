from server.config import app, db
from server.models.user import User

with app.app_context():
    # Delete all users
    db.session.query(User).delete()
    db.session.commit()
    print("All users have been deleted.")


