from db import db
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy import String, Integer, DateTime
from datetime import datetime, timedelta


def gmt_plus_7_now():
    return datetime.utcnow() + timedelta(hours=7)


class RoleModel(db.Model):
    __tablename__ = "roles"

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String(255), nullable=False)
    created_at = mapped_column(DateTime, default=gmt_plus_7_now, nullable=False)
    updated_at = mapped_column(DateTime, default=gmt_plus_7_now, onupdate=gmt_plus_7_now, nullable=False)

    users = relationship("UserModel", backref="roles", lazy=True)

    def __repr__(self):
        return f"<Role {self.id}>"

    def to_dictionaries(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
