import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// کامپوننت‌ها
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// صفحات
import Home from './pages/Home';
import Login from './pages/Login';
import About from './pages/About';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import FriendList from './pages/FriendList';
import FriendDetail from './pages/FriendDetail';
import FriendEdit from './pages/FriendEdit';
import GiftSelect from './pages/GiftSelect';
import GiftList from './pages/GiftList';
import GiftEdit from './pages/GiftEdit';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/friends" element={<FriendList />} />
          <Route path="/friends/:id" element={<FriendDetail />} />
          <Route path="/friends/edit/:id" element={<FriendEdit />} />
          <Route path="/gifts" element={<GiftList />} />
          <Route path="/gifts/edit/:id" element={<GiftEdit />} />
          <Route path="/gifts/select/:friendId" element={<GiftSelect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 