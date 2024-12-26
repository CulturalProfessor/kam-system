from flask import Blueprint, request, jsonify
from models import db, Interaction, InteractionType, InteractionOutcome
from datetime import datetime
from flask_jwt_extended import jwt_required

interaction_bp = Blueprint("interaction_bp", __name__)


@interaction_bp.route("/interactions", methods=["GET"])
@jwt_required()
def get_interactions():
    interactions = Interaction.query.all()
    result = [
        {
            "id": i.id,
            "interaction_date": i.interaction_date.isoformat(),
            "type": i.type.value if i.type else None,
            "outcome": i.outcome.value if i.outcome else None,
            "details": i.details,
            "duration_minutes": i.duration_minutes,
            "restaurant_id": i.restaurant_id,
            "contact_id": i.contact_id,
        }
        for i in interactions
    ]
    return jsonify(result), 200


@interaction_bp.route("/interactions", methods=["POST"])
@jwt_required()
def create_interaction():
    data = request.get_json()
    try:
        interaction_type = InteractionType[data["type"].upper()]
        interaction_outcome = (
            InteractionOutcome[data["outcome"].upper()] if "outcome" in data else None
        )

        new_interaction = Interaction(
            interaction_date=datetime.strptime(data["interaction_date"], "%Y-%m-%d"),
            type=interaction_type,
            outcome=interaction_outcome,
            details=data.get("details"),
            duration_minutes=data.get("duration_minutes"),
            restaurant_id=data.get("restaurant_id"),
            contact_id=data.get("contact_id"),
        )
        db.session.add(new_interaction)
        db.session.commit()
        return (
            jsonify({"message": "Interaction created", "id": new_interaction.id}),
            201,
        )
    except KeyError as e:
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@interaction_bp.route("/interactions/<int:interaction_id>", methods=["GET"])
@jwt_required()
def get_interaction_by_id(interaction_id):
    interaction = Interaction.query.get_or_404(interaction_id)
    return (
        jsonify(
            {
                "id": interaction.id,
                "interaction_date": interaction.interaction_date.isoformat(),
                "type": interaction.type.value if interaction.type else None,
                "outcome": interaction.outcome.value if interaction.outcome else None,
                "details": interaction.details,
                "duration_minutes": interaction.duration_minutes,
                "restaurant_id": interaction.restaurant_id,
                "contact_id": interaction.contact_id,
            }
        ),
        200,
    )


@interaction_bp.route("/interactions/<int:interaction_id>", methods=["PUT"])
@jwt_required()
def update_interaction(interaction_id):
    interaction = Interaction.query.get_or_404(interaction_id)
    data = request.get_json()
    try:
        if "type" in data:
            interaction.type = InteractionType[data["type"].upper()]
        if "outcome" in data:
            interaction.outcome = InteractionOutcome[data["outcome"].upper()]
        interaction.details = data.get("details", interaction.details)
        interaction.duration_minutes = data.get(
            "duration_minutes", interaction.duration_minutes
        )
        if "interaction_date" in data:
            interaction.interaction_date = datetime.strptime(
                data["interaction_date"], "%Y-%m-%d"
            )
        db.session.commit()
        return jsonify({"message": "Interaction updated"}), 200
    except KeyError as e:
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@interaction_bp.route("/interactions/<int:interaction_id>", methods=["DELETE"])
@jwt_required()
def delete_interaction(interaction_id):
    interaction = Interaction.query.get_or_404(interaction_id)
    try:
        db.session.delete(interaction)
        db.session.commit()
        return jsonify({"message": "Interaction deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
