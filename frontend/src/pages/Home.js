import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Home.css';

const Home = () => {
  const user = authService.getCurrentUser();
  const isLoggedIn = authService.isLoggedIn();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>به بامارام خوش آمدید</h1>
        <p>یک پروژه با بک‌اند پایتون (FastAPI) و فرانت‌اند ری‌اکت</p>
        
        {isLoggedIn ? (
          <div className="welcome-message">
            <h2>خوش آمدید{user?.username ? ` ${user.username}` : ''}</h2>
            <p>شما با موفقیت وارد سیستم شده‌اید.</p>
            <button 
              className="btn btn-danger" 
              onClick={() => {
                authService.logout();
                window.location.reload();
              }}
            >
              خروج از حساب کاربری
            </button>
          </div>
        ) : (
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">ورود به حساب کاربری</Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>ویژگی‌های این پروژه</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>بک‌اند پایتون با FastAPI</h3>
            <p>استفاده از فریم‌ورک قدرتمند FastAPI برای ایجاد API‌های سریع و مطمئن</p>
          </div>
          <div className="feature-card">
            <h3>فرانت‌اند ری‌اکت</h3>
            <p>استفاده از کتابخانه ری‌اکت برای ایجاد رابط کاربری پویا و واکنش‌گرا</p>
          </div>
          <div className="feature-card">
            <h3>احراز هویت با OTP</h3>
            <p>سیستم احراز هویت با استفاده از رمز یکبار مصرف (OTP) از طریق شماره موبایل</p>
          </div>
          <div className="feature-card">
            <h3>مدیریت کاربران</h3>
            <p>سیستم مدیریت کاربران با قابلیت ثبت‌نام، ورود، و مدیریت پروفایل</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 