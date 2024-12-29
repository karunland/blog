import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { Home } from './pages/Home';
import { BlogDetail } from './components/BlogDetail';
import { Login } from './pages/Login';
import { About } from './pages/About';
import { Dashboard } from './pages/Dashboard';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <Navbar />
          <main className="flex-grow-1 py-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Container className="container-narrow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/:slug" element={<BlogDetail />} />
              </Routes>
            </Container>
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
