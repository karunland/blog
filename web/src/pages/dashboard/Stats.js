import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../lib/api';
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  LinearProgress,
  Skeleton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ArticleIcon from '@mui/icons-material/Article';

export function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.isSuccess) {
          setStats(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Stats yüklenemedi:', error);
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} md={3} key={item}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
        ))}
      </Grid>
    );
  }

  const statCards = [
    { icon: <ArticleIcon />, value: stats.totalBlogs, label: 'Toplam Blog' },
    { icon: <VisibilityIcon />, value: stats.totalViews, label: 'Toplam Görüntülenme' },
    { icon: <CommentIcon />, value: stats.totalComments, label: 'Toplam Yorum' },
    { icon: <ThumbUpIcon />, value: stats.totalLikes, label: 'Toplam Beğeni' }
  ];

  return (
    <Grid container spacing={3} sx={{ py: 3, mt: 3 }}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1
            }}
          >
            {card.icon}
            <Typography variant="h4">{card.value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {card.label}
            </Typography>
          </Paper>
        </Grid>
      ))}

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Popüler Bloglarınız
          </Typography>
          <List>
            {stats.popularBlogs.map(blog => (
              <ListItem
                key={blog.slug}
                component={Link}
                to={`/${blog.slug}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemText primary={blog.title} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    icon={<VisibilityIcon />}
                    label={`${blog.views} görüntülenme`}
                  />
                  <Chip
                    size="small"
                    icon={<CommentIcon />}
                    label={`${blog.comments} yorum`}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Son Aktiviteler
          </Typography>
          <List>
            {stats.recentActivities.map((activity, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={activity.content}
                  secondary={new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Kategori Dağılımı
          </Typography>
          <Box sx={{ mt: 2 }}>
            {stats.categoryStats.map(cat => (
              <Box key={cat.categoryName} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{cat.categoryName}</Typography>
                  <Typography variant="body2">{cat.blogCount}</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(cat.blogCount / stats.totalBlogs) * 100}
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
