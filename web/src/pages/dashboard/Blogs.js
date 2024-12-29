import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getBlogPosts, deleteBlog } from '../../lib/api';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/MyBlogs.css';

export function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadMyBlogs();
  }, []);

  const loadMyBlogs = async () => {
    try {
      const response = await getBlogPosts();
      if (response.isSuccess) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error('Bloglar yüklenirken hata:', error);
    }
  };

  const handleDelete = async (slug) => {
    if (window.confirm('Bu blogu silmek istediğinizden emin misiniz?')) {
      try {
        const response = await deleteBlog(slug);
        if (response.isSuccess) {
          // Refresh the blog list after successful deletion
          loadMyBlogs();
        } else {
          alert('Blog silinirken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Blog silinirken hata:', error);
        alert('Blog silinirken bir hata oluştu.');
      }
    }
  };

  return (
    <div className="blogs">
      <h2>Bloglarım</h2>
      <div className="blog-list">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-item">
            <h3>
              <Link to={`/${blog.slug}`}>{blog.title}</Link>
            </h3>
            <div className="blog-meta">
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              <br></br>
              <span>{blog.status}</span>
            </div>
            <div className="blog-actions">
              <button className="edit-btn" onClick={() => navigate(`/dashboard/blogs/edit/${blog.slug}`)}>
                <i className="fas fa-edit"></i>
              </button>
              <button className="delete-btn" onClick={() => handleDelete(blog.slug)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 