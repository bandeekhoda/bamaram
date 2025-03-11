import React, { useState, useEffect } from 'react';
import { getFriends, deleteFriend } from '../services/friendService';
import { 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemSecondaryAction, 
    IconButton, 
    Typography, 
    Box,
    Paper,
    Grid,
    Avatar,
    Tooltip,
    Fade,
    keyframes,
    Chip
} from '@mui/material';
import { 
    Delete as DeleteIcon, 
    Edit as EditIcon,
    Cake as CakeIcon,
    Male as MaleIcon,
    Female as FemaleIcon,
    Celebration as CelebrationIcon,
    Favorite as FavoriteIcon,
    EmojiPeople as EmojiPeopleIcon,
    FamilyRestroom as FamilyRestRoomIcon,
    Favorite as HeartIcon,
    Celebration as PartyIcon,
    CardGiftcard as GiftIcon,
    LocalFlorist as FlowerIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// تعریف انیمیشن‌های چشمک‌زن
const pulseAnimation = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
`;

const fastPulseAnimation = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
`;

// تعریف نسبت‌ها و مناسبت‌ها (همان تعاریف FriendForm)
const RELATIONS = {
    PARENT: 'پدر/مادر',
    CHILD: 'فرزند',
    SPOUSE: 'همسر',
    FRIEND: 'رفیق',
    RELATIVE: 'اقوام'
};

const OCCASIONS = {
    BIRTHDAY: 'تولد',
    MOTHERS_DAY: 'روز مادر',
    FATHERS_DAY: 'روز پدر',
    DAUGHTERS_DAY: 'روز دختر',
    SONS_DAY: 'روز پسر',
    WEDDING_ANNIVERSARY: 'سالگرد ازدواج',
    ENGAGEMENT_ANNIVERSARY: 'سالگرد عقد'
};

// تعریف آیکون‌ها برای هر مناسبت
const OCCASION_ICONS = {
    BIRTHDAY: CakeIcon,
    MOTHERS_DAY: FlowerIcon,
    FATHERS_DAY: EmojiPeopleIcon,
    DAUGHTERS_DAY: FamilyRestRoomIcon,
    SONS_DAY: FamilyRestRoomIcon,
    WEDDING_ANNIVERSARY: HeartIcon,
    ENGAGEMENT_ANNIVERSARY: PartyIcon
};

// تابع محاسبه سن
const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
};

// تابع محاسبه روزهای باقی‌مانده
const calculateDaysUntil = (date) => {
    const today = new Date();
    const targetDate = new Date(date);
    
    // تنظیم ساعت به ابتدای روز برای مقایسه دقیق
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    // تنظیم سال مناسبت برای سال جاری
    targetDate.setFullYear(today.getFullYear());
    
    // اگر تاریخ امسال گذشته، به سال بعد تنظیم می‌شود
    if (targetDate < today) {
        targetDate.setFullYear(today.getFullYear() + 1);
    }
    
    // محاسبه تفاوت روزها
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
};

// تابع کمکی برای بررسی نزدیک بودن تاریخ
const isDateSoon = (daysUntil) => {
    return daysUntil <= 10 && daysUntil > 0;
};

const getOccasionStyle = (daysUntil) => {
    if (daysUntil === 0) {
        return {
            bgcolor: '#ffebee', // قرمز روشن
            border: '2px solid #f44336', // قرمز پررنگ
            color: '#d32f2f', // قرمز تیره
            animation: `${fastPulseAnimation} 1s infinite`,
            '& .occasion-days': {
                color: '#d32f2f',
                fontWeight: 'bold',
                '&::after': {
                    content: '"امروز!"',
                    marginRight: '8px',
                    color: '#d32f2f',
                }
            }
        };
    } else if (daysUntil <= 3) {
        return {
            bgcolor: '#fff5f5', // قرمز بسیار کمرنگ
            border: '2px solid #ff8a80', // قرمز روشن
            color: '#c62828', // قرمز تیره
            animation: `${pulseAnimation} 2s infinite`,
            '& .occasion-days': {
                color: '#c62828',
                fontWeight: 'bold',
                '&::after': {
                    content: '"خیلی نزدیک!"',
                    marginRight: '8px',
                    color: '#c62828',
                }
            }
        };
    } else if (daysUntil <= 10) {
        return {
            bgcolor: '#fff3e0', // نارنجی کمرنگ
            border: '2px solid #ff9800', // نارنجی پررنگ
            color: '#e65100', // نارنجی تیره
            '& .occasion-days': {
                color: '#e65100',
                fontWeight: 'bold',
                '&::after': {
                    content: '"نزدیک"',
                    marginRight: '8px',
                    color: '#e65100',
                }
            }
        };
    } else if (daysUntil <= 30) {
        return {
            bgcolor: '#fffde7', // زرد ملایم
            border: '2px solid #ffd54f', // زرد طلایی
            color: '#f57f17', // نارنجی تیره
            '& .occasion-days': {
                color: '#f57f17'
            }
        };
    }

    return {
        bgcolor: '#f5f5f5',
        border: '1px solid #e0e0e0',
        color: '#757575'
    };
};

const RELATION_AVATARS = {
    PARENT_FATHER: 'https://s6.uupload.ir/files/3048150_m0rl.png',
    PARENT_MOTHER: 'https://s6.uupload.ir/files/7361197_tl2j.png',
    CHILD: 'https://s6.uupload.ir/files/3636387_fmhj.png',
    SPOUSE: 'https://s6.uupload.ir/files/2060996_3vvw.png',
    FRIEND: 'https://s6.uupload.ir/files/3362053_pka6.png',
    RELATIVE: 'https://s6.uupload.ir/files/1662964_oxdv.png'
};

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadFriends();
    }, []);

    const loadFriends = async () => {
        try {
            const data = await getFriends();
            console.log('Friends data from server:', data);
            
            // اضافه کردن روزهای باقی‌مانده برای هر مناسبت
            const friendsWithDates = data.map(friend => ({
                ...friend,
                occasionDates: friend.occasionDates.map(od => ({
                    ...od,
                    daysUntil: calculateDaysUntil(od.date),
                    isDateSoon: isDateSoon(calculateDaysUntil(od.date))
                }))
            }));

            // مرتب‌سازی محبوبان براساس نزدیک‌ترین مناسبت
            const sortedFriends = friendsWithDates.sort((a, b) => {
                const aMinDays = Math.min(...a.occasionDates.map(od => od.daysUntil));
                const bMinDays = Math.min(...b.occasionDates.map(od => od.daysUntil));
                return aMinDays - bMinDays;
            });

            console.log('Sorted friends:', sortedFriends);
            setFriends(sortedFriends);
        } catch (error) {
            console.error('Error loading friends:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('آیا از حذف این دوست مطمئن هستید؟')) {
            try {
                await deleteFriend(id);
                setFriends(friends.filter(friend => friend.id !== id));
            } catch (error) {
                console.error('Error deleting friend:', error);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/friends/edit/${id}`);
    };

    const handleAdd = () => {
        navigate('/friends/add');
    };

    // تابع کمکی برای فرمت تاریخ میلادی
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4 
                }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        لیست محبوبان
                    </Typography>
                    <Button 
                        variant="contained" 
                        onClick={handleAdd}
                        sx={{
                            background: `linear-gradient(45deg, #fe663f 30%, #ff8568 90%)`,
                            color: 'white',
                            padding: '12px 32px',
                            '&:hover': {
                                background: `linear-gradient(45deg, #e55736 30%, #fe663f 90%)`,
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 24px rgba(254, 102, 63, 0.3)'
                            },
                        }}
                    >
                        افزودن محبوب جدید
                    </Button>
                </Box>

                <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' }}>
                    {friends.map((friend) => (
                        <Grid 
                            item 
                            xs={12} 
                            sm={6} 
                            md={4} 
                            key={friend.id}
                            sx={{ display: 'flex', height: '100%' }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 2,
                                    height: 400, // ارتفاع ثابت
                                    position: 'relative',
                                    borderRadius: 2,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                {/* بخش اطلاعات اصلی */}
                                <Box sx={{ mb: 2, flexShrink: 0 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start',
                                        gap: 2
                                    }}>
                                        <Avatar 
                                            src={RELATION_AVATARS[friend.relation]}
                                            sx={{ 
                                                width: 56, 
                                                height: 56,
                                                bgcolor: friend.gender === 'male' ? '#029f68' : '#fe663f',
                                                flexShrink: 0
                                            }}
                                        >
                                            {friend.name ? friend.name[0] : ''}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {friend.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {RELATIONS[friend.relation]} • {calculateAge(friend.birthdate)} ساله
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                تاریخ تولد: {formatDate(friend.birthdate)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* بخش مناسبت‌ها - با اسکرول */}
                                <Box 
                                    sx={{ 
                                        flex: 1,
                                        overflowY: 'auto',
                                        mb: 2,
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: '#f1f1f1',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: '#888',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb:hover': {
                                            background: '#555',
                                        },
                                    }}
                                >
                                    {friend.occasionDates && friend.occasionDates.map((occasion, index) => {
                                        const daysUntil = calculateDaysUntil(occasion.date);
                                        const occasionStyle = getOccasionStyle(daysUntil);
                                        
                                        return (
                                            <Box 
                                                key={index}
                                                sx={{
                                                    p: 1.5,
                                                    mb: 1,
                                                    borderRadius: 2,
                                                    ...occasionStyle
                                                }}
                                            >
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {React.createElement(OCCASION_ICONS[occasion.occasion] || CelebrationIcon, { 
                                                        style: { marginLeft: 8, fontSize: 20 } 
                                                    })}
                                                    <span>{OCCASIONS[occasion.occasion]}</span>
                                                    <span className="occasion-days" style={{ marginRight: 'auto' }}>
                                                        {daysUntil > 0 ? `${daysUntil} روز مانده` : ''}
                                                    </span>
                                                </Typography>
                                                {daysUntil <= 30 && (
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        justifyContent: 'flex-end', 
                                                        gap: 1,
                                                        mt: 1 
                                                    }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => navigate(`/gifts/${friend.id}/${occasion.occasion}`)}
                                                            startIcon={<GiftIcon />}
                                                            sx={{
                                                                color: '#029f68',
                                                                borderColor: '#029f68',
                                                                '&:hover': { 
                                                                    bgcolor: 'rgba(2, 159, 104, 0.1)',
                                                                    borderColor: '#029f68',
                                                                    transform: 'translateY(-2px)'
                                                                },
                                                                transition: 'all 0.2s ease',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            انتخاب هدیه
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            onClick={() => navigate(`/postcards/${friend.id}/${occasion.occasion}`)}
                                                            startIcon={<EmailIcon />}
                                                            sx={{
                                                                color: '#fe663f',
                                                                borderColor: '#fe663f',
                                                                '&:hover': { 
                                                                    bgcolor: 'rgba(254, 102, 63, 0.1)',
                                                                    borderColor: '#fe663f',
                                                                    transform: 'translateY(-2px)'
                                                                },
                                                                transition: 'all 0.2s ease',
                                                                fontSize: '0.8rem'
                                                            }}
                                                        >
                                                            کارت پستال
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>
                                        );
                                    })}
                                </Box>

                                {/* بخش دکمه‌های اکشن */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'flex-end', 
                                    gap: 1,
                                    pt: 2,
                                    borderTop: '1px solid rgba(0,0,0,0.1)',
                                    flexShrink: 0
                                }}>
                                    <Tooltip title="ویرایش" arrow TransitionComponent={Fade}>
                                        <IconButton 
                                            onClick={() => handleEdit(friend.id)}
                                            sx={{ 
                                                color: '#029f68',
                                                '&:hover': { bgcolor: 'rgba(2, 159, 104, 0.1)' }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="حذف" arrow TransitionComponent={Fade}>
                                        <IconButton 
                                            onClick={() => handleDelete(friend.id)}
                                            sx={{ 
                                                color: '#fe663f',
                                                '&:hover': { bgcolor: 'rgba(254, 102, 63, 0.1)' }
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default FriendList; 