from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from pydantic import BaseModel
from services import basalam_service
from services.auth import get_current_user
from schemas.user import User

router = APIRouter(
    prefix="/api/basalam", tags=["basalam"], dependencies=[Depends(get_current_user)]
)


class ProductSearchRequest(BaseModel):
    query: Optional[str] = ""
    start: Optional[int] = 0
    rows: Optional[int] = 20
    min_price: Optional[int] = None
    max_price: Optional[int] = None
    free_shipping: Optional[int] = None
    slug: Optional[str] = None
    vendor_identifier: Optional[str] = None
    same_city: Optional[int] = None
    min_rating: Optional[int] = None
    vendor_score: Optional[int] = None


@router.post("/products/search")
async def search_products(
    search_request: ProductSearchRequest, current_user: User = Depends(get_current_user)
):
    """جستجوی محصولات در باسلام"""
    try:
        results = await basalam_service.search_products(
            query=search_request.query,
            start=search_request.start,
            rows=search_request.rows,
            min_price=search_request.min_price,
            max_price=search_request.max_price,
            free_shipping=search_request.free_shipping,
            slug=search_request.slug,
            vendor_identifier=search_request.vendor_identifier,
            same_city=search_request.same_city,
            min_rating=search_request.min_rating,
            vendor_score=search_request.vendor_score,
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"خطا در ارتباط با باسلام: {str(e)}"
        )


@router.get("/products/search")
async def search_products_get(
    query: Optional[str] = "",
    start: Optional[int] = 0,
    rows: Optional[int] = 20,
    current_user: User = Depends(get_current_user),
):
    """جستجوی محصولات در باسلام با متد GET"""
    try:
        results = await basalam_service.search_products(
            query=query, start=start, rows=rows
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"خطا در ارتباط با باسلام: {str(e)}"
        )


@router.get("/products/{product_id}")
async def get_product_details(
    product_id: str, current_user: User = Depends(get_current_user)
):
    """دریافت جزئیات یک محصول از باسلام"""
    try:
        product = await basalam_service.get_product_details(product_id)
        return product
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"خطا در ارتباط با باسلام: {str(e)}"
        )
