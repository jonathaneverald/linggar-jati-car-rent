from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, DECIMAL
from datetime import datetime, timedelta


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class CarMaintenanceModel(db.Model):
    __tablename__ = "car_maintenances"

    id = mapped_column(Integer, primary_key=True)
    car_id = mapped_column(Integer, ForeignKey("cars.id"), unique=True, nullable=False)
    maintenance_date = mapped_column(Date, nullable=False)
    description = mapped_column(String(255), nullable=False)
    cost = mapped_column(DECIMAL(10, 2), nullable=False)
    created_at = mapped_column(DateTime, default=gmt_plus_7_now, nullable=False)
    updated_at = mapped_column(DateTime, default=gmt_plus_7_now, onupdate=gmt_plus_7_now, nullable=False)

    def __repr__(self):
        return f"<Car Maintenance {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "car_id": self.car_id,
            "maintenance_data": self.maintenance_date,
            "description": self.description,
            "cost": self.cost,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
