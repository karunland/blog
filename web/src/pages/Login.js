import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../lib/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Box,
  Grid,
  Link,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { GoogleLoginBlog } from '../components/GoogleLogin';
import { Divider } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';


export function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      if (response.data?.isSuccess) {
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        setUser(userData);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.error?.errorMessage || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMessage) => {
    console.error('Login page received error:', errorMessage);
    setError(errorMessage);
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Giriş Yap
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Şifre"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            startIcon={<LoginIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Giriş Yap
          </LoadingButton>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Hesabınız yok mu?{' '}
              <Link
                href="/register"
                underline="hover"
                sx={{ cursor: 'pointer' }}
              >
                Kayıt Ol
              </Link>
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }}>veya</Divider>

          <GoogleLoginBlog buttonName="login" onError={handleGoogleError} />
        </Box>
      </Paper>
    </Container>
  );
} 