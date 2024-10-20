from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.users import UserModel
from models.cars import CarModel
from models.drivers import DriverModel
from models.transactions import TransactionModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.transactions_schema import add_transaction_schema, update_transaction_schema
from utils.handle_response import ResponseHandler
import os
import cloudinary
import cloudinary.uploader
from sqlalchemy import or_, and_
from datetime import datetime

transactions_blueprint = Blueprint("transactions_blueprint", __name__)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


@transactions_blueprint.post("/transactions")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def create_transaction():
    Session = sessionmaker(bind=connection)
    s = Session()
    s.begin()

    try:
        user_id = get_jwt_identity()
        current_user = s.query(UserModel).filter_by(id=user_id).first()
        if not current_user:
            return ResponseHandler.error(message="User not found", status=404)

        data = request.get_json()
        validator = Validator(add_transaction_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Data Invalid!", data=validator.errors, status=400)

        car_name = data.get("car_name")
        driver_name = data.get("driver_name", None)  # Use None if driver is not selected
        start_date_string = data.get("start_date")
        end_date_string = data.get("end_date")

        # Convert the strings to datetime objects
        start_date = datetime.strptime(start_date_string, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_string, "%Y-%m-%d")

        if end_date <= start_date:
            return ResponseHandler.error(message="End date must be greater than start date", status=400)

        # Calculate rent duration
        date_difference = end_date - start_date
        rent_duration = date_difference.days
        driver_cost = 0

        existing_car = s.query(CarModel).filter(CarModel.name == car_name).first()
        if not existing_car:
            return ResponseHandler.error(message="Car not found!", status=404)
        if existing_car.status != "Available":
            return ResponseHandler.error(message="Car is not available!", status=404)

        # Check if the user want to use driver or not
        existing_driver = None
        if "driver_name" in data:
            existing_driver = s.query(DriverModel).filter(DriverModel.name == driver_name).first()
            if not existing_driver:
                return ResponseHandler.error(message="Driver not found!", status=404)
            if existing_driver.status != "Available":
                return ResponseHandler.error(message="Driver is not available!", status=404)

            # Calculate driver cost
            driver_cost = 100000 * rent_duration

        # Calculate total cost for transaction
        total_cost = (existing_car.price * rent_duration) + driver_cost

        # Create the transaction
        new_transaction = TransactionModel(
            user_id=user_id,
            car_id=existing_car.id,
            driver_id=existing_driver.id if existing_driver else None,
            start_date=start_date,
            end_date=end_date,
            return_date=None,
            rental_status="Pending",
            payment_status="Pending",
            payment_proof=None,
            late_fee=None,
            total_cost=total_cost,
        )
        new_transaction.generate_invoice()

        # Update car status to booked & Driver status if using driver
        existing_car.status = "Booked"
        if existing_driver:
            existing_driver.status = "Booked"

        s.add(new_transaction)
        s.commit()

        return ResponseHandler.success(
            message="Transaction added successfully",
            data=new_transaction.to_dictionaries(),
            status=201,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding new transaction",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@transactions_blueprint.get("/transactions")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_all_transaction():
    pass


@transactions_blueprint.get("/transactions/<int:transaction_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_transaction_by_id(transaction_id):
    pass


@transactions_blueprint.put("/transactions/<int:transaction_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def update_transaction(transaction_id):
    pass
