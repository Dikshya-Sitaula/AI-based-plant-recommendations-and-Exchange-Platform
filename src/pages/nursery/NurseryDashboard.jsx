import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNurserySession, getNurseryStats, getNurseryProfile, clearNurserySession } from './NurseryUtils';
import './NurseryModule.css';
import { Layers, ShoppingBag, TrendingUp, DollarSign, AlertTriangle, Package, ArrowRight, User, Plus } from 'lucide-react';

export default function NurseryDashboard() {
  const navigate = useNavigate();
  const session = getNurserySession();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalPlantsSold: 0,
    totalRevenue: 0,
    lowStock: 0,
    recentOrders: [],
    trending: [],
  });

  useEffect(() => {
    if (!session) {
      navigate('/nursery/signin');
      return;
    }
    
    const fetchData = async () => {
      const profileData = await getNurseryProfile(session.userId);
      const statsData = await getNurseryStats(session.userId);
      setProfile(profileData);
      setStats(statsData);
    };

    fetchData();
  }, [navigate, session]);

  const handleSignOut = () => {
    clearNurserySession();
    navigate('/nursery/signin');
  };

  return (
    <div className="module-page nursery-page animate-fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">Nursery Dashboard</p>
          <h1>Welcome back, {profile?.ownerName || 'Nursery Owner'}</h1>
          <p className="module-copy">Quick insights for your nursery, sales, inventory and trending plants.</p>
        </div>
        <button type="button" className="btn-secondary" onClick={handleSignOut}>Sign Out</button>
      </div>

      <div className="panel-grid">
        <div className="stat-card panel-card">
          <div className="stat-card-header">
            <span>Total Products</span>
            <Layers size={20} />
          </div>
          <div className="stat-card-value">{stats.totalProducts}</div>
        </div>
        <div className="stat-card panel-card">
          <div className="stat-card-header">
            <span>Total Orders</span>
            <ShoppingBag size={20} />
          </div>
          <div className="stat-card-value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card panel-card">
          <div className="stat-card-header">
            <span>Plants Sold</span>
            <Package size={20} />
          </div>
          <div className="stat-card-value">{stats.totalPlantsSold}</div>
        </div>
        <div className="stat-card panel-card">
          <div className="stat-card-header">
            <span>Total Revenue</span>
            <DollarSign size={20} />
          </div>
          <div className="stat-card-value">Rs. {stats.totalRevenue}</div>
        </div>
      </div>

      <div className="quick-actions-grid">
        <Link to="/nursery/products" className="action-card">
          <div>
            <p>Manage Products</p>
            <small>View, edit, and update stock.</small>
          </div>
          <ArrowRight size={18} />
        </Link>
        <Link to="/nursery/products/add" className="action-card">
          <div>
            <p>Add Product</p>
            <small>Create a new plant listing.</small>
          </div>
          <Plus size={18} />
        </Link>
        <Link to="/nursery/orders" className="action-card">
          <div>
            <p>Sales & Orders</p>
            <small>Review recent order performance.</small>
          </div>
          <ShoppingBag size={18} />
        </Link>
        <Link to="/nursery/profile" className="action-card">
          <div>
            <p>Nursery Profile</p>
            <small>Update your contact and business settings.</small>
          </div>
          <User size={18} />
        </Link>
      </div>

      <div className="page-section two-column-grid">
        <section className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent Orders</p>
              <h2>Latest customer activity</h2>
            </div>
            <Link to="/nursery/orders" className="link-link">View all</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="empty-state">No recent orders yet.</p>
          ) : (
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.plantName}</td>
                      <td>{order.customerName}</td>
                      <td>{order.orderDate}</td>
                      <td><span className={`status-chip status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Low Stock</p>
              <h2>Products needing attention</h2>
            </div>
            <Link to="/nursery/products" className="link-link">Manage stock</Link>
          </div>
          <div className="low-stock-list">
            {stats.trending.length === 0 ? (
              <p className="empty-state">No low stock products right now.</p>
            ) : (
              stats.trending.slice(0, 4).map((item) => (
                <div key={item.id} className="low-stock-item">
                  <img src={item.image} alt={item.name} className="low-stock-img" />
                  <div>
                    <p className="low-stock-name">{item.name}</p>
                    <p className="low-stock-meta">{item.quantity} left</p>
                  </div>
                  <span className="status-chip status-alert">Refill</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
