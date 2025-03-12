from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional, List


class BidBase(BaseModel):
    amount: float

    @validator('amount')
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('مبلغ پیشنهادی باید بیشتر از صفر باشد')
        return v


class BidCreate(BidBase):
    pass


class Bid(BidBase):
    id: int
    created_at: datetime
    auction_id: int
    user_id: int
    user_name: Optional[str] = None  # برای نمایش نام کاربر در لیست پیشنهادها

    class Config:
        orm_mode = True


class AuctionBase(BaseModel):
    title: str
    description: Optional[str] = None
    base_price: float
    start_time: datetime
    end_time: datetime

    @validator('base_price')
    def base_price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('قیمت پایه باید بیشتر از صفر باشد')
        return v

    @validator('end_time')
    def end_time_must_be_after_start_time(cls, v, values):
        if 'start_time' in values and v <= values['start_time']:
            raise ValueError('زمان پایان باید بعد از زمان شروع باشد')
        return v


class AuctionCreate(AuctionBase):
    pass


class AuctionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    is_active: Optional[bool] = None


class Auction(AuctionBase):
    id: int
    current_price: float
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    creator_id: int
    bids: List[Bid] = []

    class Config:
        orm_mode = True 