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
import { Box, Container } from '@mui/material';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: 'background.default'
          }}
        >
          <Navbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 4,
              bgcolor: 'background.default'
            }}
          >
            <Container maxWidth="xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/:slug" element={<BlogDetail />} />
              </Routes>
            </Container>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
