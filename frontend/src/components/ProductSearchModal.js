import React, { useState, useEffect, useRef, useCallback } from 'react';
import { basalamService } from '../services/api';
import './ProductSearchModal.css';

const ProductSearchModal = ({ isOpen, onClose, onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const observer = useRef();
  const ROWS_PER_PAGE = 20;
  
  // بارگذاری محصولات اولیه یا جستجو
  const loadProducts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentPage = reset ? 0 : page;
      let response;
      
      if (searchQuery.trim()) {
        // جستجوی محصولات
        response = await basalamService.searchProducts({
          query: searchQuery,
          start: currentPage * ROWS_PER_PAGE,
          rows: ROWS_PER_PAGE
        });
      } else {
        // دریافت محصولات پیش‌فرض
        response = await basalamService.getDefaultProducts(
          currentPage * ROWS_PER_PAGE,
          ROWS_PER_PAGE
        );
      }
      
      console.log('پاسخ API باسلام:', response);
      
      // استخراج محصولات از پاسخ API
      const newProducts = response.products || [];
      console.log('محصولات استخراج شده:', newProducts);
      
      if (reset) {
        setProducts(newProducts);
        setPage(1);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
      }
      
      // بررسی اینکه آیا محصولات بیشتری وجود دارد
      setHasMore(newProducts.length === ROWS_PER_PAGE);
      setLoading(false);
    } catch (err) {
      setError('خطا در دریافت محصولات. لطفاً دوباره تلاش کنید.');
      setLoading(false);
      console.error(err);
    }
  }, [searchQuery, page]);
  
  // بارگذاری محصولات اولیه
  useEffect(() => {
    if (isOpen) {
      loadProducts(true);
    }
  }, [isOpen, loadProducts]);
  
  // تنظیم observer برای infinite scroll
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadProducts();
      }
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, loadProducts]);
  
  // جستجوی محصولات
  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(true);
  };
  
  // انتخاب محصول
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };
  
  // تأیید انتخاب محصول
  const handleConfirmSelection = () => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct);
      onClose();
    }
  };
  
  // تابع کمکی برای نمایش قیمت
  const formatPrice = (price) => {
    if (!price) return '0 تومان';
    return price.toLocaleString() + ' تومان';
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="product-search-modal-overlay">
      <div className="product-search-modal">
        <div className="product-search-modal-header">
          <h2>جستجو و انتخاب محصول</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="product-search-form">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="نام محصول را جستجو کنید..."
              className="search-input"
            />
            <button type="submit" className="search-button">جستجو</button>
          </form>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="products-container">
          {products.length === 0 && !loading ? (
            <div className="no-products">محصولی یافت نشد</div>
          ) : (
            <div className="products-grid">
              {products.map((product, index) => {
                const isLastElement = index === products.length - 1;
                return (
                  <div
                    key={product.id}
                    ref={isLastElement ? lastProductElementRef : null}
                    className={`product-card ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="product-image">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/default-product.png';
                          }}
                        />
                      ) : (
                        <img src="/default-product.png" alt="تصویر پیش‌فرض" />
                      )}
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-price">{formatPrice(product.price)}</p>
                      {product.vendor_name && (
                        <p className="product-vendor">فروشنده: {product.vendor_name}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {loading && <div className="loading-more">در حال بارگذاری...</div>}
        </div>
        
        <div className="product-search-modal-footer">
          <button
            className="cancel-button"
            onClick={onClose}
          >
            انصراف
          </button>
          <button
            className="select-button"
            onClick={handleConfirmSelection}
            disabled={!selectedProduct}
          >
            انتخاب محصول
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchModal; 