import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { register } from '../lib/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Link,
  IconButton
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await register(data);

      if (response.isSuccess) {
        Swal.fire({
          title: 'Başarılı!',
          text: 'Kayıt işlemi tamamlandı. Giriş yapabilirsiniz.',
          icon: 'success',
          timer: 2000
        });
        navigate('/login');
      }
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: error.response?.data?.error?.errorMessage || 'Kayıt işlemi başarısız oldu',
        icon: 'error'
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Kayıt Ol
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ad"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Soyad"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kullanıcı Adı"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                required
              />
            </Grid>
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
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  {imagePreview ? 'Fotoğrafı Değiştir' : 'Profil Fotoğrafı Yükle'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Önizleme"
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<PersonAddIcon />}
            sx={{ mt: 3, mb: 2 }}
          >
            Kayıt Ol
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Zaten hesabınız var mı?{' '}
              <Link
                href="/login"
                underline="hover"
                sx={{ cursor: 'pointer' }}
              >
                Giriş Yap
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}