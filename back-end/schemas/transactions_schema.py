from datetime import datetime
from cerberus import Validator


def validate_date(field, value, error):
    try:
        datetime.strptime(value, "%Y-%m-%d")
    except ValueError:
        error(field, "must be of date type")


# # Function to validate that end_date is greater than start_date
# def validate_date_range(field, value, error, values):
#     start_date_str = values.get("start_date")
#     if not start_date_str:
#         error("start_date", "Start date is required")
#         return

#     try:
#         start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
#         end_date = datetime.strptime(value, "%Y-%m-%d")
#     except ValueError:
#         error(field, "must be a valid date format (YYYY-MM-DD)")
#         return

#     if end_date <= start_date:
#         error(field, "End date must be greater than start date")


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

update_transaction_schema = {}
