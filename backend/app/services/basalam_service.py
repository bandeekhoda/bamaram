import httpx
from typing import Dict, Any, Optional
import logging
import urllib.parse
import json

# تنظیم لاگر
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# آدرس API باسلام
BASALAM_API_URL = "https://search.basalam.com/ai-engine/api/v2.0/product/search"


async def search_products(
    query: str = "",
    start: int = 0,
    rows: int = 20,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    free_shipping: Optional[int] = None,
    slug: Optional[str] = None,
    vendor_identifier: Optional[str] = None,
    same_city: Optional[int] = None,
    min_rating: Optional[int] = None,
    vendor_score: Optional[int] = None,
) -> Dict[str, Any]:
    """
    جستجوی محصولات در باسلام

    Args:
        query: عبارت جستجو
        start: شروع از چندمین نتیجه
        rows: تعداد نتایج در هر صفحه
        min_price: حداقل قیمت
        max_price: حداکثر قیمت
        free_shipping: ارسال رایگان (0 یا 1)
        slug: دسته‌بندی محصول
        vendor_identifier: شناسه فروشنده
        same_city: فقط در شهر من (0 یا 1)
        min_rating: حداقل امتیاز
        vendor_score: امتیاز فروشنده

    Returns:
        نتایج جستجو
    """
    # ساخت فیلترها
    filters = {}

    if min_price is not None:
        filters["minPrice"] = min_price

    if max_price is not None:
        filters["maxPrice"] = max_price

    if free_shipping is not None:
        filters["freeShipping"] = free_shipping

    if slug is not None:
        filters["slug"] = slug

    if vendor_identifier is not None:
        filters["vendorIdentifier"] = vendor_identifier

    if same_city is not None:
        filters["sameCity"] = same_city

    if min_rating is not None:
        filters["minRating"] = min_rating

    if vendor_score is not None:
        filters["vendorScore"] = vendor_score

    # ساخت پارامترهای درخواست
    payload = {"q": query, "start": start, "rows": rows}

    if filters:
        payload["filters"] = filters

    logger.info(f"درخواست به API باسلام: {payload}")

    try:
        # ارسال درخواست به API باسلام
        async with httpx.AsyncClient() as client:
            response = await client.post(
                BASALAM_API_URL,
                json=payload,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=utf-8",
                    "Accept-Language": "fa-IR,fa;q=0.9",
                    "Accept-Charset": "UTF-8",
                },
                timeout=30.0,  # افزایش زمان تایم‌اوت
            )

            # بررسی وضعیت پاسخ
            response.raise_for_status()

            # دریافت پاسخ
            result = response.json()
            logger.info(f"پاسخ API باسلام: {result.keys()}")

            # اگر جستجو با کوئری فارسی انجام شده و نتیجه‌ای نداشته، از API دیگری استفاده کنیم
            if (
                query
                and not (result.get("result", {}).get("products", []))
                and any("\u0600" <= c <= "\u06FF" for c in query)
            ):
                logger.info("جستجوی فارسی بدون نتیجه، استفاده از API جایگزین")
                # استفاده از API جستجوی عمومی باسلام
                alt_url = "https://api.basalam.com/search"
                alt_params = {"q": query, "from": start, "size": rows}

                alt_response = await client.get(
                    alt_url,
                    params=alt_params,
                    headers={
                        "Accept": "application/json",
                        "Content-Type": "application/json; charset=utf-8",
                        "Accept-Language": "fa-IR,fa;q=0.9",
                    },
                    timeout=30.0,
                )

                alt_response.raise_for_status()
                alt_result = alt_response.json()
                logger.info(
                    f"پاسخ API جایگزین: {alt_result.keys() if isinstance(alt_result, dict) else 'نوع داده غیر دیکشنری'}"
                )

                # استخراج محصولات از API جایگزین
                if (
                    isinstance(alt_result, dict)
                    and "hits" in alt_result
                    and "hits" in alt_result["hits"]
                ):
                    alt_products = alt_result["hits"]["hits"]
                    products = []

                    for item in alt_products:
                        if "_source" in item:
                            product = item["_source"]
                            # استخراج آدرس تصویر
                            image_url = ""
                            if "photo" in product:
                                if isinstance(product["photo"], dict):
                                    if "MEDIUM" in product["photo"]:
                                        image_url = product["photo"]["MEDIUM"]
                                    elif "SMALL" in product["photo"]:
                                        image_url = product["photo"]["SMALL"]
                                elif isinstance(product["photo"], str):
                                    image_url = product["photo"]

                            # استخراج نام محصول
                            name = product.get("name", "") or product.get("title", "")

                            # استخراج قیمت
                            price = product.get("price", 0)

                            # استخراج نام فروشنده
                            vendor_name = product.get("vendorName", "") or product.get(
                                "vendor_name", ""
                            )

                            # استخراج توضیحات
                            description = product.get(
                                "shortDescription", ""
                            ) or product.get("description", "")

                            processed_product = {
                                "id": product.get("id", ""),
                                "name": name,
                                "price": price,
                                "image_url": image_url,
                                "vendor_name": vendor_name,
                                "description": description,
                            }
                            products.append(processed_product)

                    # ساخت ساختار پاسخ مشابه API اصلی
                    result = {"products": products}
                    return result

            # استخراج محصولات از پاسخ API اصلی
            products = []
            if "result" in result and "products" in result["result"]:
                raw_products = result["result"]["products"]

                # تبدیل ساختار داده محصولات به فرمت مورد نیاز
                for product in raw_products:
                    # استخراج آدرس تصویر
                    image_url = ""
                    if "photo" in product and product["photo"]:
                        if "MEDIUM" in product["photo"]:
                            image_url = product["photo"]["MEDIUM"]
                        elif "SMALL" in product["photo"]:
                            image_url = product["photo"]["SMALL"]

                    # استخراج نام محصول
                    name = product.get("name", "") or product.get("title", "")

                    # استخراج قیمت
                    price = product.get("price", 0)

                    # استخراج نام فروشنده
                    vendor_name = product.get("vendorName", "") or product.get(
                        "vendor_name", ""
                    )

                    # استخراج توضیحات
                    description = product.get("shortDescription", "") or product.get(
                        "description", ""
                    )

                    processed_product = {
                        "id": product.get("id", ""),
                        "name": name,
                        "price": price,
                        "image_url": image_url,
                        "vendor_name": vendor_name,
                        "description": description,
                    }
                    products.append(processed_product)

                # اضافه کردن محصولات به نتیجه
                result["products"] = products

            # برگرداندن نتایج
            return result
    except Exception as e:
        logger.error(f"خطا در ارتباط با API باسلام: {str(e)}")
        # در صورت خطا، یک لیست خالی برگردانیم
        return {"products": []}


async def get_product_details(product_id: str) -> Dict[str, Any]:
    """
    دریافت جزئیات یک محصول از باسلام

    Args:
        product_id: شناسه محصول

    Returns:
        جزئیات محصول
    """
    try:
        # آدرس API جزئیات محصول
        product_url = f"https://api.basalam.com/api/v2.0/product/{product_id}"

        async with httpx.AsyncClient() as client:
            response = await client.get(
                product_url,
                headers={
                    "Accept": "application/json",
                    "Content-Type": "application/json; charset=utf-8",
                    "Accept-Language": "fa-IR,fa;q=0.9",
                },
                timeout=30.0,
            )

            response.raise_for_status()
            result = response.json()

            # پردازش اطلاعات محصول
            if "product" in result:
                product = result["product"]

                # استخراج آدرس تصویر
                image_url = ""
                if "photo" in product and product["photo"]:
                    if isinstance(product["photo"], dict):
                        if "MEDIUM" in product["photo"]:
                            image_url = product["photo"]["MEDIUM"]
                        elif "SMALL" in product["photo"]:
                            image_url = product["photo"]["SMALL"]
                    elif isinstance(product["photo"], str):
                        image_url = product["photo"]

                # ساخت پاسخ
                processed_product = {
                    "id": product.get("id", ""),
                    "name": product.get("name", "") or product.get("title", ""),
                    "price": product.get("price", 0),
                    "image_url": image_url,
                    "vendor_name": product.get("vendorName", "")
                    or product.get("vendor_name", ""),
                    "description": product.get("shortDescription", "")
                    or product.get("description", ""),
                    "details": product,  # اطلاعات کامل محصول
                }

                return processed_product

            return {"id": product_id, "message": "اطلاعات محصول یافت نشد"}
    except Exception as e:
        logger.error(f"خطا در دریافت جزئیات محصول: {str(e)}")
        return {"id": product_id, "message": "خطا در دریافت اطلاعات محصول"}
