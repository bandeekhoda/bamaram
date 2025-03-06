from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from database.database import Base


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class Friend(Base):
    __tablename__ = "friends"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    birthdate = Column(Date, nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # رابطه با کاربر
    user = relationship("User", back_populates="friends")
