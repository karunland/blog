import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@mui/material';
import { googleLogin, googleRegister, getMe } from '../lib/api';
import GoogleIcon from '@mui/icons-material/Google';

export function GoogleLoginBlog({ buttonName, onError }) {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleGoogleResponse = async (response) => {
    try {
      const apiResponse = buttonName === 'login' 
        ? await googleLogin({ credential: response.credential })
        : await googleRegister({ credential: response.credential });

      if (apiResponse.data?.isSuccess) {
        const token = apiResponse.data.data.token;
        localStorage.setItem('token', token);

        const meResponse = await getMe();
        if (meResponse.data?.isSuccess) {
          setUser(meResponse.data.data);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (onError) {
        const errorMessage = error.response?.data?.error?.errorMessage || 
                           error.message ||
                           'Google ile giriş sırasında bir hata oluştu';
        onError(errorMessage);
      }
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: (error) => {
      console.error('Google OAuth error:', error);
      if (onError) {
        onError('Google ile bağlantı kurulamadı');
      }
    },
    flow: 'auth-code'
  });

  return (
    <Button
      variant="outlined"
      onClick={() => login()}
      startIcon={<GoogleIcon />}
      fullWidth
      sx={{ mt: 2, mb: 2 }}
    >
      Google ile {buttonName === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
    </Button>
  );
}


