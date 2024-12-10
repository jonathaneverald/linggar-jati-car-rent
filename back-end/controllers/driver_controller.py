from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.drivers import DriverModel
from models.users import UserModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.driver_schema import add_driver_schema, update_driver_schema
from utils.handle_response import ResponseHandler
from math import ceil

drivers_blueprint = Blueprint("drivers_blueprint", __name__)


@drivers_blueprint.post("/drivers")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can create new driver
def create_driver():
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
        validator = Validator(add_driver_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Invalid data!", data=validator.errors, status=400)

        name = data.get("name")
        gender = data.get("gender")
        dob = data.get("dob")
        address = data.get("address")
        phone_number = data.get("phone_number")
        license_number = data.get("license_number")
        status = data.get("status")

        existing_driver = (
            s.query(DriverModel)
            .filter((DriverModel.phone_number == phone_number) | (DriverModel.license_number == license_number))
            .first()
        )
        if existing_driver:
            return ResponseHandler.error(
                message="Driver already exists! Driver's phone number and license number must unique!",
                status=409,
            )

        new_driver = DriverModel(
            name=name,
            gender=gender,
            dob=dob,
            address=address,
            phone_number=phone_number,
            license_number=license_number,
            status=status,
        )
        s.add(new_driver)
        s.commit()

        return ResponseHandler.success(
            message="Driver added successfully",
            data=new_driver.to_dictionaries(),
            status=201,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the driver",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@drivers_blueprint.get("/drivers")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_all_driver():
    try:
        # Get query parameters for pagination
        page = request.args.get("page", default=1, type=int)
        per_page = request.args.get("per_page", default=5, type=int)

        drivers = DriverModel.query.paginate(page=page, per_page=per_page, error_out=False)
        if not drivers:
            return ResponseHandler.error(message="No drivers found", status=404)

        # # Apply pagination
        # if page and per_page:
        #     pagination = car_query.paginate(page=page, per_page=per_page, error_out=False)
        #     cars = pagination.items
        #     total_cars = car_query.count()
        #     total_pages = ceil(total_cars / per_page)

        # drivers = (DriverModel).query.all()

        # drivers_list = [driver.to_dictionaries() for driver in drivers]
        drivers_list = []
        for driver in drivers:
            driver_dict = {
                **{column.name: getattr(driver, column.name) for column in DriverModel.__table__.columns},
            }
            drivers_list.append(driver_dict)

        response_data = {
            "drivers": drivers_list,
            "pagination": {
                "total_drivers": drivers.total,
                "current_page": drivers.page,
                "total_pages": drivers.pages,
                "next_page": page + 1 if page < drivers.pages else None,
                "prev_page": page - 1 if page > 1 else None,
            },
        }

        return ResponseHandler.success(data=response_data, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occured while showing drivers",
            data=str(e),
            status=500,
        )


@drivers_blueprint.get("/drivers-available")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_all_available_driver():
    try:
        drivers = (DriverModel).query.filter(DriverModel.status.ilike("Available")).all()
        drivers_list = [driver.to_dictionaries() for driver in drivers]
        return ResponseHandler.success(data=drivers_list, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occured while showing drivers",
            data=str(e),
            status=500,
        )


@drivers_blueprint.get("/drivers/<int:driver_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_driver_by_id(driver_id):
    try:
        driver = (DriverModel).query.filter_by(id=driver_id).first()
        if not driver:
            return ResponseHandler.error(message="Driver not found!", data=None, status=404)

        return ResponseHandler.success(
            message="Driver retrieved successfully",
            data=driver.to_dictionaries(),
            status=200,
        )

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing driver",
            data=str(e),
            status=500,
        )


@drivers_blueprint.put("/drivers/<int:driver_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can update the driver
def update_driver(driver_id):
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

        # Check driver's data in database
        driver = s.query(DriverModel).filter_by(id=driver_id).first()
        if not driver:
            return ResponseHandler.error(
                message="Driver not found!",
                status=404,
            )

        data = request.get_json()
        validator = Validator(update_driver_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Invalid data!", data=validator.errors, status=400)

        if "name" in data:
            driver.name = data["name"]

        if "gender" in data:
            driver.gender = data["gender"]

        if "dob" in data:
            driver.dob = data["dob"]

        if "address" in data:
            driver.address = data["address"]

        if "phone_number" in data:
            existing_driver = s.query(DriverModel).filter_by(phone_number=data["phone_number"]).first()
            if existing_driver and existing_driver.id != driver_id:
                return ResponseHandler.error(message="Phone number already in use by another driver!", status=409)
            driver.phone_number = data["phone_number"]

        if "license_number" in data:
            existing_driver = s.query(DriverModel).filter_by(license_number=data["license_number"]).first()
            if existing_driver and existing_driver.id != driver_id:
                return ResponseHandler.error(message="License number already in use by another driver!", status=409)
            driver.license_number = data["license_number"]

        if "status" in data:
            driver.status = data["status"]

        s.commit()

        return ResponseHandler.success(
            message="Driver updated successfully",
            data=driver.to_dictionaries(),
            status=200,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the driver",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@drivers_blueprint.delete("/drivers/<int:driver_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can delete the driver
def delete_driver(driver_id):
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

        # Check driver's data in database
        driver = s.query(DriverModel).filter_by(id=driver_id).first()
        if not driver:
            return ResponseHandler.error(
                message="Driver not found!",
                status=404,
            )

        driver_info = driver.to_dictionaries()

        s.delete(driver)
        s.commit()

        return ResponseHandler.success(message="Driver deleted successfully", data=driver_info, status=200)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while deleting the driver",
            data=str(e),
            status=500,
        )

    finally:
        s.close()
