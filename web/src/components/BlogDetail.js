import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogBySlug } from '../lib/api';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Stack,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Grid
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

export function BlogDetail() {
  const [blog, setBlog] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const { slug } = useParams();
  const contentRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    loadBlog();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blog.content;
      
      const headingElements = tempDiv.querySelectorAll('h1');
      const headingsData = Array.from(headingElements).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent,
          level: 1
        };
      });
      
      setHeadings(headingsData);
      
      const contentWithIds = tempDiv.innerHTML;
      if (contentRef.current) {
        contentRef.current.innerHTML = contentWithIds;
      }
    }
  }, [blog]);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const headingElements = contentRef.current.querySelectorAll('h1');
      const scrollPosition = window.scrollY + 100;

      let currentHeading = null;
      
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        const headingTop = heading.offsetTop;
        
        if (scrollPosition >= headingTop) {
          currentHeading = heading;
          break;
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading.id);
      } else if (headingElements.length > 0) {
        if (scrollPosition < headingElements[0].offsetTop) {
          setActiveId(headingElements[0].id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function loadBlog() {
    try {
      const response = await getBlogBySlug(slug);
      if (response.isSuccess) {
        setBlog(response.data);
      }
    } catch (error) {
      console.error('Blog yüklenemedi:', error);
    }
  }

  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (!blog) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography>Yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={headings.length > 0 ? 8 : 12} style={{ wordBreak: 'break-word' }}>
          {blog.imageUrl && (
            <Box
              component="img"
              src={blog.imageUrl}
              alt={blog.title}
              sx={{
                width: '100%',
                height: '600px',
                objectFit: 'cover',
                borderRadius: 2,
                mb: 4
              }}
            />
          )}
          
          <Typography variant="h3" component="h1" gutterBottom>
            {blog.title}
          </Typography>

          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ mb: 4 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {blog.authorName}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayIcon color="action" fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 4 }} />
          
          <Box
            ref={contentRef}
            sx={{
              typography: 'body1',
              '& h1': {
                ...theme.typography.h4,
                mt: 4,
                mb: 2
              },
              '& p': {
                mb: 2,
                lineHeight: 1.8
              }
            }}
          />
        </Grid>

        {headings.length > 0 && (
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                position: isMobile ? 'relative' : 'sticky',
                top: isMobile ? 0 : 100,
                p: 3,
                bgcolor: 'grey.50',
                height: 'fit-content',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" gutterBottom>
                İçindekiler
              </Typography>
              <Stack spacing={1}>
                {headings.map((heading) => (
                  <Button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    variant={activeId === heading.id ? "contained" : "text"}
                    size="small"
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      textTransform: 'none',
                      px: 2
                    }}
                  >
                    {heading.text}
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
} 