from flask import Flask, jsonify
from flask_migrate import Migrate
from config import Config
from models import db
from routes.restaurants import restaurant_bp
from flask_cors import CORS
from routes.restaurants import restaurant_bp
from routes.contacts import contact_bp
from routes.interactions import interaction_bp


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)

    app.register_blueprint(restaurant_bp, url_prefix="/api")
    app.register_blueprint(contact_bp, url_prefix="/api")
    app.register_blueprint(interaction_bp, url_prefix="/api")

    @app.route("/", methods=["GET"])
    def hello_world():
        return jsonify({"message": "KAM Lead Management System Running"}), 200

    return app


if __name__ == "__main__":
    flask_app = create_app()
    with flask_app.app_context():
        db.create_all()
    flask_app.run(debug=True)
