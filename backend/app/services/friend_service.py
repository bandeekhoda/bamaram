from sqlalchemy.orm import Session
from datetime import date, datetime
import jdatetime
from typing import List, Optional

from models.friend import Friend, Gender
from schemas.friend import FriendCreate, FriendUpdate, FriendWithBirthdayStatus

def get_friends(db: Session, user_id: int) -> List[Friend]:
    """دریافت لیست تمام دوستان یک کاربر"""
    return db.query(Friend).filter(Friend.user_id == user_id).all()

def get_friend(db: Session, friend_id: int, user_id: int) -> Optional[Friend]:
    """دریافت اطلاعات یک دوست با شناسه مشخص"""
    return db.query(Friend).filter(Friend.id == friend_id, Friend.user_id == user_id).first()

def create_friend(db: Session, friend: FriendCreate, user_id: int) -> Friend:
    """ایجاد یک دوست جدید"""
    db_friend = Friend(
        name=friend.name,
        birthdate=friend.birthdate,
        gender=Gender[friend.gender.upper()],
        user_id=user_id
    )
    db.add(db_friend)
    db.commit()
    db.refresh(db_friend)
    return db_friend

def update_friend(db: Session, friend_id: int, friend_update: FriendUpdate, user_id: int) -> Optional[Friend]:
    """به‌روزرسانی اطلاعات یک دوست"""
    db_friend = get_friend(db, friend_id, user_id)
    if not db_friend:
        return None
    
    update_data = friend_update.dict(exclude_unset=True)
    if 'gender' in update_data and update_data['gender']:
        update_data['gender'] = Gender[update_data['gender'].upper()]
    
    for key, value in update_data.items():
        setattr(db_friend, key, value)
    
    db.commit()
    db.refresh(db_friend)
    return db_friend

def delete_friend(db: Session, friend_id: int, user_id: int) -> bool:
    """حذف یک دوست"""
    db_friend = get_friend(db, friend_id, user_id)
    if not db_friend:
        return False
    
    db.delete(db_friend)
    db.commit()
    return True

def calculate_days_until_birthday(birthdate: date) -> int:
    """محاسبه تعداد روزهای باقی‌مانده تا تولد"""
    today = date.today()
    
    # تبدیل تاریخ میلادی به شمسی
    j_birthdate = jdatetime.date.fromgregorian(date=birthdate)
    j_today = jdatetime.date.today()
    
    # ساخت تاریخ تولد برای سال جاری
    j_birthday_this_year = jdatetime.date(j_today.year, j_birthdate.month, j_birthdate.day)
    
    # اگر تولد امسال گذشته است، تولد سال بعد را محاسبه می‌کنیم
    if j_birthday_this_year < j_today:
        j_birthday_this_year = jdatetime.date(j_today.year + 1, j_birthdate.month, j_birthdate.day)
    
    # تبدیل به تاریخ میلادی برای محاسبه تفاوت
    g_birthday_this_year = j_birthday_this_year.togregorian()
    
    # محاسبه تعداد روزهای باقی‌مانده
    delta = g_birthday_this_year - today
    return delta.days

def get_friends_with_birthday_status(db: Session, user_id: int) -> List[FriendWithBirthdayStatus]:
    """دریافت لیست دوستان به همراه وضعیت تولد آن‌ها"""
    friends = get_friends(db, user_id)
    result = []
    
    for friend in friends:
        days_until_birthday = calculate_days_until_birthday(friend.birthdate)
        is_birthday_soon = days_until_birthday <= 7
        
        friend_with_status = FriendWithBirthdayStatus(
            id=friend.id,
            name=friend.name,
            birthdate=friend.birthdate,
            gender=Gender(friend.gender).name.lower(),
            user_id=friend.user_id,
            days_until_birthday=days_until_birthday,
            is_birthday_soon=is_birthday_soon
        )
        result.append(friend_with_status)
    
    return result 