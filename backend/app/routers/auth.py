from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from database.database import get_db
from schemas.auth import PhoneNumber, OTPVerify, OTPResponse, LoginResponse
from crud import user as user_crud
from crud import otp as otp_crud
from services.auth import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(
    prefix="/api/auth",
    tags=["authentication"],
    responses={401: {"description": "احراز هویت ناموفق"}},
)

@router.post("/request-otp", response_model=OTPResponse)
def request_otp(phone_data: PhoneNumber, db: Session = Depends(get_db)):
    """
    درخواست کد OTP برای شماره موبایل
    """
    phone_number = phone_data.phone_number
    
    # ایجاد کد OTP
    otp_crud.create_otp(db, phone_number)
    
    # در اینجا می‌توانید کد ارسال پیامک را اضافه کنید
    # اما طبق درخواست، نیازی به ارسال واقعی پیامک نیست
    
    return {
        "message": f"کد تأیید برای شماره {phone_number} ارسال شد. (کد فیک: 1234)",
        "success": True
    }

@router.post("/verify-otp", response_model=LoginResponse)
def verify_otp(otp_data: OTPVerify, db: Session = Depends(get_db)):
    """
    تأیید کد OTP و ورود به سیستم
    """
    phone_number = otp_data.phone_number
    code = otp_data.code
    
    # بررسی کد OTP
    is_valid = otp_crud.verify_otp(db, phone_number, code)
    
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="کد تأیید نامعتبر یا منقضی شده است"
        )
    
    # بررسی وجود کاربر با این شماره موبایل
    user = user_crud.get_user_by_phone(db, phone_number)
    
    # اگر کاربر وجود نداشت، یک کاربر جدید ایجاد می‌کنیم
    if not user:
        user = user_crud.create_user_with_phone(db, phone_number)
    
    # ایجاد توکن دسترسی
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "phone_number": phone_number},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    } 