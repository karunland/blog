import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BlogCard } from './BlogCard';
import { getBlogsByCategory, getAllCategories, searchBlogs } from '../lib/api';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Skeleton,
  Paper,
  InputAdornment,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
  ListItemSecondaryAction,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import CategoryIcon from '@mui/icons-material/Category';

function BlogSkeleton() {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3].map(i => (
        <Grid item xs={12} key={i}>
          <Paper sx={{ p: 2 }}>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="20%" height={20} sx={{ mt: 1 }} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get('PageNumber')) || 1;
  const pageSize = parseInt(searchParams.get('PageSize')) || 9;
  const [searchTerm, setSearchTerm] = useState(searchParams.get('Search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('SortBy') || 'newest');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('CategoryId') || '');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.isSuccess) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const handleSearchInputChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value.length > 0) {
      try {
        const response = await searchBlogs(value);
        if (response.isSuccess) {
          setSearchSuggestions(response.data);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSuggestionClick = (slug) => {
    navigate(`/blog/${slug}`);
    setShowSuggestions(false);
  };

  const handleSort = (event) => {
    const value = event.target.value;
    setSortBy(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('SortBy', value);
    newParams.set('PageNumber', '1');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategory(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('CategoryId', value);
    } else {
      newParams.delete('CategoryId');
    }
    newParams.set('PageNumber', '1');
    setSearchParams(newParams);
  };

  async function loadPosts() {
    setLoading(true);
    try {
      const params = {
        PageNumber: currentPage,
        PageSize: pageSize,
        CategoryId: searchParams.get('CategoryId') || '',
        Search: searchParams.get('Search') || '',
        SortBy: searchParams.get('SortBy') || 'newest'
      };

      const response = await getBlogsByCategory(params);
      
      if (response.isSuccess) {
        setPosts(response.data);
        setTotalCount(response.count);
        setTotalPages(Math.ceil(response.count / pageSize));
      }
    } catch (error) {
      console.error('Bloglar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [searchParams]);

  const handlePageChange = (pageNumber) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('PageNumber', pageNumber);
    setSearchParams(newParams);
  };

  if (loading) {
    return <BlogSkeleton />;
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Blog ara..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            {showSuggestions && searchSuggestions.length > 0 && (
              <Paper
                sx={{
                  position: 'absolute',
                  width: '100%',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflow: 'auto',
                }}
              >
                <List>
                  {searchSuggestions.map((blog) => (
                    <ListItem
                      key={blog.slug}
                      button
                      onClick={() => handleSuggestionClick(blog.slug)}
                    >
                      <ListItemText primary={blog.title} />
                      {/* add category and author name */}
                      <ListItemSecondaryAction>
                        <Chip 
                          size="small"
                          label={blog.categoryName}
                          sx={{ ml: 1 }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Kategori"
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="">Tüm Kategoriler</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
                <Chip 
                  size="small"
                  label={category.blogsCount || 0}
                  sx={{ ml: 1 }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sıralama</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSort}
            label="Sıralama"
            startAdornment={
              <InputAdornment position="start">
                <SortIcon />
              </InputAdornment>
            }
          >
            <MenuItem value="newest">En Yeni</MenuItem>
            <MenuItem value="oldest">En Eski</MenuItem>
            <MenuItem value="most_viewed">En Çok Görüntülenen</MenuItem>
            <MenuItem value="most_commented">En Çok Yorumlanan</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            Gösterilecek blog bulunamadı.
          </Paper>
        )}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          {/* Pagination component will be added here */}
        </Box>
      )}
    </Box>
  );
}
