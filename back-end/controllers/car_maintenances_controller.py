from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.car_maintenances import CarMaintenanceModel
from models.cars import CarModel
from models.users import UserModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.car_maintenances_schema import add_maintenance_schema, update_maintenance_schema
from utils.handle_response import ResponseHandler
from sqlalchemy import and_

car_maintenances_blueprint = Blueprint("car_maintenances_blueprint", __name__)


@car_maintenances_blueprint.post("/car-maintenances")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can create new car
def create_maintenance():
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
        validator = Validator(add_maintenance_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Invalid data!", data=validator.errors, status=400)

        # Check if the car exist in database
        car = s.query(CarModel).filter_by(name=data["car_name"]).first()
        if not car:
            return ResponseHandler.error(
                message="Car name doesn't exist in database!",
                status=404,
            )

        # Check if the date and description exist in database
        existing_data = (
            s.query(CarMaintenanceModel)
            .filter(
                and_(
                    CarMaintenanceModel.car_id == car.id,  # Check for the same car
                    CarMaintenanceModel.maintenance_date == data["maintenance_date"],
                    CarMaintenanceModel.description == data["description"],
                )
            )
            .first()
        )
        if existing_data:
            return ResponseHandler.error(
                message="Car Maintenance Data already exists in database! Date & Description must unique!",
                status=400,
            )

        new_maintenance = CarMaintenanceModel(
            car_id=car.id,
            maintenance_date=data["maintenance_date"],
            description=data["description"],
            cost=data["cost"],
        )
        s.add(new_maintenance)
        s.commit()

        return ResponseHandler.success(
            message="Car Maintenance added successfully",
            data=new_maintenance.to_dictionaries(),
            status=201,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the car maintenance",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@car_maintenances_blueprint.get("/car-maintenances")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_maintenance():
    try:
        # Get query parameters for pagination
        page = request.args.get("page", default=1, type=int)
        per_page = request.args.get("per_page", default=5, type=int)

        car_maintenances = (
            CarMaintenanceModel.query.join(CarModel, CarModel.id == CarMaintenanceModel.car_id)
            .add_column(CarModel.name)
            .paginate(page=page, per_page=per_page, error_out=False)
        )

        # Create a list of car maintenance dictionaries
        car_maintenances_list = []
        for car_maintenance, car_name in car_maintenances:
            car_maintenance_dict = {
                **{
                    column.name: getattr(car_maintenance, column.name)
                    for column in CarMaintenanceModel.__table__.columns
                },
                "car_name": car_name,
            }
            car_maintenances_list.append(car_maintenance_dict)

        response_data = {
            "car_maintenances": car_maintenances_list,
            "pagination": {
                "total_maintenances": car_maintenances.total,
                "current_page": car_maintenances.page,
                "total_pages": car_maintenances.pages,
                "next_page": page + 1 if page < car_maintenances.pages else None,
                "prev_page": page - 1 if page > 1 else None,
            },
        }
        return ResponseHandler.success(data=response_data, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occured while showing car maintenances",
            data=str(e),
            status=500,
        )


@car_maintenances_blueprint.get("/car-maintenances/<int:maintenance_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_maintenance_by_id(maintenance_id):
    try:
        car_maintenance_result = (
            CarMaintenanceModel.query.join(CarMaintenanceModel, CarModel.id == CarMaintenanceModel.car_id)
            .add_column(CarModel.name)
            .filter(CarMaintenanceModel.id == maintenance_id)
            .first()
        )
        if not car_maintenance_result:
            return ResponseHandler.error(message="Car maintenance not found!", data=None, status=404)

        car_maintenance, car_name = car_maintenance_result
        car_maintenance_dict = {
            **{column.name: getattr(car_maintenance, column.name) for column in CarMaintenanceModel.__table__.columns},
            "car_name": car_name,
        }

        return ResponseHandler.success(
            message="Car maintenance retrieved successfully",
            data=car_maintenance_dict,
            status=200,
        )

    except Exception as e:
        return ResponseHandler.error(
            message="An error occured while showing car maintenances",
            data=str(e),
            status=500,
        )


@car_maintenances_blueprint.put("/car-maintenances/<int:maintenance_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can update new car
def update_maintenance(maintenance_id):
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

        # Check car maintenance's data in database
        car_maintenance = s.query(CarMaintenanceModel).filter_by(id=maintenance_id).first()
        if not car_maintenance:
            return ResponseHandler.error(
                message="Car maintenance data not found!",
                status=404,
            )

        data = request.get_json()
        validator = Validator(update_maintenance_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Invalid data!", data=validator.errors, status=400)

        # Extract fields from the data
        new_car_name = data.get("car_name")
        new_maintenance_date = data.get("maintenance_date")
        new_description = data.get("description")

        # Validate car existence if car_name is provided
        if new_car_name:
            car = s.query(CarModel).filter_by(name=new_car_name).first()
            if not car:
                return ResponseHandler.error(
                    message="Car name doesn't exist in the database!",
                    status=404,
                )
            car_maintenance.car_id = car.id

        # Check for uniqueness of maintenance_date and description
        if new_maintenance_date or new_description:
            existing_maintenance = (
                s.query(CarMaintenanceModel)
                .filter(
                    and_(
                        CarMaintenanceModel.car_id == car.id,  # Check for the same car
                        CarMaintenanceModel.maintenance_date
                        == (new_maintenance_date or car_maintenance.maintenance_date),
                        CarMaintenanceModel.description == (new_description or car_maintenance.description),
                        CarMaintenanceModel.id != maintenance_id,
                    )
                )
                .first()
            )

            if existing_maintenance:
                return ResponseHandler.error(
                    message="A car maintenance record with the same date and description already exists!",
                    status=400,
                )

        # Update fields if they are provided
        if new_maintenance_date:
            car_maintenance.maintenance_date = new_maintenance_date

        if new_description:
            car_maintenance.description = new_description

        if "cost" in data:
            car_maintenance.cost = data["cost"]

        s.commit()

        return ResponseHandler.success(
            message="Car maintenance data updated successfully",
            data=car_maintenance.to_dictionaries(),
            status=200,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the car maintenance",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@car_maintenances_blueprint.delete("/car-maintenances/<int:maintenance_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can delete new car
def delete_maintenance(maintenance_id):
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

        car_maintenance = s.query(CarMaintenanceModel).filter_by(id=maintenance_id).first()
        if not car_maintenance:
            return ResponseHandler.error(
                message="Car maintenance not found!",
                status=404,
            )

        car_maintenance_info = car_maintenance.to_dictionaries()

        s.delete(car_maintenance)
        s.commit()
        return ResponseHandler.success(
            message="Car maintenance deleted successfully", data=car_maintenance_info, status=200
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while deleting the car maintenance",
            data=str(e),
            status=500,
        )

    finally:
        s.close()
