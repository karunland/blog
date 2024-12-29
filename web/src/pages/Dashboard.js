import { Row, Col } from 'react-bootstrap';
import { Link, Route, Routes } from 'react-router-dom';
import { Stats } from './dashboard/Stats';
import { MyBlogs } from './dashboard/Blogs';
import { AddBlog } from './dashboard/Add';
import { EditBlog } from './dashboard/Edit';
import '../styles/Dashboard.css';
import { DashboardNav } from '../components/DashboardNav';
export function Dashboard() {
  return (
    <div className="dashboard-container">
      <Row>
        {/* Sidebar on the left */}
        <DashboardNav />
        {/* Main Content */}
        <Col>
          <Routes>
            <Route path="/" element={<Stats />} />
            <Route path="/blogs" element={<MyBlogs />} />
            <Route path="/add-blog" element={<AddBlog />} />
            <Route path="/blogs/edit/:slug" element={<EditBlog />} />
          </Routes>
        </Col>
      </Row>
    </div>
  );
} 