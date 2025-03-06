import React, { useState } from 'react';
import { authService } from '../services/api';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); // 1: وارد کردن شماره موبایل، 2: وارد کردن کد OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // اعتبارسنجی شماره موبایل
  const validatePhoneNumber = (phone) => {
    const regex = /^09[0-9]{9}$/;
    return regex.test(phone);
  };

  // درخواست کد OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    // اعتبارسنجی شماره موبایل
    if (!validatePhoneNumber(phoneNumber)) {
      setError('لطفاً یک شماره موبایل معتبر وارد کنید (مثال: 09123456789)');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.requestOTP(phoneNumber);
      setMessage(response.message);
      setStep(2); // رفتن به مرحله وارد کردن کد OTP
    } catch (err) {
      setError(err.detail || 'خطا در ارسال کد تأیید. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  // تأیید کد OTP و ورود
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otpCode) {
      setError('لطفاً کد تأیید را وارد کنید');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await authService.verifyOTP(phoneNumber, otpCode);
      setMessage('ورود با موفقیت انجام شد!');
      
      // فراخوانی تابع callback برای اطلاع‌رسانی به کامپوننت والد
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.detail || 'کد تأیید نامعتبر است. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  // بازگشت به مرحله وارد کردن شماره موبایل
  const handleBack = () => {
    setStep(1);
    setError('');
    setMessage('');
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <h2>ورود به حساب کاربری</h2>
        
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        
        {step === 1 ? (
          // فرم وارد کردن شماره موبایل
          <form onSubmit={handleRequestOTP}>
            <div className="form-group">
              <label htmlFor="phoneNumber">شماره موبایل</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="مثال: 09123456789"
                disabled={loading}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? 'در حال ارسال...' : 'دریافت کد تأیید'}
            </button>
          </form>
        ) : (
          // فرم وارد کردن کد OTP
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otpCode">کد تأیید</label>
              <input
                type="text"
                id="otpCode"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="کد 4 رقمی"
                disabled={loading}
                required
              />
              <small>کد تأیید به شماره {phoneNumber} ارسال شد.</small>
              <small className="hint">راهنمایی: کد فیک 1234 را وارد کنید</small>
            </div>
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-light" 
                onClick={handleBack}
                disabled={loading}
              >
                بازگشت
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? 'در حال بررسی...' : 'ورود'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm; 