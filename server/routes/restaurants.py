from flask import Blueprint, request, jsonify, current_app
from sqlalchemy import func
from models import db, Restaurant, RestaurantStatus, CallFrequency, Contact
from datetime import datetime, timedelta
from flask_jwt_extended import jwt_required
from extensions import cache, redis_client

restaurant_bp = Blueprint("restaurant_bp", __name__)


def invalidate_cache():
    cache.delete("average_interaction_duration_all")
    cache.delete("performance_score_all")
    cache.delete("underperforming_restaurants")
    cache.delete("test_average_interaction_duration_all")

@restaurant_bp.route("/restaurants", methods=["GET"])
@jwt_required()
def get_restaurants():
    try:
        restaurants = Restaurant.query.all()
        result = [
            {
                "id": r.id,
                "name": r.name,
                "address": r.address,
                "status": r.status.value if r.status else None,
                "call_frequency": r.call_frequency.value if r.call_frequency else None,
                "last_call_date": (
                    r.last_call_date.isoformat() if r.last_call_date else None
                ),
                "revenue": str(r.revenue) if r.revenue is not None else None,
                "notes": r.notes,
            }
            for r in restaurants
        ]
        current_app.logger.info("Fetched restaurants successfully")
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching restaurants: {str(e)}")
        return jsonify({"error": str(e)}), 400


@restaurant_bp.route("/restaurants", methods=["POST"])
@jwt_required()
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
            revenue=data.get("revenue"),
            notes=data.get("notes"),
        )
        db.session.add(new_restaurant)
        db.session.commit()
        invalidate_cache()
        current_app.logger.info(f"Created restaurant with ID {new_restaurant.id}")
        return jsonify({"message": "Restaurant created", "id": new_restaurant.id}), 201
    except KeyError as e:
        current_app.logger.error(f"Invalid value for key: {e}")
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating restaurant: {str(e)}")
        return jsonify({"error": str(e)}), 400


@restaurant_bp.route("/restaurants/<int:restaurant_id>", methods=["GET"])
@jwt_required()
def get_restaurant_by_id(restaurant_id):
    try:
        restaurant = Restaurant.query.get_or_404(restaurant_id)
        current_app.logger.info(f"Fetched restaurant with ID {restaurant.id}")
        return (
            jsonify(
                {
                    "id": restaurant.id,
                    "name": restaurant.name,
                    "address": restaurant.address,
                    "status": restaurant.status.value if restaurant.status else None,
                    "call_frequency": (
                        restaurant.call_frequency.value
                        if restaurant.call_frequency
                        else None
                    ),
                    "last_call_date": (
                        restaurant.last_call_date.isoformat()
                        if restaurant.last_call_date
                        else None
                    ),
                    "revenue": (
                        str(restaurant.revenue)
                        if restaurant.revenue is not None
                        else None
                    ),
                    "notes": restaurant.notes,
                    "contacts": [
                        {
                            "id": c.id,
                            "name": c.name,
                            "role": c.role,
                            "email": c.email,
                            "phone": c.phone,
                        }
                        for c in restaurant.contacts
                    ],
                    "interactions": [
                        {
                            "id": i.id,
                            "type": i.type.value if i.type else None,
                            "details": i.details,
                            "interaction_date": i.interaction_date.isoformat(),
                        }
                        for i in restaurant.interactions
                    ],
                }
            ),
            200,
        )
    except Exception as e:
        current_app.logger.error(
            f"Error fetching restaurant with ID {restaurant_id}: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400


@restaurant_bp.route("/restaurants/<int:restaurant_id>", methods=["PUT"])
@jwt_required()
def update_restaurant(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    data = request.get_json()
    try:
        restaurant.name = data.get("name", restaurant.name)
        restaurant.address = data.get("address", restaurant.address)
        if "status" in data:
            restaurant.status = RestaurantStatus[data["status"].upper()]
        if "call_frequency" in data:
            restaurant.call_frequency = CallFrequency[data["call_frequency"].upper()]
        if data.get("last_call_date"):
            restaurant.last_call_date = datetime.strptime(
                data["last_call_date"], "%Y-%m-%d"
            )
        restaurant.revenue = data.get("revenue", restaurant.revenue)
        restaurant.notes = data.get("notes", restaurant.notes)
        db.session.commit()
        invalidate_cache()
        current_app.logger.info(f"Updated restaurant with ID {restaurant.id}")
        return jsonify({"message": "Restaurant updated"}), 200
    except KeyError as e:
        current_app.logger.error(f"Invalid value for key: {e}")
        return jsonify({"error": f"Invalid value: {e}"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error updating restaurant with ID {restaurant_id}: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400


@restaurant_bp.route("/restaurants/<int:restaurant_id>", methods=["DELETE"])
@jwt_required()
def delete_restaurant(restaurant_id):
    restaurant = Restaurant.query.get_or_404(restaurant_id)
    try:
        contacts = Contact.query.filter_by(restaurant_id=restaurant_id).all()

        for contact in contacts:
            db.session.delete(contact)

        db.session.delete(restaurant)
        db.session.commit()
        invalidate_cache()
        current_app.logger.info(f"Deleted restaurant with ID {restaurant.id}")
        return jsonify({"message": "Restaurant deleted"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(
            f"Error deleting restaurant with ID {restaurant_id}: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400

@restaurant_bp.route("/restaurants/underperforming", methods=["GET"])
@jwt_required()
@cache.cached(timeout=300, key_prefix="underperforming_restaurants")
def get_underperforming_restaurants():
    try:
        restaurants = Restaurant.query.all()
        for r in restaurants:
            r.is_underperforming()
        underperforming_restaurants = [r for r in restaurants if r.is_underperforming()]
        result = [
            {
                "id": r.id,
                "name": r.name,
                "last_interaction_date": (
                    r.last_interaction_date().isoformat()
                    if r.last_interaction_date()
                    else None
                ),
                "time_since_last_interaction": (
                    (datetime.utcnow() - r.last_interaction_date()).days
                    if r.last_interaction_date()
                    else None
                ),
                "revenue": r.revenue,
            }
            for r in underperforming_restaurants
        ]
        current_app.logger.info("Fetched underperforming restaurants successfully")
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(
            f"Error fetching underperforming restaurants: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400


@restaurant_bp.route("/restaurants/performance_score", methods=["GET"])
@jwt_required()
@cache.cached(timeout=300, key_prefix="performance_score_all")
def get_performance_scores():
    try:
        restaurants = Restaurant.query.all()
        result = [
            {
                "id": r.id,
                "name": r.name,
                "performance_score": str(r.performance_score()).split(".")[0],
            }
            for r in restaurants
        ]
        current_app.logger.info("Fetched performance scores successfully")
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching performance scores: {str(e)}")
        return jsonify({"error": str(e)}), 400

@restaurant_bp.route("/restaurants/average_interaction_duration", methods=["GET"])
@jwt_required()
@cache.cached(timeout=300,key_prefix="average_interaction_duration_all")
def get_all_average_interaction_duration():
    try:
        restaurants = Restaurant.query.all()
        result = [
            {
                "id": r.id,
                "name": r.name,
                "average_interaction_duration": str(
                    r.average_interaction_duration()
                ).split(".")[0],
            }
            for r in restaurants
        ]
        current_app.logger.info("Fetched average interaction durations successfully")
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(
            f"Error fetching average interaction durations: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400
    

@restaurant_bp.route("/restaurants/average_interaction_duration/test", methods=["GET"])
@cache.cached(timeout=300, key_prefix="test_average_interaction_duration_all")
def test_get_all_average_interaction_duration():
    try:
        restaurants = Restaurant.query.all()
        result = [
            {
                "id": r.id,
                "name": r.name,
                "average_interaction_duration": str(
                    r.average_interaction_duration()
                ).split(".")[0],
            }
            for r in restaurants
        ]
        current_app.logger.info("Fetched average interaction durations successfully")
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(
            f"Error fetching average interaction durations: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400
    

@restaurant_bp.route("/restaurants/average_interaction_duration/without_cache/test", methods=["GET"])
def test_get_all_average_interaction_duration_without_cache():
    try:
        restaurants = Restaurant.query.all()
        result = [
            {
                "id": r.id,
                "name": r.name,
                "average_interaction_duration": str(
                    r.average_interaction_duration()
                ).split(".")[0],
            }
            for r in restaurants
        ]
        current_app.logger.info("Fetched average interaction durations successfully")
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(
            f"Error fetching average interaction durations: {str(e)}"
        )
        return jsonify({"error": str(e)}), 400
