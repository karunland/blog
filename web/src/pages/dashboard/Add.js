import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { FiSave, FiUpload } from 'react-icons/fi';
import { getCategories, createBlog } from '../../lib/api';
import { Editor } from '@tinymce/tinymce-react';
import '../../styles/AddBlog.css';

export function AddBlog() {
  const navigate = useNavigate();
  const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
  const textColor = isDarkTheme ? '#fff' : '#000';
  const placeholderColor = isDarkTheme ? '#aaa' : '#6c757d';
  const backgroundColor = isDarkTheme ? '#333' : '#fff';

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

  useEffect(() => {
    fetchCategories();
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
    const file = e.target.files[0];
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
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('categoryId', formData.categoryId);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('slug', formData.slug);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

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
    <div className="add-blog">
      <Container fluid>
        <h2 style={{ color: textColor }}>Yeni Blog Ekle</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={9}>
              <Form.Group className="form-group">
                <Form.Label style={{ color: textColor }}>Başlık</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Blog başlığını girin"
                  required
                  style={{ 
                    color: textColor,
                    backgroundColor: backgroundColor,
                    '::placeholder': { color: placeholderColor }
                  }}
                />
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label style={{ color: textColor }}>URL Slug</Form.Label>
                <Form.Control
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="url-slug-giriniz"
                  required
                  style={{ 
                    color: textColor,
                    backgroundColor: backgroundColor,
                    '::placeholder': { color: placeholderColor }
                  }}
                />
              </Form.Group>
            </Col>
          
            <Col lg={3}>
              <Form.Group className="form-group">
                <Form.Label style={{ color: textColor }}>Kategori</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    color: textColor,
                    backgroundColor: backgroundColor
                  }}
                >
                  <option value="" style={{ color: placeholderColor }}>Kategori seçin</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id} style={{ color: textColor }}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label style={{ color: textColor }}>Durum</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  style={{ 
                    color: textColor,
                    backgroundColor: backgroundColor
                  }}
                >
                  <option value={1} style={{ color: textColor }}>Taslak</option>
                  <option value={2} style={{ color: textColor }}>Yayınlandı</option>
                  <option value={3} style={{ color: textColor }}>Arşivlendi</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
          <div className="form-group">
          <label className="file-upload" htmlFor="image">
            <div className="file-upload-icon">
              <FiUpload />
            </div>
            <div className="file-upload-text">
              {formData.image ? 'Resmi değiştir' : 'Kapak resmi yükle'}
            </div>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          {imagePreview && (
            <div className="file-preview">
              <img src={imagePreview} alt="Önizleme" />
            </div>
          )}
        </div>
        </Row>
          <Row>
            <Col lg={12}>
              <Form.Group className="form-group editor-container">
                <Form.Label>İçerik</Form.Label>
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                  value={formData.content}
                  required
                  onEditorChange={handleEditorChange}
                  init={{
                    height: 800,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | importword | blocks | bold italic underline strikethrough forecolor backcolor | align checklist bullist numlist | link image media footnotes mergetags table | subscript superscript charmap blockquote | tokens | spellchecker typography a11ycheck wordcount | addcomment showcomments | fullscreen preview',
                    content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
                    skin: (document.body.getAttribute('data-theme') === 'dark') ? 'oxide-dark' : 'oxide',
                    content_css: (document.body.getAttribute('data-theme') === 'dark') ? 'dark' : 'default'
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {error && <div className="error-message" style={{ color: '#dc3545' }}>{error}</div>}

          <button 
            type="submit" 
            className="submit-button" 
            disabled={loading} 
            style={{ 
              fontSize: '14px', 
              padding: '8px 12px',
              backgroundColor: isDarkTheme ? '#0d6efd' : '#0d6efd',
              color: '#fff'
            }}
          >
            <FiSave />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </Form>
      </Container>
    </div>
  );
}