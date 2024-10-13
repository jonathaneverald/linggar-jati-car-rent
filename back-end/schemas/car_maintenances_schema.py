from datetime import datetime
from cerberus import Validator


def validate_date(field, value, error):
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        error(field, "must be of date type")


add_maintenance_schema = {
    "car_name": {"type": "string", "maxlength": 100, "required": True},
    "maintenance_date": {"type": "string", "maxlength": 50, "required": True, "check_with": validate_date},
    "description": {"type": "string", "maxlength": 50, "required": True},
    "cost": {"type": "float", "required": True},
}

update_maintenance_schema = {
    "car_name": {"type": "string", "maxlength": 100, "required": False},
    "maintenance_date": {"type": "string", "maxlength": 50, "required": False, "check_with": validate_date},
    "description": {"type": "string", "maxlength": 50, "required": False},
    "cost": {"type": "float", "required": False},
}
