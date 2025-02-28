import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { setUser } from '../store/userSlice';
import { googleLogin, googleRegister, getMe } from '../lib/api';
import GoogleIcon from '@mui/icons-material/Google';
import { toast } from '../utils/toast';

export function GoogleLoginBlog({ buttonName, onError }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleResponse = async (codeResponse) => {
    try {
      const apiResponse = buttonName === 'login' 
        ? await googleLogin({ credential: codeResponse.access_token })
        : await googleRegister({ credential: codeResponse.access_token });

      if (apiResponse.isSuccess) {
        const token = apiResponse.data.token;
        localStorage.setItem('token', token);
        const meResponse = await getMe();
        if (meResponse.isSuccess) {
          dispatch(setUser(meResponse.data));
          navigate('/');
        }
      } else {
        toast.error(apiResponse.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google ile giriş yapılırken bir hata oluştu');
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onError: (error) => {
      // console.error('Google OAuth error:', error);
    },
    flow: 'implicit',
    scope: 'email profile',
    use_cors: true
  });

  return (
    <Button
      size="small"
      variant="outlined"
      
      onClick={() => login()}
      startIcon={<GoogleIcon />}
      fullWidth
      sx={{ }}
    >
      Google ile Devam Et
    </Button>
  );
}
