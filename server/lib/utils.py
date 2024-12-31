from flask_bcrypt import Bcrypt
import requests
from  lib.extensions import cache
from apscheduler.schedulers.background import BackgroundScheduler
import os

bcrypt = Bcrypt()


def invalidate_cache():
    cache.delete("average_interaction_duration_all")
    cache.delete("performance_score_all")
    cache.delete("underperforming_restaurants")
    cache.delete("test_average_interaction_duration_all")


def ping_server():
    try:
        api_url = os.getenv("API_URL", "http://localhost:5000")
        response = requests.get(f"{api_url}/health")
        if response.status_code == 200:
            print("Server is healthy")
    except Exception as e:
        print(f"Error pinging server: {str(e)}")


def configure_scheduler(app):
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=ping_server, trigger="interval", minutes=10)
    scheduler.start()
