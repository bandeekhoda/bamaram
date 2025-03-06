#!/usr/bin/env python
import uvicorn
import os
import sys
from dotenv import load_dotenv

# بارگذاری متغیرهای محیطی
load_dotenv()

# تنظیمات سرور
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))
RELOAD = os.getenv("RELOAD", "True").lower() == "true"

if __name__ == "__main__":
    # راه‌اندازی سرور با استفاده از uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=RELOAD)
    print(f"سرور در آدرس http://{HOST}:{PORT} در حال اجراست")
