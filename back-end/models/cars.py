from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, ForeignKey, DECIMAL
from datetime import datetime, timedelta
from slugify import slugify
import random


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class CarModel(db.Model):
    __tablename__ = "cars"

    id = mapped_column(Integer, primary_key=True)
    category_id = mapped_column(Integer, ForeignKey("car_categories.id"), unique=True, nullable=False)
    slug = mapped_column(String(255), unique=True, nullable=False)
    name = mapped_column(String(255), nullable=False)
    transmission = mapped_column(String(255), nullable=False)
    fuel = mapped_column(String(255), nullable=False)
    color = mapped_column(String(255), nullable=False)
    plate_number = mapped_column(String(255), unique=True, nullable=False)
    capacity = mapped_column(Integer, nullable=False)
    registration_number = mapped_column(Integer, nullable=False)
    price = mapped_column(DECIMAL(10, 2), nullable=False)
    image = mapped_column(String(255), nullable=False)
    status = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, default=gmt_plus_7_now, nullable=False)
    updated_at = mapped_column(DateTime, default=gmt_plus_7_now, onupdate=gmt_plus_7_now, nullable=False)

    car_maintenances = relationship("CarMaintenanceModel", backref="cars", lazy=True)
    transactions = relationship("TransactionModel", backref="cars", lazy=True)

    def __repr__(self):
        return f"<Car {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "category_id": self.category_id,
            "slug": self.slug,
            "name": self.name,
            "transmission": self.transmission,
            "fuel": self.fuel,
            "color": self.color,
            "plate_number": self.plate_number,
            "capacity": self.capacity,
            "registration_number": self.registration_number,
            "price": self.price,
            "image": self.image,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    @staticmethod
    def generate_slug(name):
        slug_base = slugify(name)
        unique_number = random.randint(100, 999)
        return f"{slug_base}-{unique_number}"
