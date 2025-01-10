import { googleRegister } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Box, Typography, Link } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';

export const GoogleLoginBlog = ({ buttonName }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { googleLoginAsync } = useAuth();
    const handleGoogleLogin = async (credentialResponse) => {
        try {
            if (buttonName === 'login') {
                const response = await googleLoginAsync(credentialResponse.credential);
                if (response.isSuccess) {
                    setSuccess(true);
                    Swal.fire({
                        title: 'Giriş Başarılı',
                        text: 'Google ile giriş yapıldı.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        showCancelButton: false,
                    });
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    setError('Google ile giriş başarısız oldu.');
                    console.error('Google login failed:', error);
                }
            } else {
                const response = await googleRegister(credentialResponse.credential);
                if (response.isSuccess) {
                    setSuccess(true);
                    Swal.fire({
                        title: 'Kayıt Başarılı',
                        text: 'Google ile kayıt yapıldı.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false,
                        showCancelButton: false,
                    });
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    setError('Google ile kayıt başarısız oldu.');
                    console.error('Google register failed:', error);
                }
            }
        } catch (error) {
            setError('Google ile giriş başarısız oldu.');
            console.error('Google login failed:', error);
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 2 }}>
            <GoogleLogin
                size="large"
                shape="rectangular"
                text="continue_with"
                logo_alignment="left"
                theme="outline"
                // change button name
                buttonText={buttonName === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
                width="100%"
                onSuccess={handleGoogleLogin}
                onError={() => setError('Google ile giriş başarısız oldu.')}
                useOneTap
            />
            {buttonName === 'login' ? 
                <Typography variant="body2">
                    Hesabınız yok mu? <Link href="/register" underline="hover" sx={{ cursor: 'pointer' }}>Kayıt Ol</Link>
                </Typography> 
                : 
                <Typography variant="body2">
                    Hesabınız var mı? <Link href="/login" underline="hover" sx={{ cursor: 'pointer' }}>Giriş Yap</Link>
                </Typography>
            }
        </Box>
    );
};


