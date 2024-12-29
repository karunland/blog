import { Container, Row, Col, Card } from 'react-bootstrap';

export function About() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4">Hakkımda</h2>
              <div className="text-center mb-4">
                <img 
                  src="/profile-image.jpg" 
                  alt="Profil" 
                  className="rounded-circle"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <p className="lead text-center mb-4">
                Merhaba, ben [İsim Soyisim]
              </p>
              <div className="mb-4">
                <h5>Kim Bu Blogger?</h5>
                <p>
                  Yazılım geliştirme tutkusu ile başlayan yolculuğumda, 
                  sürekli öğrenme ve kendimi geliştirme fırsatları arıyorum. 
                  Bu blog, teknik deneyimlerimi ve öğrendiklerimi paylaşmak 
                  için oluşturduğum bir platform.
                </p>
              </div>
              <div className="mb-4">
                <h5>Neler Yapıyorum?</h5>
                <p>
                  Full-stack web geliştirme alanında çalışıyorum. 
                  React, .NET Core ve modern web teknolojileri üzerine 
                  yazılar yazıyor, deneyimlerimi paylaşıyorum.
                </p>
              </div>
              <div>
                <h5>İletişim</h5>
                <p>
                  Benimle iletişime geçmek veya projelerim hakkında 
                  daha fazla bilgi almak için:
                </p>
                <ul className="list-unstyled">
                  <li>📧 Email: example@email.com</li>
                  <li>🌐 GitHub: github.com/username</li>
                  <li>💼 LinkedIn: linkedin.com/in/username</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 