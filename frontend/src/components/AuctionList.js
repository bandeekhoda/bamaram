import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';
import { getActiveAuctions, createBid, getAuctionBids } from '../services/auctionService';
import { formatPrice, formatDate } from '../utils/formatters';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState(null);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    loadAuctions();
  }, []);

  const loadAuctions = async () => {
    try {
      const data = await getActiveAuctions();
      setAuctions(data);
      setError(null);
    } catch (err) {
      setError('خطا در دریافت لیست حراج‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBidClick = async (auction) => {
    setSelectedAuction(auction);
    setBidAmount('');
    setBidError(null);
    try {
      const bidsData = await getAuctionBids(auction.id);
      setBids(bidsData);
    } catch (err) {
      console.error('Error fetching bids:', err);
    }
  };

  const handleBidClose = () => {
    setSelectedAuction(null);
    setBidAmount('');
    setBidError(null);
  };

  const handleBidSubmit = async () => {
    try {
      const amount = parseFloat(bidAmount);
      if (isNaN(amount) || amount <= selectedAuction.current_price) {
        setBidError('مبلغ پیشنهادی باید بیشتر از قیمت فعلی باشد');
        return;
      }

      await createBid(selectedAuction.id, { amount });
      await loadAuctions();
      handleBidClose();
    } catch (err) {
      setBidError(err.response?.data?.detail || 'خطا در ثبت پیشنهاد');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        حراج‌های فعال
      </Typography>
      <Grid container spacing={3}>
        {auctions.map((auction) => (
          <Grid item xs={12} sm={6} md={4} key={auction.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {auction.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {auction.description}
                </Typography>
                <Typography variant="body1" color="primary">
                  قیمت فعلی: {formatPrice(auction.current_price)} تومان
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  قیمت پایه: {formatPrice(auction.base_price)} تومان
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  پایان حراج: {formatDate(auction.end_time)}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GavelIcon />}
                    onClick={() => handleBidClick(auction)}
                    fullWidth
                  >
                    ثبت پیشنهاد
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedAuction} onClose={handleBidClose} maxWidth="sm" fullWidth>
        <DialogTitle>ثبت پیشنهاد برای {selectedAuction?.title}</DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="body1" gutterBottom>
              قیمت فعلی: {formatPrice(selectedAuction?.current_price)} تومان
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              پیشنهاد شما باید بیشتر از قیمت فعلی باشد
            </Typography>
          </Box>

          <TextField
            autoFocus
            margin="dense"
            label="مبلغ پیشنهادی (تومان)"
            type="number"
            fullWidth
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            error={!!bidError}
            helperText={bidError}
          />

          {bids.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                پیشنهادهای قبلی
              </Typography>
              {bids.map((bid, index) => (
                <Typography key={bid.id} variant="body2" color="textSecondary">
                  {index + 1}. {formatPrice(bid.amount)} تومان
                </Typography>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBidClose} color="primary">
            انصراف
          </Button>
          <Button onClick={handleBidSubmit} color="primary" variant="contained">
            ثبت پیشنهاد
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuctionList; 