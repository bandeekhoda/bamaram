# بک‌اند پروژه بامارام

این پوشه شامل کدهای بک‌اند پروژه بامارام است که با استفاده از FastAPI پیاده‌سازی شده است.

## نحوه راه‌اندازی

برای راه‌اندازی سرور بک‌اند، می‌توانید از یکی از روش‌های زیر استفاده کنید:

### در لینوکس و مک

1. استفاده از اسکریپت run.sh:

```bash
./run.sh
```

2. استفاده از اسکریپت پایتون:

```bash
python3 run.py
```

### در ویندوز

1. استفاده از فایل run.bat (دابل کلیک روی فایل):

```
run.bat
```

2. استفاده از اسکریپت پایتون:

```bash
python run.py
```

## نحوه راه‌اندازی دستی

اگر می‌خواهید سرور را به صورت دستی راه‌اندازی کنید، می‌توانید از دستورات زیر استفاده کنید:

### در لینوکس و مک

```bash
# فعال‌سازی محیط مجازی
source venv/bin/activate

# رفتن به پوشه app
cd app

# راه‌اندازی سرور
python -m uvicorn main:app --host 0.0.0.0
```

### در ویندوز

```bash
# فعال‌سازی محیط مجازی
venv\Scripts\activate

# رفتن به پوشه app
cd app

# راه‌اندازی سرور
python -m uvicorn main:app --host 0.0.0.0
```

## API‌های موجود

- `GET /`: صفحه اصلی API
- `GET /api/health`: بررسی وضعیت سلامت سرور
- `GET /api/users/`: دریافت لیست کاربران
- `GET /api/users/{user_id}`: دریافت اطلاعات یک کاربر
- `POST /api/users/`: ایجاد کاربر جدید
- `PUT /api/users/{user_id}`: به‌روزرسانی اطلاعات کاربر
- `DELETE /api/users/{user_id}`: حذف کاربر
- `POST /api/auth/request-otp`: درخواست کد OTP
- `POST /api/auth/verify-otp`: تأیید کد OTP و ورود به سیستم
- `GET /api/friends/`: دریافت لیست دوستان
- `GET /api/friends/{friend_id}`: دریافت اطلاعات یک دوست
- `POST /api/friends/`: افزودن دوست جدید
- `PUT /api/friends/{friend_id}`: به‌روزرسانی اطلاعات دوست
- `DELETE /api/friends/{friend_id}`: حذف دوست
