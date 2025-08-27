import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories, createBlog, getBlogDetail, updateBlog } from '../../lib/api';
import { Editor } from '@tinymce/tinymce-react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardMedia,
  Stack,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Tooltip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import InfoIcon from '@mui/icons-material/Info';
import toastr from 'toastr';

import '../../styles/AddBlog.css';


const MIN_WORD_COUNT = 20; // Minimum kelime sayısı
const REACT_APP_TINYMCE_API_KEY = process.env.REACT_APP_TINYMCE_API_KEY;

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`blog-tabpanel-${index}`}
      aria-labelledby={`blog-tab-${index}`}
      {...other}
      sx={{ mt: 2 }}
    >
      {value === index && children}
    </Box>
  );
}

export function AddBlog() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditMode = Boolean(slug);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    image: null,
    status: 1
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [wordCount, setWordCount] = useState(0);


  if (!REACT_APP_TINYMCE_API_KEY) {
    toastr.error('TinyMCE API Key bulunamadı');
    navigate('/');
  }

  useEffect(() => {
    document.title = isEditMode 
      ? formData.title 
        ? `${formData.title} Düzenle | BlogApp` 
        : 'Blog Düzenle | BlogApp'
      : 'Yeni Blog Yazısı | BlogApp';
  }, [isEditMode, formData.title]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await getCategories();
        if (categoriesResponse.isSuccess) {
          setCategories(categoriesResponse.data);
        }

        if (isEditMode) {
          const blogResponse = await getBlogDetail(slug);
          if (blogResponse.isSuccess) {
            const blogData = blogResponse.data;
            setFormData({
              title: blogData.title,
              content: blogData.content,
              categoryId: blogData.categoryId,
              status: blogData.statusEnumId,
              image: blogData.imageUrl,
              id: blogData.id
            });
            if (blogData.imageUrl) {
              setImagePreview(blogData.imageUrl);
            }
            // İçerik yüklendiğinde kelime sayısını hesapla
            calculateWordCount(blogData.content);
          }
        }
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError('Veriler yüklenirken bir hata oluştu.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateWordCount = (content) => {
    // HTML etiketlerini kaldır ve sadece metni al
    const strippedContent = content.replace(/<[^>]*>/g, ' ');
    // Boşluklara göre böl ve boş olmayan kelimeleri say
    const words = strippedContent.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
    calculateWordCount(content);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // if environment is production, check if the word count is greater than 100
    if (process.env.NODE_ENV === 'production' && wordCount < MIN_WORD_COUNT) {
      setError(`Blog yazınız en az ${MIN_WORD_COUNT} kelime içermelidir. Şu an: ${wordCount} kelime`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      if (isEditMode) {
        formDataToSend.append('Id', parseInt(formData.id));
        formDataToSend.append('Title', formData.title);
        formDataToSend.append('Content', formData.content);
        formDataToSend.append('CategoryId', parseInt(formData.categoryId));
        formDataToSend.append('Status', parseInt(formData.status));
        if (formData.image instanceof File) {
          formDataToSend.append('Image', formData.image);
        }
      } else {
        formDataToSend.append('title', formData.title);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('status', formData.status === 1 ? 'Draft' : formData.status === 2 ?
          'Published' : 'Archived');
        if (formData.image) {
          formDataToSend.append('image', formData.image);
        }
      }

      const response = isEditMode
        ? await updateBlog(formDataToSend)
        : await createBlog(formDataToSend);

      if (response.isSuccess) {
        navigate('/dashboard/blogs');
      } else {
        setError(response.errors?.join(', ') || 'Bir hata oluştu');
      }
    } catch (error) {
      setError(`Blog ${isEditMode ? 'güncellenirken' : 'eklenirken'} bir hata oluştu.`);
      console.error(`Blog ${isEditMode ? 'güncellenirken' : 'eklenirken'} hata:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderPreview = () => {
    return (
      <Box>
        {imagePreview && (
          <Box
            component="img"
            src={imagePreview}
            alt={formData.title}
            sx={{
              width: '100%',
              height: 'auto',
              maxHeight: '400px',
              objectFit: 'cover',
              borderRadius: 2,
              mb: 4,
              boxShadow: 3
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
          {formData.title || 'Blog Başlığı'}
        </Typography>

        <Stack 
          direction="row" 
          spacing={3} 
          sx={{ mb: 4 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{ 
                width: 48,
                height: 48,
                border: '2px solid',
                borderColor: 'primary.light',
                backgroundColor: 'grey.200'
              }}
            />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Yazar Adı
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date().toLocaleDateString('tr-TR')}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        <Divider sx={{ mb: 4 }} />
        
        <Box
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
              overflow: 'auto'
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
          dangerouslySetInnerHTML={{ __html: formData.content || 'Blog içeriği buraya gelecek...' }}
        />
      </Box>
    );
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 4, borderRadius: 2, paddingTop: 1, backgroundColor: 'transparent', color: '#2d3436' }}>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab 
            icon={<EditIcon />} 
            iconPosition="start" 
            label="Düzenle" 
          />
          <Tab 
            icon={<RemoveRedEyeIcon />} 
            iconPosition="start" 
            label="Önizleme" 
          />
        </Tabs>
      </Box>

      <Box component="form" onSubmit={handleSubmit}>
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Başlık"
                name="title"
                size="small"
                value={formData.title}
                onChange={handleInputChange}
                required
                margin="normal"
              />

              {formData.title && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {window.location.origin}/blog/{formData.slug}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  label="Kategori"
                  size="small"
                > 
                  <MenuItem value="" disabled>
                    Kategori seçin
                  </MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Durum</InputLabel>
                <Select
                  name="status"
                  size="small"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  label="Durum"
                >
                  <MenuItem value={1}>Taslak</MenuItem>
                  <MenuItem value={2}>Yayınlandı</MenuItem>
                  <MenuItem value={3}>Arşivlendi</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Card 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  backgroundColor: 'transparent',
                  border: '2px dashed',
                  borderColor: theme => imagePreview ? 'primary.main' : 'divider',
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    borderColor: 'primary.main',
                    cursor: 'pointer'
                  }
                }}
              >
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  
                  {imagePreview ? (
                    <Box sx={{ width: '100%', position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={imagePreview}
                        alt="Blog kapak resmi"
                        sx={{
                          width: '100%',
                          height: 300,
                          objectFit: 'cover',
                          borderRadius: 1,
                          mb: 2
                        }}
                      />
                      <Stack 
                        direction="row" 
                        spacing={1} 
                        sx={{ 
                          position: 'absolute',
                          bottom: 24,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: 1,
                          p: 0.5
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.preventDefault();
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                          sx={{ 
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          component="span"
                          sx={{ 
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                          }}
                        >
                          <PhotoCamera />
                        </IconButton>
                      </Stack>
                    </Box>
                  ) : (
                    <Box sx={{ 
                      py: 6, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      color: 'text.secondary'
                    }}>
                      <ImageIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                      <Typography variant="h6" gutterBottom>
                        Kapak Fotoğrafı Yükle
                      </Typography>
                      <Typography variant="body2" color="text.secondary" align="center">
                        Sürükle bırak veya seçmek için tıkla
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        PNG, JPG veya GIF (Max. 5MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>

              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'start', gap: 2, alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2">
                    İçerik
                  </Typography>
                  <Tooltip title={`Blog yazın en az ${MIN_WORD_COUNT} kelime içermelidir`}>
                    <InfoIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
                  </Tooltip>
                </Box>
                <Chip 
                  label={`${wordCount} kelime`}
                  color={wordCount >= MIN_WORD_COUNT ? "success" : "warning"}
                  size="small"
                  variant="outlined"
              />
              </Box>

              <Box className="editor-container">
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                  value={formData.content}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: 800,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'table', 'code', 'help', 'wordcount', 'codesample'
                    ],
                    toolbar: 'undo redo | blocks | bold italic underline strikethrough forecolor backcolor | align bullist numlist | link | codesample | spellchecker code fullscreen',
                    codesample_languages: [
                      { text: 'C#', value: 'csharp' },
                      { text: 'HTML/XML', value: 'markup' },
                      { text: 'JavaScript', value: 'javascript' },
                      { text: 'CSS', value: 'css' },
                      { text: 'PHP', value: 'php' },
                      { text: 'Python', value: 'python' },
                      { text: 'Java', value: 'java' },
                      { text: 'SQL', value: 'sql' }
                    ],
                    content_style: `
                      body { 
                        font-family: Inter, Arial, sans-serif; 
                        font-size: 16px;
                        background-color: ${'#2d2d2d'};
                        color: ${'#ffffff'};
                      }
                      p { 
                        color: ${'#ffffff'};
                        line-height: 1.6;
                      }
                      h1, h2, h3, h4, h5, h6 { 
                        color: ${'#ffffff'};
                        font-weight: 600;
                      }
                    `,
                    skin: 'oxide-dark',
                    content_css: 'dark',
                    font_size_formats: '12px 14px 16px 18px 24px 36px 48px',
                    font_size: '16px',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {renderPreview()}
        </TabPanel>

        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          disabled={loading || wordCount < MIN_WORD_COUNT}
          sx={{ mt: 4 }}
        >
          {loading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Box>
    </Paper>
  );
}