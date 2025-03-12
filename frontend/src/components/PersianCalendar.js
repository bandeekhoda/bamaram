import React, { useState, useEffect } from 'react';
import { 
    Paper, 
    Grid, 
    Typography, 
    Box,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Chip
} from '@mui/material';
import {
    ChevronRight as ChevronRightIcon,
    ChevronLeft as ChevronLeftIcon,
    Event as EventIcon,
    Celebration as CelebrationIcon
} from '@mui/icons-material';
import moment from 'moment-jalaali';

const WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
const MONTHS = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const PersianCalendar = ({ onDateSelect }) => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [selectedDate, setSelectedDate] = useState(null);
    const [holidays, setHolidays] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedHolidays, setSelectedHolidays] = useState([]);

    useEffect(() => {
        setHolidays({});
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(currentDate.clone().subtract(1, 'jMonth'));
    };

    const handleNextMonth = () => {
        setCurrentDate(currentDate.clone().add(1, 'jMonth'));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        const dayHolidays = holidays[date.jDate()] || [];
        setSelectedHolidays(dayHolidays);
        setDialogOpen(true);
    };

    const handleAddOccasion = () => {
        if (selectedDate && onDateSelect) {
            onDateSelect(selectedDate.format('YYYY-MM-DD'));
        }
        setDialogOpen(false);
    };

    const renderCalendarDays = () => {
        const year = currentDate.jYear();
        const month = currentDate.jMonth();
        const daysInMonth = moment.jDaysInMonth(year, month);
        const firstDayOfMonth = moment(`${year}/${month + 1}/1`, 'jYYYY/jM/jD').day();
        
        const days = [];
        const today = moment();

        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<Box key={`empty-${i}`} sx={{ p: 1 }} />);
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = moment(`${year}/${month + 1}/${day}`, 'jYYYY/jM/jD');
            const isToday = date.isSame(today, 'day');
            const hasHoliday = holidays[day];

            days.push(
                <Box
                    key={day}
                    onClick={() => handleDateClick(date)}
                    sx={{
                        p: 0,
                        height: '26px',
                        width: '26px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        borderRadius: isToday ? '2px' : '50%',
                        transition: 'all 0.2s ease',
                        ...(isToday && {
                            bgcolor: '#FF4D00',
                            color: 'white',
                            fontWeight: 'bold',
                            boxShadow: '0 2px 8px rgba(255, 77, 0, 0.4)',
                            transform: 'scale(1.1)',
                            height: '3px',
                            marginTop: '8px'
                        }),
                        '&:hover': {
                            bgcolor: isToday ? '#FF6B00' : 'rgba(255, 77, 0, 0.08)',
                            transform: isToday ? 'scale(1.1)' : 'scale(1.1)',
                            boxShadow: isToday ? '0 4px 12px rgba(255, 77, 0, 0.5)' : 'none'
                        }
                    }}
                >
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            fontSize: '0.7rem',
                            fontWeight: isToday ? 'bold' : 'normal',
                            lineHeight: 1,
                            userSelect: 'none',
                            transform: isToday ? 'translateY(-17px)' : 'none',
                            position: isToday ? 'absolute' : 'static',
                            top: isToday ? '0' : 'auto'
                        }}
                    >
                        {day}
                    </Typography>
                    {hasHoliday && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -2,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 3,
                                height: 3,
                                borderRadius: '50%',
                                bgcolor: '#FF6B00'
                            }}
                        />
                    )}
                </Box>
            );
        }

        return days;
    };

    return (
        <Paper elevation={0} sx={{ 
            pt: 0.5,
            pb: 3,
            px: 3,
            borderRadius: 3,
            height: '100%',
            width: '100%',
            bgcolor: 'transparent',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header with current date */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 0,
                mb: 0.25
            }}>
                <IconButton 
                    onClick={handlePrevMonth}
                    size="small"
                    sx={{ color: '#2c665a' }}
                >
                    <ChevronRightIcon />
                </IconButton>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 'bold',
                        color: '#2c665a',
                        fontSize: '1.1rem'
                    }}
                >
                    {MONTHS[currentDate.jMonth()]} {currentDate.jYear()}
                </Typography>
                <IconButton 
                    onClick={handleNextMonth}
                    size="small"
                    sx={{ color: '#2c665a' }}
                >
                    <ChevronLeftIcon />
                </IconButton>
            </Box>

            {/* Weekday headers */}
            <Grid container spacing={0} sx={{ mb: 0.25 }}>
                {WEEKDAYS.map(day => (
                    <Grid item xs key={day}>
                        <Typography 
                            align="center" 
                            sx={{ 
                                fontWeight: 'medium',
                                color: day === 'جمعه' ? '#FF4D00' : '#2c665a',
                                fontSize: '0.6rem',
                                mb: 0.5,
                                userSelect: 'none'
                            }}
                        >
                            {day.slice(0, 1)}
                        </Typography>
                    </Grid>
                ))}
            </Grid>

            {/* Calendar grid */}
            <Grid container spacing={0} sx={{ 
                flex: 1,
                width: '100%',
                mt: 0.25,
                '& .MuiGrid-item': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    height: '32px',
                    p: 0
                }
            }}>
                {renderCalendarDays().map((day, index) => (
                    <Grid item key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        width: 'calc(100% / 7)',
                        p: 0
                    }}>
                        {day}
                    </Grid>
                ))}
            </Grid>

            {/* Dialog for showing holidays and adding occasions */}
            <Dialog 
                open={dialogOpen} 
                onClose={() => setDialogOpen(false)} 
                maxWidth="xs" 
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.95)'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    textAlign: 'center',
                    color: '#2c665a',
                    fontWeight: 'bold',
                    pb: 1
                }}>
                    {selectedDate && `${selectedDate.jDate()} ${MONTHS[selectedDate.jMonth()]} ${selectedDate.jYear()}`}
                </DialogTitle>
                <DialogContent>
                    {selectedHolidays.length > 0 ? (
                        <List>
                            {selectedHolidays.map((holiday, index) => (
                                <ListItem key={index}>
                                    <ListItemText 
                                        primary={holiday.occasion}
                                        secondary={holiday.description}
                                        primaryTypographyProps={{
                                            sx: { color: '#2c665a', fontWeight: 'medium' }
                                        }}
                                    />
                                    <Chip 
                                        icon={<CelebrationIcon />}
                                        label="مناسبت رسمی"
                                        sx={{
                                            bgcolor: 'rgba(255, 77, 0, 0.1)',
                                            color: '#FF4D00',
                                            borderColor: '#FF4D00'
                                        }}
                                        variant="outlined"
                                        size="small"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography 
                            color="text.secondary"
                            sx={{ textAlign: 'center', py: 2 }}
                        >
                            مناسبت رسمی برای این روز ثبت نشده است
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button 
                        onClick={handleAddOccasion}
                        startIcon={<EventIcon />}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(45deg, #029f68 30%, #06c17f 90%)',
                            color: 'white',
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        افزودن مناسبت
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default PersianCalendar; 