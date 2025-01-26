import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper, Stack, IconButton } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useTheme } from '@mui/material/styles';
import { BlogCard } from '../components/BlogCard';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import heroImage from '../assets/default.jpg';
import { getBestBlogs } from '../lib/api';
import { useState, useEffect } from 'react';

export function Home() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBestBlogs();
        if (response.isSuccess) {
          const blogsArray = response.data.map((blog) => ({
            title: blog.title,
            slug: blog.slug,
            imageUrl: blog.imageUrl,
            createdAt: blog.createdAt,
            categoryName: blog.categoryName,
            viewCount: blog.viewCount
          }));
          setBlogs(blogsArray);
        }
      } catch (error) {
        console.error('Blog verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: isDarkMode 
            ? 'linear-gradient(45deg, #1a1a1a 30%, #2d2d2d 90%)'
            : 'linear-gradient(45deg, #335C67 30%, #4B7C8B 90%)',
          color: isDarkMode ? '#f5f5f5' : 'white',
          py: 12,
          borderRadius: '0 0 20px 20px',
          mb: 8,
          boxShadow: isDarkMode 
            ? '0 3px 10px rgba(0,0,0,0.5)'
            : '0 3px 10px rgba(0,0,0,0.2)'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                Düşüncelerinizi Dünyayla Paylaşın
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, color: isDarkMode ? '#e0e0e0' : 'rgba(255,255,255,0.9)' }}>
                Modern ve kullanıcı dostu blog platformumuzla hikayelerinizi anlatın,
                bilgi paylaşın ve global toplulukla etkileşime geçin.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: isDarkMode ? '#E09F3E' : 'white',
                    color: isDarkMode ? '#1a1a1a' : '#335C67',
                    '&:hover': {
                      bgcolor: isDarkMode ? '#B47E31' : 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Ücretsiz Başla
                </Button>
                <Button
                  component={Link}
                  to="/blog"
                  variant="outlined"
                  size="large"
                  sx={{
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Blogları Keşfet
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={heroImage}
                alt="Blog Platform"
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  height: 'auto',
                  display: { xs: 'none', md: 'block' }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Blog Slider Section */}
      <Container maxWidth="xl" sx={{ mb: 8 }}>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            mb: 4,
            borderBottom: `2px solid ${isDarkMode ? '#E09F3E' : 'var(--orange)'}`,
            pb: 1,
            width: 'fit-content',
            color: isDarkMode ? '#f5f5f5' : theme.palette.text.primary
          }}
        >
          Öne Çıkan Bloglar
        </Typography>
        <Box sx={{
          '.slick-track': {
            display: 'flex',
            gap: 2,
            mx: 0
          },
          '.slick-slide': {
            px: 1,
            height: 'inherit'
          },
          '.slick-slide > div': {
            height: '100%'
          },
          '.slick-prev, .slick-next': {
            zIndex: 1,
            width: 40,
            height: 40,
            '&:before': {
              fontSize: 40,
              color: isDarkMode ? '#fff' : 'var(--orange)'
            }
          },
          '.slick-prev': { left: -45 },
          '.slick-next': { right: -45 }
        }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Yükleniyor...</Typography>
            </Box>
          ) : blogs.length > 0 ? (
            <Slider {...sliderSettings}>
              {blogs.map((blog, index) => (
                <Box key={index}>
                  <BlogCard blog={blog} />
                </Box>
              ))}
            </Slider>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <Typography>Henüz blog yazısı bulunmuyor.</Typography>
            </Box>
          )}
        </Box>
      </Container>

      {/* View All Blogs Section */}
      <Container maxWidth="lg" sx={{ mb: 8, textAlign: 'center' }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(255,107,107,0.02)',
            border: '1px dashed',
            borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,107,107,0.2)'
          }}
        >
          <Typography variant="h5" gutterBottom>
            Daha Fazla İçerik Keşfedin
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Tüm blog yazılarımızı görüntüleyin ve ilginizi çeken konuları keşfedin.
          </Typography>
          <Button
            component={Link}
            to="/blog"
            variant="outlined"
            size="large"
            endIcon={<AutoStoriesIcon />}
            sx={{
              borderColor: isDarkMode ? '#fff' : 'var(--orange)',
              color: isDarkMode ? '#fff' : 'var(--orange)',
              '&:hover': {
                borderColor: isDarkMode ? '#fff' : 'var(--orange)',
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,107,107,0.05)'
              }
            }}
          >
            Tüm Blogları Gör
          </Button>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                bgcolor: isDarkMode 
                  ? 'rgba(255,255,255,0.03)'
                  : theme.palette.background.paper,
                borderRadius: 2,
                border: 1,
                borderColor: isDarkMode
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: isDarkMode 
                    ? '0 5px 15px rgba(255,255,255,0.1)'
                    : '0 5px 15px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CreateIcon sx={{ fontSize: 40, color: isDarkMode ? '#fff' : '#ff6b6b', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? '#f5f5f5' : theme.palette.text.primary }}>
                Kolay İçerik Oluşturma
              </Typography>
              <Typography sx={{ color: isDarkMode ? '#bdbdbd' : theme.palette.text.secondary }}>
                Modern editör ile yazılarınızı kolayca oluşturun ve düzenleyin.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                bgcolor: isDarkMode 
                  ? 'rgba(255,255,255,0.03)'
                  : theme.palette.background.paper,
                borderRadius: 2,
                border: 1,
                borderColor: isDarkMode
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: isDarkMode 
                    ? '0 5px 15px rgba(255,255,255,0.1)'
                    : '0 5px 15px rgba(0,0,0,0.1)'
                }
              }}
            >
              <GroupIcon sx={{ fontSize: 40, color: isDarkMode ? '#fff' : '#ff6b6b', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? '#f5f5f5' : theme.palette.text.primary }}>
                Aktif Topluluk
              </Typography>
              <Typography sx={{ color: isDarkMode ? '#bdbdbd' : theme.palette.text.secondary }}>
                Dünya çapında okuyucularla etkileşime geçin ve fikir alışverişinde bulunun.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                bgcolor: isDarkMode 
                  ? 'rgba(255,255,255,0.03)'
                  : theme.palette.background.paper,
                borderRadius: 2,
                border: 1,
                borderColor: isDarkMode
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: isDarkMode 
                    ? '0 5px 15px rgba(255,255,255,0.1)'
                    : '0 5px 15px rgba(0,0,0,0.1)'
                }
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 40, color: isDarkMode ? '#fff' : '#ff6b6b', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? '#f5f5f5' : theme.palette.text.primary }}>
                SEO Dostu
              </Typography>
              <Typography sx={{ color: isDarkMode ? '#bdbdbd' : theme.palette.text.secondary }}>
                İçerikleriniz arama motorlarında üst sıralarda yer alsın.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                bgcolor: isDarkMode 
                  ? 'rgba(255,255,255,0.03)'
                  : theme.palette.background.paper,
                borderRadius: 2,
                border: 1,
                borderColor: isDarkMode
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: isDarkMode 
                    ? '0 5px 15px rgba(255,255,255,0.1)'
                    : '0 5px 15px rgba(0,0,0,0.1)'
                }
              }}
            >
              <AutoStoriesIcon sx={{ fontSize: 40, color: isDarkMode ? '#fff' : '#ff6b6b', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? '#f5f5f5' : theme.palette.text.primary }}>
                Zengin İçerik
              </Typography>
              <Typography sx={{ color: isDarkMode ? '#bdbdbd' : theme.palette.text.secondary }}>
                Resim, video ve daha fazlasını içeriklerinize ekleyin.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Container maxWidth="md" sx={{ mb: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: isDarkMode
              ? 'rgba(255,255,255,0.03)'
              : theme.palette.background.paper,
            borderRadius: 4,
            border: 1,
            borderColor: isDarkMode
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.1)',
            '& h3': {
              color: isDarkMode ? '#f5f5f5' : theme.palette.text.primary
            },
            '& h6': {
              color: isDarkMode ? '#bdbdbd' : theme.palette.text.secondary
            }
          }}
        >
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold">
            Hikayenizi Anlatmaya Başlayın
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
            Ücretsiz hesap oluşturun ve hemen yazmaya başlayın.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              px: 6,
              py: 1.5,
              bgcolor: isDarkMode ? '#E09F3E' : theme.palette.primary.main,
              color: isDarkMode ? '#1a1a1a' : '#ffffff',
              '&:hover': {
                bgcolor: isDarkMode ? '#B47E31' : theme.palette.primary.dark
              }
            }}
          >
            Hemen Başla
          </Button>
        </Paper>
      </Container>

      {/* Diğer bileşenler için de benzer güncellemeler */}
      <IconButton
        sx={{
          color: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.1)'
          }
        }}
      >
        {/* ... Icon button içeriği ... */}
      </IconButton>
    </Box>
  );
}
