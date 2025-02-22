import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BlogCard } from './BlogCard';
import { getBlogsByCategory, getAllCategories, searchBlogs } from '../lib/api';
import { PulseLoader } from 'react-spinners';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
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
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Box 
            sx={{ 
              height: '100%',
              maxHeight: 420,
              borderRadius: '12px',
              overflow: 'hidden',
              border: '0.8px solid transparent',
              bgcolor: 'background.paper',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Author Section */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Skeleton 
                variant="circular" 
                width={40} 
                height={40}
                sx={{ 
                  border: '2px solid',
                  borderColor: 'primary.light'
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="text" width={80} height={16} />
              </Box>
            </Box>

            {/* Image Section */}
            <Box sx={{ px: 1 }}>
              <Skeleton 
                variant="rectangular" 
                height={200}
                sx={{ 
                  borderRadius: '24px',
                }}
              />
            </Box>

            {/* Content Section */}
            <Box sx={{ p: 2, flexGrow: 1 }}>
              <Skeleton variant="text" height={28} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={28} />
            </Box>

            {/* Stats Bar */}
            <Box 
              sx={{ 
                p: 2,
                mt: 'auto',
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Skeleton variant="circular" width={18} height={18} />
                  <Skeleton variant="text" width={20} />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Skeleton variant="circular" width={18} height={18} />
                  <Skeleton variant="text" width={20} />
                </Stack>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Skeleton variant="circular" width={18} height={18} />
                  <Skeleton variant="text" width={20} />
                </Stack>
              </Stack>
              <Skeleton 
                variant="rounded" 
                width={90} 
                height={24} 
                sx={{ borderRadius: '16px' }} 
              />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export const BlogSortType = {
  Newest: 0,
  Oldest: 1,
  MostViewed: 2,
  MostCommented: 3
}

export function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const pageSize = 9;
  const [searchTerm, setSearchTerm] = useState(searchParams.get('Search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('SortBy') || BlogSortType.Newest);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('CategoryId') || '');
  const observer = useRef();

  const lastBlogElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

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
    setSearchParams(newParams);
  };

  async function loadPosts(isNewSearch = false) {
    setLoading(true);
    try {
      const params = {
        PageNumber: isNewSearch ? 1 : page,
        PageSize: pageSize,
        CategoryId: searchParams.get('CategoryId') || '',
        Search: searchParams.get('Search') || '',
        SortBy: searchParams.get('SortBy') || 'newest'
      };

      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await getBlogsByCategory(params);
      
      if (response.isSuccess) {
        setPosts(prevPosts => {
          if (isNewSearch) {
            return response.data;
          }
          return [...prevPosts, ...response.data];
        });
        setHasMore(response.data.length === pageSize);
      }
    } catch (error) {
      console.error('Bloglar yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadPosts(true);
  }, [searchParams.get('CategoryId'), searchParams.get('Search'), searchParams.get('SortBy')]);

  useEffect(() => {
    loadPosts();
  }, [page]);

  if (loading && posts.length === 0) {
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
                      sx={{
                        cursor: 'pointer',
                      }}
                      onClick={() => handleSuggestionClick(blog.slug)}
                    >
                      <ListItemText primary={blog.title} />
                      <ListItemSecondaryAction>
                        <Chip 
                          size="small"
                          label={blog.categoryName}
                          sx={{ ml: 1}}
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
            <MenuItem value={BlogSortType.Newest}>En Yeni</MenuItem>
            <MenuItem value={BlogSortType.Oldest}>En Eski</MenuItem>
            <MenuItem value={BlogSortType.MostViewed}>En Çok Görüntülenen</MenuItem>
            <MenuItem value={BlogSortType.MostCommented}>En Çok Yorumlanan</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Box>
        {Array.isArray(posts) && posts.length > 0 ? (
          <Grid container spacing={3}>
            {posts.map((blog, index) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <div ref={index === posts.length - 1 ? lastBlogElementRef : null}>
                  <BlogCard blog={blog} />
                </div>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            Gösterilecek blog bulunamadı.
          </Paper>
        )}
        {loading && posts.length > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              py: 4,
              width: '100%'
            }}
          >
            <PulseLoader 
              color="#1976d2"
              size={15}
              margin={2}
              speedMultiplier={0.8}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
