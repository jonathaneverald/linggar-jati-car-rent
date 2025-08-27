from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime, ForeignKey
from datetime import datetime, timedelta


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class CarImageModel(db.Model):
    __tablename__ = "car_images"

    id = mapped_column(Integer, primary_key=True)
    car_id = mapped_column(Integer, ForeignKey("cars.id"), nullable=False)
    url = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, default=gmt_plus_7_now, nullable=False)
    updated_at = mapped_column(DateTime, default=gmt_plus_7_now, onupdate=gmt_plus_7_now, nullable=False)

    def __repr__(self):
        return f"<CarImage {self.id} for Car {self.car_id}>"

    def to_dictionaries(self):
        return {"id": self.id, "url": self.url}
