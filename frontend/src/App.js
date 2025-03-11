import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
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
import FriendsPage from './pages/FriendsPage';
import GiftSelect from './pages/GiftSelect';
import GiftList from './pages/GiftList';
import GiftEdit from './pages/GiftEdit';
import NotFound from './pages/NotFound';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import Register from './pages/Register';
import FriendForm from './components/FriendForm';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/friends/add" element={<FriendForm />} />
            <Route path="/friends/edit/:id" element={<FriendForm />} />
            <Route path="/gifts" element={<GiftList />} />
            <Route path="/gifts/edit/:id" element={<GiftEdit />} />
            <Route path="/gifts/select/:friendId" element={<GiftSelect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App; 