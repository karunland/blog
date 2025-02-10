import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmail, getMe } from '../lib/api';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';
import { toast } from '../utils/toast';

export default function EmailVerification() {
  const { code } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await verifyEmail(code);
        if (response.isSuccess) {
          const token = response.data;
          localStorage.setItem('token', token);

          const meResponse = await getMe();
          if (meResponse.isSuccess) {
            dispatch(setUser(meResponse.data));
          }

          toast.success('Email adresiniz doğrulandı. Yönlendiriliyorsunuz...');

          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        toast.error('Email doğrulama işlemi başarısız oldu.');
        navigate('/login');
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