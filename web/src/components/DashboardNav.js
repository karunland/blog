import { useNavigate, useLocation } from 'react-router-dom';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';

export function DashboardNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const pages = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Blog Ekle', path: '/dashboard/add-blog', icon: <AddIcon /> },
    { name: 'Bloglarım', path: '/dashboard/blogs', icon: <ArticleIcon /> },
    { name: 'Profil', path: '/dashboard/profile', icon: <PersonIcon /> }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        left: theme.spacing(3),
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Paper
        elevation={3}
        sx={{
          py: 2,
          px: 1.5,
          borderRadius: 3,
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(8px)',
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateX(5px)'
          }
        }}
      >
        <List>
          {pages.map((page) => {
            const isActive = location.pathname === page.path;
            return (
              <ListItem
                key={page.name}
                onClick={() => navigate(page.path)}
                sx={{
                  cursor: 'pointer',
                  mb: 1,
                  borderRadius: 2,
                  px: 2,
                  backgroundColor: isActive 
                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.1)
                    : 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive
                      ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.2 : 0.1)
                      : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05)
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 36,
                    color: isActive ? 'primary.main' : 'inherit'
                  }}
                >
                  {page.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={page.name}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}