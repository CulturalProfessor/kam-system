from flask import Flask, jsonify
from config import Config
from models import db
from routes.restaurants import restaurant_bp
from flask_cors import CORS
from routes.contacts import contact_bp
from routes.interactions import interaction_bp
from routes.users import user_bp
from flask_jwt_extended import JWTManager
import logging
from logging.handlers import RotatingFileHandler
import traceback
from flask_migrate import Migrate
from extensions import cache, jwt, redis_client


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    app.config["CACHE_TYPE"] = "redis"
    app.config["CACHE_REDIS_HOST"] = "localhost"
    app.config["CACHE_REDIS_PORT"] = 6379
    app.config["CACHE_REDIS_DB"] = 0
    app.config["CACHE_REDIS_URL"] = "redis://localhost:6379/0"
    db.init_app(app)
    jwt.init_app(app)
    cache.init_app(app)
    migrate = Migrate(app, db)
    configure_logger(app)
    redis_client.ping()

    app.register_blueprint(restaurant_bp, url_prefix="/api")
    app.register_blueprint(contact_bp, url_prefix="/api")
    app.register_blueprint(interaction_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")

    @app.route("/", methods=["GET"])
    def hello_world():
        app.logger.info("Hello World route accessed")
        return jsonify({"message": "KAM Lead Management System Running"}), 200

    return app


def configure_logger(app):
    log_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )
    log_handler = RotatingFileHandler("server.log", maxBytes=1000000, backupCount=5)
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
    flask_app.run(debug=True)
