import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createAuction } from '../services/auctionService';

const CreateAuction = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    base_price: '',
    start_time: new Date(),
    end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auctionData = {
        ...formData,
        base_price: parseFloat(formData.base_price),
      };

      await createAuction(auctionData);
      onSuccess?.();
      setFormData({
        title: '',
        description: '',
        base_price: '',
        start_time: new Date(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'خطا در ایجاد حراج');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3}>
      <Box p={3}>
        <Typography variant="h5" gutterBottom>
          ایجاد حراج جدید
        </Typography>

        {error && (
          <Box mb={2}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            name="title"
            label="عنوان حراج"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            name="description"
            label="توضیحات"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />

          <TextField
            name="base_price"
            label="قیمت پایه (تومان)"
            type="number"
            value={formData.base_price}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box my={2}>
              <DateTimePicker
                label="زمان شروع"
                value={formData.start_time}
                onChange={handleDateChange('start_time')}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={new Date()}
              />
            </Box>

            <Box my={2}>
              <DateTimePicker
                label="زمان پایان"
                value={formData.end_time}
                onChange={handleDateChange('end_time')}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={formData.start_time}
              />
            </Box>
          </LocalizationProvider>

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'ایجاد حراج'}
            </Button>
          </Box>
        </form>
      </Box>
    </Paper>
  );
};

export default CreateAuction; 