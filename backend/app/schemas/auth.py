from pydantic import BaseModel
from typing import Optional

class PhoneNumber(BaseModel):
    phone_number: str

class OTPVerify(BaseModel):
    phone_number: str
    code: str

class OTPResponse(BaseModel):
    message: str
    success: bool

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: Optional[str] = None 