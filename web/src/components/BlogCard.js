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
        mb: 2,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4]
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
              borderRadius: 1,
              mb: 2
            }}
          />
        )}
      </Link>
      <CardContent>
        <Link 
          to={`/${blog.slug}`} 
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 600,
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            {blog.title}
          </Typography>
        </Link>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {blog.categoryName || 'Kategorisiz'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {blog.views || 0} görüntülenme
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
} 