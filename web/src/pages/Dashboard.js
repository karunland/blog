import { Routes, Route } from 'react-router-dom';
import { Stats } from './dashboard/Stats';
import { MyBlogs } from './dashboard/Blogs';
import { AddBlog } from './dashboard/Add';
import { EditBlog } from './dashboard/Edit';
import { DashboardNav } from '../components/DashboardNav';
import { Grid, Box } from '@mui/material';
import { Profile } from './dashboard/Profile';

export function Dashboard() {
  return (
    <Box>
      <Grid container flexDirection="column">
        <Grid item xs={12} style={{ minWidth: '100%' }}>
          <DashboardNav />
        </Grid>
        <Grid item xs={12} md={9}>
          <Routes>
            <Route path="/" element={<Stats />} />
            <Route path="/blogs" element={<MyBlogs />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/blogs/edit/:slug" element={<EditBlog />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Grid>
      </Grid>
    </Box>
  );
} 