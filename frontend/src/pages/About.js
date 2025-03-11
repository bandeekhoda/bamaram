import React from 'react';
import { Container, Typography, Grid, Paper, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import './About.css';

const About = () => {
  const theme = useTheme();

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'بک‌اند پایتون با FastAPI',
      description: 'استفاده از فریم‌ورک قدرتمند FastAPI برای ایجاد API‌های سریع و مطمئن'
    },
    {
      icon: <StorageIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'فرانت‌اند ری‌اکت',
      description: 'استفاده از کتابخانه ری‌اکت برای ایجاد رابط کاربری پویا و واکنش‌گرا'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'احراز هویت با OTP',
      description: 'سیستم احراز هویت با استفاده از رمز یکبار مصرف (OTP) از طریق شماره موبایل'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      title: 'مدیریت کاربران',
      description: 'سیستم مدیریت کاربران با قابلیت ثبت‌نام، ورود، و مدیریت پروفایل'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
            mb: 3
          }}>
          درباره بامرام
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: '900px',
            margin: '0 auto',
            lineHeight: 1.8,
            mb: 4
          }}>
          بامرام یک پلتفرم هوشمند و نوآورانه است که برای یادآوری و مدیریت تاریخ‌های دوست‌داشتنی زندگی کاربران طراحی شده است
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
              مشکل و نیاز بازار
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 2 }}>
              با توجه به شلوغی‌های زندگی امروزی، بسیاری از افراد تاریخ‌های مهم را فراموش می‌کنند و یا فرصت مناسب برای خرید هدیه و خوشحال کردن خانواده خود پیدا نمی‌کنند. این موضوع می‌تواند باعث از دست دادن فرصت‌های تعمیق روابط در خانواده‌ها شود.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', backgroundColor: 'rgba(255, 87, 34, 0.05)' }}>
            <Typography variant="h5" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>
              راه‌حل ارائه شده
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 2 }}>
              بامرام یک هفته قبل از هر مناسبت به شما یادآوری می‌کند و هدایای مناسب آن روز را از فروشگاه "باسلام"، به شما معرفی می‌کند. مثلاً وقتی روز مادر است، هدیه‌های مناسب روز مادر را برای شما بر اساس قیمت، سلیقه و سن هدیه گیرنده دسته‌بندی می‌کند.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box mt={6}>
        <Paper elevation={0} sx={{ p: 4, backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
            ویژگی‌های منحصر به فرد
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 2 }}>
            بامرام تلاش می‌کند بسته‌بندی‌های ویژه مناسبت‌ها را نیز فراهم کند، به این صورت که فروشنده بسته‌بندی مناسب روز مادر را برای هدایای روز مادر آماده می‌کند. این ویژگی به شما امکان می‌دهد که به راحتی و بدون دغدغه هدایا را به صورت آنلاین خریداری کنید و هر مناسبت را به بهترین شکل جشن بگیرید.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary="یادآوری هوشمند مناسبت‌های مهم" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary="پیشنهاد هدایای مناسب بر اساس سلیقه و بودجه" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary="بسته‌بندی ویژه برای هر مناسبت" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
              </ListItemIcon>
              <ListItemText primary="خرید آنلاین آسان از فروشگاه باسلام" />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;
