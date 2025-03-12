import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Container
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const mainLinks = [
    { title: 'خانه', path: '/' },
    { title: 'حراج خیریه', path: '/auctions' },
    { title: 'بازارچه خیریه', path: '/charity-marketplace' },
    { title: 'درباره ما', path: '/about' },
    { title: 'تماس با ما', path: '/contact' }
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#f8faf9', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img 
                src="https://s6.uupload.ir/files/صفحه_آخر_copyبیبی_rmq9.jpg" 
                alt="بامرام" 
                style={{ 
                  height: '50px',
                  marginLeft: '12px',
                  borderRadius: '8px'
                }} 
              />
            </RouterLink>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {mainLinks.map((link) => (
              <Button
                key={link.path}
                component={RouterLink}
                to={link.path}
                sx={{
                  color: '#2c665a',
                  '&:hover': {
                    color: '#029f68',
                    backgroundColor: 'rgba(2, 159, 104, 0.08)'
                  }
                }}
              >
                {link.title}
              </Button>
            ))}
            {isAuthenticated && (
              <>
                <Button
                  component={RouterLink}
                  to="/friends"
                  sx={{
                    color: '#2c665a',
                    '&:hover': {
                      color: '#029f68',
                      backgroundColor: 'rgba(2, 159, 104, 0.08)'
                    }
                  }}
                >
                  محبوبان
                </Button>
                <Button
                  component={RouterLink}
                  to="/gifts"
                  sx={{
                    color: '#2c665a',
                    '&:hover': {
                      color: '#029f68',
                      backgroundColor: 'rgba(2, 159, 104, 0.08)'
                    }
                  }}
                >
                  هدایا
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  sx={{ 
                    color: '#2c665a',
                    '&:hover': {
                      backgroundColor: 'rgba(2, 159, 104, 0.08)'
                    }
                  }}
                >
                  {user?.avatar ? (
                    <Avatar
                      alt={user.username}
                      src={user.avatar}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    component={RouterLink}
                    to="/profile"
                    onClick={handleClose}
                  >
                    پروفایل
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>خروج</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#2c665a',
                    borderColor: '#2c665a',
                    '&:hover': {
                      borderColor: '#029f68',
                      backgroundColor: 'rgba(2, 159, 104, 0.08)'
                    }
                  }}
                >
                  ورود
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    backgroundColor: '#029f68',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#027a50'
                    }
                  }}
                >
                  ثبت‌نام
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 