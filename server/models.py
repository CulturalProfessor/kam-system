from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Restaurant(db.Model):
    __tablename__ = "restaurants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    status = db.Column(db.String(50), default="New")
    call_frequency = db.Column(db.String(50), default="Weekly")
    last_call_date = db.Column(db.DateTime, nullable=True)

    contacts = db.relationship("Contact", backref="restaurant", lazy=True)
    interactions = db.relationship("Interaction", backref="restaurant", lazy=True)

    def __repr__(self):
        return f"<Restaurant {self.name}>"


class Contact(db.Model):
    __tablename__ = "contacts"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))

    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=False
    )

    def __repr__(self):
        return f"<Contact {self.name} - {self.role}>"


class Interaction(db.Model):
    __tablename__ = "interactions"

    id = db.Column(db.Integer, primary_key=True)
    interaction_date = db.Column(db.DateTime, nullable=False)
    type = db.Column(db.String(50))
    details = db.Column(db.Text)

    restaurant_id = db.Column(
        db.Integer, db.ForeignKey("restaurants.id"), nullable=False
    )

    def __repr__(self):
        return f"<Interaction {self.type} on {self.interaction_date}>"
