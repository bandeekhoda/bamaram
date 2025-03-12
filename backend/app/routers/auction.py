from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from dependencies import get_db, get_current_user
from schemas.auction import Auction, AuctionCreate, AuctionUpdate, Bid, BidCreate
from services import auction_service
from models.user import User

router = APIRouter(
    prefix="/auctions",
    tags=["auctions"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[Auction])
def get_auctions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """دریافت لیست همه حراج‌ها"""
    return auction_service.get_auctions(db, skip=skip, limit=limit)


@router.get("/active", response_model=List[Auction])
def get_active_auctions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """دریافت لیست حراج‌های فعال"""
    return auction_service.get_active_auctions(db, skip=skip, limit=limit)


@router.get("/{auction_id}", response_model=Auction)
def get_auction(
    auction_id: int,
    db: Session = Depends(get_db)
):
    """دریافت اطلاعات یک حراج"""
    db_auction = auction_service.get_auction(db, auction_id=auction_id)
    if db_auction is None:
        raise HTTPException(status_code=404, detail="حراج مورد نظر یافت نشد")
    return db_auction


@router.post("/", response_model=Auction)
def create_auction(
    auction: AuctionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ایجاد حراج جدید"""
    return auction_service.create_auction(db=db, auction=auction, user_id=current_user.id)


@router.put("/{auction_id}", response_model=Auction)
def update_auction(
    auction_id: int,
    auction: AuctionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """به‌روزرسانی اطلاعات حراج"""
    db_auction = auction_service.update_auction(
        db=db,
        auction_id=auction_id,
        auction_update=auction,
        user_id=current_user.id
    )
    if db_auction is None:
        raise HTTPException(status_code=404, detail="حراج مورد نظر یافت نشد")
    return db_auction


@router.delete("/{auction_id}")
def delete_auction(
    auction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """حذف یک حراج"""
    success = auction_service.delete_auction(
        db=db,
        auction_id=auction_id,
        user_id=current_user.id
    )
    if not success:
        raise HTTPException(status_code=404, detail="حراج مورد نظر یافت نشد")
    return {"message": "حراج با موفقیت حذف شد"}


@router.post("/{auction_id}/bids", response_model=Bid)
def create_bid(
    auction_id: int,
    bid: BidCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """ثبت پیشنهاد قیمت جدید"""
    return auction_service.create_bid(
        db=db,
        auction_id=auction_id,
        bid=bid,
        user_id=current_user.id
    )


@router.get("/{auction_id}/bids", response_model=List[Bid])
def get_auction_bids(
    auction_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """دریافت لیست پیشنهادهای یک حراج"""
    return auction_service.get_auction_bids(db, auction_id=auction_id, skip=skip, limit=limit) 