import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
    });
    if (response.data.access_token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const isAuthenticated = () => {
    const user = getCurrentUser();
    return !!user;
};

const AuthService = {
    login,
    logout,
    getCurrentUser,
    isAuthenticated
};

export default AuthService; 