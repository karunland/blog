import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Box, TextField, Button, Typography, Divider, Alert } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
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
    try {
      const response = await axios.post('/api/user/login', formData);
      if (response.data.isSuccess) {
        login(response.data.data);
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/api/user/google-login', credentialResponse.credential);
      if (response.data.isSuccess) {
        login(response.data.data);
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Google ile giriş yapılırken bir hata oluştu.');
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
          boxShadow: 3
        }}
      >
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