import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
  Box,
  Drawer,
  useMediaQuery,
  useTheme as useMuiTheme,
  Stack
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../styles/Navbar.css';
import { ReactComponent as Logo } from '../assets/logo.svg';

const menuItems = [
  { title: 'Ana Sayfa', path: '/' },
  { title: 'Blog', path: '/blog' },
  { title: 'Hakkında', path: '/about' }
];

export function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      PaperProps={{
        sx: {
          width: 250,
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          {menuItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuToggle}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              {item.title}
            </Button>
          ))}
          {user ? (
            <>
              <Button
                component={Link}
                to="/dashboard"
                onClick={handleMobileMenuToggle}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  handleMobileMenuToggle();
                  logout();
                }}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                onClick={handleMobileMenuToggle}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Giriş Yap
              </Button>
              <Button
                component={Link}
                to="/register"
                onClick={handleMobileMenuToggle}
                fullWidth
                variant="contained"
                sx={{ justifyContent: 'flex-start' }}
              >
                Kaydol
              </Button>
            </>
          )}
          <IconButton
            onClick={toggleTheme}
            size="small"
            sx={{ alignSelf: 'flex-start' }}
          >
            {isDarkMode ? <BsSun /> : <BsMoon />}
          </IconButton>
        </Stack>
      </Box>
    </Drawer>
  );

  return (
    <AppBar 
      position="fixed"
      elevation={0}
      sx={{ 
        bgcolor: theme.palette.mode === 'dark' 
          ? isScrolled 
            ? 'rgba(18, 18, 18, 0.85)'
            : 'rgba(18, 18, 18, 0.4)'
          : isScrolled 
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(10px)',
        borderBottom: 1,
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)',
        color: 'text.primary',
        transition: 'all 0.3s ease-in-out',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{ 
            justifyContent: 'space-between',
            minHeight: { xs: '64px', sm: '70px' }
          }}
        >
          {/* Logo ve İsim */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Logo style={{ width: 40, height: 40 }} />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}
            >
              DevLog
            </Typography>
          </Box>

          {/* Desktop Menu */}
          {!isMobile ? (
            <Stack direction="row" spacing={2} alignItems="center">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {item.title}
                </Button>
              ))}
              {user ? (
                <>
                  <Button
                    component={Link}
                    to="/dashboard"
                    color="inherit"
                    sx={{ 
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={logout}
                    color="inherit"
                    sx={{ 
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Çıkış Yap
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    sx={{ 
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Giriş Yap
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: '20px',
                      px: 3,
                      bgcolor: theme.palette.mode === 'dark' 
                        ? 'primary.main' 
                        : 'primary.main',
                      '&:hover': {
                        bgcolor: theme.palette.mode === 'dark'
                          ? 'primary.dark'
                          : 'primary.dark'
                      }
                    }}
                  >
                    Kaydol
                  </Button>
                </>
              )}
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                size="small"
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {isDarkMode ? <BsSun /> : <BsMoon />}
              </IconButton>
            </Stack>
          ) : (
            // Mobile Menu Icon
            <IconButton
              color="inherit"
              onClick={handleMobileMenuToggle}
              edge="end"
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>
      {renderMobileDrawer()}
    </AppBar>
  );
}