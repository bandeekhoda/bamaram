#!/usr/bin/env python
"""
اسکریپت راه‌اندازی سرور بامارام
این اسکریپت محیط مجازی را فعال می‌کند و سرور را راه‌اندازی می‌کند
قابل اجرا در هر دو سیستم عامل لینوکس و ویندوز
"""

import os
import sys
import subprocess
import platform

# تشخیص مسیر فعلی
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.join(CURRENT_DIR, "app")


def is_venv_activated():
    """بررسی می‌کند که آیا محیط مجازی فعال است یا خیر"""
    return hasattr(sys, "real_prefix") or (
        hasattr(sys, "base_prefix") and sys.base_prefix != sys.prefix
    )


def activate_venv():
    """محیط مجازی را فعال می‌کند"""
    # تشخیص سیستم عامل
    is_windows = platform.system() == "Windows"

    # مسیر محیط مجازی
    venv_dir = os.path.join(CURRENT_DIR, "venv")

    if is_windows:
        # مسیر فایل فعال‌سازی در ویندوز
        activate_script = os.path.join(venv_dir, "Scripts", "activate")
        # دستور فعال‌سازی در ویندوز
        activate_cmd = f"{activate_script}"
        shell_cmd = "cmd.exe"
    else:
        # مسیر فایل فعال‌سازی در لینوکس/مک
        activate_script = os.path.join(venv_dir, "bin", "activate")
        # دستور فعال‌سازی در لینوکس/مک
        activate_cmd = f"source {activate_script}"
        shell_cmd = "bash"

    print(f"فعال‌سازی محیط مجازی در {venv_dir}...")

    # اجرای دستور فعال‌سازی و سپس اجرای سرور
    if is_windows:
        cmd = f'{shell_cmd} /c "{activate_cmd} && cd {APP_DIR} && python -m uvicorn main:app --host 0.0.0.0"'
    else:
        cmd = f'{shell_cmd} -c "{activate_cmd} && cd {APP_DIR} && python -m uvicorn main:app --host 0.0.0.0"'

    return subprocess.call(cmd, shell=True)


def main():
    """تابع اصلی برنامه"""
    # اگر محیط مجازی فعال نیست، آن را فعال می‌کنیم
    if not is_venv_activated():
        return activate_venv()
    else:
        # اگر محیط مجازی از قبل فعال است، مستقیماً سرور را اجرا می‌کنیم
        os.chdir(APP_DIR)
        return subprocess.call(
            [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0"]
        )


if __name__ == "__main__":
    sys.exit(main())
