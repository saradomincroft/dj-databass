from server.config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.ext.associationproxy import association_proxy

# Base = declarative_base()

class Dj(db.Model):
    __tablename__ = "djs"

    id = Column(Integer(), primary_key=True)
    name = Column(String(), nullable=False)
    produces = Column(Boolean(), nullable=False)

    dj_genres = relationship("DjGenre", back_populates="dj")
    genres = association_proxy("dj_genres", "genre", creator=lambda g: DjGenre(genre=g))

    dj_subgenres = relationship("DjSubgenre", back_populates="dj")
    subgenres = association_proxy("dj_subgenres", "subgenre", creator=lambda s: DjSubgenre(subgenre=s))
    # can ommit this
    # instead of establishing with djs and genres 
    # should have put the subgenre dj relationship with the genre itself
    # chaining relationships (similar to movies ones - actors, genres)

    dj_venues = relationship("DjVenue", back_populates="dj")
    venues = association_proxy("dj_venues", "venue", creator=lambda v: DjVenue(venue=v))

    def __repr__(self):
        return f"{self.name}"


class Genre(db.Model):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False, unique=True)

    subgenres = relationship("Subgenre", back_populates="genre")

    dj_genres = relationship("DjGenre", back_populates="genre")
    djs = association_proxy("dj_genres", "dj", creator=lambda dg: DjGenre(dj=dg))

    def __repr__(self):
        return f"{self.title}"

class DjGenre(db.Model):
    __tablename__ = "dj_genres"

    id = Column(Integer, primary_key=True)
    dj_id = Column(Integer, ForeignKey('djs.id'))
    genre_id = Column(Integer, ForeignKey('genres.id'))

    dj = relationship('Dj', back_populates='dj_genres')
    genre = relationship('Genre', back_populates='dj_genres')


class Subgenre(db.Model):
    __tablename__ = "subgenres"

    id = Column(Integer, primary_key=True)
    subtitle = Column(String, nullable=False)
    genre_id = Column(Integer, ForeignKey("genres.id"))

    genre = relationship("Genre", back_populates="subgenres")

    dj_subgenres = relationship("DjSubgenre", back_populates="subgenre")
    djs = association_proxy("dj_subgenres", "dj", creator=lambda ds: DjSubgenre(dj=ds))

    def __repr__(self):
        return f"{self.subtitle}"


class DjSubgenre(db.Model):
    __tablename__ = "dj_subgenres"

    id = Column(Integer, primary_key=True)
    dj_id = Column(Integer, ForeignKey('djs.id'))
    subgenre_id = Column(Integer, ForeignKey('subgenres.id'))

    dj = relationship('Dj', back_populates='dj_subgenres')
    subgenre = relationship('Subgenre', back_populates='dj_subgenres')


class Venue(db.Model):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True)
    venuename = Column(String, nullable=False)

    dj_venues = relationship("DjVenue", back_populates="venue")
    djs = association_proxy("dj_venues", "dj", creator=lambda dv: DjVenue(dj=dv))

    def __repr__(self):
        return f"{self.venuename}"
    

class DjVenue(db.Model):
    __tablename__ = "dj_venues"

    id = Column(Integer, primary_key=True)
    dj_id = Column(Integer, ForeignKey('djs.id'))
    venue_id = Column(Integer, ForeignKey('venues.id'))

    dj = relationship('Dj', back_populates='dj_venues')
    venue = relationship('Venue', back_populates='dj_venues')
