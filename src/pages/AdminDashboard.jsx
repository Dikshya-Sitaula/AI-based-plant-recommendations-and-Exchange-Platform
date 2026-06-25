import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Store, Package, ShoppingBag, DollarSign, TrendingUp, Users, Clock3 } from 'lucide-react';
import { formatCurrency, getPortalState } from '../data/portalData';

export default function AdminDashboard() {
  const [state, setState] = useState(getPortalState());

  useEffect(() => {
    setState(getPortalState());
  }, []);

  const stats = useMemo(() => {
    const nurseries = state.nurseries || [];
    const products = state.nurseryProducts || [];
    const orders = state.nurseryOrders || [];
    const pendingApprovals = nurseries.filter((nursery) => nursery.status === 'pending').length;
    const approvedNurseries = nurseries.filter((nursery) => nursery.status === 'approved').length;
    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const trendingProducts = [...products].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 3);

    return { approvedNurseries, pendingApprovals, products: products.length, orders: orders.length, revenue, trendingProducts };
  }, [state]);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gap: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1rem 1.2rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.3rem' }}>Admin Dashboard</p>
        <h2 style={{ fontSize: '1.6rem' }}>Marketplace and nursery operations overview</h2>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[
          { label: 'Total Nurseries', value: stats.approvedNurseries, icon: <Store size={16} /> },
          { label: 'Pending Approvals', value: stats.pendingApprovals, icon: <Clock3 size={16} /> },
          { label: 'Total Plants', value: stats.products, icon: <Package size={16} /> },
          { label: 'Total Orders', value: stats.orders, icon: <ShoppingBag size={16} /> },
          { label: 'Revenue', value: formatCurrency(stats.revenue), icon: <DollarSign size={16} /> },
        ].map((card) => (
          <div key={card.label} className="glass-panel" style={{ borderRadius: '18px', padding: '0.95rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{card.label}</span>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.4rem', borderRadius: '10px' }}>{card.icon}</div>
            </div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Trending Products</h3>
            <Link to="/admin/trending-products" style={{ color: 'var(--primary)', fontWeight: '700' }}>View all</Link>
          </div>
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {stats.trendingProducts.map((product) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '0.7rem' }}>
                <span>{product.name}</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{product.trendingScore}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ borderRadius: '20px', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Nursery Performance</h3>
            <Link to="/admin/nurseries" style={{ color: 'var(--primary)', fontWeight: '700' }}>Manage</Link>
          </div>
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {state.nurseries.map((nursery) => (
              <div key={nursery.id} style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '0.7rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{nursery.nurseryName}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{nursery.location}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: 'var(--primary)', fontWeight: '700' }}>{nursery.status}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{nursery.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
