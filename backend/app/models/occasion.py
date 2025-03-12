from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database.database import Base
from enum import Enum as PyEnum

class OccasionType(PyEnum):
    BIRTHDAY = "BIRTHDAY"
    MOTHERS_DAY = "MOTHERS_DAY"
    FATHERS_DAY = "FATHERS_DAY"
    DAUGHTERS_DAY = "DAUGHTERS_DAY"
    SONS_DAY = "SONS_DAY"
    WEDDING_ANNIVERSARY = "WEDDING_ANNIVERSARY"
    ENGAGEMENT_ANNIVERSARY = "ENGAGEMENT_ANNIVERSARY"
    STUDENTS_DAY = "STUDENTS_DAY"

class Occasion(Base):
    __tablename__ = "occasions"

    id = Column(Integer, primary_key=True, index=True)
    friend_id = Column(Integer, ForeignKey("friends.id"), nullable=False)
    occasion_type = Column(Enum(OccasionType), nullable=False)
    date = Column(Date, nullable=False)

    # رابطه با دوست
    friend = relationship("Friend", back_populates="occasions") 