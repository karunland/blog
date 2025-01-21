import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { setUser } from '../store/userSlice';
import { googleLogin, googleRegister, getMe } from '../lib/api';
import GoogleIcon from '@mui/icons-material/Google';

export function GoogleLoginBlog({ buttonName, onError }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleResponse = async (codeResponse) => {
    try {
      console.log(codeResponse);
      const apiResponse = buttonName === 'login' 
        ? await googleLogin({ credential: codeResponse.access_token })
        : await googleRegister({ credential: codeResponse.access_token });

      console.log(apiResponse);
      if (apiResponse.isSuccess) {
        const token = apiResponse.data.token;
        localStorage.setItem('token', token);
        const meResponse = await getMe();
        if (meResponse.isSuccess) {
          dispatch(setUser(meResponse.data));
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
    flow: 'implicit',
    scope: 'email profile',
    use_cors: true
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
