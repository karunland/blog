import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../lib/api';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Link as MuiLink,
  Dialog,
  Alert,
  Snackbar
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { GoogleLoginBlog } from '../components/GoogleLogin';
import { Divider } from '@mui/material';
import Cropper from 'react-easy-crop';
import { LoadingButton } from '@mui/lab';
import Logo from '../components/Logo';

const generateDiceBearAvatar = (name) => {
  // DiceBear'in farklı stilleri: adventurer, avataaars, bottts, initials, micah, miniavs, pixel-art
  const style = 'adventurer';
  const seed = name.replace(/\s+/g, '-').toLowerCase();
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4`;
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [success, setSuccess] = useState(false);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        setCropDialogOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], "cropped_image.jpg", { type: 'image/jpeg' });
  };

  const handleCropSave = async () => {
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.src = originalImage;
    
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(
      image,
      croppedAreaPixels.x * scaleX,
      croppedAreaPixels.y * scaleY,
      croppedAreaPixels.width * scaleX,
      croppedAreaPixels.height * scaleY,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const croppedImageUrl = canvas.toDataURL('image/jpeg');
    const croppedFile = await createFile(croppedImageUrl);
    
    setFormData(prev => ({
      ...prev,
      image: croppedFile
    }));
    setImagePreview(croppedImageUrl);
    setCropDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      
      // Form verilerini ekle
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await register(data);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error?.errorMessage || 'Kayıt işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: '20px' }}>
        <Logo width={200} />
      </Link>
      
      <Typography variant="h5" align="center" gutterBottom>
        Kayıt Ol
      </Typography>

      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom> Ad </Typography>
              <TextField
                fullWidth
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom> Soyad </Typography>
              <TextField
                fullWidth
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom> Kullanıcı Adı </Typography>
              <TextField
                fullWidth
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                required
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom> Email </Typography>
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
              <Typography variant="subtitle2" gutterBottom> Şifre </Typography>
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
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  {imagePreview ? 'Fotoğrafı Değiştir' : 'Profil Fotoğrafı Yükle (İsteğe Bağlı)'}
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

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            startIcon={<PersonAddIcon />}
            sx={{ mt: 3 }}
          >
            Kayıt Ol
          </LoadingButton>

          <Divider sx={{ my: 2 }}>veya</Divider>

          <GoogleLoginBlog buttonName="register" onError={handleGoogleError} />

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Zaten hesabın var mı?{' '}
              <MuiLink
                href="/login"
                underline="hover"
                sx={{ cursor: 'pointer' }}
              >
                Giriş Yap
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Kayıt işlemi başarılı! Giriş sayfasına yönlendiriliyorsunuz.
        </Alert>
      </Snackbar>

      <Dialog
        open={cropDialogOpen}
        onClose={() => setCropDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ position: 'relative', height: 400, width: '100%' }}>
          {originalImage && (
            <Cropper
              image={originalImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </Box>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => setCropDialogOpen(false)}>İptal</Button>
          <Button variant="contained" onClick={handleCropSave}>Kaydet</Button>
        </Box>
      </Dialog>
    </Container>
  );
}

export default Register;