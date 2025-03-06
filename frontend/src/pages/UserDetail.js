import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { userService, authService } from '../services/api';
import './UserDetail.css';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // بررسی اینکه آیا کاربر فعلی همان کاربری است که صفحه‌اش را مشاهده می‌کنیم
  const currentUser = authService.getCurrentUser();
  const isCurrentUser = currentUser && currentUser.id === parseInt(id);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getUser(id);
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت اطلاعات کاربر. لطفاً دوباره تلاش کنید.');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="user-detail-page">
        <div className="loading">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-detail-page">
        <div className="alert alert-danger">{error}</div>
        <Link to="/users" className="btn btn-primary">بازگشت به لیست کاربران</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-detail-page">
        <div className="alert alert-danger">کاربر مورد نظر یافت نشد.</div>
        <Link to="/users" className="btn btn-primary">بازگشت به لیست کاربران</Link>
      </div>
    );
  }

  return (
    <div className="user-detail-page">
      <div className="user-detail-card">
        <div className="user-header">
          <h1>{user.username || 'بدون نام کاربری'}</h1>
          <span className={`user-status ${user.is_active ? 'active' : 'inactive'}`}>
            {user.is_active ? 'فعال' : 'غیرفعال'}
          </span>
        </div>
        
        <div className="user-info-section">
          <div className="info-item">
            <span className="info-label">شناسه کاربر:</span>
            <span className="info-value">{user.id}</span>
          </div>
          
          {user.email && (
            <div className="info-item">
              <span className="info-label">ایمیل:</span>
              <span className="info-value">{user.email}</span>
            </div>
          )}
          
          {user.phone_number && (
            <div className="info-item">
              <span className="info-label">شماره موبایل:</span>
              <span className="info-value">{user.phone_number}</span>
            </div>
          )}
          
          <div className="info-item">
            <span className="info-label">تاریخ عضویت:</span>
            <span className="info-value">
              {new Date(user.created_at).toLocaleDateString('fa-IR')}
            </span>
          </div>
          
          {user.updated_at && (
            <div className="info-item">
              <span className="info-label">آخرین به‌روزرسانی:</span>
              <span className="info-value">
                {new Date(user.updated_at).toLocaleDateString('fa-IR')}
              </span>
            </div>
          )}
        </div>
        
        <div className="user-actions">
          <Link to="/users" className="btn btn-light">بازگشت به لیست کاربران</Link>
          
          {isCurrentUser && (
            <button className="btn btn-primary">ویرایش پروفایل</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 