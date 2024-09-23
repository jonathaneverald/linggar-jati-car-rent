from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime
from datetime import datetime, timedelta


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class CarCategoryModel(db.Model):
    __tablename__ = "car_categories"

    id = mapped_column(Integer, primary_key=True)
    car_brand = mapped_column(String(255), nullable=False)
    type = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, default=gmt_plus_7_now, nullable=False)
    updated_at = mapped_column(DateTime, default=gmt_plus_7_now, onupdate=gmt_plus_7_now, nullable=False)

    cars = relationship("CarModel", backref="car_categories", lazy=True)

    def __repr__(self):
        return f"<Car Category {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "car_brand": self.car_brand,
            "type": self.type,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
