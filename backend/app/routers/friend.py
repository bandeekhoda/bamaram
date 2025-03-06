from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db
from schemas.friend import Friend, FriendCreate, FriendUpdate, FriendWithBirthdayStatus
from services import friend_service
from services.auth import get_current_user
from schemas.user import User

router = APIRouter(
    prefix="/api/friends", tags=["friends"], dependencies=[Depends(get_current_user)]
)


@router.get("/", response_model=List[FriendWithBirthdayStatus])
def get_friends(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """دریافت لیست تمام دوستان کاربر فعلی"""
    return friend_service.get_friends_with_birthday_status(db, current_user.id)


@router.get("/{friend_id}", response_model=Friend)
def get_friend(
    friend_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """دریافت اطلاعات یک دوست با شناسه مشخص"""
    friend = friend_service.get_friend(db, friend_id, current_user.id)
    if not friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="دوست مورد نظر یافت نشد"
        )
    return friend


@router.post("/", response_model=Friend, status_code=status.HTTP_201_CREATED)
def create_friend(
    friend: FriendCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """ایجاد یک دوست جدید"""
    return friend_service.create_friend(db, friend, current_user.id)


@router.put("/{friend_id}", response_model=Friend)
def update_friend(
    friend_id: int,
    friend_update: FriendUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """به‌روزرسانی اطلاعات یک دوست"""
    updated_friend = friend_service.update_friend(
        db, friend_id, friend_update, current_user.id
    )
    if not updated_friend:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="دوست مورد نظر یافت نشد"
        )
    return updated_friend


@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_friend(
    friend_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """حذف یک دوست"""
    success = friend_service.delete_friend(db, friend_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="دوست مورد نظر یافت نشد"
        )
    return None
