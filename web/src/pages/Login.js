import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { login } from '../lib/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Box,
  Grid,
  Link,
  Alert,
  Snackbar
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LoginIcon from '@mui/icons-material/Login';
import { GoogleLoginBlog } from '../components/GoogleLogin';
import { Divider } from '@mui/material';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
      if (response.isSuccess) {
        localStorage.setItem('token', response.data.token);
        dispatch(setUser(response.data));
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.errorMessage);
      }
    } catch (error) {
      setError(error.response?.data?.error?.errorMessage || 'Giriş işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 15 }}>
      <Logo width={100} />
      <Typography variant="h5" align="center" gutterBottom>
        Giriş Yap
      </Typography>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Email
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Şifre
              </Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                size="small"
              />
            </Grid>
          </Grid>

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="medium"
            loading={loading}
            startIcon={<LoginIcon />}
            sx={{ mt: 3 }}
          >
            Giriş Yap
          </LoadingButton>

          <Divider sx={{ my: 2 }}>veya</Divider>

          <GoogleLoginBlog buttonName="login" onError={handleGoogleError} />
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
        </Box>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={1000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Giriş başarılı! Yönlendiriliyorsunuz...
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Login;