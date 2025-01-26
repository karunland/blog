import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload } from 'react-icons/fi';
import { getCategories, createBlog } from '../../lib/api';
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
  Select
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CreateIcon from '@mui/icons-material/Create';
import '../../styles/AddBlog.css';
export function AddBlog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    image: null,
    status: 1,
    slug: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  // get theme info from local storage
  const isDarkMode = localStorage.getItem('theme') === 'dark';

  useEffect(() => {
    fetchCategories();
    document.title = 'Yeni Blog Yazısı | BlogApp';
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.isSuccess) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata oluştu:', error);
      setError('Kategoriler yüklenirken bir hata oluştu.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' ? {
        slug: value.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      } : {})
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
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
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await createBlog(formDataToSend);

      if (response.isSuccess) {
        navigate('/dashboard/blogs');
      } else {
        setError(response.errors?.join(', ') || 'Bir hata oluştu');
      }
    } catch (error) {
      setError('Blog eklenirken bir hata oluştu.');
      console.error('Blog eklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <CreateIcon sx={{ fontSize: 32, mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Yeni Blog Yazısı
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Başlık"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                margin="normal"
              />

              <TextField
                fullWidth
                label="URL Slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                margin="normal"
              />
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
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  {imagePreview ? 'Kapak Resmini Değiştir' : 'Kapak Resmi Yükle'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Önizleme"
                    sx={{
                      mt: 2,
                      maxWidth: '100%',
                      maxHeight: 200,
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                )}
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
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | bold italic underline strikethrough forecolor backcolor | align bullist numlist | link image media | spellchecker code fullscreen',
                    content_style: `
                      body { 
                        font-family: Inter, Arial, sans-serif; 
                        font-size: 16px;
                        background-color: ${isDarkMode ? '#2d2d2d' : '#ffffff'};
                        color: ${isDarkMode ? '#ffffff' : '#2d3436'};
                      }
                      p { 
                        color: ${isDarkMode ? '#ffffff' : '#2d3436'};
                        line-height: 1.6;
                      }
                      h1, h2, h3, h4, h5, h6 { 
                        color: ${isDarkMode ? '#ffffff' : '#2d3436'};
                        font-weight: 600;
                      }
                    `,
                    skin: isDarkMode ? 'oxide-dark' : 'oxide',
                    content_css: isDarkMode ? 'dark' : 'default'
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{ mt: 4 }}
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}