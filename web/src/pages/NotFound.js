import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button } from '@mui/material';
import notFoundImage from '../assets/404.png';

export function NotFound() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 3
        }}
      >
        <Box
          component="img"
          src={notFoundImage}
          alt="404 Not Found"
          sx={{
            width: '100%',
            maxWidth: 400,
            height: 'auto',
            mb: 2
          }}
        />
        
        <Typography 
          variant="h2" 
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </Typography>

        <Typography 
          variant="h4" 
          component="h2"
          sx={{
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Sayfa Bulunamadı
        </Typography>

        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{
            maxWidth: 450,
            mb: 2
          }}
        >
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfaya dönerek devam edebilirsiniz.
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              transform: 'translateY(-2px)',
              transition: 'transform 0.2s'
            }
          }}
        >
          Ana Sayfaya Dön
        </Button>
      </Box>
    </Container>
  );
}