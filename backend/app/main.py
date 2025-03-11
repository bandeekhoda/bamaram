from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import users, auth, friend, gift, basalam
from database.database import engine
from models import user, otp, friend as friend_model, gift as gift_model

# ایجاد جداول در دیتابیس
user.Base.metadata.create_all(bind=engine)
otp.Base.metadata.create_all(bind=engine)
friend_model.Base.metadata.create_all(bind=engine)
gift_model.Base.metadata.create_all(bind=engine)

app = FastAPI(title="بامرام API")

# تنظیمات CORS برای ارتباط با فرانت‌اند - اجازه به دامنه‌های مشخص
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # پورت پیش‌فرض React
        "http://localhost:3001",  # پورت دیگر برای تست
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# اضافه کردن روترها
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(friend.router)
app.include_router(gift.router)
app.include_router(basalam.router)


@app.get("/")
async def root():
    return {"message": "به API بامرام خوش آمدید!"}


@app.get("/api/health")
async def health_check():
    return {"status": "سرویس فعال است"}


# در اینجا می‌توانید روت‌های بیشتری اضافه کنید
