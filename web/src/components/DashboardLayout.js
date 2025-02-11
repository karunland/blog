import { Box, Container } from '@mui/material';
import { DashboardNav } from './DashboardNav';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
  // get theme info from local storage
  const isDarkMode = localStorage.getItem('theme') === 'dark';

  return (
    <>
      <DashboardNav />
      <Box 
        sx={{ 
        //   minHeight: '100vh',
          backgroundColor: isDarkMode ? 'transparent' : '#ffffff',
        //   pt: 3
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </>
  );
} 