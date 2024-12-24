from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Numeric
import enums

db = SQLAlchemy()

RestaurantStatus = enums.RestaurantStatus
CallFrequency = enums.CallFrequency
InteractionType = enums.InteractionType
InteractionOutcome = enums.InteractionOutcome
UserRole = enums.UserRole
PreferredContactMethod = enums.PreferredContactMethod


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.KAM, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    restaurants = db.relationship(
        "Restaurant", back_populates="assigned_kam", lazy=True
    )

    def __repr__(self):
        return f"<User {self.name} ({self.role.value})>"


class Restaurant(db.Model):
    __tablename__ = "restaurants"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    status = db.Column(
        db.Enum(RestaurantStatus), default=RestaurantStatus.NEW, nullable=False
    )
    call_frequency = db.Column(
        db.Enum(CallFrequency), default=CallFrequency.WEEKLY, nullable=False
    )
    last_call_date = db.Column(db.DateTime, nullable=True)
    revenue = db.Column(Numeric(12, 2), nullable=True)
    notes = db.Column(db.Text)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    assigned_kam_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    assigned_kam = db.relationship("User", back_populates="restaurants", lazy=True)

    contacts = db.relationship("Contact", back_populates="restaurant", lazy=True)
    interactions = db.relationship(
        "Interaction", back_populates="restaurant", lazy=True
    )

    def __repr__(self):
        return f"<Restaurant {self.name}>"


class Contact(db.Model):
    __tablename__ = "contacts"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    preferred_contact_method = db.Column(db.Enum(PreferredContactMethod))
    time_zone = db.Column(db.String(50))

    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=False
    )
    restaurant = db.relationship("Restaurant", back_populates="contacts")

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    interactions = db.relationship("Interaction", back_populates="contact", lazy=True)

    def __repr__(self):
        return f"<Contact {self.name} - {self.role}>"


class Interaction(db.Model):
    __tablename__ = "interactions"
    id = db.Column(db.Integer, primary_key=True)
    interaction_date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.Enum(InteractionType), nullable=False)
    details = db.Column(db.Text)
    outcome = db.Column(db.Enum(InteractionOutcome))
    duration_minutes = db.Column(db.Integer)

    contact_id = db.Column(db.Integer, db.ForeignKey("contacts.id"), nullable=False)
    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=False
    )

    contact = db.relationship("Contact", back_populates="interactions", lazy=True)
    restaurant = db.relationship("Restaurant", back_populates="interactions", lazy=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    def __repr__(self):
        return f"<Interaction {self.type.value} on {self.interaction_date}>"
