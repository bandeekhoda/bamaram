import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Navbar.css';

const Navbar = () => {
  const isLoggedIn = authService.isLoggedIn();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">
          <Link to="/">بامارام</Link>
        </h1>
        <ul className="nav-links">
          <li>
            <Link to="/">خانه</Link>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <Link to="/friends">دوستان</Link>
              </li>
              <li>
                <Link to="/gifts">هدایا</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/users">کاربران</Link>
          </li>
          <li>
            <Link to="/about">درباره ما</Link>
          </li>
        </ul>
        <div className="auth-links">
          {isLoggedIn ? (
            <>
              <span className="user-info">
                {user?.username || 'کاربر'}
              </span>
              <button onClick={handleLogout} className="btn-logout">
                خروج
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-login">
              ورود
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 