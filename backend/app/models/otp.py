from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
import datetime

from database.database import Base


class OTP(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, index=True)
    phone_number = Column(String, index=True)
    code = Column(String)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))

    def is_expired(self):
        # اطمینان از اینکه هر دو تاریخ timezone-aware هستند
        now = datetime.datetime.now(datetime.timezone.utc)

        # اگر expires_at بدون timezone است، آن را به UTC تبدیل می‌کنیم
        expires_at = self.expires_at
        if expires_at.tzinfo is None:
            # تبدیل تاریخ بدون timezone به timezone-aware با UTC
            expires_at = expires_at.replace(tzinfo=datetime.timezone.utc)

        return now > expires_at
