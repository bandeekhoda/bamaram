import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { friendService, giftService, basalamService } from '../services/api';
import ProductSearchModal from '../components/ProductSearchModal';
import './GiftSelect.css';

function GiftSelect() {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        setLoading(true);
        // دریافت اطلاعات دوست
        const friendData = await friendService.getFriend(friendId);
        setFriend(friendData);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت اطلاعات دوست');
        setLoading(false);
        console.error(err);
      }
    };

    fetchFriend();
  }, [friendId]);

  const openProductSearchModal = () => {
    setIsModalOpen(true);
  };

  const closeProductSearchModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      setMessage('لطفاً یک محصول انتخاب کنید');
      return;
    }

    try {
      // ایجاد هدیه جدید با اطلاعات محصول انتخاب شده
      const giftData = {
        name: selectedProduct.name,
        description: selectedProduct.description || selectedProduct.title || '',
        price: selectedProduct.price || 0,
        image_url: selectedProduct.image_url || selectedProduct.imageUrl || '',
        product_id: selectedProduct.id || selectedProduct.productId,
        product_data: selectedProduct
      };

      // ایجاد هدیه جدید
      const newGift = await giftService.createGift(giftData);
      
      // ارسال هدیه به دوست
      await giftService.sendGift(friendId, newGift.id);
      
      setMessage('هدیه با موفقیت ارسال شد!');
      setTimeout(() => {
        navigate('/friends');
      }, 2000);
    } catch (err) {
      setMessage('خطا در ارسال هدیه');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="gift-select-container">
      <h1>انتخاب هدیه برای {friend?.name}</h1>
      <Link to="/friends" className="back-button">بازگشت به لیست دوستان</Link>
      
      {message && <div className="message">{message}</div>}
      
      <div className="birthday-info">
        {friend?.days_until_birthday === 0 
          ? 'امروز تولدشه!' 
          : `${friend?.days_until_birthday} روز تا تولد ${friend?.name} مانده است`}
      </div>
      
      <div className="product-selection">
        <button 
          className="search-product-button" 
          onClick={openProductSearchModal}
        >
          جستجو و انتخاب محصول
        </button>
        
        {selectedProduct && (
          <div className="selected-product">
            <h3>محصول انتخاب شده:</h3>
            <div className="product-preview">
              <div className="product-image">
                <img 
                  src={selectedProduct.image_url || selectedProduct.imageUrl || '/default-product.png'} 
                  alt={selectedProduct.name || selectedProduct.title} 
                />
              </div>
              <div className="product-details">
                <h4 className="product-name">{selectedProduct.name || selectedProduct.title}</h4>
                <p className="product-price">
                  {(selectedProduct.price || 0).toLocaleString()} تومان
                </p>
                {selectedProduct.vendor_name && (
                  <p className="product-vendor">فروشنده: {selectedProduct.vendor_name}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="gift-form">
          <button 
            type="submit" 
            className="send-gift-button"
            disabled={!selectedProduct}
          >
            ارسال هدیه
          </button>
        </form>
      </div>
      
      <ProductSearchModal 
        isOpen={isModalOpen} 
        onClose={closeProductSearchModal} 
        onSelectProduct={handleSelectProduct} 
      />
    </div>
  );
}

export default GiftSelect; 