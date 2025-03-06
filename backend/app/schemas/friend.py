from pydantic import BaseModel
from datetime import date
from typing import Optional
from enum import Enum

class GenderEnum(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class FriendBase(BaseModel):
    name: str
    birthdate: date
    gender: GenderEnum

class FriendCreate(FriendBase):
    pass

class FriendUpdate(BaseModel):
    name: Optional[str] = None
    birthdate: Optional[date] = None
    gender: Optional[GenderEnum] = None

class Friend(FriendBase):
    id: int
    user_id: int
    
    class Config:
        orm_mode = True

class FriendWithBirthdayStatus(Friend):
    days_until_birthday: int
    is_birthday_soon: bool 