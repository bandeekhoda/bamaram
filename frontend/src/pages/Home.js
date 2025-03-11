import React from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import './Home.css';
import AuthService from '../services/AuthService';

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

  const isAuthenticated = AuthService.isAuthenticated();

  return (
    <div className="home-page">
      <Container maxWidth="lg">
        <section className="hero-section" style={{ background: '#029f68' }}>
          <Box className="logo-container">
            <img src="/images/logo.png" alt="Bamaram Logo" className="logo-image" />
          </Box>
          <Typography variant="h3" component="h1" gutterBottom>
            باسلام به هر بامرام
          </Typography>
          <Typography variant="h5" component="h2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: 4,
              maxWidth: '900px',
              margin: '0 auto',
              lineHeight: 1.8
            }}>
            بامرام یک پلتفرم هوشمند و نوآورانه است که برای یادآوری و مدیریت تاریخ‌های محبوبان زندگی شما طراحی شده است
          </Typography>
          <div className="cta-buttons">
            {!isAuthenticated ? (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="large"
                sx={{
                  minWidth: '180px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, #fe663f 30%, #ff8568 90%)`,
                  color: 'white',
                  '&:hover': {
                    background: `linear-gradient(45deg, #e55736 30%, #fe663f 90%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(254, 102, 63, 0.3)'
                  },
                  boxShadow: '0 4px 16px rgba(254, 102, 63, 0.2)',
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
                  background: `linear-gradient(45deg, #fe663f 30%, #ff8568 90%)`,
                  color: 'white',
                  '&:hover': {
                    background: `linear-gradient(45deg, #e55736 30%, #fe663f 90%)`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(254, 102, 63, 0.3)'
                  },
                  boxShadow: '0 4px 16px rgba(254, 102, 63, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                لیست محبوبان
              </Button>
            )}
          </div>
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

        <div className="welcome-message">
          <Typography variant="h4" component="h2" gutterBottom
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
            چرا بامرام؟
          </Typography>
          <Typography variant="body1" 
            sx={{
              color: theme.palette.text.secondary,
              textAlign: 'center',
              maxWidth: '900px',
              margin: '0 auto',
              mt: 2,
              lineHeight: 2
            }}>
            با توجه به شلوغی‌های زندگی امروزی، بسیاری از افراد تاریخ‌های مهم را فراموش می‌کنند و یا فرصت مناسب برای خرید هدیه و خوشحال کردن خانواده خود پیدا نمی‌کنند. بامرام یک هفته قبل از هر مناسبت به شما یادآوری می‌کند و هدایای مناسب آن روز را از فروشگاه "باسلام"، به شما معرفی می‌کند. همچنین، بسته‌بندی‌های ویژه مناسبت‌ها را نیز فراهم می‌کنیم تا شما بتوانید به راحتی و بدون دغدغه هدایا را به صورت آنلاین خریداری کنید.
          </Typography>
        </div>
      </Container>
    </div>
  );
};

export default Home; 