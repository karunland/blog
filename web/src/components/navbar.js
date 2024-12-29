import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Navbar as BNavbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';
import '../styles/Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDisplayName = () => {
    if (!user) return '';
    return user.firstName || "Hesabım";
  };

  return (
    <BNavbar 
      expand="lg" 
      className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}
      style={{ backgroundColor: 'var(--navbar-bg)' }}
      variant={isDarkMode ? 'dark' : 'light'}
      fixed={isScrolled ? "top" : undefined}
    >
      <Container>
        <BNavbar.Brand as={Link} to="/" className="fw-bold">
          BlogApp
        </BNavbar.Brand>
        <BNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/about" className="mx-2">
              Hakkımda
            </Nav.Link>
            
            <Button
              variant={isDarkMode ? 'dark' : 'light'}
              onClick={toggleTheme}
              className="theme-toggle mx-2"
              style={{ border: 'none' }}
            >
              {isDarkMode ? <BsSun /> : <BsMoon />}
            </Button>

            {user ? (
              <NavDropdown 
                title={getDisplayName()}
                id="basic-nav-dropdown"
                className="mx-2"
              >
                <NavDropdown.Item as={Link} to="/dashboard">
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>
                  Çıkış Yap
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown 
                title="Hesap" 
                id="basic-nav-dropdown"
                align="end"
                className="mx-2"
              >
                <NavDropdown.Item as={Link} to="/login">
                  Giriş Yap
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/register">
                  Kaydol
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </BNavbar.Collapse>
      </Container>
    </BNavbar>
  );
}