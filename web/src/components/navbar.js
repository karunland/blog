import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
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
  useTheme,
  Stack,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Link
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import appIconAnimation from '../assets/icon.json';
import { useLottie } from 'lottie-react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useColorMode } from '../App';

const pages = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Blog', path: '/blog' }
];

const settings = [
  { name: 'Profil', path: '/dashboard/profile' },
  { name: 'Blog Yazılarım', path: '/dashboard/blogs' },
  { name: 'Yeni Blog', path: '/dashboard/blogs/new' }
];

export function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const theme = useTheme();
  const colorMode = useColorMode();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isDark, setIsDark] = useState(theme.palette.mode === 'dark');

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleCloseUserMenu();
  };

  // Lottie animasyonu için options
  const options = {
    animationData: appIconAnimation,
    loop: true,
    autoplay: false,
  };

  const { View: LottieView, play, stop } = useLottie(options);

  useEffect(() => {
    setIsDark(theme.palette.mode === 'dark');
  }, [theme.palette.mode]);

  const toggleTheme = () => {
    colorMode.toggleColorMode();
  };

  return (
    <AppBar 
      position="fixed"
      elevation={0}
      sx={{ 
        bgcolor: theme.palette.mode === 'dark'
          ? 'rgba(18, 18, 18, 0.85)'
          : 'rgba(18, 18, 18, 0.4)',
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
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Sol taraf - Logo ve başlık */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 100, 
                mr: 2,
                cursor: 'pointer',
                marginRight: '0px',
                transition: 'width 0.3s ease'
              }}
              onMouseEnter={() => play()}
              onMouseLeave={() => stop()}
            >
              {LottieView}
            </Box>
              <Typography
              variant="h5"
                noWrap
              component={RouterLink}
              to="/"
                sx={{
                fontFamily: 'monospace',
                  fontWeight: 700,
                letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                DEVLOG
              </Typography>
          </Box>

          {/* Sağ taraf - Menü öğeleri, tema değiştirici ve kullanıcı menüsü */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Desktop menü */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => navigate(page.path)}
                  sx={{ color: 'inherit' }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Tema değiştirme butonu */}
            {/* <IconButton
              onClick={toggleTheme}
              sx={{
                ml: 2,
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </IconButton> */}

            {/* Mobile menü */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
                aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                  horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                  horizontal: 'right',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              >
                {pages.map((page) => (
                  <MenuItem 
                    key={page.name} 
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate(page.path);
              }}
            >
                    <Typography textAlign="center">{page.name}</Typography>
              </MenuItem>
                ))}
            </Menu>
          </Box>

            {/* Kullanıcı menüsü */}
            <Box sx={{ ml: 2 }}>
              {isAuthenticated ? (
              <>
                  <Tooltip title="">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar alt={user?.userName} src={user?.imageUrl} />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => (
                      <MenuItem key={setting.name} onClick={() => handleMenuClick(setting.path)}>
                        <Typography textAlign="center">{setting.name}</Typography>
                      </MenuItem>
                    ))}
                    <MenuItem onClick={() => {
                      handleCloseUserMenu();
                      dispatch(clearUser());
                      localStorage.removeItem('token');
                      navigate('/');
                    }}>
                      <Typography textAlign="center">Çıkış Yap</Typography>
                    </MenuItem>
                  </Menu>
              </>
            ) : (
              <Button
                  onClick={() => navigate('/login')}
                  sx={{ color: 'inherit' }}
              >
                  Giriş Yap
              </Button>
            )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}