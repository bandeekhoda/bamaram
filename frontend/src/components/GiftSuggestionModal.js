import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Grid,
  Tooltip,
  Button
} from '@mui/material';
import {
  Close as CloseIcon,
  Checkroom as ClothesIcon,
  Watch as WatchIcon,
  Kitchen as KitchenIcon,
  Deck as DecorIcon,
  Toys as ToysIcon,
  School as SchoolIcon,
  Backpack as BagIcon,
  SportsEsports as GamingIcon,
  SportsSoccer as SportsIcon,
} from '@mui/icons-material';

const GIFT_SUGGESTIONS = {
  PARENT_MOTHER: [
    { icon: ClothesIcon, label: 'لباس زنانه', link: 'https://basalam.com/subcategory/women-apparel' },
    { icon: WatchIcon, label: 'ساعت زنانه', link: 'https://basalam.com/s?q=%D8%B3%D8%A7%D8%B9%D8%AA%20%D8%B2%D9%86%D8%A7%D9%86%D9%87' },
    { icon: DecorIcon, label: 'دکوری', link: 'https://basalam.com/subcategory/decorative' },
    { icon: KitchenIcon, label: 'لوازم آشپرخانه', link: 'https://basalam.com/subcategory/kitchen-appliances' },
  ],
  PARENT_FATHER: [
    { icon: WatchIcon, label: 'ساعت مردانه', link: 'https://basalam.com/search/subcategory/men-watch' },
    { icon: ClothesIcon, label: 'تی شرت', link: 'https://basalam.com/search/subcategory/men-t-shirt' },
    { icon: BagIcon, label: 'کمربند', link: 'https://basalam.com/s?q=%DA%A9%D9%85%D8%B1%D8%A8%D9%86%D8%AF' },
    { icon: BagIcon, label: 'کیف', link: 'https://basalam.com/search/subcategory/men-bag' },
  ],
  CHILD_YOUNG: [
    { icon: ToysIcon, label: 'اسباب بازی', link: 'https://basalam.com/subcategory/toys' },
    { icon: ClothesIcon, label: 'لباس دخترانه', link: 'https://basalam.com/subcategory/girl-apparel' },
    { icon: ClothesIcon, label: 'لباس پسرانه', link: 'https://basalam.com/subcategory/boy-apparel' },
  ],
  CHILD_TEEN: [
    { icon: GamingIcon, label: 'بازی فکری', link: 'https://basalam.com/s?q=%D8%A8%D8%A7%D8%B2%DB%8C%20%D9%81%DA%A9%D8%B1%DB%8C' },
    { icon: SchoolIcon, label: 'لوازم التحریر', link: 'https://basalam.com/subcategory/stationery' },
    { icon: BagIcon, label: 'کیف پسرانه', link: 'https://basalam.com/s?q=%DA%A9%DB%8C%D9%81%20%D9%BE%D8%B3%D8%B1%D8%A7%D9%86%D9%87' },
    { icon: BagIcon, label: 'کیف دخترانه', link: 'https://basalam.com/s?q=%DA%A9%DB%8C%D9%81%20%D8%AF%D8%AE%D8%AA%D8%B1%D8%A7%D9%86%D9%87' },
  ],
  SPOUSE: [
    { icon: WatchIcon, label: 'ساعت مردانه', link: 'https://basalam.com/search/subcategory/men-watch' },
    { icon: ClothesIcon, label: 'تی شرت مردانه', link: 'https://basalam.com/search/subcategory/men-t-shirt' },
    { icon: BagIcon, label: 'کمربند مردانه', link: 'https://basalam.com/s?q=%DA%A9%D9%85%D8%B1%D8%A8%D9%86%D8%AF' },
    { icon: BagIcon, label: 'کیف مردانه', link: 'https://basalam.com/search/subcategory/men-bag' },
    { icon: ClothesIcon, label: 'لباس زنانه', link: 'https://basalam.com/subcategory/women-apparel' },
    { icon: WatchIcon, label: 'ساعت زنانه', link: 'https://basalam.com/s?q=%D8%B3%D8%A7%D8%B9%D8%AA%20%D8%B2%D9%86%D8%A7%D9%86%D9%87' },
    { icon: KitchenIcon, label: 'لوازم آشپرخانه', link: 'https://basalam.com/subcategory/kitchen-appliances' },
    { icon: BagIcon, label: 'کیف زنانه', link: 'https://basalam.com/s?q=%DA%A9%DB%8C%D9%81%20%D8%B2%D9%86%D8%A7%D9%86%D9%87' },
  ],
  FRIEND: [
    { icon: WatchIcon, label: 'ساعت مردانه', link: 'https://basalam.com/search/subcategory/men-watch' },
    { icon: ClothesIcon, label: 'تی شرت مردانه', link: 'https://basalam.com/search/subcategory/men-t-shirt' },
    { icon: BagIcon, label: 'کیف مردانه', link: 'https://basalam.com/search/subcategory/men-bag' },
    { icon: WatchIcon, label: 'ساعت زنانه', link: 'https://basalam.com/s?q=%D8%B3%D8%A7%D8%B9%D8%AA%20%D8%B2%D9%86%D8%A7%D9%86%D9%87' },
    { icon: KitchenIcon, label: 'لوازم آشپرخانه', link: 'https://basalam.com/subcategory/kitchen-appliances' },
    { icon: BagIcon, label: 'کیف زنانه', link: 'https://basalam.com/s?q=%DA%A9%DB%8C%D9%81%20%D8%B2%D9%86%D8%A7%D9%86%D9%87' },
    { icon: SportsIcon, label: 'لوازم ورزشی', link: 'https://basalam.com/subcategory/sporting-goods' },
  ],
  RELATIVE: [
    { icon: WatchIcon, label: 'ساعت مردانه', link: 'https://basalam.com/search/subcategory/men-watch' },
    { icon: ClothesIcon, label: 'تی شرت مردانه', link: 'https://basalam.com/search/subcategory/men-t-shirt' },
    { icon: BagIcon, label: 'کیف مردانه', link: 'https://basalam.com/search/subcategory/men-bag' },
    { icon: WatchIcon, label: 'ساعت زنانه', link: 'https://basalam.com/s?q=%D8%B3%D8%A7%D8%B9%D8%AA%20%D8%B2%D9%86%D8%A7%D9%86%D9%87' },
    { icon: KitchenIcon, label: 'لوازم آشپرخانه', link: 'https://basalam.com/subcategory/kitchen-appliances' },
    { icon: BagIcon, label: 'کیف زنانه', link: 'https://basalam.com/s?q=%DA%A9%DB%8C%D9%81%20%D8%B2%D9%86%D8%A7%D9%86%D9%87' },
    { icon: SportsIcon, label: 'لوازم ورزشی', link: 'https://basalam.com/subcategory/sporting-goods' },
  ],
};

const GiftSuggestionModal = ({ open, onClose, friend }) => {
  const getGiftSuggestions = () => {
    if (!friend) return [];

    if (friend.relation === 'CHILD') {
      const age = calculateAge(friend.birthdate);
      return age <= 7 ? GIFT_SUGGESTIONS.CHILD_YOUNG : GIFT_SUGGESTIONS.CHILD_TEEN;
    }

    return GIFT_SUGGESTIONS[friend.relation] || [];
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="gift-suggestion-modal"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: '70%', lg: '60%' },
        maxWidth: '800px',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            پیشنهاد هدیه برای {friend?.name}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          {getGiftSuggestions().map((suggestion, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Tooltip title={suggestion.label} arrow>
                <Button
                  variant="outlined"
                  onClick={() => window.open(suggestion.link, '_blank')}
                  sx={{
                    width: '100%',
                    height: '100px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 2,
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    '&:hover': {
                      borderColor: '#029f68',
                      color: '#029f68',
                      bgcolor: 'rgba(2, 159, 104, 0.08)',
                      transform: 'translateY(-4px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {React.createElement(suggestion.icon, { 
                    sx: { fontSize: 32 }
                  })}
                  <Typography variant="caption" sx={{ 
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {suggestion.label}
                  </Typography>
                </Button>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default GiftSuggestionModal; 