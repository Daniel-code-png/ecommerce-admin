import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, LogOut, Shield, Menu, X } from 'lucide-react';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      path: '/products',
      icon: Package,
      label: 'Productos'
    }
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Shield size={32} />
            <span>Admin Panel</span>
          </div>
          <button className="btn-close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <small className="user-role">Administrador</small>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <button className="btn-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <h2 className="topbar-title">Panel de Administración</h2>
        </header>

        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;