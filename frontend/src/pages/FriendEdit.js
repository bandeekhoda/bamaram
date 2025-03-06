import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { friendService, authService } from '../services/api';
import './FriendEdit.css';

const FriendEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewFriend = id === 'new';
  const [friend, setFriend] = useState({
    name: '',
    birthdate: '',
    gender: 'male'
  });
  const [loading, setLoading] = useState(!isNewFriend);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // بررسی وضعیت لاگین
  useEffect(() => {
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  // دریافت اطلاعات دوست (فقط در حالت ویرایش)
  useEffect(() => {
    if (isNewFriend) {
      // برای دوست جدید نیازی به دریافت اطلاعات نیست
      setLoading(false);
      return;
    }

    const fetchFriend = async () => {
      try {
        const data = await friendService.getFriend(id);
        
        // تبدیل تاریخ به فرمت مناسب برای input نوع date
        const birthdate = new Date(data.birthdate);
        const formattedDate = birthdate.toISOString().split('T')[0];
        
        setFriend({
          name: data.name,
          birthdate: formattedDate,
          gender: data.gender
        });
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت اطلاعات دوست. لطفاً دوباره تلاش کنید.');
        setLoading(false);
      }
    };

    fetchFriend();
  }, [id, isNewFriend]);

  // تغییر فیلدهای فرم
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFriend({
      ...friend,
      [name]: value
    });
  };

  // ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      if (isNewFriend) {
        // ایجاد دوست جدید
        const newFriend = await friendService.createFriend(friend);
        navigate(`/friends/${newFriend.id}`);
      } else {
        // ویرایش دوست موجود
        await friendService.updateFriend(id, friend);
        navigate(`/friends/${id}`);
      }
    } catch (err) {
      const errorMessage = isNewFriend 
        ? 'خطا در ایجاد دوست جدید. لطفاً دوباره تلاش کنید.' 
        : 'خطا در به‌روزرسانی اطلاعات دوست. لطفاً دوباره تلاش کنید.';
      setError(errorMessage);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="friend-edit-page">
        <div className="loading">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="friend-edit-page">
      <div className="friend-edit-card">
        <h1>{isNewFriend ? 'افزودن دوست جدید' : 'ویرایش اطلاعات دوست'}</h1>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">نام</label>
            <input
              type="text"
              id="name"
              name="name"
              value={friend.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="birthdate">تاریخ تولد</label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={friend.birthdate}
              onChange={handleInputChange}
              required
            />
            <small>تاریخ تولد به صورت میلادی وارد شود</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">جنسیت</label>
            <select
              id="gender"
              name="gender"
              value={friend.gender}
              onChange={handleInputChange}
              required
            >
              <option value="male">مرد</option>
              <option value="female">زن</option>
              <option value="other">سایر</option>
            </select>
          </div>
          
          <div className="form-actions">
            <Link to="/friends" className="btn btn-light">انصراف</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'در حال ذخیره...' : (isNewFriend ? 'ایجاد دوست' : 'ذخیره تغییرات')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FriendEdit;