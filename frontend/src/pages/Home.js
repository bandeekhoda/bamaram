import React from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import AuthService from '../services/AuthService';
import { useAuth } from '../contexts/AuthContext';
import PersianCalendar from '../components/PersianCalendar';
import { ReactTyped } from 'react-typed';
import CharityMarketplace from '../components/CharityMarketplace';
import CharityAuction from '../components/CharityAuction';

// Import icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChatIcon from '@mui/icons-material/Chat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SecurityIcon from '@mui/icons-material/Security';

// اضافه کردن استایل انیمیشن قلب
const pulsingHeartStyle = {
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.2)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  animation: 'pulse 1.5s infinite',
  marginRight: '8px',
  color: '#fe663f',
  verticalAlign: 'middle',
};

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate('/friends');
    } else {
      navigate('/login');
    }
  };

  const handleDateSelect = (date) => {
    if (isAuthenticated) {
      navigate('/friends/add', { state: { selectedDate: date } });
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <PeopleAltIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'یادآوری هوشمند',
      description: 'یک هفته قبل از هر مناسبت به شما یادآوری می‌کنیم تا هیچ تاریخ مهمی را از دست ندهید'
    },
    {
      icon: <ChatIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: 'پیشنهاد هدیه مناسب',
      description: 'هدایای مناسب هر مناسبت را بر اساس قیمت، سلیقه و سن هدیه گیرنده به شما پیشنهاد می‌دهیم'
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 48, color: theme.palette.secondary.main }} />,
      title: 'بسته‌بندی ویژه',
      description: 'بسته‌بندی‌های مخصوص هر مناسبت را برای هدایای شما فراهم می‌کنیم'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'خرید آنلاین آسان',
      description: 'امکان خرید آنلاین و راحت هدایا از فروشگاه باسلام با تضمین کیفیت'
    }
  ];

  return (
    <div className="home-page">
      <Container maxWidth="lg">
        <section className="hero-section" sx={{
          background: 'linear-gradient(135deg, #f6fffe 0%, #e0f5f1 100%)',
          borderRadius: '0 0 50px 50px',
          padding: '10px 20px 20px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '100%',
              background: 'linear-gradient(45deg, rgba(254, 80, 0, 0.1) 0%, rgba(254, 102, 63, 0.05) 100%)',
              zIndex: 0
            }}
          />
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
            mb: 1
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-start' },
              flex: 1,
              order: { xs: 1, md: 1 },
              mr: { xs: 0, md: 4 }
            }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  color: '#FE5000 !important',
                  position: 'relative',
                  zIndex: 1,
                  fontWeight: 'bold',
                  textAlign: { xs: 'center', md: 'right' },
                  mb: 1,
                  fontSize: { xs: '0.84rem', md: '1.05rem' }
                }}>
                باسلام به هر بامرام
              </Typography>
              
              <Box sx={{
                textAlign: { xs: 'center', md: 'right' },
                color: '#2c665a',
                direction: 'rtl',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'nowrap'
              }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.8rem', md: '2rem' },
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ❤️ مرام بزار برای عزیزت ❤️
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.8rem', md: '2rem' },
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                    '& .emoji': {
                      fontSize: '1.3em',
                      verticalAlign: 'middle',
                      margin: '0 4px'
                    }
                  }}
                >
                  <ReactTyped
                    strings={[
                      'حتی با یک پیامک 📱',
                      'با یک هدیه کوچک 🎁',
                      'حتی با یک کارت پستال 💌'
                    ]}
                    typeSpeed={40}
                    backSpeed={50}
                    startDelay={1000}
                    backDelay={2000}
                    loop
                  />
                </Typography>
              </Box>
              
              <Box sx={{ 
                width: '100%', 
                display: 'flex', 
                justifyContent: 'flex-start', 
                mt: '60px',
                pl: '20px'
              }}>
                <div className="cta-buttons">
                  {!isAuthenticated ? (
                    <Button
                      onClick={() => navigate('/login')}
                      variant="contained"
                      size="large"
                      sx={{
                        minWidth: '180px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #FE5000 30%, #fe663f 90%)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #fe663f 30%, #FE5000 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(254, 80, 0, 0.3)'
                        },
                        boxShadow: '0 4px 16px rgba(254, 80, 0, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      ورود به بامرام
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      to="/friends"
                      variant="contained"
                      size="large"
                      sx={{
                        minWidth: '180px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #FE5000 30%, #fe663f 90%)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #fe663f 30%, #FE5000 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(254, 80, 0, 0.3)'
                        },
                        boxShadow: '0 4px 16px rgba(254, 80, 0, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      لیست محبوبان
                    </Button>
                  )}
                </div>
              </Box>
            </Box>

            <Box sx={{ 
              width: '280px',
              height: '280px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '20px',
              padding: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              transition: 'transform 0.3s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              order: { xs: 2, md: 2 },
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)'
              }
            }}>
              <PersianCalendar onDateSelect={handleDateSelect} />
            </Box>
          </Box>
        </section>

        <section className="features-section">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <div className="feature-card">
                  {feature.icon}
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      mt: 2,
                      mb: 1,
                      fontWeight: 'bold',
                      color: theme.palette.text.primary
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary
                    }}
                  >
                    {feature.description}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </section>

        <CharityAuction />

        <CharityMarketplace />

        {/* تصویر انتهای صفحه */}
        <Box
          sx={{
            mt: 8,
            mb: 4,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <img
            src="https://s6.uupload.ir/files/یییییییی_olm1.jpg"
            alt="Bamaram Feature"
            style={{
              maxWidth: '90%',
              height: 'auto',
              borderRadius: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          />
        </Box>
      </Container>
    </div>
  );
};

export default Home;