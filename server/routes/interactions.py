from flask import Blueprint, request, jsonify
from models import db, Interaction
from datetime import datetime

interaction_bp = Blueprint("interaction_bp", __name__)


@interaction_bp.route("/interactions", methods=["GET"])
def get_interactions():
    interactions = Interaction.query.all()
    result = [
        {
            "id": i.id,
            "interaction_date": i.interaction_date.isoformat(),
            "type": i.type,
            "details": i.details,
            "restaurant_id": i.restaurant_id,
        }
        for i in interactions
    ]
    return jsonify(result), 200


@interaction_bp.route("/interactions", methods=["POST"])
def create_interaction():
    data = request.get_json()
    try:
        new_interaction = Interaction(
            interaction_date=datetime.strptime(
                data["interaction_date"], "%Y-%m-%d"
            ),
            type=data.get("type"),
            details=data.get("details"),
            restaurant_id=data.get("restaurant_id"),
        )
        db.session.add(new_interaction)
        db.session.commit()
        return jsonify({"message": "Interaction created", "id": new_interaction.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@interaction_bp.route("/interactions/<int:interaction_id>", methods=["GET"])
def get_interaction_by_id(interaction_id):
    interaction = Interaction.query.get_or_404(interaction_id)
    return (
        jsonify(
            {
                "id": interaction.id,
                "interaction_date": interaction.interaction_date.isoformat(),
                "type": interaction.type,
                "details": interaction.details,
                "restaurant_id": interaction.restaurant_id,
            }
        ),
        200,
    )


@interaction_bp.route("/interactions/<int:interaction_id>", methods=["PUT"])
def update_interaction(interaction_id):
    interaction = Interaction.query.get_or_404(interaction_id)
    data = request.get_json()
    try:
        interaction.type = data.get("type", interaction.type)
        interaction.details = data.get("details", interaction.details)
        if data.get("interaction_date"):
            interaction.interaction_date = datetime.strptime(
                data["interaction_date"], "%Y-%m-%d"
            )
        db.session.commit()
        return jsonify({"message": "Interaction updated"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@interaction_bp.route("/interactions/<int:interaction_id>", methods=["DELETE"])
def delete_interaction(interaction_id):
    interaction = Interaction.query.get_or_404(interaction_id)
    try:
        db.session.delete(interaction)
        db.session.commit()
        return jsonify({"message": "Interaction deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400