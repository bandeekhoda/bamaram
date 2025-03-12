import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  IconButton,
  Stack,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  const mainLinks = [
    { title: 'خانه', path: '/' },
    { title: 'درباره ما', path: '/about' },
    ...(isAuthenticated ? [
      { title: 'محبوبان', path: '/friends' },
      { title: 'هدایا', path: '/gifts' }
    ] : [])
  ];

  const socialLinks = [
    { icon: <InstagramIcon />, url: 'https://instagram.com/bamaram', label: 'اینستاگرام' },
    { icon: <TelegramIcon />, url: 'https://t.me/bamaram', label: 'تلگرام' },
    { icon: <WhatsAppIcon />, url: 'https://wa.me/+989123456789', label: 'واتساپ' }
  ];

  const contactInfo = [
    { 
      icon: <LocationOnIcon sx={{ ml: 1 }} />,
      text: 'تهران، خیابان ولیعصر، بالاتر از میدان ونک، برج نگار، طبقه ۱۲'
    },
    { 
      icon: <PhoneIcon sx={{ ml: 1 }} />,
      text: '۰۲۱-۸۸۸۸۸۸۸۸'
    },
    { 
      icon: <EmailIcon sx={{ ml: 1 }} />,
      text: 'info@bamaram.ir'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f8faf9',
        borderTop: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.06)',
        pt: 8,
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <img
                src="https://s6.uupload.ir/files/یییییییییی_m552.jpg"
                alt="بامرام"
                style={{
                  height: '80px',
                  marginBottom: '24px',
                  borderRadius: '12px'
                }}
              />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1a3d35' }}>
                چرا بامرام؟
              </Typography>
              <Typography variant="body2" sx={{ color: '#2c665a', lineHeight: 2 }}>
                با توجه به شلوغی‌های زندگی امروزی، بسیاری از افراد تاریخ‌های مهم را فراموش می‌کنند و یا فرصت مناسب برای خرید هدیه و خوشحال کردن خانواده خود پیدا نمی‌کنند. بامرام یک هفته قبل از هر مناسبت به شما یادآوری می‌کند و هدایای مناسب آن روز را از فروشگاه "باسلام"، به شما معرفی می‌کند.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    color: '#2c665a',
                    '&:hover': {
                      color: '#029f68',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1a3d35' }}>
              دسترسی سریع
            </Typography>
            <List sx={{ p: 0 }}>
              {mainLinks.map((link, index) => (
                <ListItem key={index} sx={{ p: 0, mb: 1 }}>
                  <Link
                    to={link.path}
                    style={{
                      color: '#2c665a',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#029f68'}
                    onMouseOut={(e) => e.target.style.color = '#2c665a'}
                  >
                    {link.title}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1a3d35' }}>
              تماس با ما
            </Typography>
            <List sx={{ p: 0 }}>
              {contactInfo.map((info, index) => (
                <ListItem key={index} sx={{ p: 0, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', color: '#2c665a' }}>
                    {info.icon}
                    <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
                      {info.text}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(0, 0, 0, 0.06)' }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#2c665a' }}>
            © {new Date().getFullYear()} بامرام - تمامی حقوق محفوظ است
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 