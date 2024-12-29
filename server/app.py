import os
from dotenv import load_dotenv
from flask import Flask, current_app, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from logging.handlers import RotatingFileHandler
import logging
import traceback

from config import Config
from models import db
from extensions import cache, jwt, redis_client
from routes.restaurants import restaurant_bp
from routes.contacts import contact_bp
from routes.interactions import interaction_bp
from routes.users import user_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cache.init_app(app)
    Migrate(app, db)
    CORS(app)
 
    try:
        redis_client.ping()
        current_app.logger.info("Redis connection successful")
    except Exception as e:
        app.logger.error(f"Redis connection failed: {e}")

    app.register_blueprint(restaurant_bp, url_prefix="/api")
    app.register_blueprint(contact_bp, url_prefix="/api")
    app.register_blueprint(interaction_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")

    @app.route("/", methods=["GET"])
    def hello_world():
        app.logger.info("Hello World route accessed")
        return jsonify({"message": "KAM Lead Management System Running"}), 200

    configure_logger(app)
    return app


def configure_logger(app):
    log_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    log_file = os.getenv("LOG_FILE", "server.log")
    log_handler = RotatingFileHandler(log_file, maxBytes=1_000_000, backupCount=5)
    log_handler.setFormatter(log_formatter)

    app.logger.setLevel(logging.INFO)
    log_handler.setLevel(logging.INFO)
    app.logger.addHandler(log_handler)

    @app.errorhandler(Exception)
    def handle_exception(e):
        tb = traceback.format_exc()
        app.logger.error(f"Uncaught Exception: {e}\nTraceback:\n{tb}")
        return jsonify({"error": "An internal error occurred"}), 500


if __name__ == "__main__":
    flask_app = create_app()
    with flask_app.app_context():
        db.create_all()
    debug_mode = os.getenv("DEBUG", "True").lower() == "true"
    flask_app.run(debug=debug_mode)
