import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';
import '../styles/Login.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:5003/api/User/Login', {
        email,
        password
      });

      if (response.data.isSuccess) {
        login(response.data.data);
        Swal.fire({
          title: 'Başarılı!',
          text: response.data.message,
          icon: 'success',
          timer: 2000
        });
        navigate('/');
      } else {
        Swal.fire({
          title: 'Hata!',
          text: response.data.error?.errorMessage || 'Bir hata oluştu',
          icon: 'error'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Hata!',
        text: 'Giriş yapılırken bir hata oluştu',
        icon: 'error'
      });
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Giriş Yap</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Giriş Yap
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
} 