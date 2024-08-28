from server.config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship

# Association table for many-to-many relationship between User and Dj
user_dj_favourites = Table(
    'user_dj_favourites',
    db.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('dj_id', Integer, ForeignKey('djs.id'))
)

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    is_admin = Column(Boolean, default=False)
    _hashed_password = Column(String, nullable=False)
    profile_image_url = Column(String)  

    # Many-to-many relationship with Dj
    favourites = relationship('Dj', secondary=user_dj_favourites, backref='users')

    @hybrid_property
    def hashed_password(self):
        return self._hashed_password
    
    @hashed_password.setter
    def hashed_password(self, password):
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._hashed_password = hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._hashed_password, password.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'is_admin': self.is_admin,
            'profile_image_url': self.profile_image_url, 
            'favourites': [self.serialize_favourites(dj) for dj in self.favourites] if self.favourites else []
        }
    
    def serialize_favourites(self, dj):
        return {
            'id': dj.id,
            'name': dj.name,
        }

    def __repr__(self):
        return f"<User {self.id}: {self.username}>"
