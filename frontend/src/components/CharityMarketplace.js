import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const CharityMarketplace = () => {
    return (
        <Box
            sx={{
                py: 6,
                px: 2,
                background: 'linear-gradient(45deg, rgba(254, 80, 0, 0.15) 0%, rgba(254, 102, 63, 0.15) 100%)',
                borderRadius: 3,
                my: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                flexDirection: { xs: 'column', md: 'row' }
            }}
        >
            <Typography
                variant="h4"
                component="h2"
                sx={{
                    fontWeight: 'bold',
                    color: '#FE5000',
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    margin: 0
                }}
            >
                اولین بازارچه خیریه آنلاین ایران
            </Typography>
            
            <Button
                variant="contained"
                href="https://basalam.com/"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ShoppingCartIcon />}
                sx={{
                    background: 'linear-gradient(45deg, #FE5000 30%, #fe663f 90%)',
                    color: 'white',
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    whiteSpace: 'nowrap',
                    marginLeft: 30,
                    '&:hover': {
                        background: 'linear-gradient(45deg, #fe663f 30%, #FE5000 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(254, 80, 0, 0.25)',
                    },
                    transition: 'all 0.3s ease'
                }}
            >
                خرید کن و نیکی
            </Button>
        </Box>
    );
};

export default CharityMarketplace; 