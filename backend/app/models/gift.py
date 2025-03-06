from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database.database import Base


class Gift(Base):
    __tablename__ = "gifts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    product_id = Column(String, nullable=True)  # شناسه محصول در باسلام
    product_data = Column(JSON, nullable=True)  # اطلاعات محصول از باسلام
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # رابطه با هدایای ارسال شده
    sent_gifts = relationship("SentGift", back_populates="gift")


class SentGift(Base):
    __tablename__ = "sent_gifts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    friend_id = Column(Integer, ForeignKey("friends.id"), nullable=False)
    gift_id = Column(Integer, ForeignKey("gifts.id"), nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())

    # رابطه‌ها
    user = relationship("User", backref="sent_gifts")
    friend = relationship("Friend", backref="received_gifts")
    gift = relationship("Gift", back_populates="sent_gifts")
