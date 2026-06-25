import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutGrid, Package, ShoppingBag, DollarSign, TrendingUp, AlertTriangle, PlusCircle, ArrowRight } from 'lucide-react';
import { formatCurrency, getNurseryOrders, getNurseryProducts, getPortalState } from '../data/portalData';

export default function NurseryDashboard() {
  const navigate = useNavigate();
  const [nurseryId, setNurseryId] = useState(() => localStorage.getItem('leafLifeNurseryId') || '');
  const [nurseryName, setNurseryName] = useState(() => localStorage.getItem('leafLifeNurseryName') || 'Your Nursery');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('leafLifeNurseryAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/nursery/signin');
      return;
    }

    const state = getPortalState();
    const nursery = state.nurseries.find((entry) => entry.id === nurseryId);
    if (nursery) {
      setNurseryName(nursery.nurseryName);
      localStorage.setItem('leafLifeNurseryName', nursery.nurseryName);
    }

    setProducts(getNurseryProducts(nurseryId));
    setOrders(getNurseryOrders(nurseryId));
  }, [navigate, nurseryId]);

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalPlantsSold = orders.reduce((sum, order) => sum + order.quantity, 0);
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const lowStock = products.filter((product) => product.quantity <= 5);

    return { totalProducts, totalOrders, totalPlantsSold, totalRevenue, lowStock };
  }, [products, orders]);

  const recentOrders = useMemo(() => orders.slice(0, 4), [orders]);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gap: '1.2rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1.2rem 1.3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.3rem' }}>Nursery Dashboard</p>
            <h2 style={{ fontSize: '1.7rem', marginBottom: '0.25rem' }}>Welcome back, {nurseryName}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Track product health, daily orders, and revenue growth at a glance.</p>
          </div>
          <Link to="/nursery/products/add" className="btn-primary" style={{ justifyContent: 'center', gap: '0.5rem' }}>
            <PlusCircle size={18} /> Add Plant
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {[
          { label: 'Total Products', value: stats.totalProducts, icon: <Package size={18} /> },
          { label: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={18} /> },
          { label: 'Plants Sold', value: stats.totalPlantsSold, icon: <TrendingUp size={18} /> },
          { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: <DollarSign size={18} /> },
        ].map((card) => (
          <div key={card.label} className="glass-panel" style={{ borderRadius: '20px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.7rem' }}>
              <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{card.label}</span>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.45rem', borderRadius: '10px' }}>{card.icon}</div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '700' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1.1fr 0.9fr' }}>
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Orders</h3>
            <Link to="/nursery/orders" style={{ color: 'var(--primary)', fontWeight: '700' }}>View all</Link>
          </div>
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {recentOrders.length ? recentOrders.map((order) => (
              <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.7rem', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '0.8rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{order.plantName}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{order.customer} • {order.quantity} item</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '700' }}>{formatCurrency(order.totalAmount)}</div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.85rem' }}>{order.status}</div>
                </div>
              </div>
            )) : <div style={{ color: 'var(--text-secondary)' }}>No orders yet.</div>}
          </div>
        </div>

        <div className="glass-panel" style={{ borderRadius: '20px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Low Stock Products</h3>
            <Link to="/nursery/products" style={{ color: 'var(--primary)', fontWeight: '700' }}>Manage</Link>
          </div>
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {stats.lowStock.length ? stats.lowStock.map((product) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '0.7rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{product.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{product.category}</div>
                </div>
                <div style={{ color: '#b54708', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '700' }}>
                  <AlertTriangle size={15} /> {product.quantity} left
                </div>
              </div>
            )) : <div style={{ color: 'var(--text-secondary)' }}>Everything is well stocked.</div>}
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: '20px', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/nursery/products" className="btn-secondary">View Products</Link>
          <Link to="/nursery/orders" className="btn-secondary">View Orders</Link>
          <Link to="/nursery/sales-report" className="btn-secondary">Sales Report</Link>
          <Link to="/nursery/trending-products" className="btn-secondary">Trending Products</Link>
          <Link to="/nursery/profile" className="btn-secondary">Profile</Link>
        </div>
      </div>
    </div>
  );
}
