from flask_bcrypt import Bcrypt
from extensions import cache

bcrypt = Bcrypt()

def invalidate_cache():
    cache.delete("average_interaction_duration_all")
    cache.delete("performance_score_all")
    cache.delete("underperforming_restaurants")
    cache.delete("test_average_interaction_duration_all")