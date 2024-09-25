from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, Date, DateTime, ForeignKey, DECIMAL
from datetime import datetime, timedelta
import random


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class TransactionModel(db.Model):
    __tablename__ = "transactions"

    id = mapped_column(Integer, primary_key=True)
    user_id = mapped_column(Integer, ForeignKey("users.id"), unique=False, nullable=False)
    car_id = mapped_column(Integer, ForeignKey("cars.id"), unique=False, nullable=False)
    driver_id = mapped_column(Integer, ForeignKey("drivers.id"), unique=False, nullable=True)
    invoice = mapped_column(String(255), unique=True, nullable=False)
    start_date = mapped_column(Date, nullable=False)
    end_date = mapped_column(Date, nullable=False)
    return_date = mapped_column(Date, nullable=True)
    rental_status = mapped_column(String(255), nullable=False)
    payment_status = mapped_column(String(255), nullable=False)
    payment_proof = mapped_column(String(255), nullable=False)
    late_fee = mapped_column(DECIMAL(10, 2), nullable=True)
    total_cost = mapped_column(DECIMAL(10, 2), nullable=False)
    created_at = mapped_column(DateTime, default=gmt_plus_7_now, nullable=False)
    updated_at = mapped_column(DateTime, default=gmt_plus_7_now, onupdate=gmt_plus_7_now, nullable=False)

    def __repr__(self):
        return f"<Transaction {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "car_id": self.car_id,
            "driver_id": self.driver_id,
            "invoice": self.invoice,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "return_date": self.return_date,
            "rental_status": self.rental_status,
            "payment_status": self.payment_status,
            "payment_proof": self.payment_proof,
            "late_fee": self.late_fee,
            "total_cost": self.total_cost,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

    def generate_invoice(self):
        # Set the format for invoice
        date_created = datetime.now().strftime("%Y%m%d")
        random_number = random.randint(10000, 99999)

        # Combine the parts to form the invoice number
        self.invoice = f"INV/{date_created}/{random_number}"

        return self.invoice
