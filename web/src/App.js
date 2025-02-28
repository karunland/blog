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
import { PublicRoute } from './components/PublicRoute';
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
import { AddBlog } from './pages/dashboard/Add';
import { MyBlogs } from './pages/dashboard/Blogs';
import { Profile } from './pages/dashboard/Profile';
import { DashboardLayout } from './components/DashboardLayout';
import { Navbar } from './components/navbar';
import { Toaster } from 'react-hot-toast';
import { Landing } from './pages/Landing';
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function AppContent() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/google-callback" element={<GoogleCallback />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Blog />} />
        <Route path="/about" element={<About />} />
        <Route path="/motivasyon" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/:slug" element={<BlogDetail />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/google-login" element={<GoogleLoginBlog />} />
        <Route path="/verify/:code" element={<EmailVerification />} />
        <Route path="*" element={<NotFound />} />
        <Route 
          path="/dashboard/*" 
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="add-blog/:slug" element={<AddBlog />} />
          <Route path="blogs" element={<MyBlogs />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  const [mode, setMode] = useState('dark');
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
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
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)'
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
          <Toaster position="top-center" />
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  return useContext(ColorModeContext);
}
