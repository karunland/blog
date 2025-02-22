import { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { likeBlog } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../utils/toast';
import { LoginModal } from './LoginModal';
import { styled } from '@mui/material/styles';

export function LikeButton({ blog }) {
  const { isAuthenticated } = useAuth();
  const [isLikedState, setIsLikedState] = useState(liked || false);
  const [likeCountState, setLikeCountState] = useState(likeCount || 0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  
  const StyledIconButton = styled(IconButton)({
    padding: 0,
    fontSize: '18px',
    '&:hover': {
      '& .MuiSvgIcon-root': {
        filter: 'drop-shadow(0 0 4px rgba(255, 23, 68, 0.6))',
        transform: 'scale(1.1)',
        borderRadius: '50%',
        // border: '2px solid rgba(255, 23, 68, 0.1)',
        transition: 'all 0.2s ease-in-out',

      }
    }
  });

  const LikeIcon = styled(FavoriteIcon)({
    color: '#ff1744',
    // transition: 'all 0.2s ease-in-out',
    fontSize: '20px',
  });

  const StyledFavoriteBorderIcon = styled(FavoriteBorderIcon)({
    fontSize: '20px',
    color: '#ff1744',
  });

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await likeBlog(blog.slug);
      if (response.isSuccess) {
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  return (
    <>
      <Box
        onClick={handleLike}
        className='LikeButton'
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'rgba(255, 23, 68, 0.1, 0.1)',
            borderRadius: '50%',
          }
        }}
      >

        <Box display={{ xs: 'none', md: 'flex', position: 'absolute', top: 0, left: 0, width: '10px', height: '10px', backgroundColor: 'rgba(255, 23, 68, 0.1)', borderRadius: '50%' }}>
        </Box>
        <StyledIconButton
          size="small"
          color="error"
        >
          {isLikedState ? <LikeIcon /> : <StyledFavoriteBorderIcon />}
        </StyledIconButton>
        <Typography variant="body2" color="text.secondary">
          {likeCountState == 0 ? '' : likeCountState}
        </Typography>
      </Box>

      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
} 