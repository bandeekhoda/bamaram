import os
from app.database.database import Base, engine

# حذف فایل دیتابیس اگر وجود دارد
if os.path.exists("bamaram.db"):
    os.remove("bamaram.db")

# ایجاد مجدد جداول
Base.metadata.create_all(bind=engine)

print("Database updated successfully!") 