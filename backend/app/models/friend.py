from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from datetime import date

from database.database import Base
from schemas.friend import RelationEnum


class Friend(Base):
    __tablename__ = "friends"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    birthdate = Column(Date, nullable=False)
    relation = Column(SQLAlchemyEnum(RelationEnum), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # رابطه با کاربر
    user = relationship("User", back_populates="friends")
    
    # رابطه با مناسبت‌ها
    occasions = relationship("Occasion", back_populates="friend", cascade="all, delete-orphan")
    
    @property
    def age(self):
        """محاسبه سن بر اساس تاریخ تولد"""
        if not self.birthdate:
            return None
        today = date.today()
        age = today.year - self.birthdate.year
        # اگر تاریخ تولد امسال هنوز نرسیده، یک سال کم می‌کنیم
        if today.month < self.birthdate.month or (today.month == self.birthdate.month and today.day < self.birthdate.day):
            age -= 1
        return age
