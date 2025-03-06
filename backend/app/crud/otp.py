from sqlalchemy.orm import Session
import datetime
import random
from models.otp import OTP

def generate_otp_code():
    # در اینجا کد OTP فیک 1234 را برمی‌گردانیم
    return "1234"

def create_otp(db: Session, phone_number: str):
    # حذف OTP‌های قبلی برای این شماره موبایل
    db.query(OTP).filter(OTP.phone_number == phone_number).delete()
    db.commit()
    
    # ایجاد OTP جدید
    otp_code = generate_otp_code()
    expires_at = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=5)
    
    db_otp = OTP(
        phone_number=phone_number,
        code=otp_code,
        expires_at=expires_at
    )
    
    db.add(db_otp)
    db.commit()
    db.refresh(db_otp)
    
    return db_otp

def verify_otp(db: Session, phone_number: str, code: str):
    db_otp = db.query(OTP).filter(
        OTP.phone_number == phone_number,
        OTP.code == code,
        OTP.is_verified == False
    ).first()
    
    if not db_otp:
        return False
    
    if db_otp.is_expired():
        return False
    
    # OTP را تأیید شده علامت‌گذاری می‌کنیم
    db_otp.is_verified = True
    db.commit()
    
    return True 