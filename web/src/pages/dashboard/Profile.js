import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Box,
  Button,
  Typography,
  Avatar,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { api } from '../../lib/api';

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

export default function Profile() {
  const { user, setUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

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
    if (!completedCrop || !previewCanvasRef.current) return;

    setIsUploading(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise(resolve => {
        previewCanvasRef.current.toBlob(resolve, 'image/jpeg', 0.95);
      });

      // Create form data
      const formData = new FormData();
      formData.append('image', blob, 'profile.jpg');
      formData.append('firstName', user.firstName);
      formData.append('lastName', user.lastName);
      formData.append('userName', user.userName);

      // Upload to server
      const response = await api.put('/api/user', formData);
      if (response.status === 200) {
        // Update user context with new image URL
        const meResponse = await api.get('/api/user/me');
        if (meResponse.status === 200) {
          setUser(meResponse.data);
        }
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  }

  // Update canvas preview
  function updateCanvasPreview() {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;

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

  // Update canvas when crop changes
  if (completedCrop) {
    updateCanvasPreview();
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
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
    </Box>
  );
}
