import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getBlogPosts, deleteBlog } from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/MyBlogs.css';

export function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Bloglarım | BlogApp';
    loadMyBlogs();
  }, []);

  const loadMyBlogs = async () => {
    try {
      const response = await getBlogPosts();
      if (response.isSuccess) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error('Bloglar yüklenirken hata:', error);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Bu blogu silmek istediğinizden emin misiniz?')) {
      try {
        const response = await deleteBlog(slug);
        if (response.isSuccess) {
          loadMyBlogs();
        } else {
          alert('Blog silinirken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Blog silinirken hata:', error);
        alert('Blog silinirken bir hata oluştu.');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ArticleIcon sx={{ fontSize: 24, mr: 2, color: 'primary.main' }} />
            <Typography variant="h5" component="h1">
              Bloglarım
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/dashboard/add-blog')}
          >
            Yeni Blog Ekle
          </Button>
        </Box>

        <List>
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <Box key={blog.id}>
                {index > 0 && <Divider />}
                <ListItem sx={{ py: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1">
                        {blog.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                        </Typography>
                        <Typography 
                          variant="caption"
                          sx={{ 
                            ml: 1,
                            color: blog.status === 2 ? 'success.main' : 'warning.main'
                          }}
                        >
                          {blog.status === 2 ? 'Yayında' : 'Taslak'}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Düzenle">
                      <IconButton 
                        size="small"
                        edge="end" 
                        onClick={() => navigate(`/dashboard/blogs/edit/${blog.slug}`)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Sil">
                      <IconButton 
                        size="small"
                        edge="end" 
                        onClick={() => handleDelete(blog.slug)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              Henüz blog yazınız bulunmuyor.
            </Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
} 