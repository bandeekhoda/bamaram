import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { friendService, authService } from '../services/api';
import './FriendDetail.css';

const FriendDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [friend, setFriend] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // بررسی وضعیت لاگین
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  // دریافت اطلاعات دوست
  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const data = await friendService.getFriend(id);
        setFriend(data);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت اطلاعات دوست. لطفاً دوباره تلاش کنید.');
        setLoading(false);
      }
    };

    fetchFriend();
  }, [id]);

  // حذف دوست
  const handleDelete = async () => {
    if (window.confirm('آیا از حذف این دوست اطمینان دارید؟')) {
      try {
        await friendService.deleteFriend(id);
        navigate('/friends');
      } catch (err) {
        setError('خطا در حذف دوست. لطفاً دوباره تلاش کنید.');
      }
    }
  };

  // تبدیل تاریخ میلادی به شمسی (برای نمایش)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  if (loading) {
    return (
      <div className="friend-detail-page">
        <div className="loading">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friend-detail-page">
        <div className="alert alert-danger">{error}</div>
        <Link to="/friends" className="btn btn-primary">بازگشت به لیست محبوبان</Link>
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="friend-detail-page">
        <div className="alert alert-danger">دوست مورد نظر یافت نشد.</div>
        <Link to="/friends" className="btn btn-primary">بازگشت به لیست محبوبان</Link>
      </div>
    );
  }

  return (
    <div className="friend-detail-page">
      <div className="friend-detail-card">
        <div className="friend-header">
          <h1>{friend.name}</h1>
          {friend.is_birthday_soon && (
            <span className="birthday-badge">
              {friend.days_until_birthday === 0 
                ? 'امروز تولدشه!' 
                : `${friend.days_until_birthday} روز تا تولد`}
            </span>
          )}
        </div>
        
        <div className="friend-info-section">
          <div className="info-item">
            <span className="info-label">تاریخ تولد:</span>
            <span className="info-value">{formatDate(friend.birthdate)}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">جنسیت:</span>
            <span className="info-value">
              {friend.gender === 'male' ? 'مرد' : friend.gender === 'female' ? 'زن' : 'سایر'}
            </span>
          </div>
          
          {friend.is_birthday_soon && (
            <div className="birthday-info">
              <h3>تولد نزدیک است!</h3>
              <p>
                {friend.days_until_birthday === 0 
                  ? 'امروز تولد این دوست شماست. تبریک بگویید و هدیه‌ای برایش تهیه کنید.' 
                  : `تنها ${friend.days_until_birthday} روز تا تولد این دوست باقی مانده است. برای تهیه هدیه برنامه‌ریزی کنید.`}
              </p>
              <button className="btn btn-gift">انتخاب هدیه</button>
            </div>
          )}
        </div>
        
        <div className="friend-actions">
          <Link to="/friends" className="btn btn-light">بازگشت به لیست محبوبان</Link>
          <Link to={`/friends/edit/${friend.id}`} className="btn btn-primary">ویرایش</Link>
          <button className="btn btn-danger" onClick={handleDelete}>حذف</button>
        </div>
      </div>
    </div>
  );
};

export default FriendDetail;