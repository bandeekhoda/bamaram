from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db
from schemas.gift import (
    Gift,
    GiftCreate,
    GiftUpdate,
    SentGift,
    SentGiftCreate,
    SentGiftWithDetails,
)
from services import gift_service
from services.auth import get_current_user
from schemas.user import User

router = APIRouter(prefix="/api/gifts", tags=["gifts"])


# روت‌های مربوط به هدایا (فقط برای ادمین)
@router.get(
    "/admin", response_model=List[Gift], dependencies=[Depends(get_current_user)]
)
def get_gifts(db: Session = Depends(get_db)):
    """دریافت لیست تمام هدایا (فقط برای ادمین)"""
    return gift_service.get_gifts(db)


@router.post(
    "/admin",
    response_model=Gift,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)],
)
def create_gift(gift: GiftCreate, db: Session = Depends(get_db)):
    """ایجاد یک هدیه جدید (فقط برای ادمین)"""
    return gift_service.create_gift(db, gift)


@router.put(
    "/admin/{gift_id}", response_model=Gift, dependencies=[Depends(get_current_user)]
)
def update_gift(gift_id: int, gift_update: GiftUpdate, db: Session = Depends(get_db)):
    """به‌روزرسانی اطلاعات یک هدیه (فقط برای ادمین)"""
    updated_gift = gift_service.update_gift(db, gift_id, gift_update)
    if not updated_gift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="هدیه مورد نظر یافت نشد"
        )
    return updated_gift


@router.delete(
    "/admin/{gift_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_user)],
)
def delete_gift(gift_id: int, db: Session = Depends(get_db)):
    """حذف یک هدیه (فقط برای ادمین)"""
    success = gift_service.delete_gift(db, gift_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="هدیه مورد نظر یافت نشد"
        )
    return None


# روت‌های مربوط به هدایا (برای همه کاربران)
@router.get("/", response_model=List[Gift])
def get_available_gifts(db: Session = Depends(get_db)):
    """دریافت لیست هدایای موجود"""
    return gift_service.get_gifts(db)


@router.get("/{gift_id}", response_model=Gift)
def get_gift(gift_id: int, db: Session = Depends(get_db)):
    """دریافت اطلاعات یک هدیه با شناسه مشخص"""
    gift = gift_service.get_gift(db, gift_id)
    if not gift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="هدیه مورد نظر یافت نشد"
        )
    return gift


# روت‌های مربوط به ارسال هدیه
@router.post("/send", response_model=SentGift, status_code=status.HTTP_201_CREATED)
def send_gift(
    sent_gift: SentGiftCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """ارسال یک هدیه به یک دوست"""
    # بررسی اینکه آیا دوست متعلق به کاربر فعلی است
    from services import friend_service

    friend = friend_service.get_friend(db, sent_gift.friend_id, current_user.id)
    if not friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="دوست مورد نظر یافت نشد"
        )

    # بررسی اینکه آیا هدیه وجود دارد
    gift = gift_service.get_gift(db, sent_gift.gift_id)
    if not gift:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="هدیه مورد نظر یافت نشد"
        )

    # تنظیم کاربر فعلی به عنوان فرستنده
    sent_gift_data = SentGiftCreate(
        user_id=current_user.id,
        friend_id=sent_gift.friend_id,
        gift_id=sent_gift.gift_id,
    )

    return gift_service.send_gift(db, sent_gift_data)


@router.get("/sent", response_model=List[dict])
def get_sent_gifts(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """دریافت لیست هدایای ارسال شده توسط کاربر فعلی"""
    return gift_service.get_sent_gifts_with_details(db, current_user.id)
