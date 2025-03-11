import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Vazir, Arial, sans-serif',
    allVariants: {
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.5rem',
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.7,
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    button: {
      fontFamily: 'Vazir, Arial, sans-serif',
      fontWeight: 500,
    },
    caption: {
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    overline: {
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    subtitle1: {
      fontFamily: 'Vazir, Arial, sans-serif',
    },
    subtitle2: {
      fontFamily: 'Vazir, Arial, sans-serif',
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#029f68',
      light: '#02c17f',
      dark: '#028c5c',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fe663f',
      light: '#ff8568',
      dark: '#e55736',
      contrastText: '#fff',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#263238',
      secondary: '#546E7A',
    },
    action: {
      active: '#2E7D32',
      hover: 'rgba(46, 125, 50, 0.08)',
      selected: 'rgba(46, 125, 50, 0.16)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      disabledBackground: 'rgba(0, 0, 0, 0.12)',
    },
    divider: 'rgba(46, 125, 50, 0.12)',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#2E7D32',
          '&:hover': {
            color: '#1B5E20',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#2E7D32',
          '&:hover': {
            backgroundColor: 'rgba(46, 125, 50, 0.08)',
          },
        },
      },
    },
  },
});

export default theme; 