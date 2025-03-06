import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/api';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت لیست کاربران. لطفاً دوباره تلاش کنید.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="user-list-page">
        <h1>لیست کاربران</h1>
        <div className="loading">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-page">
        <h1>لیست کاربران</h1>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="user-list-page">
      <h1>لیست کاربران</h1>
      
      {users.length === 0 ? (
        <div className="no-users">
          <p>هیچ کاربری یافت نشد.</p>
        </div>
      ) : (
        <div className="user-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <h3>{user.username || 'بدون نام کاربری'}</h3>
                <p className="user-email">{user.email || 'بدون ایمیل'}</p>
                <p className="user-phone">{user.phone_number || 'بدون شماره موبایل'}</p>
                <p className="user-status">
                  وضعیت: <span className={user.is_active ? 'active' : 'inactive'}>
                    {user.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                </p>
              </div>
              <div className="user-actions">
                <Link to={`/users/${user.id}`} className="btn btn-primary">
                  مشاهده جزئیات
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList; 