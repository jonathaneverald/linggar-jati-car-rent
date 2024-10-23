from datetime import datetime
from cerberus import Validator


def validate_date(field, value, error):
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        error(field, "must be of date type")


add_transaction_schema = {
    "car_name": {"type": "string", "maxlength": 100, "required": True},
    "driver_name": {"type": "string", "maxlength": 100, "required": False},
    "start_date": {"type": "string", "maxlength": 50, "required": True, "check_with": validate_date},
    "end_date": {
        "type": "string",
        "maxlength": 50,
        "required": True,
        "check_with": validate_date,
    },
}

validating_payment_schema = {
    "rental_status": {
        "type": "string",
        "maxlength": 50,
        "allowed": ["Valid", "Invalid"],
        "required": True,
    }
}

return_car_schema = {
    "return_date": {"type": "string", "maxlength": 50, "required": True, "check_with": validate_date},
}

generate_report_schema = {
    "from_month": {
        "type": "string",
        "maxlength": 50,
        "allowed": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        "required": True,
    },
    "from_year": {
        "type": "string",
        "maxlength": 50,
        "required": True,
    },
    "to_month": {
        "type": "string",
        "maxlength": 50,
        "allowed": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
        "required": True,
    },
    "to_year": {
        "type": "string",
        "maxlength": 50,
        "required": True,
    },
}

update_transaction_schema = {}
