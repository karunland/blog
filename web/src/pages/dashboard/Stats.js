import { useEffect, useState } from 'react';
import { Row, Col, Card, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../lib/api';

export function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
  const textColor = isDarkTheme ? '#fff' : '#000';

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getDashboardStats();
        if (response.isSuccess) {
          console.log(response.data);
          setStats(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Stats yüklenemedi:', error);
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <div style={{ color: textColor }}>Yükleniyor...</div>;

  return (
    <>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-stat-card" style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}>
            <Card.Body>
              <h3 style={{ color: textColor }}>{stats.totalBlogs}</h3>
              <p style={{ color: textColor }}>Toplam Blog</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card" style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}>
            <Card.Body>
              <h3 style={{ color: textColor }}>{stats.totalViews}</h3>
              <p style={{ color: textColor }}>Toplam Görüntülenme</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card" style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}>
            <Card.Body>
              <h3 style={{ color: textColor }}>{stats.totalComments}</h3>
              <p style={{ color: textColor }}>Toplam Yorum</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card" style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}>
            <Card.Body>
              <h3 style={{ color: textColor }}>{stats.totalLikes}</h3>
              <p style={{ color: textColor }}>Toplam Beğeni</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    
      <Row className="mb-4">
        <Col md={6}>
          <Card style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}>
            <Card.Header style={{ color: textColor, backgroundColor: isDarkTheme ? '#444' : '#f8f9fa' }}>Popüler Bloglarınız</Card.Header>
            <ListGroup variant="flush">
              {stats.popularBlogs.map(blog => (
                <ListGroup.Item 
                  key={blog.slug} 
                  className="d-flex justify-content-between align-items-center"
                  style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}
                >
                  <Link to={`/${blog.slug}`} style={{ color: isDarkTheme ? '#6ea8fe' : '#0d6efd' }}>{blog.title}</Link>
                  <div>
                    <Badge bg="primary" className="me-2">
                      {blog.views} görüntülenme
                    </Badge>
                    <Badge bg="info">
                      {blog.comments} yorum
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
        <Col md={6}>
          <Card style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}>
            <Card.Header style={{ color: textColor, backgroundColor: isDarkTheme ? '#444' : '#f8f9fa' }}>Son Aktiviteler</Card.Header>
            <ListGroup variant="flush">
              {stats.recentActivities.map((activity, index) => (
                <ListGroup.Item 
                  key={index}
                  style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}
                >
                  <small className="text-muted">
                    {new Date(activity.createdAt).toLocaleDateString('tr-TR')}
                  </small>
                  <p className="mb-0">{activity.content}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card style={{ color: textColor, backgroundColor: isDarkTheme ? '#333' : '#fff' }}>
            <Card.Header style={{ color: textColor, backgroundColor: isDarkTheme ? '#444' : '#f8f9fa' }}>Kategori Dağılımı</Card.Header>
            <Card.Body>
              <div className="category-stats">
                {stats.categoryStats.map(cat => (
                  <div key={cat.categoryName} className="category-stat-item">
                    <span style={{ color: textColor }}>{cat.categoryName}</span>
                    <div className="progress" style={{ backgroundColor: isDarkTheme ? '#444' : '#e9ecef' }}>
                      <div 
                        className="progress-bar" 
                        style={{
                          width: `${(cat.blogCount / stats.totalBlogs) * 100}%`,
                          backgroundColor: isDarkTheme ? '#0d6efd' : '#0d6efd'
                        }}
                      >
                        {cat.blogCount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
