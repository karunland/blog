import { createTheme } from '@mui/material/styles';

export const getTheme = (isDarkMode) => {
  return createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#0d6efd',
        light: '#3d8bfd',
        dark: '#0a58ca',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6c757d',
        light: '#858e96',
        dark: '#565e64',
        contrastText: '#ffffff',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f8f9fa',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#ffffff' : '#2d3436',
        secondary: isDarkMode ? '#e1e1e1' : '#636e72',
      },
      divider: isDarkMode ? '#2d2d2d' : '#dee2e6',
      action: {
        hover: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDarkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.08)',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            borderColor: isDarkMode ? '#2d2d2d' : '#dee2e6',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            borderColor: isDarkMode ? '#2d2d2d' : '#dee2e6',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
            color: isDarkMode ? '#e1e1e1' : '#2d3436',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#ffffff' : '#2d3436',
            '&.Mui-focused': {
              color: isDarkMode ? '#ffffff' : '#2d3436',
            },
          },
          input: {
            '&::placeholder': {
              color: isDarkMode ? '#b2bec3' : '#636e72',
              opacity: 1,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? '#404040' : '#dee2e6',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDarkMode ? '#606060' : '#b2bec3',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#0d6efd',
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDarkMode ? '#b2bec3' : '#636e72',
            '&.Mui-focused': {
              color: '#0d6efd',
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: isDarkMode ? '#b2bec3' : '#636e72',
          },
        },
      },
    },
    typography: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
    },
  });
}; 