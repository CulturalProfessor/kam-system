import enum


class RestaurantStatus(enum.Enum):
    NEW = "New"
    CONTACTED = "Contacted"
    CONVERTED = "Converted"
    LOST = "Lost"


class CallFrequency(enum.Enum):
    DAILY = "Daily"
    WEEKLY = "Weekly"
    MONTHLY = "Monthly"


class InteractionType(enum.Enum):
    CALL = "Call"
    MEETING = "Meeting"
    EMAIL = "Email"
    SITE_VISIT = "Site Visit"
    FOLLOW_UP = "Follow-Up"
