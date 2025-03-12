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
    Chip,
    Container,
    Divider,
    Stack
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
    Email as EmailIcon,
    Mail as MailIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import GiftSuggestionModal from './GiftSuggestionModal';

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
    PARENT_FATHER: 'پدر',
    PARENT_MOTHER: 'مادر',
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
    ENGAGEMENT_ANNIVERSARY: 'سالگرد عقد',
    STUDENTS_DAY: 'روز دانش‌آموز'
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
const calculateDaysUntil = (date, occasion) => {
    const today = new Date();
    const targetDate = new Date(date);
    
    // تنظیم ساعت به ابتدای روز برای مقایسه دقیق
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    // برای تولد و سالگردها، سال را به سال جاری یا سال بعد تنظیم می‌کنیم
    if (occasion === 'BIRTHDAY' || 
        occasion === 'WEDDING_ANNIVERSARY' || 
        occasion === 'ENGAGEMENT_ANNIVERSARY') {
        targetDate.setFullYear(today.getFullYear());
        if (targetDate < today) {
            targetDate.setFullYear(today.getFullYear() + 1);
        }
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
            bgcolor: '#ffebee',
            border: '2px solid #f44336',
            color: '#d32f2f',
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
            bgcolor: '#fff5f5',
            border: '2px solid #ff8a80',
            color: '#e53935',
            animation: `${pulseAnimation} 2s infinite`,
            '& .occasion-days': {
                color: '#e53935',
                fontWeight: 'bold'
            }
        };
    } else if (daysUntil <= 7) {
        return {
            bgcolor: '#fff8e1',
            border: '2px solid #ffd54f',
            color: '#f57f17',
            '& .occasion-days': {
                color: '#f57f17',
                fontWeight: 'bold'
            }
        };
    } else if (daysUntil <= 30) {
        return {
            bgcolor: '#f5f5f5',
            border: '2px solid #e0e0e0',
            color: '#616161',
            '& .occasion-days': {
                color: '#616161'
            }
        };
    } else {
        return {
            bgcolor: '#ffffff',
            border: '1px solid #eeeeee',
            color: '#9e9e9e',
            '& .occasion-days': {
                color: '#9e9e9e'
            }
        };
    }
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
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadFriends();
    }, []);

    const loadFriends = async () => {
        try {
            const data = await getFriends();
            console.log('Raw friends data:', data);
            
            // اضافه کردن روزهای باقی‌مانده برای هر مناسبت
            const friendsWithDates = data.map(friend => ({
                ...friend,
                occasionDates: friend.occasionDates
                    .map(od => ({
                        ...od,
                        daysUntil: calculateDaysUntil(od.date, od.occasion),
                        isDateSoon: isDateSoon(calculateDaysUntil(od.date, od.occasion))
                    }))
                    .sort((a, b) => a.daysUntil - b.daysUntil) // مرتب‌سازی مناسبت‌ها بر اساس نزدیک‌ترین تاریخ
            }));

            // مرتب‌سازی محبوبان براساس نزدیک‌ترین مناسبت
            const sortedFriends = friendsWithDates.sort((a, b) => {
                const aMinDays = Math.min(...a.occasionDates.map(od => od.daysUntil));
                const bMinDays = Math.min(...b.occasionDates.map(od => od.daysUntil));
                return aMinDays - bMinDays;
            });

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

    const handleGiftClick = (friend) => {
        setSelectedFriend(friend);
        setIsGiftModalOpen(true);
    };

    const handlePostcardClick = () => {
        window.open('https://digipostal.ir/', '_blank');
    };

    return (
        <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: '#f5f7fa',
            p: 3
        }}>
            <Box
                sx={{
                    width: '1200px',
                    minWidth: '1200px',
                    margin: '0 auto'
                }}
            >
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: { xs: 2, md: 4 }, 
                        mb: 4, 
                        borderRadius: 3,
                        background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
                        width: '100%'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'stretch', sm: 'center' }, 
                        gap: 2,
                        mb: 4,
                        width: '100%'
                    }}>
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{ 
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                textAlign: { xs: 'center', sm: 'right' }
                            }}
                        >
                            لیست محبوبان
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={handleAdd}
                            sx={{
                                background: `linear-gradient(45deg, #fe663f 30%, #ff8568 90%)`,
                                color: 'white',
                                padding: '12px 32px',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(254, 102, 63, 0.2)',
                                '&:hover': {
                                    background: `linear-gradient(45deg, #e55736 30%, #fe663f 90%)`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(254, 102, 63, 0.3)'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            افزودن محبوب جدید
                        </Button>
                    </Box>

                    <Box sx={{ 
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 3,
                        '& > *': {
                            minWidth: 0
                        }
                    }}>
                        {friends.map((friend) => (
                            <Paper
                                key={friend.id}
                                elevation={2}
                                sx={{
                                    width: '100%',
                                    height: '500px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 2.5,
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                                    },
                                    background: 'linear-gradient(to bottom, #ffffff, #fafafa)'
                                }}
                            >
                                {/* بخش اطلاعات اصلی */}
                                <Box sx={{ 
                                    mb: 2.5,
                                    width: '100%'
                                }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'flex-start',
                                        gap: 2,
                                        mb: 2,
                                        width: '100%'
                                    }}>
                                        <Avatar 
                                            src={RELATION_AVATARS[friend.relation]}
                                            sx={{ 
                                                width: 64, 
                                                height: 64,
                                                bgcolor: friend.gender === 'male' ? '#029f68' : '#fe663f',
                                                boxShadow: (() => {
                                                    if (friend.occasionDates.some(od => od.daysUntil === 0)) {
                                                        return '0 0 0 3px #f44336, 0 4px 12px rgba(0,0,0,0.1)';
                                                    }
                                                    if (friend.occasionDates.some(od => od.daysUntil <= 3)) {
                                                        return '0 0 0 3px #ff8a80, 0 4px 12px rgba(0,0,0,0.1)';
                                                    }
                                                    if (friend.occasionDates.some(od => od.daysUntil <= 10)) {
                                                        return '0 0 0 3px #ff9800, 0 4px 12px rgba(0,0,0,0.1)';
                                                    }
                                                    if (friend.occasionDates.some(od => od.daysUntil <= 30)) {
                                                        return '0 0 0 3px #ffd54f, 0 4px 12px rgba(0,0,0,0.1)';
                                                    }
                                                    return '0 4px 12px rgba(0,0,0,0.1)';
                                                })(),
                                                animation: (() => {
                                                    if (friend.occasionDates.some(od => od.daysUntil === 0)) {
                                                        return `${pulseAnimation} 1s infinite`;
                                                    }
                                                    if (friend.occasionDates.some(od => od.daysUntil <= 3)) {
                                                        return `${pulseAnimation} 2s infinite`;
                                                    }
                                                    return 'none';
                                                })(),
                                                transition: 'all 0.3s ease',
                                                flexShrink: 0
                                            }}
                                        >
                                            {friend.name ? friend.name[0] : ''}
                                        </Avatar>
                                        <Box sx={{ 
                                            flex: 1,
                                            minWidth: 0 // برای جلوگیری از سرریز محتوا
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 0.5
                                            }}>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        fontWeight: 'bold',
                                                        color: '#2c3e50',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {friend.name}
                                                </Typography>
                                                <Chip 
                                                    label={RELATIONS[friend.relation]}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: friend.gender === 'male' ? 'rgba(2, 159, 104, 0.1)' : 'rgba(254, 102, 63, 0.1)',
                                                        color: friend.gender === 'male' ? '#029f68' : '#fe663f',
                                                        height: '20px'
                                                    }}
                                                />
                                            </Box>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                <CakeIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                                                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {formatDate(friend.birthdate)} • {calculateAge(friend.birthdate)} ساله
                                                </span>
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                </Box>

                                {/* بخش مناسبت‌ها */}
                                <Box 
                                    sx={{ 
                                        flex: 1,
                                        overflowY: 'auto',
                                        mb: 2,
                                        width: '100%',
                                        maxHeight: '350px',
                                        '&::-webkit-scrollbar': {
                                            width: '4px',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            background: '#f1f1f1',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            background: '#bbb',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb:hover': {
                                            background: '#999',
                                        },
                                    }}
                                >
                                    {friend.occasionDates && friend.occasionDates.map((occasion, index) => {
                                        const daysUntil = occasion.daysUntil;
                                        const occasionStyle = getOccasionStyle(daysUntil);
                                        
                                        return (
                                            <Box 
                                                key={`${occasion.occasion}-${index}`}
                                                sx={{
                                                    p: 2,
                                                    mb: 1.5,
                                                    borderRadius: 2,
                                                    ...occasionStyle,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1
                                                }}
                                            >
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        fontWeight: 500,
                                                        gap: 1
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {React.createElement(OCCASION_ICONS[occasion.occasion] || CelebrationIcon, { 
                                                            style: { fontSize: 20 } 
                                                        })}
                                                        <span>{OCCASIONS[occasion.occasion]}</span>
                                                    </Box>
                                                    <span className="occasion-days" style={{ fontSize: '0.85rem' }}>
                                                        {daysUntil === 0 ? 'امروز!' : 
                                                         daysUntil > 0 ? `${daysUntil} روز مانده` : ''}
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
                                                            onClick={() => handleGiftClick(friend)}
                                                            startIcon={<GiftIcon />}
                                                            sx={{
                                                                color: '#029f68',
                                                                borderColor: '#029f68',
                                                                borderRadius: 1.5,
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
                                                            onClick={handlePostcardClick}
                                                            startIcon={<EmailIcon />}
                                                            sx={{
                                                                color: '#3b82f6',
                                                                borderColor: '#3b82f6',
                                                                borderRadius: 1.5,
                                                                '&:hover': { 
                                                                    bgcolor: 'rgba(59, 130, 246, 0.1)',
                                                                    borderColor: '#3b82f6',
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
                                    width: '100%'
                                }}>
                                    <Tooltip title="ویرایش" arrow TransitionComponent={Fade}>
                                        <IconButton 
                                            onClick={() => handleEdit(friend.id)}
                                            sx={{ 
                                                color: '#029f68',
                                                '&:hover': { 
                                                    bgcolor: 'rgba(2, 159, 104, 0.1)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.2s ease'
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
                                                '&:hover': { 
                                                    bgcolor: 'rgba(254, 102, 63, 0.1)',
                                                    transform: 'translateY(-2px)'
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        ))}
                        {/* اضافه کردن المان‌های خالی برای حفظ گرید در صورت کم بودن تعداد کارت‌ها */}
                        {[...Array(Math.max(0, 3 - (friends.length % 3 || 3)))].map((_, index) => (
                            <Box key={`empty-${index}`} sx={{ height: 0 }} />
                        ))}
                    </Box>
                </Paper>
            </Box>

            <GiftSuggestionModal
                open={isGiftModalOpen}
                onClose={() => setIsGiftModalOpen(false)}
                friend={selectedFriend}
            />
        </Box>
    );
};

export default FriendList; 