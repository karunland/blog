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
  Link,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import appIconAnimation from '../assets/icon.json';
import { useLottie } from 'lottie-react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useColorMode } from '../App';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

const pages = [
  { name: 'Ana Sayfa', path: '/' },
  { name: 'Blog', path: '/blog' }
];

const settings = [
  { name: 'Profil', path: '/dashboard/profile', icon: <PersonIcon fontSize="small" /> },
  { name: 'Blog Yazılarım', path: '/dashboard/blogs', icon: <ArticleIcon fontSize="small" /> },
  { name: 'Yeni Blog', path: '/dashboard/blogs/new', icon: <AddIcon fontSize="small" /> }
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
          ? 'rgba(18, 18, 18, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: 1,
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)',
        color: 'text.primary',
        transition: 'all 0.2s ease-in-out',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        height: '72px'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '72px', justifyContent: 'space-between' }}>
          {/* Logo ve başlık */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component={RouterLink}
              to="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <Box 
                sx={{ 
                  width: 64,
                  height: 'auto',
                  mr: 1.5,
                  cursor: 'pointer',
                  transition: 'width 0.2s ease'
                }}
                onMouseEnter={() => play()}
                onMouseLeave={() => stop()}
              >
                {LottieView}
              </Box>
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.05rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                DEVLOG
                <Box component="span" sx={{ opacity: 0.7 }}>.ONLINE</Box>
              </Typography>
            </Box>
          </Box>

          {/* Menü öğeleri ve kullanıcı */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Desktop menü */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => navigate(page.path)}
                  sx={{ 
                    color: 'inherit',
                    fontSize: '1rem',
                    textTransform: 'none',
                    px: 2.5,
                    py: 1
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* Mobile menü */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="medium"
                aria-label="menu"
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
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 180,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5
                    }
                  }
                }}
              >
                {pages.map((page) => (
                  <MenuItem 
                    key={page.name} 
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate(page.path);
                    }}
                  >
                    <Typography variant="body1">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Kullanıcı menüsü */}
            <Box>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Hesap ayarları">
                    <IconButton 
                      onClick={handleOpenUserMenu} 
                      sx={{ 
                        p: 0,
                        width: 40,
                        height: 40,
                        border: '2px solid transparent',
                        '&:hover': {
                          border: `2px solid ${theme.palette.primary.main}`
                        }
                      }}
                    >
                      <Avatar 
                        alt={user?.userName} 
                        src={user?.imageUrl}
                        sx={{ width: 36, height: 36 }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorElUser}
                    id="account-menu"
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    onClick={handleCloseUserMenu}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 220,
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1.5
                        }
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Hoş geldin,
                      </Typography>
                      <Typography variant="subtitle1" fontWeight="500">
                        {user?.userName}
                      </Typography>
                    </Box>
                    <Divider />
                    {settings.map((setting) => (
                      <MenuItem 
                        key={setting.name} 
                        onClick={() => handleMenuClick(setting.path)}
                      >
                        <ListItemIcon>
                          {setting.icon}
                        </ListItemIcon>
                        <ListItemText primary={setting.name} />
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem 
                      onClick={() => {
                        handleCloseUserMenu();
                        dispatch(clearUser());
                        localStorage.removeItem('token');
                        navigate('/');
                      }}
                    >
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Çıkış Yap" />
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    color: 'inherit',
                    borderColor: 'currentColor',
                    textTransform: 'none',
                    fontSize: '1rem',
                    height: 40,
                    px: 3
                  }}
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