import axios from 'axios';

const API_URL = 'http://localhost:8000';

// تنظیم axios برای استفاده از توکن
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// سرویس احراز هویت
const authService = {
  // درخواست OTP
  requestOTP: async (phoneNumber) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/request-otp`, {
        phone_number: phoneNumber
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // تأیید OTP و ورود
  verifyOTP: async (phoneNumber, code) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/verify-otp`, {
        phone_number: phoneNumber,
        code: code
      });
      
      // ذخیره توکن در localStorage
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.user_id,
          username: response.data.username
        }));
        setAuthToken(response.data.access_token);
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // خروج از سیستم
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
  },

  // بررسی وضعیت لاگین
  isLoggedIn: () => {
    return localStorage.getItem('token') !== null;
  },

  // دریافت کاربر فعلی
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// سرویس کاربران
const userService = {
  // دریافت لیست کاربران
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // دریافت اطلاعات یک کاربر
  getUser: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

// سرویس دوستان
const friendService = {
  // دریافت لیست دوستان
  getFriends: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // دریافت اطلاعات یک دوست
  getFriend: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/friends/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // ایجاد دوست جدید
  createFriend: async (friendData) => {
    try {
      const response = await axios.post(`${API_URL}/api/friends`, friendData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // به‌روزرسانی اطلاعات دوست
  updateFriend: async (id, friendData) => {
    try {
      const response = await axios.put(`${API_URL}/api/friends/${id}`, friendData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // حذف دوست
  deleteFriend: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/friends/${id}`);
      return true;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

// سرویس هدایا
const giftService = {
  // دریافت لیست هدایا
  getGifts: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/gifts`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // دریافت اطلاعات یک هدیه
  getGift: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/gifts/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  
  // ایجاد هدیه جدید
  createGift: async (giftData) => {
    try {
      const response = await axios.post(`${API_URL}/api/gifts`, giftData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  
  // به‌روزرسانی اطلاعات هدیه
  updateGift: async (id, giftData) => {
    try {
      const response = await axios.put(`${API_URL}/api/gifts/${id}`, giftData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
  
  // حذف هدیه
  deleteGift: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/gifts/${id}`);
      return true;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // ارسال هدیه به یک دوست
  sendGift: async (friendId, giftId) => {
    try {
      const response = await axios.post(`${API_URL}/api/gifts/send`, {
        friend_id: friendId,
        gift_id: giftId
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // دریافت لیست هدایای ارسال شده
  getSentGifts: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/gifts/sent`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

// سرویس باسلام
const basalamService = {
  // جستجوی محصولات
  searchProducts: async (params = {}) => {
    try {
      const { query = '', start = 0, rows = 20, ...filters } = params;
      const response = await axios.post(`${API_URL}/api/basalam/products/search`, {
        query,
        start,
        rows,
        ...filters
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // دریافت محصولات پیش‌فرض
  getDefaultProducts: async (start = 0, rows = 20) => {
    try {
      const response = await axios.get(`${API_URL}/api/basalam/products/search`, {
        params: { start, rows }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  // دریافت جزئیات محصول
  getProductDetails: async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/api/basalam/products/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
};

// تنظیم توکن از localStorage در هنگام بارگذاری
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

export { authService, userService, friendService, giftService, basalamService }; 