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

class InteractionOutcome(enum.Enum):
    SUCCESSFUL = "Successful"
    NEEDS_FOLLOW_UP = "Needs Follow-Up"
    NO_RESPONSE = "No Response"
    CANCELLED = "Cancelled"

class UserRole(enum.Enum):
    KAM = "KAM"
    MANAGER = "Manager"
    ADMIN = "Admin"

class PreferredContactMethod(enum.Enum):
    PHONE = "Phone"
    EMAIL = "Email"
    WHATSAPP = "WhatsApp"
    SMS = "SMS"
