import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Home } from './pages/Home';
import { BlogDetail } from './components/BlogDetail';
import Login from './pages/Login';
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { Search } from './pages/Search';
import Register from './pages/Register';
import { PrivateRoute } from './components/PrivateRoute';
import { NotFound } from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { Blog } from './pages/Blog';
import { GoogleLoginBlog } from './components/GoogleLogin';
import EmailVerification from './pages/EmailVerification';
import { useEffect, useState, useMemo, createContext, useContext } from 'react';
import { useAuth } from './contexts/AuthContext';
import GoogleCallback from './pages/GoogleCallback';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Tema context'ini oluştur
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function AppContent() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      {/* Auth Routes - Navbar ve Footer olmayan sayfalar */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
      </Route>

      {/* Main Routes - Normal sayfalar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
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
      </Route>
    </Routes>
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
                primary: {
                  main: '#2563eb',
                  light: '#3b82f6',
                  dark: '#1d4ed8',
                },
                secondary: {
                  main: '#4f46e5',
                  light: '#6366f1',
                  dark: '#4338ca',
                },
                error: {
                  main: '#dc2626',
                },
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#0f172a',
                  secondary: '#475569',
                },
                divider: 'rgba(226, 232, 240, 1)',
              }
            : {
                primary: {
                  main: '#3b82f6',
                  light: '#60a5fa',
                  dark: '#2563eb',
                },
                secondary: {
                  main: '#6366f1',
                  light: '#818cf8',
                  dark: '#4f46e5',
                },
                error: {
                  main: '#ef4444',
                },
                background: {
                  default: '#0f172a',
                  paper: '#1e293b',
                },
                text: {
                  primary: '#f1f5f9',
                  secondary: '#cbd5e1',
                },
                divider: 'rgba(51, 65, 85, 1)',
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

export function useColorMode() {
  return useContext(ColorModeContext);
}
