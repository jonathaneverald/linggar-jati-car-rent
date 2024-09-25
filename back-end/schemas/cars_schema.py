add_car_schema = {
    "car_brand": {"type": "string", "maxlength": 50, "required": True},
    "type": {"type": "string", "maxlength": 50, "required": True},
    "name": {"type": "string", "maxlength": 100, "required": True},
    "transmission": {"type": "string", "maxlength": 50, "allowed": ["MT", "AT", "CVT"], "required": True},
    "fuel": {"type": "string", "maxlength": 50, "allowed": ["Petrol", "Diesel"], "required": True},
    "color": {"type": "string", "maxlength": 50, "required": True},
    "plate_number": {"type": "string", "maxlength": 50, "required": True},
    "capacity": {"type": "integer", "required": True},
    "registration_number": {"type": "integer", "required": True},
    "price": {"type": "float", "required": True},
    "status": {"type": "string", "maxlength": 50, "allowed": ["Available", "Unavailable", "Rented"], "required": True},
}

update_car_schema = {
    "car_brand": {"type": "string", "maxlength": 50, "required": False},
    "type": {"type": "string", "maxlength": 50, "required": False},
    "name": {"type": "string", "maxlength": 100, "required": False},
    "transmission": {"type": "string", "maxlength": 50, "allowed": ["MT", "AT", "CVT"], "required": False},
    "fuel": {"type": "string", "maxlength": 50, "allowed": ["Petrol", "Diesel"], "required": False},
    "color": {"type": "string", "maxlength": 50, "required": False},
    "plate_number": {"type": "string", "maxlength": 50, "required": False},
    "capacity": {"type": "integer", "required": False},
    "registration_number": {"type": "integer", "required": False},
    "price": {"type": "float", "required": False},
    "status": {
        "type": "string",
        "maxlength": 50,
        "allowed": ["Available", "Unavailable", "Rented"],
        "required": False,
    },
}
