import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if (response.isSuccess) {
        navigate('/dashboard');
      }
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: error.response?.data?.error?.errorMessage || 'Giriş başarısız oldu',
        icon: 'error'
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Giriş Yap
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Şifre"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            margin="normal"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Giriş Yap
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Hesabınız yok mu?{' '}
              <Link
                href="/register"
                underline="hover"
                sx={{ cursor: 'pointer' }}
              >
                Kaydol
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 