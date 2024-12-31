import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getAllCategories } from '../lib/api';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Skeleton,
  Chip,
  Divider,
  Box
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ArticleIcon from '@mui/icons-material/Article';

function SideBarSkeleton() {
  return (
    <Paper sx={{ p: 2 }}>
      {[1, 2, 3, 4].map((item) => (
        <Skeleton
          key={item}
          variant="rectangular"
          height={40}
          sx={{ mb: 1, borderRadius: 1 }}
        />
      ))}
    </Paper>
  );
}

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeCategoryId = searchParams.get('CategoryId');

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.isSuccess) {
        setCategories(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryId) {
      newParams.set('CategoryId', categoryId);
    } else {
      newParams.delete('CategoryId');
    }
    newParams.set('PageNumber', '1');
    newParams.set('PageSize', '9');
    navigate(`/?${newParams.toString()}`);
  };

  if (loading) {
    return <SideBarSkeleton />;
  }

  const totalBlogs = categories.reduce((total, cat) => total + (cat.blogsCount || 0), 0);

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ pl: 2, fontWeight: 'medium' }}>
        Kategoriler
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <List component="nav" disablePadding>
        <ListItemButton
          selected={!activeCategoryId}
          onClick={() => handleCategoryClick(null)}
        >
          <ListItemIcon>
            <ArticleIcon />
          </ListItemIcon>
          <ListItemText primary="Tüm Yazılar" />
          <Chip 
            label={totalBlogs}
            size="small"
            color={!activeCategoryId ? "primary" : "default"}
          />
        </ListItemButton>

        {categories.map(category => (
          <ListItemButton
            key={category.id}
            selected={activeCategoryId === category.id.toString()}
            onClick={() => handleCategoryClick(category.id)}
          >
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary={category.name} />
            <Chip 
              label={category.blogsCount || 0}
              size="small"
              color={activeCategoryId === category.id.toString() ? "primary" : "default"}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
