from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from models.gift import Gift, SentGift
from models.friend import Friend
from schemas.gift import GiftCreate, GiftUpdate, SentGiftCreate


def get_gifts(db: Session) -> List[Gift]:
    """دریافت لیست تمام هدایا"""
    return db.query(Gift).all()


def get_gift(db: Session, gift_id: int) -> Optional[Gift]:
    """دریافت اطلاعات یک هدیه با شناسه مشخص"""
    return db.query(Gift).filter(Gift.id == gift_id).first()


def create_gift(db: Session, gift: GiftCreate) -> Gift:
    """ایجاد یک هدیه جدید"""
    db_gift = Gift(
        name=gift.name,
        description=gift.description,
        price=gift.price,
        image_url=gift.image_url,
        product_id=gift.product_id,
        product_data=gift.product_data,
    )
    db.add(db_gift)
    db.commit()
    db.refresh(db_gift)
    return db_gift


def update_gift(db: Session, gift_id: int, gift_update: GiftUpdate) -> Optional[Gift]:
    """به‌روزرسانی اطلاعات یک هدیه"""
    db_gift = get_gift(db, gift_id)
    if not db_gift:
        return None

    update_data = gift_update.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_gift, key, value)

    db.commit()
    db.refresh(db_gift)
    return db_gift


def delete_gift(db: Session, gift_id: int) -> bool:
    """حذف یک هدیه"""
    db_gift = get_gift(db, gift_id)
    if not db_gift:
        return False

    db.delete(db_gift)
    db.commit()
    return True


def send_gift(db: Session, sent_gift: SentGiftCreate) -> SentGift:
    """ارسال یک هدیه به یک دوست"""
    db_sent_gift = SentGift(
        user_id=sent_gift.user_id,
        friend_id=sent_gift.friend_id,
        gift_id=sent_gift.gift_id,
    )
    db.add(db_sent_gift)
    db.commit()
    db.refresh(db_sent_gift)
    return db_sent_gift


def get_sent_gifts_by_user(db: Session, user_id: int) -> List[SentGift]:
    """دریافت لیست هدایای ارسال شده توسط یک کاربر"""
    return db.query(SentGift).filter(SentGift.user_id == user_id).all()


def get_sent_gifts_by_friend(db: Session, friend_id: int) -> List[SentGift]:
    """دریافت لیست هدایای ارسال شده به یک دوست"""
    return db.query(SentGift).filter(SentGift.friend_id == friend_id).all()


def get_sent_gifts_with_details(db: Session, user_id: int) -> List[dict]:
    """دریافت لیست هدایای ارسال شده با جزئیات"""
    sent_gifts = db.query(SentGift).filter(SentGift.user_id == user_id).all()
    result = []

    for sent_gift in sent_gifts:
        gift = db.query(Gift).filter(Gift.id == sent_gift.gift_id).first()
        friend = db.query(Friend).filter(Friend.id == sent_gift.friend_id).first()

        if gift and friend:
            result.append(
                {
                    "id": sent_gift.id,
                    "sent_at": sent_gift.sent_at,
                    "gift": gift,
                    "friend_name": friend.name,
                }
            )

    return result
