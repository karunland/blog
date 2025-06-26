import { Box, Container, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import MuiLink from '@mui/material/Link';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Blog. Tüm hakları saklıdır.
          </Typography>

          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink
              href="https://github.com/karunland/blog"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <GitHubIcon /> Source
            </MuiLink>
            <Link
              component={RouterLink}
              to="/privacy-policy"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Gizlilik Politikası
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Kullanım Koşulları
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};