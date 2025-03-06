from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import user as user_model
from schemas import user as user_schema

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db: Session, user_id: int):
    return db.query(user_model.User).filter(user_model.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(user_model.User).filter(user_model.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(user_model.User).filter(user_model.User.username == username).first()

def get_user_by_phone(db: Session, phone_number: str):
    return db.query(user_model.User).filter(user_model.User.phone_number == phone_number).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(user_model.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: user_schema.UserCreate):
    hashed_password = get_password_hash(user.password) if user.password else None
    
    db_user = user_model.User(
        email=user.email,
        username=user.username,
        phone_number=user.phone_number,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_with_phone(db: Session, phone_number: str):
    # ایجاد کاربر با شماره موبایل بدون رمز عبور
    # رمز عبور بعداً می‌تواند تنظیم شود
    db_user = user_model.User(
        phone_number=phone_number,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: user_schema.UserUpdate):
    db_user = get_user(db, user_id)
    update_data = user.dict(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    for key, value in update_data.items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    db.delete(db_user)
    db.commit()
    return db_user 