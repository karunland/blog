import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import { handleGoogleCallback } from '../lib/auth';
import { googleLogin, googleRegister, getMe } from '../lib/api';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      const result = handleGoogleCallback();
      
      if (result) {
        try {
          const { accessToken, type } = result;
          
          // Login veya register işlemini yap
          const apiResponse = type === 'login'
            ? await googleLogin({ credential: accessToken })
            : await googleRegister({ credential: accessToken });

          if (apiResponse.isSuccess) {
            const token = apiResponse.data.token;
            localStorage.setItem('token', token);
            
            // Kullanıcı bilgilerini al
            const meResponse = await getMe();
            if (meResponse.isSuccess) {
              dispatch(setUser(meResponse.data));
              navigate('/dashboard');
            }
          } else {
            console.error('API error:', apiResponse.message);
            navigate('/login');
          }
        } catch (error) {
          console.error('Callback handling error:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
      <div className="text-white text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg">Google ile giriş yapılıyor...</p>
      </div>
    </div>
  );
};

export default GoogleCallback; 