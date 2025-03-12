import axios from 'axios';

const API_URL = 'http://localhost:8000/api/friends';

// تنظیم پیکربندی پیش‌فرض axios
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false
});

// تابع کمکی برای تنظیم توکن
const setAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
    }
    return false;
};

// تابع کمکی برای مدیریت خطاها
const handleError = (error) => {
    console.error('API Error:', error);
    if (error.response) {
        console.error('Response Error:', error.response.data);
        if (error.response.status === 401) {
            // خطای عدم احراز هویت - هدایت به صفحه لاگین
            window.location.href = '/login';
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }
        throw error;
    } else if (error.request) {
        console.error('Request Error:', error.request);
        throw new Error('خطا در ارتباط با سرور. لطفاً از اتصال اینترنت خود مطمئن شوید.');
    } else {
        console.error('Error:', error.message);
        throw new Error('خطای غیرمنتظره رخ داده است.');
    }
};

export const getFriends = async () => {
    try {
        if (!setAuthHeader()) {
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }
        console.log('Fetching friends...');
        const response = await axiosInstance.get('/');
        console.log('Friends fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching friends:', error);
        throw handleError(error);
    }
};

export const getFriend = async (id) => {
    try {
        if (!setAuthHeader()) {
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }
        const response = await axiosInstance.get(`/${id}/`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const createFriend = async (friendData) => {
    try {
        if (!setAuthHeader()) {
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }

        // اطمینان از صحت داده‌ها قبل از ارسال
        const formattedData = {
            name: friendData.name,
            relation: friendData.relation,
            birthdate: friendData.birthdate,
            occasionDates: friendData.occasionDates
                .filter(od => od.occasion && od.date) // حذف مناسبت‌های خالی
                .map(od => ({
                    occasion: od.occasion,
                    date: new Date(od.date).toISOString().split('T')[0]
                }))
        };

        console.log('Formatted data being sent:', formattedData);
        
        const response = await axiosInstance.post('/', formattedData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const updateFriend = async (id, friendData) => {
    try {
        if (!setAuthHeader()) {
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }

        // اطمینان از صحت داده‌ها قبل از ارسال
        const formattedData = {
            name: friendData.name,
            relation: friendData.relation,
            birthdate: friendData.birthdate,
            occasionDates: friendData.occasionDates.map(od => ({
                occasion: od.occasion,
                date: new Date(od.date).toISOString().split('T')[0]
            }))
        };

        const response = await axiosInstance.put(`/${id}/`, formattedData);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteFriend = async (id) => {
    try {
        if (!setAuthHeader()) {
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }
        const response = await axiosInstance.delete(`/${id}/`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};