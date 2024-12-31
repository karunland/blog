import { Card, CardContent, Typography, Box, Stack, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import '../styles/BlogCard.css';

export function BlogCard({ blog }) {
  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 2,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'action.hover',
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease'
        }
      }}
    >
      <Link 
        to={`/${blog.slug}`} 
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        {blog.imageUrl && (
          <CardMedia
            component="img"
            height="300"
            image={blog.imageUrl}
            alt={blog.title}
            sx={{
              objectFit: 'cover',
              borderRadius: 2,
              mb: 2,
              width: '100%',
              maxHeight: '300px'
            }}
          />
        )}
      </Link>
      <CardContent>
        <Link 
          to={`/${blog.slug}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            {blog.title}
          </Typography>
        </Link>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">
              {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">
              {blog.categoryName || 'Kategorisiz'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            <VisibilityIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="body2">
              {blog.views || 0} görüntülenme
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
} 