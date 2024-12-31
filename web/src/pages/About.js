import { Container, Paper, Typography, Box, Avatar, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export function About() {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={1} sx={{ p: 5, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Hakkımda
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Avatar
            src="/profile-image.jpg"
            alt="Profil"
            sx={{ width: 150, height: 150 }}
          />
        </Box>

        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
          Merhaba, ben [İsim Soyisim]
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Kim Bu Blogger?
          </Typography>
          <Typography variant="body1" paragraph>
            Yazılım geliştirme tutkusu ile başlayan yolculuğumda, 
            sürekli öğrenme ve kendimi geliştirme fırsatları arıyorum. 
            Bu blog, teknik deneyimlerimi ve öğrendiklerimi paylaşmak 
            için oluşturduğum bir platform.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Neler Yapıyorum?
          </Typography>
          <Typography variant="body1" paragraph>
            Full-stack web geliştirme alanında çalışıyorum. 
            React, .NET Core ve modern web teknolojileri üzerine 
            yazılar yazıyor, deneyimlerimi paylaşıyorum.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            İletişim
          </Typography>
          <Typography variant="body1" paragraph>
            Benimle iletişime geçmek veya projelerim hakkında 
            daha fazla bilgi almak için:
          </Typography>
          <Grid container spacing={2} sx={{ pl: 2 }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon />
                <Typography>example@email.com</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <GitHubIcon />
                <Typography>github.com/username</Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkedInIcon />
                <Typography>linkedin.com/in/username</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
} 