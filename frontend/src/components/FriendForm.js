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
    PARENT_MOTHER: ['BIRTHDAY', 'MOTHERS_DAY'],
    PARENT_FATHER: ['BIRTHDAY', 'FATHERS_DAY'],
    SPOUSE: ['BIRTHDAY', 'WEDDING_ANNIVERSARY', 'ENGAGEMENT_ANNIVERSARY'],
    CHILD: ['BIRTHDAY', 'STUDENTS_DAY'],
    FRIEND: ['BIRTHDAY'],
    RELATIVE: ['BIRTHDAY']
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
    const [occasionDates, setOccasionDates] = useState([]);

    useEffect(() => {
        if (id && id !== 'new') {
            loadFriend();
        } else {
            // برای دوست جدید، تولد را به عنوان مناسبت پیش‌فرض اضافه می‌کنیم
            setOccasionDates([{ 
                occasion: 'BIRTHDAY', 
                date: formData.birthdate || '' 
            }]);
        }
    }, [id]);

    // همگام‌سازی تاریخ تولد با مناسبت تولد
    useEffect(() => {
        if (formData.birthdate) {
            setOccasionDates(prev => prev.map(od => 
                od.occasion === 'BIRTHDAY' ? { ...od, date: formData.birthdate } : od
            ));
        }
    }, [formData.birthdate]);

    const loadFriend = async () => {
        try {
            setLoading(true);
            const friend = await getFriend(id);
            setFormData({
                name: friend.name,
                relation: friend.relation,
                birthdate: friend.birthdate,
            });
            // اطمینان از وجود مناسبت تولد
            const occasions = friend.occasionDates || [];
            if (!occasions.some(od => od.occasion === 'BIRTHDAY')) {
                occasions.unshift({ occasion: 'BIRTHDAY', date: friend.birthdate });
            }
            setOccasionDates(occasions);
        } catch (error) {
            setError('خطا در بارگذاری اطلاعات دوست');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // اگر نسبت تغییر کرد، مناسبت‌ها را بروز می‌کنیم
        if (name === 'relation') {
            const allowedOccasions = ALLOWED_OCCASIONS[value] || [];
            console.log('Allowed occasions for relation:', value, ':', allowedOccasions);
            
            // حفظ مناسبت تولد
            const birthdayOccasion = occasionDates.find(od => od.occasion === 'BIRTHDAY');
            
            // ایجاد مناسبت‌های جدید با تاریخ خالی
            const newOccasions = allowedOccasions
                .filter(occasion => occasion !== 'BIRTHDAY')
                .map(occasion => ({ occasion, date: '' }));
            
            // ترکیب مناسبت تولد با مناسبت‌های جدید
            setOccasionDates([birthdayOccasion, ...newOccasions]);
        }

        // اگر تاریخ تولد تغییر کرد، تاریخ مناسبت تولد را بروز می‌کنیم
        if (name === 'birthdate') {
            setOccasionDates(prev => prev.map(od => 
                od.occasion === 'BIRTHDAY' ? { ...od, date: value } : od
            ));
        }
    };

    const handleOccasionChange = (index, field, value) => {
        const newOccasionDates = [...occasionDates];
        newOccasionDates[index] = {
            ...newOccasionDates[index],
            [field]: value
        };
        setOccasionDates(newOccasionDates);
    };

    const addOccasion = () => {
        // حذف مناسبت‌های خالی قبلی
        const filteredOccasions = occasionDates.filter(od => 
            (od.occasion && od.date) || od.occasion === 'BIRTHDAY'
        );
        // افزودن مناسبت جدید
        setOccasionDates([...filteredOccasions, { occasion: '', date: '' }]);
    };

    const removeOccasion = (index) => {
        // حذف مناسبت به جز مناسبت تولد
        if (occasionDates[index].occasion !== 'BIRTHDAY') {
            const newOccasionDates = occasionDates.filter((_, i) => i !== index);
            setOccasionDates(newOccasionDates);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // اعتبارسنجی نام
            const nameRegex = /^[\u0600-\u06FF\s]+$/;
            if (!nameRegex.test(formData.name)) {
                setError('لطفاً نام را فقط با حروف فارسی وارد کنید');
                return;
            }

            // اعتبارسنجی تاریخ تولد
            const birthdate = new Date(formData.birthdate);
            if (isNaN(birthdate.getTime())) {
                setError('تاریخ تولد معتبر نیست');
                return;
            }

            // اعتبارسنجی و پاکسازی مناسبت‌ها
            const validOccasions = occasionDates
                .filter(od => {
                    // حفظ مناسبت تولد و مناسبت‌های کامل
                    const isValid = od.occasion === 'BIRTHDAY' || (od.occasion && od.date);
                    if (!isValid) {
                        console.log('Filtering out incomplete occasion:', od);
                    }
                    return isValid;
                })
                .filter(od => {
                    // بررسی مجاز بودن مناسبت برای نسبت انتخاب شده
                    const allowedOccasions = ALLOWED_OCCASIONS[formData.relation] || [];
                    const isAllowed = od.occasion === 'BIRTHDAY' || allowedOccasions.includes(od.occasion);
                    if (!isAllowed) {
                        console.log('Filtering out invalid occasion for relation:', od, 'Allowed occasions:', allowedOccasions);
                    }
                    return isAllowed;
                })
                // حذف مناسبت‌های تکراری
                .reduce((acc, current) => {
                    const isDuplicate = acc.some(item => item.occasion === current.occasion);
                    if (!isDuplicate) {
                        acc.push(current);
                    } else {
                        console.log('Removing duplicate occasion:', current);
                    }
                    return acc;
                }, [])
                .map(od => {
                    const formattedDate = new Date(od.date).toISOString().split('T')[0];
                    console.log('Formatting occasion date:', od.date, 'to:', formattedDate);
                    return {
                        occasion: od.occasion,
                        date: formattedDate
                    };
                });

            // بررسی وجود مناسبت تولد
            const hasBirthday = validOccasions.some(od => od.occasion === 'BIRTHDAY');
            if (!hasBirthday) {
                validOccasions.push({
                    occasion: 'BIRTHDAY',
                    date: formData.birthdate
                });
            }

            const friendData = {
                name: formData.name.trim(),
                relation: formData.relation,
                birthdate: formData.birthdate,
                occasionDates: validOccasions
            };

            console.log('Final data being sent:', JSON.stringify(friendData, null, 2));

            setLoading(true);
            if (id && id !== 'new') {
                await updateFriend(id, friendData);
            } else {
                await createFriend(friendData);
            }
            
            navigate('/friends');
        } catch (error) {
            console.error('Error submitting form:', error);
            if (error.response?.status === 422) {
                const errorDetails = error.response?.data;
                console.log('Server validation error details:', JSON.stringify(errorDetails, null, 2));
                
                if (Array.isArray(errorDetails?.detail)) {
                    // اگر آرایه‌ای از خطاها در detail دریافت کردیم
                    const errorMessages = errorDetails.detail.map(err => {
                        if (typeof err === 'string') return err;
                        if (err.msg) return err.msg;
                        return JSON.stringify(err);
                    });
                    setError(errorMessages.join('، '));
                } else if (typeof errorDetails?.detail === 'string') {
                    // اگر detail یک رشته ساده بود
                    setError(errorDetails.detail);
                } else if (typeof errorDetails === 'string') {
                    // اگر کل پیام خطا یک رشته بود
                    setError(errorDetails);
                } else {
                    setError('لطفاً همه فیلدها را به درستی پر کنید');
                    console.log('Unknown error format:', errorDetails);
                }
            } else {
                setError('خطا در ذخیره‌سازی اطلاعات');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component={Paper} sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => navigate('/friends')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" component="h1">
                    {id && id !== 'new' ? 'ویرایش دوست' : 'افزودن دوست جدید'}
                </Typography>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {typeof error === 'string' ? error : 'خطا در ثبت اطلاعات'}
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="نام"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                    disabled={loading}
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>نسبت</InputLabel>
                    <Select
                        name="relation"
                        value={formData.relation}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        {Object.entries(RELATIONS).map(([key, value]) => (
                            <MenuItem key={key} value={key}>{value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="تاریخ تولد"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleChange}
                    margin="normal"
                    required
                    disabled={loading}
                    InputLabelProps={{ shrink: true }}
                />

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    مناسبت‌ها
                </Typography>

                {occasionDates.map((od, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <FormControl sx={{ flex: 1 }}>
                            <InputLabel>مناسبت</InputLabel>
                            <Select
                                value={od.occasion}
                                onChange={(e) => handleOccasionChange(index, 'occasion', e.target.value)}
                                disabled={loading || (od.occasion === 'BIRTHDAY' && index === 0)}
                            >
                                {Object.entries(OCCASIONS)
                                    .filter(([key]) => {
                                        if (!formData.relation) return true;
                                        if (key === 'BIRTHDAY') return true;
                                        const allowedOccasions = ALLOWED_OCCASIONS[formData.relation] || [];
                                        return allowedOccasions.includes(key);
                                    })
                                    .map(([key, value]) => (
                                        <MenuItem key={key} value={key}>{value}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>

                        <TextField
                            type="date"
                            value={od.date}
                            onChange={(e) => handleOccasionChange(index, 'date', e.target.value)}
                            disabled={loading || (od.occasion === 'BIRTHDAY' && index === 0)}
                            sx={{ flex: 1 }}
                            InputLabelProps={{ shrink: true }}
                        />

                        {index > 0 && (
                            <IconButton 
                                onClick={() => removeOccasion(index)}
                                disabled={loading || (od.occasion === 'BIRTHDAY' && index === 0)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        )}
                    </Box>
                ))}

                <Button
                    startIcon={<AddIcon />}
                    onClick={addOccasion}
                    disabled={loading || !formData.relation}
                    sx={{ mt: 1, mb: 3 }}
                >
                    افزودن مناسبت
                </Button>

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'در حال ذخیره...' : 'ذخیره'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/friends')}
                        fullWidth
                        disabled={loading}
                    >
                        انصراف
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default FriendForm; 