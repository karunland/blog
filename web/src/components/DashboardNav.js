import { NavLink } from 'react-router-dom';
import '../styles/DashboardNav.css';

export function DashboardNav() {
  return (
    <nav className="dashboard-nav">
      <div className="nav-links">
        <NavLink 
          to="/dashboard"
          className="nav-item"
          end
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/dashboard/add-blog"
          className="nav-item"
        >
          Blog Ekle
        </NavLink>
        <NavLink 
          to="/dashboard/blogs"
          className="nav-item"
        >
          Bloglarım
        </NavLink>
        <NavLink 
          to="/dashboard/profile"
          className="nav-item"
        >
          Profil
        </NavLink>
      </div>
    </nav>
  );
} 