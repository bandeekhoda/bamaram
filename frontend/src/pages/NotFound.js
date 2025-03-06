import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>صفحه مورد نظر یافت نشد</h2>
        <p>متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
        <Link to="/" className="btn btn-primary">بازگشت به صفحه اصلی</Link>
      </div>
    </div>
  );
};

export default NotFound; 