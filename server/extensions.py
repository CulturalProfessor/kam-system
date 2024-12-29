from flask_caching import Cache
from flask_jwt_extended import JWTManager
import redis

cache = Cache()
jwt = JWTManager()
redis_client = redis.Redis(host='localhost', port=6379, db=0)
