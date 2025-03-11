from sqlalchemy.orm import Session
from datetime import date, datetime
import jdatetime
from typing import List, Optional
from fastapi import HTTPException

from models.friend import Friend
from schemas.friend import FriendCreate, FriendUpdate, FriendWithBirthdayStatus, OccasionType
from models.occasion import Occasion

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
        relation=friend.relation,
        user_id=user_id
    )
    
    # اضافه کردن مناسبت تولد به صورت خودکار
    birthday_occasion = Occasion(
        friend=db_friend,
        occasion_type=OccasionType.BIRTHDAY,
        date=friend.birthdate
    )
    db.add(birthday_occasion)
    
    # اضافه کردن سایر مناسبت‌ها
    if friend.occasionDates:
        for occasion_date in friend.occasionDates:
            # اگر مناسبت تولد نیست، آن را اضافه کن
            if occasion_date.occasion != OccasionType.BIRTHDAY:
                occasion = Occasion(
                    friend=db_friend,
                    occasion_type=occasion_date.occasion,
                    date=occasion_date.date
                )
                db.add(occasion)
    
    db.add(db_friend)
    db.commit()
    db.refresh(db_friend)
    return db_friend

def update_friend(db: Session, friend_id: int, friend_update: FriendUpdate, user_id: int) -> Friend:
    """به‌روزرسانی اطلاعات دوست"""
    db_friend = get_friend(db, friend_id, user_id)
    if not db_friend:
        raise HTTPException(status_code=404, detail="دوست مورد نظر یافت نشد")
    
    # به‌روزرسانی اطلاعات اصلی
    update_data = friend_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        if key != 'occasionDates':  # مناسبت‌ها را جداگانه به‌روز می‌کنیم
            setattr(db_friend, key, value)
    
    # به‌روزرسانی مناسبت‌ها
    if friend_update.occasionDates is not None:
        # حذف مناسبت‌های قبلی
        db.query(Occasion).filter(Occasion.friend_id == friend_id).delete()
        
        # اضافه کردن مناسبت‌های جدید
        for occasion_date in friend_update.occasionDates:
            occasion = Occasion(
                friend=db_friend,
                occasion_type=occasion_date.occasion,
                date=occasion_date.date
            )
            db.add(occasion)
    
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
        
        # تبدیل مناسبت‌ها به فرمت مورد نیاز
        occasion_dates = [
            {
                "occasion": occasion.occasion_type.value,
                "date": occasion.date.isoformat()
            }
            for occasion in friend.occasions
        ]
        
        friend_with_status = FriendWithBirthdayStatus(
            id=friend.id,
            name=friend.name,
            birthdate=friend.birthdate,
            relation=friend.relation,
            user_id=friend.user_id,
            days_until_birthday=days_until_birthday,
            is_birthday_soon=is_birthday_soon,
            occasionDates=occasion_dates
        )
        result.append(friend_with_status)
    
    return result 