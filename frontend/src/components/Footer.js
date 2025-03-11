import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} بامرام - تمامی حقوق محفوظ است.</p>
      </div>
    </footer>
  );
};

export default Footer; 