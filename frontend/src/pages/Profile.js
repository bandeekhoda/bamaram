import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Paper
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { authService } from '../services/api';

const Profile = () => {
  const user = authService.getCurrentUser();
  const [profileImage, setProfileImage] = useState(user?.profileImage || '/images/profile.png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    } catch (err) {
      setError('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.');
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
    } catch (err) {
      setError('خطا در حذف تصویر. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          پروفایل کاربری
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
          <Avatar
            src={profileImage}
            alt={user?.username || 'کاربر'}
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
        </Box>

        <Typography variant="h6" gutterBottom>
          {user?.username || 'کاربر'}
        </Typography>
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
      </Paper>
    </Container>
  );
};

export default Profile; 