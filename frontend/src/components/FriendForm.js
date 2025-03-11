import React, { useState, useEffect } from 'react';
import { 
    TextField, 
    Button, 
    Box, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    Typography,
    Paper,
    IconButton,
    Chip,
    FormHelperText,
    OutlinedInput
} from '@mui/material';
import { 
    ArrowBack as ArrowBackIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { createFriend, updateFriend, getFriend } from '../services/friendService';
import { useNavigate, useParams } from 'react-router-dom';

// تعریف انواع نسبت‌ها
const RELATIONS = {
    PARENT_MOTHER: 'مادر',
    PARENT_FATHER: 'پدر',
    SPOUSE: 'همسر',
    CHILD: 'فرزند',
    FRIEND: 'رفیق',
    RELATIVE: 'اقوام'
};

// تعریف انواع مناسبت‌ها
const OCCASIONS = {
    BIRTHDAY: 'تولد',
    MOTHERS_DAY: 'روز مادر',
    FATHERS_DAY: 'روز پدر',
    DAUGHTERS_DAY: 'روز دختر',
    SONS_DAY: 'روز پسر',
    WEDDING_ANNIVERSARY: 'سالگرد ازدواج',
    ENGAGEMENT_ANNIVERSARY: 'سالگرد عقد',
    MENS_DAY: 'روز مرد',
    STUDENTS_DAY: 'روز دانش‌آموز'
};

// تعریف مناسبت‌های مجاز برای هر نسبت
const ALLOWED_OCCASIONS = {
    PARENT_MOTHER: [
        'MOTHERS_DAY'
    ],
    PARENT_FATHER: [
        'FATHERS_DAY'
    ],
    SPOUSE: (gender) => gender === 'male' ? [
        'MENS_DAY',
        'WEDDING_ANNIVERSARY',
        'ENGAGEMENT_ANNIVERSARY'
    ] : [
        'WEDDING_ANNIVERSARY',
        'ENGAGEMENT_ANNIVERSARY'
    ],
    CHILD: (gender) => gender === 'female' ? [
        'DAUGHTERS_DAY',
        'STUDENTS_DAY'
    ] : [
        'SONS_DAY',
        'STUDENTS_DAY'
    ],
    FRIEND: [],
    RELATIVE: []
};

// تعریف جنسیت پیش‌فرض برای نسبت‌ها
const DEFAULT_GENDER = {
    PARENT_MOTHER: 'female',
    PARENT_FATHER: 'male'
};

const FriendForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        relation: '',
        birthdate: '',
    });
    const [occasionDates, setOccasionDates] = useState([{ occasion: '', date: '' }]);
    const [age, setAge] = useState(null);

    useEffect(() => {
        if (id && id !== 'new') {
            loadFriend();
        }
    }, [id]);

    // محاسبه سن بر اساس تاریخ تولد
    const calculateAge = (birthdate) => {
        if (!birthdate) return null;
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // به روزرسانی سن هنگام تغییر تاریخ تولد
    useEffect(() => {
        if (formData.birthdate) {
            setAge(calculateAge(formData.birthdate));
        }
    }, [formData.birthdate]);

    const loadFriend = async () => {
        try {
            const friend = await getFriend(id);
            setFormData({
                name: friend.name,
                relation: friend.relation,
                birthdate: friend.birthdate,
            });
            setOccasionDates(friend.occasionDates || [{ occasion: '', date: '' }]);
            if (friend.birthdate) {
                setAge(calculateAge(friend.birthdate));
            }
        } catch (err) {
            setError('خطا در بارگذاری اطلاعات دوست');
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // پاک کردن مناسبت‌های قبلی در صورت تغییر نسبت
        if (name === 'relation') {
            setOccasionDates([{ occasion: '', date: '' }]);
        }
        
        setError('');
    };

    const handleOccasionAdd = () => {
        setOccasionDates(prev => [...prev, { occasion: '', date: '' }]);
    };

    const handleOccasionChange = (index, field, value) => {
        setOccasionDates(prev => {
            const newDates = [...prev];
            newDates[index] = {
                ...newDates[index],
                [field]: value
            };
            return newDates;
        });
    };

    const handleOccasionRemove = (index) => {
        setOccasionDates(prev => prev.filter((_, i) => i !== index));
    };

    // دریافت لیست مناسبت‌های مجاز برای نسبت
    const getAllowedOccasions = () => {
        if (!formData.relation) return [];
        const occasions = ALLOWED_OCCASIONS[formData.relation];
        // چون جنسیت رو حذف کردیم، فقط مناسبت‌های ثابت رو برمی‌گردونیم
        return Array.isArray(occasions) ? occasions : occasions('male');
    };

    const validateName = (name) => {
        if (!name) return 'نام دوست الزامی است';
        if (name.length < 2) return 'نام باید حداقل 2 حرف باشد';
        if (name.length > 50) return 'نام نباید بیشتر از 50 حرف باشد';
        if (!/^[\u0600-\u06FF\s]+$/.test(name)) return 'لطفاً نام را به فارسی وارد کنید';
        return '';
    };

    const validateDate = (date) => {
        if (!date) return 'تاریخ الزامی است';
        
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(date)) return 'فرمت تاریخ باید YYYY-MM-DD باشد';
        
        const d = new Date(date);
        if (isNaN(d.getTime())) return 'تاریخ وارد شده معتبر نیست';
        
        if (d > new Date()) return 'تاریخ نمی‌تواند در آینده باشد';

        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 150);
        if (d < minDate) return 'تاریخ خیلی قدیمی است';
        
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // اعتبارسنجی فرم
        const nameError = validateName(formData.name);
        if (nameError) {
            setError(nameError);
            return;
        }

        // اضافه کردن تولد به عنوان مناسبت پیش‌فرض
        let updatedOccasionDates = [...occasionDates];
        const hasBirthday = updatedOccasionDates.some(od => od.occasion === 'BIRTHDAY');
        if (!hasBirthday && formData.birthdate) {
            updatedOccasionDates.push({
                occasion: 'BIRTHDAY',
                date: formData.birthdate
            });
        }

        try {
            setLoading(true);
            setError('');
            
            const friendData = {
                ...formData,
                occasionDates: updatedOccasionDates
            };

            if (id && id !== 'new') {
                await updateFriend(id, friendData);
            } else {
                await createFriend(friendData);
            }
            
            navigate('/friends');
        } catch (error) {
            console.error('Error submitting form:', error);
            
            if (error.response?.status === 400) {
                // خطای اعتبارسنجی سرور
                const serverError = error.response.data;
                if (serverError.detail) {
                    if (serverError.detail.includes('name')) {
                        setError('نام وارد شده معتبر نیست. لطفاً نام را به فارسی وارد کنید');
                    } else if (serverError.detail.includes('relation')) {
                        setError('نسبت انتخاب شده معتبر نیست');
                    } else if (serverError.detail.includes('occasion')) {
                        setError('مناسبت انتخاب شده با نسبت همخوانی ندارد');
                    } else if (serverError.detail.includes('date')) {
                        setError('تاریخ وارد شده معتبر نیست');
                    } else {
                        setError(serverError.detail);
                    }
                } else {
                    setError('لطفاً اطلاعات وارد شده را بررسی کنید');
                }
            } else if (error.response?.status === 409) {
                setError('این دوست قبلاً در لیست شما ثبت شده است');
            } else if (error.message === 'Network Error') {
                setError('خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید');
            } else {
                setError('متأسفانه مشکلی در ثبت اطلاعات پیش آمده. لطفاً دوباره تلاش کنید');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', p: 3 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton 
                        onClick={() => navigate('/friends')}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        {id ? 'ویرایش محبوب' : 'افزودن محبوب جدید'}
                    </Typography>
                </Box>

                {error && (
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            bgcolor: 'error.light',
                            color: 'error.main',
                            p: 2,
                            mb: 3,
                            borderRadius: 1
                        }}
                    >
                        <Typography>{error}</Typography>
                    </Paper>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="نام محبوب"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        error={!!error && error.includes('نام')}
                        helperText={error && error.includes('نام') ? error : ''}
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="تاریخ تولد"
                        type="date"
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            max: new Date().toISOString().split('T')[0] // محدود کردن به امروز
                        }}
                        required
                        error={!!error && error.includes('تاریخ')}
                        helperText={age !== null ? `سن: ${age} سال` : ''}
                        sx={{ mb: 2 }}
                    />

                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel sx={{ background: 'white', px: 1 }}>نسبت</InputLabel>
                        <Select
                            name="relation"
                            value={formData.relation}
                            onChange={handleChange}
                            required
                            sx={{ borderRadius: 2 }}
                        >
                            {Object.entries(RELATIONS).map(([key, value]) => (
                                <MenuItem key={key} value={key}>{value}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>مناسبت‌ها و تاریخ‌ها (اختیاری)</Typography>
                        
                        {occasionDates.map((item, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                                <FormControl sx={{ flex: 1 }}>
                                    <InputLabel sx={{ background: 'white', px: 1 }}>مناسبت</InputLabel>
                                    <Select
                                        value={item.occasion}
                                        onChange={(e) => handleOccasionChange(index, 'occasion', e.target.value)}
                                        required={false}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {getAllowedOccasions().map(occasionKey => (
                                            <MenuItem key={occasionKey} value={occasionKey}>
                                                {OCCASIONS[occasionKey]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleOccasionChange(index, 'date', e.target.value)}
                                    required={false}
                                    sx={{ flex: 1 }}
                                    InputProps={{
                                        sx: { borderRadius: 2 }
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                        sx: { 
                                            background: 'white',
                                            px: 1
                                        }
                                    }}
                                />

                                <IconButton 
                                    onClick={() => handleOccasionRemove(index)}
                                    sx={{ 
                                        color: '#fe663f',
                                        '&:hover': { bgcolor: 'rgba(254, 102, 63, 0.1)' }
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        ))}
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            تولد به صورت خودکار برای همه ثبت می‌شود. سایر مناسبت‌ها را در صورت نیاز اضافه کنید.
                        </Typography>

                        <Button
                            variant="outlined"
                            onClick={handleOccasionAdd}
                            startIcon={<AddIcon />}
                            sx={{
                                borderColor: '#fe663f',
                                color: '#fe663f',
                                '&:hover': {
                                    borderColor: '#e55736',
                                    color: '#e55736',
                                    bgcolor: 'rgba(254, 102, 63, 0.05)'
                                }
                            }}
                        >
                            افزودن مناسبت جدید
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                background: `linear-gradient(45deg, #fe663f 30%, #ff8568 90%)`,
                                color: 'white',
                                padding: '12px',
                                '&:hover': {
                                    background: `linear-gradient(45deg, #e55736 30%, #fe663f 90%)`,
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 24px rgba(254, 102, 63, 0.3)'
                                },
                                boxShadow: '0 4px 16px rgba(254, 102, 63, 0.2)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {loading ? 'در حال ذخیره...' : (id ? 'به‌روزرسانی' : 'افزودن')}
                        </Button>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => navigate('/friends')}
                            disabled={loading}
                            sx={{
                                borderColor: '#fe663f',
                                color: '#fe663f',
                                '&:hover': {
                                    borderColor: '#e55736',
                                    color: '#e55736',
                                    bgcolor: 'rgba(254, 102, 63, 0.05)'
                                }
                            }}
                        >
                            انصراف
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default FriendForm; 