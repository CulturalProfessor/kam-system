from flask import Blueprint, request, jsonify
from models import db, Restaurant, RestaurantStatus, CallFrequency
from datetime import datetime

restaurant_bp = Blueprint("restaurant_bp", __name__)


@restaurant_bp.route("/restaurants", methods=["GET"])
def get_restaurants():
    restaurants = Restaurant.query.all()
    result = []
    for r in restaurants:
        result.append(
            {
                "id": r.id,
                "name": r.name,
                "address": r.address,
                "status": r.status.value,
                "call_frequency": r.call_frequency.value,
                "last_call_date": (
                    r.last_call_date.isoformat() if r.last_call_date else None
                ),
            }
        )
    return jsonify(result), 200


@restaurant_bp.route("/restaurants", methods=["POST"])
def create_restaurant():
    data = request.get_json()
    try:
        new_restaurant = Restaurant(
            name=data.get("name"),
            address=data.get("address"),
            status=RestaurantStatus[data.get("status", "NEW").upper()],
            call_frequency=CallFrequency[data.get("call_frequency", "WEEKLY").upper()],
            last_call_date=(
                datetime.strptime(data["last_call_date"], "%Y-%m-%d")
                if data.get("last_call_date")
                else None
            ),
        )
        db.session.add(new_restaurant)
        db.session.commit()
        return jsonify({"message": "Restaurant created", "id": new_restaurant.id}), 201
    except KeyError as e:
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@restaurant_bp.route("/restaurants/<int:restaurant_id>", methods=["GET"])
def get_restaurant_by_id(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    return (
        jsonify(
            {
                "id": restaurant.id,
                "name": restaurant.name,
                "address": restaurant.address,
                "status": restaurant.status.value,
                "call_frequency": restaurant.call_frequency.value,
                "last_call_date": (
                    restaurant.last_call_date.isoformat()
                    if restaurant.last_call_date
                    else None
                ),
                "contacts": [
                    {
                        "id": c.id,
                        "name": c.name,
                        "role": c.role if isinstance(c.role, str) else c.role.value,
                        "email": c.email,
                        "phone": c.phone,
                    }
                    for c in restaurant.contacts
                ],
                "interactions": [
                    {
                        "id": i.id,
                        "type": i.type.value,
                        "details": i.details,
                        "interaction_date": i.interaction_date.isoformat(),
                    }
                    for i in restaurant.interactions
                ],
            }
        ),
        200,
    )


@restaurant_bp.route("/restaurants/<int:restaurant_id>", methods=["PUT"])
def update_restaurant(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    data = request.get_json()
    try:
        restaurant.name = data.get("name", restaurant.name)
        restaurant.address = data.get("address", restaurant.address)
        if "status" in data:
            restaurant.status = RestaurantStatus[
                data["status"].upper()
            ]  # Convert string to enum
        if "call_frequency" in data:
            restaurant.call_frequency = CallFrequency[
                data["call_frequency"].upper()
            ]  # Convert string to enum
        if data.get("last_call_date"):
            restaurant.last_call_date = datetime.strptime(
                data["last_call_date"], "%Y-%m-%d"
            )
        db.session.commit()
        return jsonify({"message": "Restaurant updated"}), 200
    except KeyError as e:
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


@restaurant_bp.route("/restaurants/<int:restaurant_id>", methods=["DELETE"])
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    try:
        db.session.delete(restaurant)
        db.session.commit()
        return jsonify({"message": "Restaurant deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
