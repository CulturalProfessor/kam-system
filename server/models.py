from flask_sqlalchemy import SQLAlchemy
import enums
from sqlalchemy import Enum

db = SQLAlchemy()

RestaurantStatus = enums.RestaurantStatus
CallFrequency = enums.CallFrequency
InteractionType = enums.InteractionType


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    status = db.Column(
        Enum(RestaurantStatus), default=RestaurantStatus.NEW, nullable=False
    )
    call_frequency = db.Column(
        Enum(CallFrequency), default=CallFrequency.WEEKLY, nullable=False
    )
    last_call_date = db.Column(db.DateTime, nullable=True)

    contacts = db.relationship("Contact", backref="restaurant", lazy=True)
    interactions = db.relationship("Interaction", backref="restaurant", lazy=True)

    def __repr__(self):
        return f"<Restaurant {self.name}>"


class Contact(db.Model):
    __tablename__ = "contacts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))

    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=False
    )

    def __repr__(self):
        return f"<Contact {self.name} - {self.role.value}>"


class Interaction(db.Model):
    __tablename__ = "interactions"

    id = db.Column(db.Integer, primary_key=True)
    interaction_date = db.Column(db.DateTime, nullable=False)
    type = db.Column(Enum(InteractionType), nullable=False)
    details = db.Column(db.Text)
    contact_id = db.Column(
        db.Integer, db.ForeignKey("contacts.id"), nullable=False
    )
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=False
    )

    def __repr__(self):
        return f"<Interaction {self.type.value} on {self.interaction_date}>"
