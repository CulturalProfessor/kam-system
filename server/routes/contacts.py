from flask import Blueprint, request, jsonify
from models import db, Contact

contact_bp = Blueprint("contact_bp", __name__)


@contact_bp.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    result = [
        {
            "id": c.id,
            "name": c.name,
            "role": c.role,
            "email": c.email,
            "phone": c.phone,
            "restaurant_id": c.restaurant_id,
        }
        for c in contacts
    ]
    return jsonify(result), 200


@contact_bp.route("/contacts", methods=["POST"])
def create_contact():
    data = request.get_json()
    try:
        new_contact = Contact(
            name=data.get("name"),
            role=data.get("role"),
            email=data.get("email"),
            phone=data.get("phone"),
            restaurant_id=data.get("restaurant_id"),
        )
        db.session.add(new_contact)
        db.session.commit()
        return jsonify({"message": "Contact created", "id": new_contact.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@contact_bp.route("/contacts/<int:contact_id>", methods=["GET"])
def get_contact_by_id(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    return (
        jsonify(
            {
                "id": contact.id,
                "name": contact.name,
                "role": contact.role,
                "email": contact.email,
                "phone": contact.phone,
                "restaurant_id": contact.restaurant_id,
            }
        ),
        200,
    )


@contact_bp.route("/contacts/<int:contact_id>", methods=["PUT"])
def update_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    data = request.get_json()
    try:
        contact.name = data.get("name", contact.name)
        contact.role = data.get("role", contact.role)
        contact.email = data.get("email", contact.email)
        contact.phone = data.get("phone", contact.phone)
        db.session.commit()
        return jsonify({"message": "Contact updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@contact_bp.route("/contacts/<int:contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    try:
        db.session.delete(contact)
        db.session.commit()
        return jsonify({"message": "Contact deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400