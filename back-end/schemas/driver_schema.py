from datetime import datetime
from cerberus import Validator


def validate_date(field, value, error):
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        error(field, "must be of date type")


add_driver_schema = {
    "name": {"type": "string", "maxlength": 100, "required": True},
    "gender": {"type": "string", "maxlength": 50, "allowed": ["Male", "Female"], "required": True},
    "dob": {"type": "string", "maxlength": 50, "required": True, "check_with": validate_date},
    "address": {"type": "string", "maxlength": 100, "required": True},
    "phone_number": {"type": "string", "maxlength": 100, "required": True},
    "license_number": {"type": "string", "maxlength": 100, "required": True},
    "status": {"type": "string", "maxlength": 100, "allowed": ["Available", "Unavailable"], "required": True},
}

update_driver_schema = {
    "name": {"type": "string", "maxlength": 100, "required": False},
    "gender": {"type": "string", "maxlength": 50, "allowed": ["Male", "Female"], "required": False},
    "dob": {"type": "string", "maxlength": 50, "required": False, "check_with": validate_date},
    "address": {"type": "string", "maxlength": 100, "required": False},
    "phone_number": {"type": "string", "maxlength": 100, "required": False},
    "license_number": {"type": "string", "maxlength": 100, "required": False},
    "status": {"type": "string", "maxlength": 100, "allowed": ["Available", "Unavailable"], "required": False},
}
