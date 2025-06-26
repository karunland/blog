import { useState } from 'react';
import { Container, Grid, TextField, Typography, Box, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { BlogList } from '../components/blogList';

export function Blog() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BlogList searchQuery={searchQuery} />
        </Grid>
      </Grid>
    </Container>
  );
}
