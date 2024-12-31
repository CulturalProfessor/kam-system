from flask import Blueprint, request, jsonify, current_app
from db.models import db, User, UserRole
from flask_jwt_extended import create_access_token, jwt_required
from  lib.utils import bcrypt
from datetime import timedelta

user_bp = Blueprint("user_bp", __name__)

expires = timedelta(days=3)


def can_create_user(current_user_role, new_user_role):
    if current_user_role == UserRole.ADMIN:
        return True
    if current_user_role == UserRole.KAM and new_user_role == UserRole.MANAGER:
        return True
    return False


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
        current_app.logger.info(f"Fetched {len(users)} users successfully.")
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching users: {str(e)}")
        return jsonify({"error": str(e)}), 400


@user_bp.route("/users/roles/<int:user_id>", methods=["GET"])
@jwt_required()
def get_users_by_currentUserRole(user_id):
    current_user = User.query.get_or_404(user_id)
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
            if can_create_user(current_user.role, u.role)
        ]
        current_app.logger.info(
            f"Fetched users based on the current user's role: {current_user.role.value}."
        )
        return jsonify(result), 200
    except Exception as e:
        current_app.logger.error(
            f"Error fetching users by role for user {user_id}: {str(e)}"
        )
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
        current_app.logger.info(f"User {user.id} logged in successfully.")
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
    current_app.logger.warning(f"Failed login attempt for email {data.get('email')}.")
    return jsonify({"error": "Invalid email or password"}), 401


@user_bp.route("/users/register", methods=["POST"])
def create_user():
    data = request.get_json()
    try:
        password_hash = bcrypt.generate_password_hash(data.get("password")).decode(
            "utf-8"
        )
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
        current_app.logger.info(f"New user {new_user.id} created successfully.")
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
        current_app.logger.error(f"Invalid role during user creation: {e}")
        return jsonify({"error": f"Invalid role"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating user: {str(e)}")
        return jsonify({"error": str(e)}), 400


@user_bp.route("/users/new", methods=["POST"])
@jwt_required()
def add_role_based_user():
    data = request.get_json()
    try:
        password_hash = bcrypt.generate_password_hash(data.get("password")).decode(
            "utf-8"
        )
        new_user = User(
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            password_hash=password_hash,
            role=UserRole[data.get("role", "KAM").upper()],
        )

        db.session.add(new_user)
        db.session.commit()
        current_app.logger.info(
            f"New role-based user {new_user.id} created successfully."
        )
        return (
            jsonify(
                {
                    "message": "User created",
                    "user": {
                        "id": new_user.id,
                        "name": new_user.name,
                        "email": new_user.email,
                        "phone": new_user.phone,
                        "role": new_user.role.value,
                    },
                }
            ),
            201,
        )
    except KeyError as e:
        current_app.logger.error(f"Invalid role during user creation: {e}")
        return jsonify({"error": f"Invalid role"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error creating role-based user: {str(e)}")
        return jsonify({"error": str(e)}), 400


@user_bp.route("/users/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    try:
        user = User.query.get_or_404(user_id)
        current_app.logger.info(f"User {user_id} fetched successfully.")
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
    except Exception as e:
        current_app.logger.error(f"Error fetching user {user_id}: {str(e)}")
        return jsonify({"error": str(e)}), 400


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
        current_app.logger.info(f"User {user_id} updated successfully.")
        return jsonify({"message": "User updated"}), 200
    except KeyError as e:
        current_app.logger.error(
            f"Invalid role during user update for user {user_id}: {e}"
        )
        return jsonify({"error": f"Invalid role"}), 400
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating user {user_id}: {str(e)}")
        return jsonify({"error": str(e)}), 400


@user_bp.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    try:
        db.session.delete(user)
        db.session.commit()
        current_app.logger.info(f"User {user_id} deleted successfully.")
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting user {user_id}: {str(e)}")
        return jsonify({"error": str(e)}), 400
