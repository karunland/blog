import { Grid, Container, Typography, Button, Box } from '@mui/material';
import { BlogList } from '../components/blogList';
import { Link as RouterLink } from 'react-router-dom';

export function Home() {
  return (
    <>
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Typography variant="h1" className="hero-title">
            DevLog'a Hoş Geldiniz
          </Typography>
          <Typography variant="h2" className="hero-subtitle">
            Geliştiricilerin Deneyim ve Bilgi Paylaşım Platformu
          </Typography>
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'var(--orange)',
              color: 'var(--cream)',
              '&:hover': {
                bgcolor: 'var(--red)',
              },
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: '11px',
            }}
          >
            Hemen Başla
          </Button>
        </Container>
      </Box>
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: 'var(--navy)',
            mb: 4,
            fontWeight: 600,
            textAlign: 'center'
          }}
        >
          Son Yazılar
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BlogList />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
