import { Card, CardContent, Typography, Box, Stack, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import '../styles/BlogCard.css';

export function BlogCard({ blog }) {
  return (
    <Card 
      elevation={1}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '0.8px solid transparent',
        '&:hover': {
          border: '0.8px solid var(--orange)',
        }
      }}
    >
      <Link 
        to={`/blog/${blog.slug}`} 
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <CardMedia
          component="img"
          height="200"
          image={blog.imageUrl || '/default-blog-image.jpg'}
          alt={blog.title}
          sx={{
            objectFit: 'cover',
            borderRadius: '4px 4px 0 0'
          }}
        />
      </Link>
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
              mb: 2,
              '&:hover': {
                color: 'var(--cream)',
                textDecoration: 'underline'
              }
            }}
          >
            {blog.title}
          </Typography>
        </Link>

        <Box sx={{ mt: 'auto' }}>
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
                {blog.viewCount || 0} görüntülenme
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
} 