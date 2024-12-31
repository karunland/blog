import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories, getBlogDetail, updateBlog } from '../../lib/api';
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
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import '../../styles/AddBlog.css';

export function EditBlog() {
  const navigate = useNavigate();
  const { slug } = useParams();
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

  const fetchBlogAndCategories = async () => {
    if (!slug) return;
    
    try {
      const [blogResponse, categoriesResponse] = await Promise.all([
        getBlogDetail(slug),
        getCategories()
      ]);

      if (blogResponse.isSuccess) {
        const newFormData = {
          title: blogResponse.data.title,
          content: blogResponse.data.content,
          categoryId: blogResponse.data.categoryId,
          status: blogResponse.data.statusEnumId,
          slug: blogResponse.data.slug
        };
        setFormData(newFormData);
        if (blogResponse.data.imageUrl) {
          setImagePreview(blogResponse.data.imageUrl);
        }
      }

      if (categoriesResponse.isSuccess) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      setError('Blog bilgileri yüklenirken bir hata oluştu.');
    }
  };

  useEffect(() => {
    fetchBlogAndCategories();
  }, [slug]);

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

      const response = await updateBlog(slug, formDataToSend);

      if (response.isSuccess) {
        navigate('/dashboard/blogs');
      } else {
        setError(response.errors?.join(', ') || 'Bir hata oluştu');
      }
    } catch (error) {
      setError('Blog güncellenirken bir hata oluştu.');
      console.error('Blog güncellenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData.title) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Blog Düzenle
        </Typography>

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
                    content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
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