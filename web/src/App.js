import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { Home } from './pages/Home';
import { BlogDetail } from './components/BlogDetail';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { Search } from './pages/Search';
import { Box, Container } from '@mui/material';
import { Register } from './pages/Register';
import { PrivateRoute } from './components/PrivateRoute';
import { NotFound } from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { Blog } from './pages/Blog';
import { GoogleLoginBlog } from './components/GoogleLogin';
import EmailVerification from './pages/EmailVerification';
import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { useAuth } from './contexts/AuthContext';

// Tema context'ini oluştur
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function AppContent() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          bgcolor: 'background.default',
          marginTop: '50px'
        }}
      >
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard/*" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/blog" element={<Blog />} />
            <Route path="/search" element={<Search />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/google-login" element={<GoogleLoginBlog />} />
            <Route path="/verify/:code" element={<EmailVerification />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}

export default function App() {
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      return savedMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [mode, setMode] = useState(getInitialMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light tema renkleri
                primary: {
                  main: '#2563eb', // Modern mavi
                  light: '#3b82f6',
                  dark: '#1d4ed8',
                },
                secondary: {
                  main: '#4f46e5', // Indigo
                  light: '#6366f1',
                  dark: '#4338ca',
                },
                error: {
                  main: '#dc2626', // Kırmızı
                },
                background: {
                  default: '#f8fafc', // Çok açık gri
                  paper: '#ffffff',
                },
                text: {
                  primary: '#0f172a', // Koyu slate
                  secondary: '#475569', // Orta slate
                },
                divider: 'rgba(226, 232, 240, 1)', // Açık slate
              }
            : {
                // Dark tema renkleri
                primary: {
                  main: '#3b82f6', // Parlak mavi
                  light: '#60a5fa',
                  dark: '#2563eb',
                },
                secondary: {
                  main: '#6366f1', // Parlak indigo
                  light: '#818cf8',
                  dark: '#4f46e5',
                },
                error: {
                  main: '#ef4444', // Parlak kırmızı
                },
                background: {
                  default: '#0f172a', // Koyu slate
                  paper: '#1e293b', // Orta koyu slate
                },
                text: {
                  primary: '#f1f5f9', // Çok açık slate
                  secondary: '#cbd5e1', // Açık slate
                },
                divider: 'rgba(51, 65, 85, 1)', // Slate
              }),
        },
        typography: {
          fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: '0.5rem',
                fontWeight: 600,
                padding: '0.8rem 2rem',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: '1rem',
              },
            },
          },
          // Gölge efektleri
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'dark' 
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
              },
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

// Custom hook'u oluştur
export function useColorMode() {
  return useContext(ColorModeContext);
}
