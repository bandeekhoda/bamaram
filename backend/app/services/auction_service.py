from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from fastapi import HTTPException
from typing import List, Optional

from models.auction import Auction, Bid
from schemas.auction import AuctionCreate, AuctionUpdate, BidCreate


def get_auctions(db: Session, skip: int = 0, limit: int = 100) -> List[Auction]:
    """دریافت لیست حراج‌ها"""
    return db.query(Auction).order_by(desc(Auction.created_at)).offset(skip).limit(limit).all()


def get_active_auctions(db: Session, skip: int = 0, limit: int = 100) -> List[Auction]:
    """دریافت لیست حراج‌های فعال"""
    now = datetime.now()
    return db.query(Auction)\
        .filter(Auction.is_active == True)\
        .filter(Auction.start_time <= now)\
        .filter(Auction.end_time >= now)\
        .order_by(desc(Auction.created_at))\
        .offset(skip)\
        .limit(limit)\
        .all()


def get_auction(db: Session, auction_id: int) -> Optional[Auction]:
    """دریافت اطلاعات یک حراج"""
    return db.query(Auction).filter(Auction.id == auction_id).first()


def create_auction(db: Session, auction: AuctionCreate, user_id: int) -> Auction:
    """ایجاد حراج جدید"""
    db_auction = Auction(
        title=auction.title,
        description=auction.description,
        base_price=auction.base_price,
        current_price=auction.base_price,  # قیمت فعلی در ابتدا برابر با قیمت پایه است
        start_time=auction.start_time,
        end_time=auction.end_time,
        creator_id=user_id
    )
    db.add(db_auction)
    db.commit()
    db.refresh(db_auction)
    return db_auction


def update_auction(db: Session, auction_id: int, auction_update: AuctionUpdate, user_id: int) -> Optional[Auction]:
    """به‌روزرسانی اطلاعات حراج"""
    db_auction = get_auction(db, auction_id)
    if not db_auction:
        return None
    
    if db_auction.creator_id != user_id:
        raise HTTPException(status_code=403, detail="شما اجازه ویرایش این حراج را ندارید")

    update_data = auction_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_auction, key, value)

    db.commit()
    db.refresh(db_auction)
    return db_auction


def delete_auction(db: Session, auction_id: int, user_id: int) -> bool:
    """حذف یک حراج"""
    db_auction = get_auction(db, auction_id)
    if not db_auction:
        return False
    
    if db_auction.creator_id != user_id:
        raise HTTPException(status_code=403, detail="شما اجازه حذف این حراج را ندارید")

    db.delete(db_auction)
    db.commit()
    return True


def create_bid(db: Session, auction_id: int, bid: BidCreate, user_id: int) -> Bid:
    """ثبت پیشنهاد قیمت جدید"""
    db_auction = get_auction(db, auction_id)
    if not db_auction:
        raise HTTPException(status_code=404, detail="حراج مورد نظر یافت نشد")

    # بررسی فعال بودن حراج
    now = datetime.now()
    if not db_auction.is_active or now < db_auction.start_time or now > db_auction.end_time:
        raise HTTPException(status_code=400, detail="این حراج در حال حاضر فعال نیست")

    # بررسی مبلغ پیشنهادی
    if bid.amount <= db_auction.current_price:
        raise HTTPException(
            status_code=400, 
            detail=f"مبلغ پیشنهادی باید بیشتر از قیمت فعلی ({db_auction.current_price}) باشد"
        )

    # ایجاد پیشنهاد جدید
    db_bid = Bid(
        amount=bid.amount,
        auction_id=auction_id,
        user_id=user_id
    )
    db.add(db_bid)

    # به‌روزرسانی قیمت فعلی حراج
    db_auction.current_price = bid.amount

    db.commit()
    db.refresh(db_bid)
    return db_bid


def get_auction_bids(db: Session, auction_id: int, skip: int = 0, limit: int = 100) -> List[Bid]:
    """دریافت لیست پیشنهادهای یک حراج"""
    return db.query(Bid)\
        .filter(Bid.auction_id == auction_id)\
        .order_by(desc(Bid.amount))\
        .offset(skip)\
        .limit(limit)\
        .all() 