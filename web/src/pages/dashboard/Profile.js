import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Box,
  Button,
  Typography,
  Avatar,
  Paper,
  Stack,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { updateProfile, updateProfilePhoto, verifyEmail, getMe, sendVerificationCode } from '../../lib/api';
import { updateUserProfile } from '../../store/userSlice';
import Swal from 'sweetalert2';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    userName: user?.userName || '',
    email: user?.email || ''
  });
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendVerificationCode = async () => {
    setIsSendingCode(true);
    try {
      const response = await sendVerificationCode();
      console.log(response);
      if (response.isSuccess) {
        setVerificationModalOpen(true);
        Swal.fire({
          title: 'Başarılı!',
          text: 'Doğrulama kodu email adresinize gönderildi.',
          icon: 'success',
          timer: 2000
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: 'Doğrulama kodu gönderilirken bir hata oluştu.',
        icon: 'error'
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      const response = await verifyEmail(verificationCode);
      if (response.isSuccess) {
        const meResponse = await getMe();
        if (meResponse.isSuccess) {
          dispatch(updateUserProfile(meResponse.data));
          setVerificationModalOpen(false);
          Swal.fire({
            title: 'Başarılı!',
            text: 'Email adresiniz doğrulandı.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: 'Doğrulama kodu geçersiz veya süresi dolmuş.',
        icon: 'error'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          setSelectedFile(reader.result);
          setCrop(centerAspectCrop(image.width, image.height, 1));
        };
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  async function onSaveImage() {
    if (!previewCanvasRef.current) return;

    setIsUploading(true);
    try {
      const blob = await new Promise(resolve => {
        previewCanvasRef.current.toBlob(resolve, 'image/jpeg', 0.95);
      });

      const formData = new FormData();
      formData.append('image', blob, 'profile.jpg');

      const response = await updateProfilePhoto(formData);
      if (response.isSuccess) {
        const meResponse = await getMe();
        if (meResponse.isSuccess) {
          dispatch(updateUserProfile(meResponse.data));
          const meResponse2 = await getMe();
          if (meResponse2.isSuccess) {
            dispatch(updateUserProfile(meResponse2.data));
          }

          setSelectedFile(null);
          Swal.fire({
            title: 'Başarılı!',
            text: 'Profil fotoğrafınız güncellendi.',
            icon: 'success',
            timer: 2000
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: 'Profil fotoğrafı güncellenirken bir hata oluştu.',
        icon: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  }

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const response = await updateProfile(formData);
      if (response.isSuccess) {
        const meResponse = await getMe();
        if (meResponse.isSuccess) {
          dispatch(updateUserProfile(meResponse.data));
          Swal.fire({
            title: 'Başarılı!',
            text: 'Profil bilgileriniz güncellendi.',
            icon: 'success',
            timer: 2000
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: 'Profil bilgileri güncellenirken bir hata oluştu.',
        icon: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  function updateCanvasPreview() {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 200;
    canvas.height = 200;

    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }

  if (completedCrop) {
    updateCanvasPreview();
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profil Fotoğrafı
        </Typography>
        
        <Stack direction="column" spacing={3} alignItems="center">
          {!selectedFile && (
            <>
              <Avatar
                src={user?.imageUrl}
                alt={`${user?.firstName} ${user?.lastName}`}
                sx={{ width: 200, height: 200 }}
              />
              <Button
                variant="contained"
                component="label"
              >
                Fotoğraf Seç
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={onSelectFile}
                />
              </Button>
            </>
          )}

          {selectedFile && (
            <>
              <Box sx={{ maxWidth: '100%', width: 400 }}>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={selectedFile}
                    onLoad={onImageLoad}
                    style={{ maxWidth: '100%' }}
                  />
                </ReactCrop>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Önizleme:
                </Typography>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    objectFit: 'contain',
                  }}
                />
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  İptal
                </Button>
                <LoadingButton
                  variant="contained"
                  onClick={onSaveImage}
                  loading={isUploading}
                >
                  Kaydet
                </LoadingButton>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profil Bilgileri
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ad"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Soyad"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={user?.isMailVerified}
              />
              {user?.isMailVerified ? (
                <Chip
                  icon={<VerifiedIcon />}
                  label="Doğrulandı"
                  color="success"
                  variant="outlined"
                />
              ) : (
                <LoadingButton
                  variant="outlined"
                  color="warning"
                  onClick={handleSendVerificationCode}
                  loading={isSendingCode}
                  startIcon={<ErrorOutlineIcon />}
                >
                  Doğrula
                </LoadingButton>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              variant="contained"
              onClick={handleUpdateProfile}
              loading={isUpdating}
              fullWidth
            >
              Bilgileri Güncelle
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={verificationModalOpen} onClose={() => setVerificationModalOpen(false)}>
        <DialogTitle>Email Doğrulama</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Email adresinize gönderilen 6 haneli doğrulama kodunu giriniz.
          </Typography>
          <TextField
            fullWidth
            label="Doğrulama Kodu"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationModalOpen(false)}>
            Kapat
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleVerifyCode}
            loading={isVerifying}
          >
            Onayla
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
