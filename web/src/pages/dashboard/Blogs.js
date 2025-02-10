import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getBlogPosts, deleteBlog, changeBlogStatus } from '../../lib/api';
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
  Button,
  Menu,
  MenuItem,
  Chip,
  Stack,
  ListItemIcon
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import DraftsIcon from '@mui/icons-material/Drafts';
import PublishIcon from '@mui/icons-material/Publish';
import ArchiveIcon from '@mui/icons-material/Archive';
import { toast } from '../../utils/toast';
import '../../styles/MyBlogs.css';

export function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
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
          toast.success('Blog başarıyla silindi');
        } else {
          toast.error('Blog silinirken bir hata oluştu');
        }
      } catch (error) {
        console.error('Blog silinirken hata:', error);
        toast.error('Blog silinirken bir hata oluştu');
      }
    }
  };

  const handleStatusMenuClick = (event, blog) => {
    setStatusMenuAnchor(event.currentTarget);
    setSelectedBlog(blog);
  };

  const handleStatusMenuClose = () => {
    setStatusMenuAnchor(null);
    setSelectedBlog(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await changeBlogStatus(selectedBlog.slug, newStatus);
      if (response.isSuccess) {
        loadMyBlogs();
        toast.success('Blog durumu güncellendi');
      } else {
        toast.error('Blog durumu güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Blog durumu güncellenirken hata:', error);
      toast.error('Blog durumu güncellenirken bir hata oluştu');
    }
    handleStatusMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 1: return 'warning'; // Taslak
      case 2: return 'success'; // Yayında
      case 3: return 'error'; // Arşivlendi
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Taslak';
      case 2: return 'Yayında';
      case 3: return 'Arşivlendi';
      default: return 'Bilinmiyor';
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
            size='small'
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
                <ListItem sx={{ py: 2 }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {blog.title}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                          </Typography>
                          <Chip 
                            label={getStatusText(blog.statusEnumId)}
                            size="small"
                            color={getStatusColor(blog.statusEnumId)}
                            variant="outlined"
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {blog.viewCount || 0}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {blog.commentCount || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Durum Değiştir">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={(e) => handleStatusMenuClick(e, blog)}
                        sx={{ 
                          mr: 1,
                          color: 'primary.main',
                          '&:hover': {
                            backgroundColor: 'primary.lighter',
                          }
                        }}
                      >
                        <SwapHorizIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Düzenle">
                      <IconButton 
                        size="small"
                        edge="end" 
                        onClick={() => navigate(`/dashboard/add-blog/${blog.slug}`)}
                        sx={{ 
                          mr: 1,
                          color: 'info.main',
                          '&:hover': {
                            backgroundColor: 'info.lighter',
                          }
                        }}
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
                        sx={{ 
                          '&:hover': {
                            backgroundColor: 'error.lighter',
                          }
                        }}
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

      <Menu
        anchorEl={statusMenuAnchor}
        open={Boolean(statusMenuAnchor)}
        onClose={handleStatusMenuClose}
      >
        <MenuItem onClick={() => handleStatusChange(1)}>
          <ListItemIcon>
            <DraftsIcon fontSize="small" sx={{ color: 'warning.main' }} />
          </ListItemIcon>
          <Typography variant="body2">Taslak</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(2)}>
          <ListItemIcon>
            <PublishIcon fontSize="small" sx={{ color: 'success.main' }} />
          </ListItemIcon>
          <Typography variant="body2">Yayınla</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange(3)}>
          <ListItemIcon>
            <ArchiveIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <Typography variant="body2">Arşivle</Typography>
        </MenuItem>
      </Menu>
    </Container>
  );
} 