import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { clearAdminSession } from '../pages/admin/AdminUtils';
import './AdminLayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminSession();
    navigate('/');
  };

  return (
    <div className="admin-shell">
      <aside className="module-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon admin-brand"><ShieldCheck size={24} /></div>
          <span>LeafLife Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Users size={20} /> User Management
          </NavLink>
          <NavLink to="/admin/nurseries" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Store size={20} /> Nurseries
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Package size={20} /> All Plants
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ShoppingCart size={20} /> All Orders
          </NavLink>
          <NavLink to="/admin/sales-report" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <ClipboardList size={20} /> Sales Report
          </NavLink>
          <NavLink to="/admin/trending-products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <TrendingUp size={20} /> Trending
          </NavLink>
        </nav>

        <button className="sign-out-btn" onClick={handleLogout}>
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      <main className="module-main">
        <header className="admin-top-bar">
          <div className="top-bar-search">
            <Search size={18} />
            <input type="text" placeholder="Search for nurseries, users or orders..." />
          </div>
          <div className="top-bar-actions">
            <button className="icon-badge-btn">
              <Bell size={20} />
              <span className="badge-ring"></span>
            </button>
            <div className="admin-profile-mini">
              <div className="mini-avatar">AD</div>
              <div className="mini-info">
                <strong>Super Admin</strong>
                <span>Master Admin</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
