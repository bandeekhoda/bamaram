# استفاده از تصویر رسمی پایتون
FROM python:3.11-slim

# تنظیم متغیرهای محیطی
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های مورد نیاز
COPY requirements.txt .
COPY app/ ./app/

# نصب پکیج‌های مورد نیاز
RUN pip install --no-cache-dir -r requirements.txt

# اکسپوز کردن پورت
EXPOSE 8000

# دستور اجرای برنامه
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 