from flask import Blueprint, request, jsonify, current_app
from db.models import Interaction, db, Contact, PreferredContactMethod
from flask_jwt_extended import jwt_required
from  lib.utils import invalidate_cache

contact_bp = Blueprint("contact_bp", __name__)


@contact_bp.route("/contacts", methods=["GET"])
@jwt_required()
def get_contacts():
    try:
        contacts = Contact.query.all()
        result = [
            {
                "id": c.id,
                "name": c.name,
                "role": c.role,
                "email": c.email,
                "phone": c.phone,
                "preferred_contact_method": (
                    c.preferred_contact_method.value
                    if c.preferred_contact_method
                    else None
                ),
                "time_zone": c.time_zone,
                "restaurant_id": c.restaurant_id,
            }
            for c in contacts
        ]
        current_app.logger.info("Fetched contacts successfully")
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching contacts: {str(e)}")
        return jsonify({"error": str(e)}), 400


@contact_bp.route("/contacts", methods=["POST"])
@jwt_required()
def create_contact():
    data = request.get_json()
    try:
        new_contact = Contact(
            name=data.get("name"),
            role=data.get("role"),
            email=data.get("email"),
            phone=data.get("phone"),
            preferred_contact_method=(
                PreferredContactMethod[data["preferred_contact_method"].upper()]
                if "preferred_contact_method" in data
                else None
            ),
            time_zone=data.get("time_zone"),
            restaurant_id=data.get("restaurant_id"),
        )
        db.session.add(new_contact)
        db.session.commit()
        invalidate_cache()
        current_app.logger.info(f"Created contact with ID {new_contact.id}")
        return jsonify({"message": "Contact created", "id": new_contact.id}), 201
    except KeyError as e:
        current_app.logger.error(f"Invalid value for key: {e}")
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating contact: {str(e)}")
        return jsonify({"error": str(e)}), 400


@contact_bp.route("/contacts/<int:contact_id>", methods=["GET"])
@jwt_required()
def get_contact_by_id(contact_id):
    try:
        contact = Contact.query.get_or_404(contact_id)
        current_app.logger.info(f"Fetched contact with ID {contact.id}")
        return (
            jsonify(
                {
                    "id": contact.id,
                    "name": contact.name,
                    "role": contact.role,
                    "email": contact.email,
                    "phone": contact.phone,
                    "preferred_contact_method": (
                        contact.preferred_contact_method.value
                        if contact.preferred_contact_method
                        else None
                    ),
                    "time_zone": contact.time_zone,
                    "restaurant_id": contact.restaurant_id,
                }
            ),
            200,
        )
    except Exception as e:
        current_app.logger.error(
            f"Error fetching contact with ID {contact_id}: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400


@contact_bp.route("/contacts/<int:contact_id>", methods=["PUT"])
@jwt_required()
def update_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    data = request.get_json()
    try:
        contact.name = data.get("name", contact.name)
        contact.role = data.get("role", contact.role)
        contact.email = data.get("email", contact.email)
        contact.phone = data.get("phone", contact.phone)
        if "preferred_contact_method" in data:
            contact.preferred_contact_method = PreferredContactMethod[
                data["preferred_contact_method"].upper()
            ]
        contact.time_zone = data.get("time_zone", contact.time_zone)
        db.session.commit()
        invalidate_cache()
        current_app.logger.info(f"Updated contact with ID {contact.id}")
        return jsonify({"message": "Contact updated"}), 200
    except KeyError as e:
        current_app.logger.error(f"Invalid value for key: {e}")
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error updating contact with ID {contact_id}: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400


@contact_bp.route("/contacts/<int:contact_id>", methods=["DELETE"])
@jwt_required()
def delete_contact(contact_id):
    contact = Contact.query.get_or_404(contact_id)
    try:
        interactions = Interaction.query.filter_by(contact_id=contact_id).all()
        for interaction in interactions:
            db.session.delete(interaction)
        db.session.commit()
        db.session.delete(contact)
        db.session.commit()
        invalidate_cache()
        return jsonify({"message": "Contact deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
