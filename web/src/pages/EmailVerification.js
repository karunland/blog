import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail, getMe } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import Swal from 'sweetalert2';

export default function EmailVerification() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await verifyEmail(code);
        if (response.data?.isSuccess) {
          const token = response.data.data;
          localStorage.setItem('token', token);

          const meResponse = await getMe();
          if (meResponse.data?.isSuccess) {
            setUser(meResponse.data.data);
          }

          Swal.fire({
            title: 'Başarılı!',
            text: 'Email adresiniz doğrulandı. Yönlendiriliyorsunuz...',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });

          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        Swal.fire({
          title: 'Hata!',
          text: 'Email doğrulama işlemi başarısız oldu.',
          icon: 'error'
        }).then(() => {
          navigate('/login');
        });
      } finally {
        setIsVerifying(false);
      }
    };

    if (code) {
      verifyEmail();
    }
  }, [code, navigate, setUser]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default'
    }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Email Doğrulama
        </Typography>
        {isVerifying ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Typography>
            Yönlendiriliyorsunuz...
          </Typography>
        )}
      </Paper>
    </Box>
  );
} 