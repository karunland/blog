import { Container, Box, Typography, Grid, Paper, Stack, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import aboutImage from '../assets/about-thumbnail.jpeg';

export function About() {
  const technologies = [
    { 
      name: 'Frontend', 
      items: [
        'React.js',
        'Material-UI (MUI)',
        'React Router'
      ] 
    },
    { 
      name: 'Backend', 
      items: [
        '.NET Core',
        'Entity Framework',
        'PostgreSQL'
      ] 
    },
    { 
      name: 'DevOps & Araçlar', 
      items: [
        'Docker',
        'Nginx',
        'Git'
      ] 
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6}>
        {/* Hero Section */}
        <Grid item xs={12}>
          <Box
            component="img"
            src={aboutImage}
            alt="About Blog Platform"
            sx={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: 2,
            }}
          />
        </Grid>

        {/* Mission Section */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: '100%',
              bgcolor: 'rgba(255,255,255,0.03)',
              borderRadius: 2,
              border: 1,
              borderColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
              Proje Hakkında
            </Typography>
            <Typography sx={{ color: '#bdbdbd', mb: 3 }}>
              Bu platform, modern web teknolojilerini kullanarak geliştirilmiş bir blog sitesidir.
              Frontend tarafında React.js ve Material-UI kullanılarak kullanıcı dostu bir arayüz,
              backend tarafında ise .NET Core kullanıldı.
              Kullanıcılar kolayca blog yazıları paylaşabilir, düzenleyebilir ve diğer yazarların
              içeriklerini keşfedebilir.
              
            </Typography>
            <Typography sx={{ color: '#bdbdbd', mb: 3 }}>Projenin kaynak kodlarına <Link to="https://github.com/karunland/blog">buradan</Link> ulaşabilirsiniz.</Typography>
          </Paper>
        </Grid>

        {/* Creator Info */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: '100%',
              bgcolor: 'rgba(255,255,255,0.03)',
              borderRadius: 2,
              border: 1,
              borderColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: '#fff' }}>
              Geliştirici
            </Typography>
            <Typography sx={{ color: '#bdbdbd', mb: 2 }}>
              Harun Korkmaz
            </Typography>
            <Typography sx={{ color: '#bdbdbd', mb: 3 }}>
              Elektronik ve Haberleşme Mühendisi
              Backend Developer
              Kocaeli Üniversitesi (2019)
            </Typography>
            <Stack direction="row" spacing={2}>
              <MuiLink
                href="https://github.com/karunland"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <GitHubIcon /> GitHub
              </MuiLink>
              <MuiLink
                href="mailto:contact@hkorkmaz.com"
                sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <EmailIcon /> Email
              </MuiLink>
            </Stack>
          </Paper>
        </Grid>

        {/* Technologies Section */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {technologies.map((category) => (
              <Grid item xs={12} md={4} key={category.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                    {category.name}
                  </Typography>
                  <Stack spacing={1}>
                    {category.items.map((item) => (
                      <Typography key={item} sx={{ color: '#bdbdbd' }}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
} 