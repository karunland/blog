import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  useTheme
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddIcon from '@mui/icons-material/Add';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';

export function DashboardNav() {
  const navigate = useNavigate();
  const theme = useTheme();

  const pages = [
    { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon sx={{mr: 1}} /> },
    { name: 'Blog Ekle', path: '/dashboard/add-blog', icon: <AddIcon sx={{mr: 1}} /> },
    { name: 'Bloglarım', path: '/dashboard/blogs', icon: <ArticleIcon sx={{mr: 1}} /> },
    { name: 'Profil', path: '/dashboard/profile', icon: <PersonIcon sx={{mr: 1}} /> }
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        top: 72,
        bgcolor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: 1,
        borderColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '64px' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => navigate(page.path)}
                sx={{
                  color: 'inherit',
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {page.icon}
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}