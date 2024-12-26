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


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)
    jwt = JWTManager(app)
    configure_logger(app)

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
