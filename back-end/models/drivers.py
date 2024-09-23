from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, Numeric
from datetime import datetime, timedelta


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class DriverModel(db.Model):
    __tablename__ = "drivers"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(255), nullable=False)
    gender = mapped_column(String(255), nullable=False)
    dob = mapped_column(Date, nullable=False)
    address = mapped_column(String(255), nullable=False)
    phone_number = mapped_column(String(255), nullable=False)
    license_number = mapped_column(String(255), nullable=False)
    status = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, default=gmt_plus_7_now, nullable=False)
    updated_at = mapped_column(DateTime, default=gmt_plus_7_now, onupdate=gmt_plus_7_now, nullable=False)

    transactions = relationship("TransactionModel", backref="drivers", lazy=True)

    def __repr__(self):
        return f"<Driver {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "name": self.name,
            "gender": self.gender,
            "dob": self.dob,
            "address": self.address,
            "phone_number": self.phone_number,
            "license_number": self.license_number,
            "status": self.status,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
