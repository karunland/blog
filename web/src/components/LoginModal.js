import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Stack,
  Typography,
  IconButton,
  Box,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/AuthContext';
import { login, googleLogin } from '../lib/api';
import { toast } from '../utils/toast';

export function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await login({ email, password });
      if (response.isSuccess) {
        authLogin(response.data.token);
        toast.success('Giriş başarılı');
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.errorMessage || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    try {
      const result = await googleLogin(response.credential);
      if (result.isSuccess) {
        authLogin(result.data.token);
        toast.success('Google ile giriş başarılı');
        onClose();
      }
    } catch (error) {
      toast.error('Google ile giriş yapılırken bir hata oluştu');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Giriş Yap
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Şifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ py: 1.2 }}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </Stack>
        </form>

        <Box sx={{ my: 3, position: 'relative' }}>
          <Divider>
            <Typography variant="body2" sx={{ px: 1, color: 'text.secondary' }}>
              VEYA
            </Typography>
          </Divider>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => {
            // Initialize Google login
            if (window.google) {
              window.google.accounts.id.prompt();
            }
          }}
          sx={{ py: 1.2 }}
        >
          Google ile Giriş Yap
        </Button>
      </DialogContent>
    </Dialog>
  );
} 