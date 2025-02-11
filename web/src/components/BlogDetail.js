import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogBySlug } from '../lib/api';
import { CommentSection } from './CommentSection';
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
  Grid,
  IconButton,
  Avatar
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import PersonIcon from '@mui/icons-material/Person';
import CommentIcon from '@mui/icons-material/Comment';

export function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const contentRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    loadBlog();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      // Blog içeriğini contentRef'e ekle
      contentRef.current.innerHTML = blog.content;

      // Başlıkları bul ve ID'lerini ayarla
      const headingElements = contentRef.current.querySelectorAll('h1, h2, h3');
      const headingsData = Array.from(headingElements).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        return {
          id,
          text: heading.textContent,
          level: parseInt(heading.tagName[1])
        };
      });
      setHeadings(headingsData);

      // Başlıklara stil ekle
      headingElements.forEach(heading => {
        heading.style.color = theme.palette.text.primary;
        heading.style.marginTop = theme.spacing(4);
        heading.style.marginBottom = theme.spacing(2);
      });

      // Paragraf ve link stillerini ayarla
      const paragraphs = contentRef.current.querySelectorAll('p');
      paragraphs.forEach(p => {
        p.style.color = theme.palette.text.primary;
        p.style.marginBottom = theme.spacing(2);
        p.style.lineHeight = '1.8';
      });

      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.style.color = theme.palette.primary.main;
        link.style.textDecoration = 'none';
      });
    }
  }, [blog, theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%'
      }
    );

    const headingElements = contentRef.current?.querySelectorAll('h1, h2, h3') || [];
    headingElements.forEach((element) => observer.observe(element));

    return () => {
      headingElements.forEach((element) => observer.unobserve(element));
    };
  }, [blog]);

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
        <Typography color="text.secondary">Yükleniyor...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={headings.length > 0 ? 8 : 12}>
          {blog.imageUrl && (
            <Box
              component="img"
              src={blog.imageUrl}
              alt={blog.title}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: 2,
                mb: 4,
                boxShadow: theme.shadows[4]
              }}
            />
          )}

          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              letterSpacing: '-0.01em'
            }}
          >
            {blog.title}
          </Typography>

          <Stack 
            direction="row" 
            spacing={3} 
            sx={{ mb: 4 }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                src={blog.authorPhoto}
                alt={blog.authorName}
                sx={{ 
                  width: 48,
                  height: 48,
                  border: '2px solid',
                  borderColor: 'primary.light',
                  backgroundColor: 'grey.200',
                  '& img': {
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    aspectRatio: '1/1'
                  }
                }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {blog.authorName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString() : new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <RemoveRedEyeIcon sx={{ color: 'text.secondary' }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {blog.viewCount}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <CommentIcon sx={{ color: 'text.secondary' }} fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                {blog.commentCount}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 4 }} />
          
          <Box
            ref={contentRef}
            sx={{
              typography: 'body1',
              color: 'text.primary',
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                borderRadius: 1,
                my: 2
              },
              '& pre': {
                backgroundColor: 'background.paper',
                p: 2,
                borderRadius: 1,
                overflow: 'auto',
                '& code': {
                  color: 'text.primary'
                }
              },
              '& blockquote': {
                borderLeft: 4,
                borderColor: 'primary.main',
                pl: 2,
                my: 2,
                color: 'text.secondary',
                fontStyle: 'italic'
              }
            }}
          />

          <Divider sx={{ my: 4 }} />
          
          <CommentSection blogSlug={slug} />
        </Grid>

        {headings.length > 0 && (
          <Grid item xs={12} lg={4}>
            <Paper
              elevation={1}
              sx={{
                position: isMobile ? 'relative' : 'sticky',
                top: isMobile ? 0 : 100,
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 600,
                  mb: 2
                }}
              >
                İçindekiler
              </Typography>
              <Stack spacing={0.5}>
                {headings.map((heading) => (
                  <Button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    variant={activeId === heading.id ? "contained" : "text"} 
                    size="small"
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      pl: heading.level > 1 ? (heading.level - 1) * 1 : 0.5,
                      py: 0.25,
                      minHeight: 0,
                      fontSize: '0.875rem',
                      color: activeId === heading.id ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        backgroundColor: activeId === heading.id ? 'primary.dark' : 'action.hover'
                      }
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