import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { giftService } from '../services/api';
import './GiftList.css';

function GiftList() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        const giftsData = await giftService.getGifts();
        setGifts(giftsData);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت لیست هدایا');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchGifts();
  }, []);
  
  const handleDeleteGift = async (id) => {
    if (window.confirm('آیا از حذف این هدیه اطمینان دارید؟')) {
      try {
        await giftService.deleteGift(id);
        setGifts(gifts.filter(gift => gift.id !== id));
      } catch (err) {
        setError('خطا در حذف هدیه');
        console.error(err);
      }
    }
  };
  
  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="gift-list-container">
      <div className="gift-list-header">
        <h1>لیست هدایا</h1>
        <Link to="/gifts/edit/new" className="add-gift-button">
          افزودن هدیه جدید
        </Link>
      </div>
      
      {gifts.length === 0 ? (
        <div className="no-gifts">
          <p>هیچ هدیه‌ای یافت نشد</p>
          <Link to="/gifts/edit/new" className="add-first-gift">
            افزودن اولین هدیه
          </Link>
        </div>
      ) : (
        <div className="gifts-grid">
          {gifts.map(gift => (
            <div key={gift.id} className="gift-card">
              <div className="gift-image">
                <img src={gift.image_url || '/default-gift.png'} alt={gift.name} />
              </div>
              <div className="gift-info">
                <h3>{gift.name}</h3>
                <p className="gift-description">{gift.description}</p>
                <p className="gift-price">{gift.price.toLocaleString()} تومان</p>
              </div>
              <div className="gift-actions">
                <Link to={`/gifts/edit/${gift.id}`} className="edit-button">
                  ویرایش
                </Link>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteGift(gift.id)}
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GiftList; 