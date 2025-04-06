import os
from dotenv import load_dotenv
from flask import Flask, app, current_app, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from logging.handlers import RotatingFileHandler
import logging
import traceback
from lib.config import Config
from db.models import db
from lib.extensions import cache, jwt, redis_client
from routes.restaurants import restaurant_bp
from routes.contacts import contact_bp
from routes.interactions import interaction_bp
from routes.users import user_bp, fetch_users
from routes.health import health_bp
from apscheduler.schedulers.background import BackgroundScheduler
from lib.utils import configure_scheduler

load_dotenv()


def configure_scheduler_for_db(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=lambda: fetch_users(app),
        trigger="interval",
        hours=24,
        id="fetch_users_job",
        replace_existing=True,
        max_instances=3
    )
    scheduler.start()

def create_app():
    app = Flask("KAM")
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cache.init_app(app)
    Migrate(app, db)
    CORS(app)
    configure_scheduler(app)
    configure_scheduler_for_db(app)
    try:
        redis_client.ping()
        print("Redis connection successful")
    except Exception as e:
        print(f"Error connecting to Redis: {str(e)}")

    app.register_blueprint(restaurant_bp, url_prefix="/api")
    app.register_blueprint(contact_bp, url_prefix="/api")
    app.register_blueprint(interaction_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")
    app.register_blueprint(health_bp, url_prefix="/api")

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
    port = int(os.getenv("PORT", 5000))
    flask_app.run(host="0.0.0.0", port=port, debug=debug_mode)


flask_app = create_app()
