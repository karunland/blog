import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Stack, Chip } from '@mui/material';
import { BlogCard } from '../components/BlogCard';
import { searchBlogs } from '../lib/api';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export function Search() {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const response = await searchBlogs(query);
        if (response.isSuccess) {
          setResults(response.data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <Container>
        <Typography variant="h4" sx={{ my: 2 }}>
          Arama terimi giriniz
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 2 }}>
        "{query}" için arama sonuçları
      </Typography>
      
      {loading ? (
        <Typography>Yükleniyor...</Typography>
      ) : results.length > 0 ? (
        <Stack spacing={2}>
          {results.map(blog => (
            <Paper 
              key={blog.slug} 
              elevation={1} 
              sx={{ 
                p: 2,
                '&:hover': {
                  boxShadow: 3,
                  transition: 'box-shadow 0.3s ease-in-out'
                }
              }}
            >
              <BlogCard blog={blog} />
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ 
                  mt: 1,
                  color: 'text.secondary',
                  fontSize: '0.875rem'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PersonIcon fontSize="small" />
                  {blog.authorName}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CategoryIcon fontSize="small" />
                  {blog.categoryName}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon fontSize="small" />
                  {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                </Box>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Typography>
          Sonuç bulunamadı
        </Typography>
      )}
    </Container>
  );
} 