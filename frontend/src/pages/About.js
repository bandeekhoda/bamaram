import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <h1>درباره بامارام</h1>
      <div className="about-content">
        <p>
          بامارام یک پروژه نمونه با بک‌اند پایتون (FastAPI) و فرانت‌اند ری‌اکت است که برای نمایش قابلیت‌های این دو تکنولوژی طراحی شده است.
        </p>
        
        <h2>تکنولوژی‌های استفاده شده</h2>
        <div className="tech-list">
          <div className="tech-item">
            <h3>بک‌اند</h3>
            <ul>
              <li>پایتون</li>
              <li>FastAPI</li>
              <li>SQLAlchemy</li>
              <li>Pydantic</li>
              <li>JWT</li>
            </ul>
          </div>
          
          <div className="tech-item">
            <h3>فرانت‌اند</h3>
            <ul>
              <li>React</li>
              <li>React Router</li>
              <li>Axios</li>
              <li>CSS</li>
            </ul>
          </div>
        </div>
        
        <h2>ویژگی‌های پروژه</h2>
        <ul className="feature-list">
          <li>احراز هویت با OTP و شماره موبایل</li>
          <li>مدیریت کاربران</li>
          <li>API‌های RESTful</li>
          <li>رابط کاربری واکنش‌گرا</li>
          <li>طراحی مناسب برای موبایل</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
