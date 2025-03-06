from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any


class GiftBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    product_id: Optional[str] = None
    product_data: Optional[Dict[str, Any]] = None


class GiftCreate(GiftBase):
    pass


class GiftUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    product_id: Optional[str] = None
    product_data: Optional[Dict[str, Any]] = None


class Gift(GiftBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class SentGiftBase(BaseModel):
    user_id: int
    friend_id: int
    gift_id: int


class SentGiftCreate(SentGiftBase):
    pass


class SentGift(SentGiftBase):
    id: int
    sent_at: datetime

    class Config:
        orm_mode = True


class SentGiftWithDetails(BaseModel):
    id: int
    sent_at: datetime
    gift: Gift
    friend_name: str

    class Config:
        orm_mode = True
