import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// تنظیم پیکربندی پیش‌فرض axios
axios.defaults.headers.common['Content-Type'] = 'application/json';

// تابع کمکی برای تنظیم توکن
const setAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
    }
    return false;
};

// تابع کمکی برای مدیریت خطاها
const handleError = (error) => {
    if (error.response) {
        if (error.response.status === 401) {
            // خطای عدم احراز هویت - هدایت به صفحه لاگین
            window.location.href = '/login';
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }
        throw error;
    } else if (error.request) {
        throw new Error('خطا در ارتباط با سرور. لطفاً از اتصال اینترنت خود مطمئن شوید.');
    } else {
        throw new Error('خطای غیرمنتظره رخ داده است.');
    }
};

export const getFriends = async () => {
    try {
        if (!setAuthHeader()) {
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }
        const response = await axios.get(`${API_URL}/friends/`);
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching friends:', error);
        handleError(error);
    }
};

export const getFriend = async (id) => {
    try {
        if (!setAuthHeader()) {
            throw new Error('لطفاً وارد حساب کاربری خود شوید');
        }
        const response = await axios.get(`${API_URL}/friends/${id}/`);
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
        
        const response = await axios.post(`${API_URL}/friends/`, formattedData);
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

        const response = await axios.put(`${API_URL}/friends/${id}/`, formattedData);
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
        const response = await axios.delete(`${API_URL}/friends/${id}/`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}; 