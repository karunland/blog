import { Container } from 'react-bootstrap';

export function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <div className="text-center">
          <p className="mb-0">&copy; 2024 BlogApp. Tüm hakları saklıdır.</p>
        </div>
      </Container>
    </footer>
  );
}