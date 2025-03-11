from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from enum import Enum

class RelationEnum(str, Enum):
    PARENT_FATHER = "PARENT_FATHER"
    PARENT_MOTHER = "PARENT_MOTHER"
    CHILD = "CHILD"
    SPOUSE = "SPOUSE"
    FRIEND = "FRIEND"
    RELATIVE = "RELATIVE"

class OccasionType(str, Enum):
    BIRTHDAY = "BIRTHDAY"
    MOTHERS_DAY = "MOTHERS_DAY"
    FATHERS_DAY = "FATHERS_DAY"
    DAUGHTERS_DAY = "DAUGHTERS_DAY"
    SONS_DAY = "SONS_DAY"
    WEDDING_ANNIVERSARY = "WEDDING_ANNIVERSARY"
    ENGAGEMENT_ANNIVERSARY = "ENGAGEMENT_ANNIVERSARY"

class OccasionDate(BaseModel):
    occasion: OccasionType
    date: date

class FriendBase(BaseModel):
    name: str
    birthdate: date
    relation: RelationEnum

class FriendCreate(FriendBase):
    occasionDates: Optional[List[OccasionDate]] = []

class FriendUpdate(BaseModel):
    name: Optional[str] = None
    birthdate: Optional[date] = None
    relation: Optional[RelationEnum] = None
    occasionDates: Optional[List[OccasionDate]] = None

class Friend(FriendBase):
    id: int
    user_id: int
    
    class Config:
        from_attributes = True

class FriendWithBirthdayStatus(Friend):
    days_until_birthday: int
    is_birthday_soon: bool
    occasionDates: List[OccasionDate] = []

    class Config:
        from_attributes = True 