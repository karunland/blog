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
  Chip,
  Container,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { updateProfile, updateProfilePhoto, verifyEmail, getMe, sendVerificationCode } from '../../lib/api';
import { updateUserProfile } from '../../store/userSlice';
import { toast } from '../../utils/toast';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PhotoCamera } from '@mui/icons-material';
import GifIcon from '@mui/icons-material/Gif';

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
  const [isGif, setIsGif] = useState(false);

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
        toast.success('Doğrulama kodu email adresinize gönderildi.');
      }
    } catch (error) {
      toast.error('Doğrulama kodu gönderilirken bir hata oluştu.');
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
          toast.success('Email adresiniz doğrulandı.');
        }
      }
    } catch (error) {
      toast.error('Doğrulama kodu geçersiz veya süresi dolmuş.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const isGifFile = file.type === 'image/gif';
      setIsGif(isGifFile);

      if (isGifFile) {
        // GIF dosyaları için direkt yükleme yapıyoruz, kırpma yapmıyoruz
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', '2'); // ProfileGif type

        updateProfilePhoto(formData)
          .then(response => {
            if (response.isSuccess) {
              return getMe();
            }
          })
          .then(meResponse => {
            if (meResponse?.isSuccess) {
              dispatch(updateUserProfile(meResponse.data));
              toast.success('Profil fotoğrafınız güncellendi.');
            }
          })
          .catch(() => {
            toast.error('Profil fotoğrafı güncellenirken bir hata oluştu.');
          })
          .finally(() => {
            setIsUploading(false);
          });
      } else {
        // Normal resimler için kırpma arayüzünü kullanıyoruz
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          const image = new Image();
          image.src = reader.result;
          image.onload = () => {
            setSelectedFile(reader.result);
            setCrop(centerAspectCrop(image.width, image.height, 1));
          };
        });
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const response = await updateProfile(formData);
      if (response.isSuccess) {
        const meResponse = await getMe();
        if (meResponse.isSuccess) {
          dispatch(updateUserProfile(meResponse.data));
          toast.success('Profil bilgileriniz güncellendi.');
        }
      }
    } catch (error) {
      toast.error('Profil bilgileri güncellenirken bir hata oluştu.');
    } finally {
      setIsUpdating(false);
    }
  };

  const onSaveImage = async () => {
    if (!completedCrop || !previewCanvasRef.current) {
      return;
    }

    setIsUploading(true);
    try {
      const canvas = previewCanvasRef.current;
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob, 'profile.jpg');
        formData.append('type', '1'); // ProfilePicture type

        const response = await updateProfilePhoto(formData);
        if (response.isSuccess) {
          const meResponse = await getMe();
          if (meResponse.isSuccess) {
            dispatch(updateUserProfile(meResponse.data));
            setSelectedFile(null);
            toast.success('Profil fotoğrafınız güncellendi.');
          }
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      toast.error('Profil fotoğrafı güncellenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
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
    <Container maxWidth="md" sx={{ py: 4, mt: 8 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            {!selectedFile && (
              <>
                {user?.imageUrl?.endsWith('.gif') ? (
                  <Box
                    component="img"
                    src={user?.imageUrl}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      borderRadius: '50%',
                      border: '4px solid',
                      borderColor: 'primary.light',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <Avatar
                    src={user?.imageUrl}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    sx={{ 
                      width: 120, 
                      height: 120,
                      border: '4px solid',
                      borderColor: 'primary.light',
                    }}
                  />
                )}
                <Box sx={{ position: 'absolute', right: -8, bottom: -8, display: 'flex', gap: 1 }}>
                  <Tooltip title="Fotoğraf Yükle">
                    <IconButton
                      component="label"
                      sx={{
                        backgroundColor: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.dark' },
                      }}
                      size="small"
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                      <PhotoCamera sx={{ color: 'white' }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="GIF Yükle">
                    <IconButton
                      component="label"
                      sx={{
                        backgroundColor: 'secondary.main',
                        '&:hover': { backgroundColor: 'secondary.dark' },
                      }}
                      size="small"
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/gif"
                        onChange={handleFileSelect}
                      />
                      <GifIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
            )}
          </Box>
          
          <Box sx={{ ml: 3 }}>
            <Typography variant="h5" gutterBottom>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              @{user?.userName}
            </Typography>
            {user?.isMailVerified ? (
              <Chip
                icon={<VerifiedIcon />}
                label="Doğrulanmış Hesap"
                color="success"
                size="small"
                variant="outlined"
              />
            ) : (
              <Chip
                icon={<ErrorOutlineIcon />}
                label="Email Doğrulanmamış"
                color="warning"
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        </Box>

        {selectedFile && (
          <Box sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Profil Fotoğrafını Düzenle
              </Typography>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
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
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Önizleme
                    </Typography>
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        border: '2px solid',
                        borderColor: 'primary.light',
                      }}
                    />
                    <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
                      <Button
                        variant="outlined"
                        onClick={() => setSelectedFile(null)}
                        disabled={isUploading}
                        size="small"
                      >
                        İptal
                      </Button>
                      <LoadingButton
                        variant="contained"
                        onClick={onSaveImage}
                        loading={isUploading}
                        size="small"
                      >
                        Kaydet
                      </LoadingButton>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Profil Bilgileri
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ad"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Soyad"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Kullanıcı Adı"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              size="small"
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
                size="small"
              />
              {!user?.isMailVerified && (
                <LoadingButton
                  variant="outlined"
                  color="warning"
                  onClick={handleSendVerificationCode}
                  loading={isSendingCode}
                  startIcon={<ErrorOutlineIcon />}
                  size="small"
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
              size="small"
            >
              Bilgileri Güncelle
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>

      <Dialog 
        open={verificationModalOpen} 
        onClose={() => setVerificationModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          Email Doğrulama
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Email adresinize gönderilen 6 haneli doğrulama kodunu giriniz.
          </Typography>
          <TextField
            fullWidth
            label="Doğrulama Kodu"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            sx={{ mt: 2 }}
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerificationModalOpen(false)} size="small">
            İptal
          </Button>
          <LoadingButton
            variant="contained"
            onClick={handleVerifyCode}
            loading={isVerifying}
            size="small"
          >
            Onayla
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
