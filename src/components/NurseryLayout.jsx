import { NavLink, Outlet } from 'react-router-dom';
import './NurseryLayout.css';

export default function NurseryLayout() {
  return (
    <div className="nursery-shell">
      <aside className="nursery-sidebar">
        <div className="nursery-brand">
          <h2>Nursery Panel</h2>
          <p>Your nursery management tools</p>
        </div>
        <nav className="nursery-nav">
          <NavLink to="/nursery/dashboard" className={({ isActive }) => isActive ? 'nursery-nav-item active' : 'nursery-nav-item'}>Dashboard</NavLink>
          <NavLink to="/nursery/products" className={({ isActive }) => isActive ? 'nursery-nav-item active' : 'nursery-nav-item'}>Products</NavLink>
          <NavLink to="/nursery/orders" className={({ isActive }) => isActive ? 'nursery-nav-item active' : 'nursery-nav-item'}>Orders</NavLink>
          <NavLink to="/nursery/sales-report" className={({ isActive }) => isActive ? 'nursery-nav-item active' : 'nursery-nav-item'}>Sales Report</NavLink>
          <NavLink to="/nursery/trending-products" className={({ isActive }) => isActive ? 'nursery-nav-item active' : 'nursery-nav-item'}>Trending</NavLink>
          <NavLink to="/nursery/profile" className={({ isActive }) => isActive ? 'nursery-nav-item active' : 'nursery-nav-item'}>Profile</NavLink>
        </nav>
      </aside>
      <main className="nursery-main">
        <header className="nursery-topbar">
          <h1>Nursery Dashboard</h1>
          <p>Manage your products, orders and sales from here.</p>
        </header>
        <div className="nursery-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
