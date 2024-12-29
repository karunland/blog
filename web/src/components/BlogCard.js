import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/BlogCard.css';

export function BlogCard({ blog }) {
  const theme = document.body.getAttribute('data-theme');
  
  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#333333' : 'white',
    color: theme === 'dark' ? '#e1e1e1' : 'inherit',
    border: 0,
    backgroundColor: 'transparent',
  };

  return (
    <Card style={cardStyle}>
      <Card.Body>
        <div className="blog-card__header">
          <Link 
            to={`/${blog.slug}`} 
            className="blog-title-link"
          >
            <Card.Title className="blog-card__title">
              {blog.id} {blog.title}
            </Card.Title>
          </Link>
          <div className="blog-card__meta">
            <span className="blog-card__date">
              {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
            </span>
            <span className="blog-card__separator">•</span>
            <span className="blog-card__category">
              {blog.categoryName || 'Kategorisiz'}
            </span>
          </div>
        </div>
        
      </Card.Body>
    </Card>
  );
} 