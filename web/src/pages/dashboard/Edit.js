import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { FiSave } from 'react-icons/fi';
import { getBlogDetail, updateBlog, getCategories } from '../../lib/api';
import { Editor } from '@tinymce/tinymce-react';
import '../../styles/Edit.css';

export function EditBlog() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
    status: 1
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBlogAndCategories = async () => {
    if (!slug) return;
    
    try {
      console.log('Fetching blog with slug:', slug);
      const [blogResponse, categoriesResponse] = await Promise.all([
        getBlogDetail(slug),
        getCategories()
      ]);

      console.log('Raw Blog Response:', blogResponse);
      console.log('Raw Categories Response:', categoriesResponse);

      if (blogResponse.isSuccess) {
        console.log('Blog Data:', {
          title: blogResponse.data.title,
          content: blogResponse.data.content,
          categoryId: blogResponse.data.categoryId,
          status: blogResponse.data.statusEnumId
        });

        const newFormData = {
          title: blogResponse.data.title,
          content: blogResponse.data.content,
          categoryId: blogResponse.data.categoryId,
          status: blogResponse.data.statusEnumId
        };
        console.log('Setting form data to:', newFormData);
        setFormData(newFormData);
      }

      if (categoriesResponse.isSuccess) {
        console.log('Categories:', categoriesResponse.data);
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
    console.log(`Changing ${name} to:`, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await updateBlog(slug, formData);

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

  console.log('Current form data:', formData);
  console.log('Current categories:', categories);

  return (
    <div className="edit-blog">
      <Container fluid>
        <h2>Blog Düzenle</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={8}>
              <Form.Group className="form-group">
                <Form.Label>Başlık</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  required
                  style={{ color: document.body.getAttribute('data-theme') === 'dark' ? '#fff' : '#000' }}
                />
              </Form.Group>
            </Col>
            <Col lg={3}>
              <Form.Group className="form-group">
                <Form.Label>Kategori</Form.Label>
                <Form.Select
                  name="categoryId"
                  value={formData.categoryId || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Kategori seçin</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>Durum</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status || 1}
                  onChange={handleInputChange}
                  required
                >
                  <option value={1}>Taslak</option>
                  <option value={2}>Yayınlandı</option>
                  <option value={3}>Arşivlendi</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col lg={9}>
              <Form.Group className="form-group editor-container">
                <Form.Label>İçerik</Form.Label>
                <Editor
                  apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                  value={formData.content || ''}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: 800,
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | bold italic underline strikethrough forecolor backcolor | align checklist bullist numlist | link image media table | help',
                    content_style: 'body { font-family:Inter,Arial,sans-serif; font-size:16px }',
                    skin: (document.body.getAttribute('data-theme') === 'dark') ? 'oxide-dark' : 'oxide',
                    content_css: (document.body.getAttribute('data-theme') === 'dark') ? 'dark' : 'default'
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading} style={{ fontSize: '14px', padding: '8px 12px' }}>
            <FiSave />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </Form>
      </Container>
    </div>
  );
} 