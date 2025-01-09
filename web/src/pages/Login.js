import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Box, TextField, Button, Typography, Divider, Alert } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { green } from '@mui/material/colors';

export function Login() {
  const navigate = useNavigate();
  const { loginAsync, googleLoginAsync } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    try {
      await loginAsync(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Giriş yapılırken bir hata oluştu.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLoginAsync(credentialResponse.credential);
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setError('Google ile giriş başarısız oldu.');
      console.error('Google login failed:', error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          position: 'relative'
        }}
      >
        {success && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              zIndex: 1,
              borderRadius: 2,
            }}
          >
            <CheckCircleIcon sx={{ color: green[500], fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color={green[700]}>
              Giriş Başarılı!
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Yönlendiriliyorsunuz...
            </Typography>
          </Box>
        )}

        <Typography component="h1" variant="h5" sx={{ color: 'var(--navy)', mb: 3 }}>
          Giriş Yap
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-posta Adresi"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifre"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: 'var(--navy)',
              '&:hover': {
                bgcolor: 'var(--dark-red)'
              }
            }}
          >
            Giriş Yap
          </Button>
          
          <Divider sx={{ my: 2 }}>veya</Divider>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <GoogleLogin
              size="large"
              shape="rectangular"
              text="continue_with"
              logo_alignment="left"
              theme="outline"
              width="100%"
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google ile giriş başarısız oldu.')}
              useOneTap
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
} 