import React, { useState } from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import AuctionList from '../components/AuctionList';
import CreateAuction from '../components/CreateAuction';

const AuctionsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAuctionCreated = () => {
    // Switch to the auctions list tab after creating a new auction
    setActiveTab(0);
  };

  return (
    <Container maxWidth="lg">
      <Box py={3}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="حراج‌های فعال" />
          <Tab label="ایجاد حراج جدید" />
        </Tabs>

        {activeTab === 0 && <AuctionList />}
        {activeTab === 1 && <CreateAuction onSuccess={handleAuctionCreated} />}
      </Box>
    </Container>
  );
};

export default AuctionsPage; 