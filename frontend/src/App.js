import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import RTL from './rtl';
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
import GiftSelect from './pages/GiftSelect';
import GiftList from './pages/GiftList';
import GiftEdit from './pages/GiftEdit';
import NotFound from './pages/NotFound';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import Register from './pages/Register';
import FriendForm from './components/FriendForm';
import FriendList from './components/FriendList';
import Auctions from './pages/Auctions';

function App() {
  return (
    <RTL>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/friends" element={<FriendList />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/friends/add" element={<FriendForm />} />
                <Route path="/friends/edit/:id" element={<FriendForm />} />
                <Route path="/gifts" element={<GiftList />} />
                <Route path="/gifts/edit/:id" element={<GiftEdit />} />
                <Route path="/gifts/select/:friendId" element={<GiftSelect />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </RTL>
  );
}

export default App; 