import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    TextField,
    Chip,
    IconButton,
    Tooltip,
    Container
} from '@mui/material';
import {
    Gavel as GavelIcon,
    Favorite as FavoriteIcon,
    AccessTime as AccessTimeIcon,
    Share as ShareIcon,
    LocalOffer as LocalOfferIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CharityAuction = () => {
    // نمونه داده برای مزایده‌ها
    const auctions = [
        {
            id: 1,
            title: "توپ تیم ملی",
            image: "https://s6.uupload.ir/files/شش_753v.jpg",
            description: "توپ تیم ملی والیبال امضا شده بازیکنان",
            currentBid: "۲,۵۰۰,۰۰۰",
            timeLeft: "۲ روز",
            charity: "حمایت از کودکان بی‌سرپرست"
        },
        {
            id: 2,
            title: "انگشتر با سنگ حرم",
            image: "https://s6.uupload.ir/files/gq5zdh358szpdogsud8zqotqfneqx5nlhghpc93k_ab1k.jpg",
            description: "انگشتر نقره با سنگ مطهر حرم امام حسین علیه السلام",
            currentBid: "۴,۲۰۰,۰۰۰",
            timeLeft: "۱ روز",
            charity: "کمک به سالمندان"
        },
        {
            id: 3,
            title: "پیراهن وحید امیری",
            image: "https://s6.uupload.ir/files/19-amiri_2_75x6.webp",
            description: "پیراهن پرسپولیس وحید امیری با امضا وی",
            currentBid: "۱۲,۰۰۰,۰۰۰",
            timeLeft: "۳ روز",
            charity: "حمایت از هنرمندان"
        }
    ];

    return (
        <Box component="section" sx={{ py: 6 }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(44, 102, 90, 0.05) 0%, rgba(44, 102, 90, 0.1) 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* هدر بخش مزایده */}
                <Box 
                    sx={{ 
                        textAlign: 'center', 
                        py: 5,
                        px: 2,
                        background: 'linear-gradient(45deg, rgba(2, 159, 104, 0.9) 0%, rgba(2, 159, 104, 0.7) 100%)',
                        borderRadius: '16px 16px 60% 60%',
                        mb: 6
                    }}
                >
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 3,
                        mb: 2,
                        px: { xs: 2, md: 6 }
                    }}>
                        <Button
                            variant="contained"
                            component={Link}
                            to="/auction/new"
                            startIcon={<AddIcon />}
                            sx={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                borderRadius: 2,
                                px: 3,
                                order: { xs: 2, md: 1 },
                                '&:hover': {
                                    background: 'rgba(255, 255, 255, 0.3)',
                                }
                            }}
                        >
                            بارگذاری کالا برای مزایده
                        </Button>

                        <Typography
                            variant="h4"
                            component="h2"
                            sx={{
                                color: '#002115',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 2,
                                order: { xs: 1, md: 2 },
                                fontSize: '2.645rem'
                            }}
                        >
                            <GavelIcon sx={{ color: '#002115', fontSize: 35 }} />
                            حراج خیریه آنلاین
                        </Typography>

                        <Button
                            variant="outlined"
                            component={Link}
                            to="/auctions"
                            startIcon={<GavelIcon />}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                borderRadius: 2,
                                px: 3,
                                order: { xs: 3, md: 3 },
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.8)',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            مشاهده حراج ها
                        </Button>
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            color: '#002115',
                            fontWeight: 'bold',
                            fontSize: '1.455rem',
                            opacity: 0.9
                        }}
                    >
                        اینجا با گران خریدن سود می‌کنید!
                    </Typography>
                </Box>

                {/* گرید مزایده‌ها */}
                <Container maxWidth="lg">
                    <Box sx={{ px: 2, pb: 6 }}>
                        <Grid container spacing={3}>
                            {auctions.map((auction) => (
                                <Grid item xs={12} sm={6} md={4} key={auction.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            borderRadius: 3,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            transition: 'all 0.3s ease',
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: '0 8px 24px rgba(44, 102, 90, 0.15)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ position: 'relative' }}>
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={auction.image}
                                                alt={auction.title}
                                                sx={{ 
                                                    borderRadius: '12px 12px 0 0',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    display: 'flex',
                                                    gap: 1
                                                }}
                                            >
                                                <Tooltip title="اشتراک‌گذاری">
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'rgba(255,255,255,0.9)',
                                                            '&:hover': { bgcolor: 'white' }
                                                        }}
                                                    >
                                                        <ShareIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>

                                        <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1 }}>
                                            <Typography 
                                                variant="h6" 
                                                gutterBottom 
                                                sx={{ 
                                                    fontSize: '1rem',
                                                    fontWeight: 'bold',
                                                    color: '#2c665a'
                                                }}
                                            >
                                                {auction.title}
                                            </Typography>
                                            
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                sx={{ 
                                                    mb: 2,
                                                    fontSize: '0.85rem',
                                                    height: '40px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}
                                            >
                                                {auction.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                                <Chip
                                                    icon={<AccessTimeIcon sx={{ fontSize: '0.9rem' }} />}
                                                    label={auction.timeLeft}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(2, 159, 104, 0.1)',
                                                        color: '#029f68',
                                                        '& .MuiChip-icon': {
                                                            color: '#029f68'
                                                        }
                                                    }}
                                                />
                                                <Chip
                                                    icon={<FavoriteIcon sx={{ fontSize: '0.9rem' }} />}
                                                    label={auction.charity}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: 'rgba(254, 80, 0, 0.1)',
                                                        color: '#FE5000',
                                                        '& .MuiChip-icon': {
                                                            color: '#FE5000'
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1
                                            }}>
                                                <LocalOfferIcon sx={{ color: '#029f68', fontSize: '1.2rem' }} />
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    آخرین پیشنهاد:
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#029f68', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                                    {auction.currentBid} تومان
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Paper>
        </Box>
    );
};

export default CharityAuction; 