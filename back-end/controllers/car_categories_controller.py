from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.car_categories import CarCategoryModel
from models.users import UserModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.car_categories_schema import add_categories_schema, update_categories_schema
from utils.handle_response import ResponseHandler

car_categories_blueprint = Blueprint("car_categories_blueprint", __name__)


@car_categories_blueprint.post("/car-categories")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can create car category
def create_category():
    Session = sessionmaker(bind=connection)
    s = Session()
    s.begin()

    try:
        user_id = get_jwt_identity()
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        # Check if the current user's role is "admin"
        if current_user.role_id != 1:
            return ResponseHandler.error(message="Unauthorized access, only admin can access this!", status=403)

        data = request.get_json()
        validator = Validator(add_categories_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Invalid data!", data=validator.errors, status=400)

        car_brand = data.get("car_brand")
        type = data.get("type")

        # Check if the car brand and type already exists
        existing_category = (
            s.query(CarCategoryModel)
            .filter(CarCategoryModel.car_brand == car_brand, CarCategoryModel.type == type)
            .first()
        )

        if existing_category:
            return ResponseHandler.error(message="Car brand and type already exists!", status=409)

        new_car_categories = CarCategoryModel(car_brand=car_brand, type=type)

        s.add(new_car_categories)
        s.commit()

        return ResponseHandler.success(
            message="Car category added successfully",
            data=new_car_categories.to_dictionaries(),
            status=201,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the car category",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@car_categories_blueprint.get("/car-categories")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_all_category():
    try:
        car_categories = (CarCategoryModel).query.all()
        car_categories_list = [car_category.to_dictionaries() for car_category in car_categories]
        return ResponseHandler.success(data=car_categories_list, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occured while showing car categories",
            data=str(e),
            status=500,
        )


@car_categories_blueprint.get("/car-categories/<int:id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
def show_category_by_id(id):
    try:
        car_category = (CarCategoryModel).query.filter_by(id=id).first()
        if not car_category:
            return ResponseHandler.error(message="Car category not found!", data=None, status=404)

        return ResponseHandler.success(
            message="Car category retrieved successfully",
            data=car_category.to_dictionaries(),
            status=200,
        )

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing car category",
            data=str(e),
            status=500,
        )
