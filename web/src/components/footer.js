import { Box, Container, Typography } from '@mui/material';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; 2024 BlogApp. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </Box>
  );
}