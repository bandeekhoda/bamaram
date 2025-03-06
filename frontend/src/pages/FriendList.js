import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FriendList.css';
import { friendService } from '../services/api';

function FriendList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const data = await friendService.getFriends();
        setFriends(data);
        setLoading(false);
      } catch (err) {
        setError('خطا در دریافت لیست دوستان');
        setLoading(false);
        console.error(err);
      }
    };

    fetchFriends();
  }, []);

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="friend-list-container">
      <h1>لیست دوستان</h1>
      <Link to="/" className="back-button">بازگشت به خانه</Link>
      
      <div className="add-friend">
        <Link to="/friends/edit/new" className="add-friend-button">افزودن دوست جدید</Link>
      </div>
      
      {friends.length === 0 ? (
        <p className="no-friends">هیچ دوستی یافت نشد</p>
      ) : (
        <div className="friends-grid">
          {friends.map(friend => (
            <div key={friend.id} className="friend-card">
              <div className="friend-image">
                <img src={friend.avatar || '/default-avatar.png'} alt={friend.name} />
              </div>
              <div className="friend-info">
                <h3>{friend.name}</h3>
                <p>{friend.email}</p>
                <p className="friend-phone">{friend.phone}</p>
                {friend.days_until_birthday !== undefined && (
                  <p className="birthday-info">
                    {friend.days_until_birthday === 0 
                      ? 'امروز تولدشه!' 
                      : `${friend.days_until_birthday} روز تا تولد`}
                  </p>
                )}
              </div>
              <div className="friend-actions">
                <Link to={`/friends/${friend.id}`} className="view-button">مشاهده</Link>
                <Link to={`/friends/edit/${friend.id}`} className="edit-button">ویرایش</Link>
                {friend.is_birthday_soon && (
                  <Link to={`/gifts/select/${friend.id}`} className="gift-button">انتخاب هدیه</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FriendList; 