from flask import Blueprint, request
from flask_cors import cross_origin
from connector.mysql_connector import connection
from models.cars import CarModel
from models.car_categories import CarCategoryModel
from models.users import UserModel
from sqlalchemy.orm import sessionmaker
from flask_jwt_extended import jwt_required, get_jwt_identity
from cerberus import Validator
from schemas.cars_schema import add_car_schema, update_car_schema
from utils.handle_response import ResponseHandler
import os
import cloudinary
import cloudinary.uploader
from slugify import slugify

cars_blueprint = Blueprint("cars_blueprint", __name__)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


@cars_blueprint.post("/cars")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can create new car
def create_car():
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

        # Use request.form to get the non-file data
        data = request.form.to_dict()

        # Manually cast certain fields to the expected types
        try:
            data["capacity"] = int(data["capacity"])  # Convert capacity to integer
            data["registration_number"] = int(data["registration_number"])  # Convert registration number to integer
            data["price"] = float(data["price"])  # Convert price to float
        except (ValueError, KeyError) as e:
            return ResponseHandler.error(message=f"Invalid data type: {str(e)}", status=400)

        validator = Validator(add_car_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Invalid data!", data=validator.errors, status=400)

        # Check if the car brand and type exist in database
        car_category = s.query(CarCategoryModel).filter_by(car_brand=data["car_brand"], type=data["type"]).first()
        if not car_category:
            return ResponseHandler.error(message="Car brand or type doesn't exist in database", status=404)

        # Check if the car already in database using plate_number & registration_number
        existing_car = (
            s.query(CarModel)
            .filter(
                (CarModel.plate_number == data["plate_number"])
                | (CarModel.registration_number == data["registration_number"])
            )
            .first()
        )
        if existing_car:
            return ResponseHandler.error(
                message="Car already exists! Car's plate number and registration number must unique!",
                status=409,
            )

        category_id = car_category.id
        slug = CarModel.generate_slug(data["name"])
        # Get the uploaded files from the request
        files = request.files.getlist("image")
        if not files:
            return ResponseHandler.error(message="Image is required", status=400)

        image_urls = []

        for file in files:
            upload_result = cloudinary.uploader.upload(file)
            image_url = upload_result["secure_url"]
            image_urls.append(image_url)

        new_car = CarModel(
            category_id=category_id,
            slug=slug,
            name=data["name"],
            transmission=data["transmission"],
            fuel=data["fuel"],
            color=data["color"],
            plate_number=data["plate_number"],
            capacity=data["capacity"],
            registration_number=data["registration_number"],
            price=data["price"],
            image=image_urls[0] if image_urls else None,  # Save the first image
            status=data["status"],
        )
        s.add(new_car)

        # # Add all images to the CarModel (if needed)
        # for image_url in image_urls:
        #     car_image = CarModel(image=image_url)
        #     s.add(car_image)

        s.commit()

        return ResponseHandler.success(
            message="Car added successfully",
            data=new_car.to_dictionaries(),
            status=201,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while adding the car",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@cars_blueprint.get("/cars")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_all_car():
    try:
        cars = (CarModel).query.all()
        cars_list = [car.to_dictionaries() for car in cars]
        return ResponseHandler.success(data=cars_list, status=200)

    except Exception as e:
        return ResponseHandler.error(
            message="An error occured while showing cars",
            data=str(e),
            status=500,
        )


@cars_blueprint.get("/cars/<int:car_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
def show_car_by_id(car_id):
    try:
        car = (CarModel).query.filter_by(id=car_id).first()
        if not car:
            return ResponseHandler.error(message="Car not found!", data=None, status=404)

        return ResponseHandler.success(
            message="Car retrieved successfully",
            data=car.to_dictionaries(),
            status=200,
        )

    except Exception as e:
        return ResponseHandler.error(
            message="An error occurred while showing car",
            data=str(e),
            status=500,
        )


@cars_blueprint.put("/cars/<int:car_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can update the car
def update_car(car_id):
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

        # Check car's data in database
        car = s.query(CarModel).filter_by(id=car_id).first()
        if not car:
            return ResponseHandler.error(
                message="Car not found!",
                status=404,
            )

        # Use request.form to get the non-file data
        data = request.form.to_dict()

        if "registration_number" in data:
            try:
                data["registration_number"] = int(data["registration_number"])
            except ValueError:
                return ResponseHandler.error(message="Registration number must be a valid integer!", status=400)

        if "capacity" in data:
            try:
                data["capacity"] = int(data["capacity"])
            except ValueError:
                return ResponseHandler.error(message="Capacity must be a valid integer!", status=400)

        if "price" in data:
            try:
                data["price"] = float(data["price"])
            except ValueError:
                return ResponseHandler.error(message="Price must be a valid float!", status=400)

        validator = Validator(update_car_schema)
        if not validator.validate(data):
            return ResponseHandler.error(message="Invalid data!", data=validator.errors, status=400)

        if "car_brand" in data or "type" in data:
            car_category = s.query(CarCategoryModel).filter_by(car_brand=data["car_brand"], type=data["type"]).first()
            if not car_category:
                return ResponseHandler.error(message="Car brand or type doesn't exist in database", status=404)
            car.category_id = car_category.id

        if "name" in data:
            name = data["name"]
            slug_base = slugify(name)

            # Preserve the numeric part of the slug
            numeric_part = car.slug.split("-")[-1]
            new_slug = f"{slug_base}-{numeric_part}"

            car.name = name
            car.slug = new_slug

        if "transmission" in data:
            car.transmission = data["transmission"]

        if "fuel" in data:
            car.fuel = data["fuel"]

        if "color" in data:
            car.color = data["color"]

        if "plate_number" in data:
            existing_plate_number = s.query(CarModel).filter((CarModel.plate_number == data["plate_number"])).first()
            if existing_plate_number:
                return ResponseHandler.error(
                    message="Car already exists! Car's plate number must unique!",
                    status=409,
                )
            car.plate_number = data["plate_number"]

        if "capacity" in data:
            car.capacity = data["capacity"]

        if "registration_number" in data:
            existing_registration_number = (
                s.query(CarModel).filter((CarModel.registration_number == data["registration_number"])).first()
            )
            if existing_registration_number:
                return ResponseHandler.error(
                    message="Car already exists! Car's registration number must unique!",
                    status=409,
                )
            car.registration_number = data["registration_number"]

        if "price" in data:
            car.price = data["price"]

        if "status" in data:
            car.status = data["status"]

        # Handle image update if new image is provided
        files = request.files.getlist("image")
        if files:
            # Delete the previous image from Cloudinary
            public_id = os.path.splitext(os.path.basename(car.image))[0]
            cloudinary.uploader.destroy(public_id)

            image_urls = []
            for file in files:
                upload_result = cloudinary.uploader.upload(file)
                image_url = upload_result["secure_url"]
                image_urls.append(image_url)

            car.image = image_urls[0] if image_urls else car.image

        s.commit()

        return ResponseHandler.success(
            message="Car updated successfully",
            data=car.to_dictionaries(),
            status=200,
        )

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while updating the car",
            data=str(e),
            status=500,
        )

    finally:
        s.close()


@cars_blueprint.delete("/cars/<int:car_id>")
@cross_origin(origin="localhost", headers=["Content-Type", "Authorization"])
@jwt_required()
# Only admin can update the car
def delete_car(car_id):
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

        # Check car's data in database
        car = s.query(CarModel).filter_by(id=car_id).first()
        if not car:
            return ResponseHandler.error(
                message="Car not found!",
                status=404,
            )

        # Delete the image from Cloudinary
        public_id = os.path.splitext(os.path.basename(car.image))[0]
        cloudinary.uploader.destroy(public_id)

        car_info = car.to_dictionaries()

        s.delete(car)
        s.commit()

        return ResponseHandler.success(message="Car deleted successfully", data=car_info, status=200)

    except Exception as e:
        s.rollback()
        return ResponseHandler.error(
            message="An error occurred while deleting the car",
            data=str(e),
            status=500,
        )

    finally:
        s.close()
