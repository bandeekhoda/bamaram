import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { authService } from '../services/api';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // اگر کاربر قبلاً لاگین کرده باشد، به صفحه اصلی هدایت می‌شود
    if (authService.isLoggedIn()) {
      navigate('/');
    }
  }, [navigate]);

  const handleLoginSuccess = () => {
    // پس از لاگین موفق، به صفحه اصلی هدایت می‌شود
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <h1>خوش آمدید</h1>
        <p>برای استفاده از امکانات سایت، لطفاً وارد حساب کاربری خود شوید.</p>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default Login; 