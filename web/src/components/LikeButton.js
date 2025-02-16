import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { likeBlog } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../utils/toast';
import { LoginModal } from './LoginModal';
import { styled } from '@mui/material/styles';

export function LikeButton({ blog, onLikeUpdate }) {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(blog.liked);
  const [likeCount, setLikeCount] = useState(blog.likeCount);
  const [showLoginModal, setShowLoginModal] = useState(false);

 
  const StyledIconButton = styled(IconButton)({
    padding: 0,
    fontSize: '18px',
    '&:hover': {
      '& .MuiSvgIcon-root': {
        filter: 'drop-shadow(0 0 4px rgba(255, 23, 68, 0.6))',
        transform: 'scale(1.1)',
        transition: 'all 0.2s ease-in-out',
      }
    }
  });

  const LikeIcon = styled(FavoriteIcon)({
    color: '#ff1744',
    transition: 'all 0.2s ease-in-out',
    fontSize: '20px',
  });

  const StyledFavoriteBorderIcon = styled(FavoriteBorderIcon)({
    fontSize: '20px',
    color: '#ff1744',
  });

  const handleLike = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await likeBlog(blog.slug);
      const newLikeState = response.data.isLiked;

      if (response.isSuccess) {
        setIsLiked(newLikeState);
        const newLikeCount = response.data.likeCount;
        setLikeCount(newLikeCount);
        
        // Notify parent component about the update
        if (onLikeUpdate) {
          onLikeUpdate({
            liked: newLikeState,
            likeCount: newLikeCount
          });
        }
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
          cursor: 'pointer'
        }}
      >
        <StyledIconButton 
          size="small" 
          color="error"
        >
          {isLiked ? <LikeIcon /> : <StyledFavoriteBorderIcon />}
        </StyledIconButton>
        <Typography variant="body2" color="text.secondary">
          {likeCount || 0}
        </Typography>
      </Box>

      <LoginModal 
        open={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
} 