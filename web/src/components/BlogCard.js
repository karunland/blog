import { Card, CardContent, Typography, Box, Stack, CardMedia, Chip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CommentIcon from '@mui/icons-material/Comment';
import { LikeButton } from './LikeButton';
import '../styles/BlogCard.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  if (year === now.getFullYear()) {
    return `${month} ${day}`;
  }
  return `${month} ${day}, ${year}`;
};

export function BlogCard({ blog }) {
  return (
    <Card 
      elevation={1}
      sx={{ 
        height: '100%',
        maxHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        border: '0.8px solid transparent',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'background.paper',
        '&:hover': {
          border: '0.8px solid var(--orange)',
          cursor: 'pointer',
            '& h2': {
              color: 'var(--orange)',
              transition: 'all 0.3s ease-in-out'
            }
        }
      }}
    >
      <Link 
        to={`/blog/${blog.slug}`} 
        style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, paddingBottom: 1 }}>
          <Avatar
            src={blog.authorPhoto}
            alt={blog.authorName}
            sx={{ 
              width: 40,
              height: 40,
              border: '2px solid',
              borderColor: 'primary.light',
              backgroundColor: 'grey.200',
              '& img': {
                objectFit: 'cover',
                width: '100%',
                height: '100%',
                aspectRatio: '1/1'
              }
            }}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {blog.authorName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDate(blog.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
          <CardMedia
            className="blog-image"
            component="img"
            image={blog.imageUrl || '/default-blog-image.jpg'}
            alt={blog.title}
            sx={{
              padding: 1,
              height: '100%',
              borderRadius: '24px',
              objectFit: 'cover',
              transition: 'transform 0.3s ease-in-out'
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, pt: 2 }}>
          <Typography 
            className="blog-title"
            variant="h6" 
            component="h2" 
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
              mb: 'auto',
              color: 'text.primary',
              transition: 'color 0.2s ease-in-out'
            }}
          >
            {blog.title}
          </Typography>
        </CardContent>

        <Box 
          sx={{ 
            px: 2,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 'auto'
          }}
        >
          <Stack 
            direction="row" 
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.commentCount || 0}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.viewCount || 0}
                </Typography>
              </Box>

              <LikeButton 
                slug={blog.slug}
                likeCount={blog.likeCount}
                liked={blog.liked}
              />
            </Stack>

            <Chip
              icon={<LocalOfferIcon sx={{ fontSize: '16px !important' }} />}
              label={blog.categoryName}
              size="small"
              sx={{ 
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '& .MuiChip-label': {
                  fontSize: '0.75rem',
                  fontWeight: 500
                }
              }}
            />
          </Stack>
        </Box>
      </Link>
    </Card>
  );
} 