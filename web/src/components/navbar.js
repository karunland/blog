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
  Menu,
  MenuItem,
  Container,
  Box,
  useScrollTrigger,
  Slide,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import '../styles/Navbar.css';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getDisplayName = () => {
    if (!user) return '';
    return user.firstName || "Hesabım";
  };

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { text: 'Çıkış Yap', onClick: logout, requiresAuth: true },
    { text: 'Giriş Yap', path: '/login', requiresAuth: false },
    { text: 'Kaydol', path: '/register', requiresAuth: false }
  ];

  const renderMenu = () => (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {menuItems
        .filter(item => item.requiresAuth === Boolean(user))
        .map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              handleClose();
              if (item.onClick) item.onClick();
            }}
            component={item.path ? Link : 'button'}
            to={item.path}
          >
            {item.text}
          </MenuItem>
        ))
      }
    </Menu>
  );

  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          <ListItem component={Link} to="/about">
            <ListItemText primary="Hakkımda" />
          </ListItem>
          {menuItems
            .filter(item => item.requiresAuth === Boolean(user))
            .map((item, index) => (
              <ListItem
                key={index}
                component={item.path ? Link : 'button'}
                to={item.path}
                onClick={() => {
                  handleMobileMenuToggle();
                  if (item.onClick) item.onClick();
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))
          }
        </List>
      </Box>
    </Drawer>
  );

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        elevation={isScrolled ? 4 : 0}
        sx={{ 
          bgcolor: 'background.paper',
          color: 'text.primary'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold'
              }}
            >
              BlogApp
            </Typography>

            {!isMobile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  component={Link}
                  to="/about"
                  color="inherit"
                >
                  Hakkımda
                </Button>

                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  size="small"
                >
                  {isDarkMode ? <BsSun /> : <BsMoon />}
                </IconButton>

                <Button
                  color="inherit"
                  onClick={handleMenu}
                >
                  {user ? getDisplayName() : 'Hesap'}
                </Button>
                {renderMenu()}
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  size="small"
                >
                  {isDarkMode ? <BsSun /> : <BsMoon />}
                </IconButton>
                <IconButton
                  color="inherit"
                  onClick={handleMobileMenuToggle}
                  edge="end"
                >
                  <MenuIcon />
                </IconButton>
                {renderMobileDrawer()}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}