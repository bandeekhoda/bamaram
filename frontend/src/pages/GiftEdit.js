import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { giftService } from '../services/api';
import ProductSearchModal from '../components/ProductSearchModal';
import './GiftEdit.css';

function GiftEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewGift = id === 'new';
  
  const [gift, setGift] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    product_id: null,
    product_data: null
  });
  
  const [loading, setLoading] = useState(!isNewGift);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchGift = async () => {
      if (isNewGift) return;
      
      try {
        const giftData = await giftService.getGift(id);
        setGift({
          name: giftData.name || '',
          description: giftData.description || '',
          price: giftData.price || '',
          image_url: giftData.image_url || '',
          product_id: giftData.product_id || null,
          product_data: giftData.product_data || null
        });
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت اطلاعات هدیه');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchGift();
  }, [id, isNewGift]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGift(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // اعتبارسنجی فرم
    if (!gift.name.trim()) {
      setMessage('لطفاً نام هدیه را وارد کنید');
      return;
    }
    
    try {
      if (isNewGift) {
        await giftService.createGift(gift);
        setMessage('هدیه با موفقیت ایجاد شد!');
      } else {
        await giftService.updateGift(id, gift);
        setMessage('هدیه با موفقیت به‌روزرسانی شد!');
      }
      
      setTimeout(() => {
        navigate('/gifts');
      }, 2000);
    } catch (err) {
      setMessage('خطا در ذخیره اطلاعات هدیه');
      console.error(err);
    }
  };
  
  const openProductSearchModal = () => {
    setIsModalOpen(true);
  };
  
  const closeProductSearchModal = () => {
    setIsModalOpen(false);
  };
  
  const handleSelectProduct = (product) => {
    setGift(prev => ({
      ...prev,
      name: product.name || prev.name,
      description: product.description || prev.description,
      price: product.price || prev.price,
      image_url: product.image_url || prev.image_url,
      product_id: product.id,
      product_data: product
    }));
  };
  
  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="gift-edit-container">
      <h1>{isNewGift ? 'ایجاد هدیه جدید' : 'ویرایش هدیه'}</h1>
      <Link to="/gifts" className="back-button">بازگشت به لیست هدایا</Link>
      
      {message && <div className="message">{message}</div>}
      
      <form onSubmit={handleSubmit} className="gift-form">
        <div className="form-group">
          <label htmlFor="name">نام هدیه</label>
          <input
            type="text"
            id="name"
            name="name"
            value={gift.name}
            onChange={handleChange}
            placeholder="نام هدیه را وارد کنید"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">توضیحات</label>
          <textarea
            id="description"
            name="description"
            value={gift.description}
            onChange={handleChange}
            placeholder="توضیحات هدیه را وارد کنید"
            rows="4"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">قیمت (تومان)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={gift.price}
            onChange={handleChange}
            placeholder="قیمت هدیه را وارد کنید"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image_url">آدرس تصویر</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={gift.image_url}
            onChange={handleChange}
            placeholder="آدرس تصویر هدیه را وارد کنید"
          />
        </div>
        
        <div className="form-group product-search-section">
          <button 
            type="button" 
            className="search-product-button"
            onClick={openProductSearchModal}
          >
            جستجو و انتخاب محصول از بسلام
          </button>
          
          {gift.product_data && (
            <div className="selected-product">
              <h3>محصول انتخاب شده:</h3>
              <div className="product-preview">
                {gift.image_url && (
                  <div className="product-image">
                    <img src={gift.image_url} alt={gift.name} />
                  </div>
                )}
                <div className="product-details">
                  <p className="product-name">{gift.name}</p>
                  <p className="product-price">{gift.price} تومان</p>
                  {gift.product_data.vendor_name && (
                    <p className="product-vendor">فروشنده: {gift.product_data.vendor_name}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="save-button">
            {isNewGift ? 'ایجاد هدیه' : 'به‌روزرسانی هدیه'}
          </button>
          <Link to="/gifts" className="cancel-button">انصراف</Link>
        </div>
      </form>
      
      <ProductSearchModal
        isOpen={isModalOpen}
        onClose={closeProductSearchModal}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}

export default GiftEdit; 