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
import heroImage from '../assets/home.png';
import { getBestBlogs } from '../lib/api';
import { useState, useEffect } from 'react';

export function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBestBlogs();
        if (response.isSuccess) {
          setBlogs(response.data);
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
          color: '#fff',
          
          mb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
                Düşüncelerinizi Dünyayla Paylaşın
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, color: '#e0e0e0' }}>
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
                    bgcolor: '#B47E31',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#B47E31'
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
                // add filter to blue
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
            borderBottom: `2px solid #E09F3E`,
            pb: 1,
            width: 'fit-content',
            color: '#fff'
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
              color: '#fff'
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
            bgcolor: 'rgba(255,255,255,0.02)',
            border: '1px dashed',
            borderColor: 'rgba(255,255,255,0.1)'
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
              borderColor: '#fff',
              color: '#fff',
              '&:hover': {
                borderColor: '#fff',
                bgcolor: 'rgba(255,255,255,0.05)'
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
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
                border: 1,
                borderColor: 'rgba(255,255,255,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 5px 15px rgba(255,255,255,0.1)'
                }
              }}
            >
              <CreateIcon sx={{ fontSize: 40, color: '#fff', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#f5f5f5' }}>
                Kolay İçerik Oluşturma
              </Typography>
              <Typography sx={{ color: '#bdbdbd' }}>
                Modern editör ile yazılarını kolayca oluştur ve düzenle
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
                border: 1,
                borderColor: 'rgba(255,255,255,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 5px 15px rgba(255,255,255,0.1)'
                }
              }}
            >
              <GroupIcon sx={{ fontSize: 40, color: '#fff', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#f5f5f5' }}>
                Aktif Topluluk
              </Typography>
              <Typography sx={{ color: '#bdbdbd' }}>
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
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
                border: 1,
                borderColor: 'rgba(255,255,255,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 5px 15px rgba(255,255,255,0.1)'
                }
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 40, color: '#fff', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#f5f5f5' }}>
                SEO Dostu
              </Typography>
              <Typography sx={{ color: '#bdbdbd' }}>
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
                bgcolor: 'rgba(255,255,255,0.03)',
                borderRadius: 2,
                border: 1,
                borderColor: 'rgba(255,255,255,0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 5px 15px rgba(255,255,255,0.1)'
                }
              }}
            >
              <AutoStoriesIcon sx={{ fontSize: 40, color: '#fff', mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: '#f5f5f5' }}>
                Zengin İçerik
              </Typography>
              <Typography sx={{ color: '#bdbdbd' }}>
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
            bgcolor: 'rgba(255,255,255,0.03)',
            borderRadius: 4,
            border: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            '& h3': {
              color: '#f5f5f5'
            },
            '& h6': {
              color: '#bdbdbd'
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
              bgcolor: '#B47E31',
              color: '#ffffff',
              '&:hover': {
                bgcolor: '#B47E31'
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
          color: '#fff',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        {/* ... Icon button içeriği ... */}
      </IconButton>
    </Box>
  );
}
