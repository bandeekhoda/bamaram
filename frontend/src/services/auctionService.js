import api from './api';

export const getAuctions = async () => {
  try {
    const response = await api.get('/auctions');
    return response.data;
  } catch (error) {
    console.error('Error fetching auctions:', error);
    throw error;
  }
};

export const getActiveAuctions = async () => {
  try {
    const response = await api.get('/auctions/active');
    return response.data;
  } catch (error) {
    console.error('Error fetching active auctions:', error);
    throw error;
  }
};

export const getAuction = async (auctionId) => {
  try {
    const response = await api.get(`/auctions/${auctionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching auction:', error);
    throw error;
  }
};

export const createAuction = async (auctionData) => {
  try {
    const response = await api.post('/auctions', auctionData);
    return response.data;
  } catch (error) {
    console.error('Error creating auction:', error);
    throw error;
  }
};

export const updateAuction = async (auctionId, auctionData) => {
  try {
    const response = await api.put(`/auctions/${auctionId}`, auctionData);
    return response.data;
  } catch (error) {
    console.error('Error updating auction:', error);
    throw error;
  }
};

export const deleteAuction = async (auctionId) => {
  try {
    const response = await api.delete(`/auctions/${auctionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting auction:', error);
    throw error;
  }
};

export const createBid = async (auctionId, bidData) => {
  try {
    const response = await api.post(`/auctions/${auctionId}/bids`, bidData);
    return response.data;
  } catch (error) {
    console.error('Error creating bid:', error);
    throw error;
  }
};

export const getAuctionBids = async (auctionId) => {
  try {
    const response = await api.get(`/auctions/${auctionId}/bids`);
    return response.data;
  } catch (error) {
    console.error('Error fetching auction bids:', error);
    throw error;
  }
}; 