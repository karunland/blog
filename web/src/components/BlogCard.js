import { Card, CardContent, Typography, Box, Stack, CardMedia, Modal, IconButton, Divider, Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CommentIcon from '@mui/icons-material/Comment';
import PreviewIcon from '@mui/icons-material/Preview';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import '../styles/BlogCard.css';

export function BlogCard({ blog }) {
  const [openPreview, setOpenPreview] = useState(false);

  const handleOpenPreview = (e) => {
    e.preventDefault(); // Link'in çalışmasını engelle
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  return (
    <>
      <Card 
        elevation={1}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '0.8px solid transparent',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            border: '0.8px solid var(--orange)',
            cursor: 'pointer',
            transition: 'all 0.3s ease-in-out',
            '& h2': {
              color: 'var(--orange)',
              transition: 'all 0.3s ease-in-out'
            }
          }
        }}
      >
        <IconButton
          onClick={handleOpenPreview}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            }
          }}
        >
          <PreviewIcon />
        </IconButton>

        <Link 
          to={`/blog/${blog.slug}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Box sx={{ p: 1.5, position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={blog.imageUrl || '/default-blog-image.jpg'}
              alt={blog.title}
              sx={{
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Link 
            to={`/blog/${blog.slug}`} 
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 2
              }}
            >
              {blog.title}
            </Typography>
          </Link>

          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOfferIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.categoryName || ''}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.viewCount || 0}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.commentCount || 0}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
        </Link>

      </Card>

      <Modal
        open={openPreview}
        onClose={handleClosePreview}
        aria-labelledby="preview-modal-title"
        aria-describedby="preview-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              {blog.title}
            </Typography>
            <IconButton onClick={handleClosePreview}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 3 }}>
            <img 
              src={blog.imageUrl || '/default-blog-image.jpg'} 
              alt={blog.title}
              style={{ 
                width: '100%',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </Box>

          <Typography variant="body1" sx={{ mb: 3 }}>
            {blog.content?.split(' ').slice(0, 50).join(' ')}...
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Yorumlar ({blog.commentCount || 0})
            </Typography>
            {blog.comments?.slice(0, 100).map((comment, index) => (
              <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar src={comment.authorImageUrl} sx={{ mr: 1 }} />
                  <Typography variant="subtitle2">{comment.authorName}</Typography>
                </Box>
                <Typography variant="body2">{comment.content}</Typography>
              </Box>
            ))}
            {blog.comments?.length > 100 && (
              <Typography variant="body2" color="text.secondary" align="center">
                Ve {blog.comments.length - 100} yorum daha...
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Link 
              to={`/blog/${blog.slug}`}
              style={{ 
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Button variant="contained">
                Devamını Oku
              </Button>
            </Link>
          </Box>
        </Box>
      </Modal>
    </>
  );
} 