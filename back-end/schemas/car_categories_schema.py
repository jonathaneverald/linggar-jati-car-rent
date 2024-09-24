add_categories_schema = {
    "car_brand": {"type": "string", "maxlength": 50, "required": True},
    "type": {"type": "string", "maxlength": 50, "required": True},
}

update_categories_schema = {
    "car_brand": {"type": "string", "maxlength": 50, "required": False},
    "type": {"type": "string", "maxlength": 50, "required": False},
}
