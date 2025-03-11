import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Navbar.css';
import { 
  Tooltip, 
  Box, 
  AppBar, 
  Container, 
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const isLoggedIn = authService.isLoggedIn();
  const user = authService.getCurrentUser();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const menuItems = [
    { title: 'خانه', path: '/' },
    ...(isLoggedIn ? [
      { title: 'محبوبان', path: '/friends' },
      { title: 'هدایا', path: '/gifts' }
    ] : []),
    { title: 'کاربران', path: '/users' },
    { title: 'درباره ما', path: '/about' }
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container maxWidth="lg">
        <Toolbar 
          disableGutters 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 1rem'
          }}
        >
          <Tooltip title="بامرام - پلتفرم هوشمند یادآوری و مدیریت تاریخ‌های دوست‌داشتنی زندگی" arrow>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img src="/images/logo.png" alt="Bamaram Logo" style={{ height: '40px' }} />
            </Box>
          </Tooltip>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="start"
                color="primary"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem 
                    key={item.path} 
                    onClick={handleClose} 
                    component={Link} 
                    to={item.path}
                    sx={{ 
                      color: theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light + '20'
                      }
                    }}
                  >
                    {item.title}
                  </MenuItem>
                ))}
                {isLoggedIn ? (
                  <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
                    خروج
                  </MenuItem>
                ) : (
                  <MenuItem 
                    component={Link} 
                    to="/login" 
                    onClick={handleClose}
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold'
                    }}
                  >
                    ورود
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: theme.palette.text.primary,
                      '&:hover': {
                        color: theme.palette.primary.main,
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </Box>
              <Box>
                {isLoggedIn ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component={Link}
                      to="/profile"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                        '&:hover': {
                          opacity: 0.8
                        }
                      }}
                    >
                      <Box
                        component="img"
                        src={user?.profileImage || '/images/profile.png'}
                        alt="Profile"
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid',
                          borderColor: 'primary.main'
                        }}
                      />
                      <Typography
                        sx={{
                          ml: 1,
                          fontWeight: 'medium',
                          color: 'text.primary'
                        }}
                      >
                        {user?.username || 'کاربر'}
                      </Typography>
                    </Box>
                    <Button
                      onClick={handleLogout}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      خروج
                    </Button>
                  </Box>
                ) : (
                  <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    sx={{
                      background: `linear-gradient(45deg, #fe663f 30%, #ff8568 90%)`,
                      color: 'white',
                      padding: '8px 24px',
                      '&:hover': {
                        background: `linear-gradient(45deg, #e55736 30%, #fe663f 90%)`,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(254, 102, 63, 0.3)'
                      },
                      boxShadow: '0 4px 16px rgba(254, 102, 63, 0.2)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ورود
                  </Button>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 