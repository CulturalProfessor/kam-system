from flask import Blueprint, request, jsonify, current_app
from models import db, User, UserRole
from flask_jwt_extended import create_access_token
from utils import bcrypt
from datetime import timedelta

user_bp = Blueprint("user_bp", __name__)

expires = timedelta(days=3)


@user_bp.route("/users", methods=["GET"])
def get_users():
    try:
        users = User.query.all()
        result = [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "phone": u.phone,
                "role": u.role.value,
                "created_at": u.created_at.isoformat(),
                "updated_at": u.updated_at.isoformat(),
            }
            for u in users
        ]
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(str(e))
        return jsonify({"error": str(e)}), 400


@user_bp.route("/users/login", methods=["POST"])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if user and bcrypt.check_password_hash(user.password_hash, data.get("password")):
        access_token = create_access_token(
            identity=user.id,
            additional_claims={"role": user.role.value, "email": user.email},
            expires_delta=expires,
        )
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "id": user.id,
                    "access_token": access_token,
                }
            ),
            200,
        )
    current_app.logger.error("Invalid email or password")
    return jsonify({"error": "Invalid email or password"}), 401


@user_bp.route("/users/register", methods=["POST"])
def create_user():
    data = request.get_json()
    try:
        password_hash = bcrypt.generate_password_hash(data.get("password")).decode(
            "utf-8"
        )
        data.get("password")
        new_user = User(
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            password_hash=password_hash,
            role=UserRole[data.get("role", "KAM").upper()],
        )

        db.session.add(new_user)
        access_token = create_access_token(
            identity=new_user.id,
            additional_claims={"role": new_user.role.value, "email": new_user.email},
            expires_delta=expires,
        )
        db.session.commit()
        return (
            jsonify(
                {
                    "message": "User created",
                    "id": new_user.id,
                    "access_token": access_token,
                }
            ),
            201,
        )
    except KeyError as e:
        current_app.logger.error(f"Invalid role: {e}")
        return jsonify({"error": f"Invalid role"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e))
        return jsonify({"error": str(e)}), 400


@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    user = User.query.get_or_404(user_id)
    return (
        jsonify(
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role.value,
            }
        ),
        200,
    )


@user_bp.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    try:
        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)
        user.phone = data.get("phone", user.phone)
        user.role = UserRole[data.get("role", user.role.name).upper()]
        db.session.commit()
        return jsonify({"message": "User updated"}), 200
    except KeyError as e:
        current_app.logger.error(f"Invalid role: {e}")
        return jsonify({"error": f"Invalid role"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e))
        return jsonify({"error": str(e)}), 400


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e))
        return jsonify({"error": str(e)}), 400
