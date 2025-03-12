import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Paper,
  TextField,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { PhotoCamera, Delete, Edit, Save, Cancel } from '@mui/icons-material';
import { authService } from '../services/api';

const Profile = () => {
  const user = authService.getCurrentUser();
  const [profileImage, setProfileImage] = useState(user?.profileImage || '/images/profile.png');
  const [username, setUsername] = useState(user?.username || '');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('لطفاً یک فایل تصویر انتخاب کنید');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('حجم تصویر نباید بیشتر از 2 مگابایت باشد');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Upload image to server
      const response = await authService.updateProfileImage(formData);
      setProfileImage(response.image_url);
      
      // Update user data in localStorage
      const currentUser = authService.getCurrentUser();
      authService.updateUserData({
        ...currentUser,
        profileImage: response.image_url
      });
      setSuccessMessage('تصویر پروفایل با موفقیت به‌روزرسانی شد');
    } catch (err) {
      setError('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.');
      console.error('Error uploading image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    setLoading(true);
    setError('');

    try {
      await authService.removeProfileImage();
      setProfileImage('/images/profile.png');
      
      // Update user data in localStorage
      const currentUser = authService.getCurrentUser();
      authService.updateUserData({
        ...currentUser,
        profileImage: '/images/profile.png'
      });
      setSuccessMessage('تصویر پروفایل با موفقیت حذف شد');
    } catch (err) {
      setError('خطا در حذف تصویر. لطفاً دوباره تلاش کنید.');
      console.error('Error removing image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameEdit = () => {
    setIsEditingUsername(true);
    setNewUsername(username);
  };

  const handleUsernameSave = async () => {
    if (!newUsername.trim()) {
      setError('نام کاربری نمی‌تواند خالی باشد');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update username on server
      await authService.updateUsername(newUsername);
      
      // Update user data in localStorage
      const currentUser = authService.getCurrentUser();
      authService.updateUserData({
        ...currentUser,
        username: newUsername
      });
      
      setUsername(newUsername);
      setIsEditingUsername(false);
      setSuccessMessage('نام کاربری با موفقیت به‌روزرسانی شد');
    } catch (err) {
      setError('خطا در به‌روزرسانی نام کاربری. لطفاً دوباره تلاش کنید.');
      console.error('Error updating username:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameCancel = () => {
    setIsEditingUsername(false);
    setNewUsername(username);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          پروفایل کاربری
        </Typography>

        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
          <Avatar
            src={profileImage}
            alt={username || 'کاربر'}
            sx={{
              width: 150,
              height: 150,
              border: '4px solid',
              borderColor: 'primary.main'
            }}
          />
          <input
            accept="image/*"
            type="file"
            id="profile-image-upload"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            disabled={loading}
          />
          <label htmlFor="profile-image-upload">
            <IconButton
              component="span"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              disabled={loading}
            >
              <PhotoCamera />
            </IconButton>
          </label>
          {profileImage !== '/images/profile.png' && (
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                backgroundColor: 'error.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'error.dark'
                }
              }}
              disabled={loading}
            >
              <Delete />
            </IconButton>
          )}
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px'
              }}
            />
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          {isEditingUsername ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <TextField
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="نام کاربری جدید"
                disabled={loading}
                sx={{ minWidth: 200 }}
              />
              <IconButton 
                onClick={handleUsernameSave}
                color="primary"
                disabled={loading}
              >
                <Save />
              </IconButton>
              <IconButton 
                onClick={handleUsernameCancel}
                color="error"
                disabled={loading}
              >
                <Cancel />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <Typography variant="h6">
                {username || 'کاربر'}
              </Typography>
              <IconButton 
                onClick={handleUsernameEdit}
                color="primary"
                disabled={loading}
              >
                <Edit />
              </IconButton>
            </Box>
          )}
        </Box>

        <Typography color="text.secondary" gutterBottom>
          {user?.phone_number}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            برای تغییر عکس پروفایل، روی آیکون دوربین کلیک کنید
          </Typography>
          <Typography variant="body2" color="text.secondary">
            حداکثر حجم مجاز: 2 مگابایت
          </Typography>
        </Box>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccessMessage('')} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Profile; 