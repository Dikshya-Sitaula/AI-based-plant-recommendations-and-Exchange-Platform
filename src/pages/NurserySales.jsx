import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CalendarDays, Filter, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import { formatCurrency, getNurseryOrders } from '../data/portalData';

export default function NurserySales() {
  const navigate = useNavigate();
  const nurseryId = localStorage.getItem('leafLifeNurseryId') || '';
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('leafLifeNurseryAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/nursery/signin');
      return;
    }
    setOrders(getNurseryOrders(nurseryId));
  }, [navigate, nurseryId]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = `${order.plantName} ${order.customer}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesDate = !dateFilter || order.orderDate === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, search, statusFilter, dateFilter]);

  const summary = useMemo(() => {
    const totalSales = filteredOrders.reduce((sum, order) => sum + order.quantity, 0);
    const totalOrders = filteredOrders.length;
    const revenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return { totalSales, totalOrders, revenue };
  }, [filteredOrders]);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gap: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1rem 1.2rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.3rem' }}>Sales Report</p>
        <h2 style={{ fontSize: '1.5rem' }}>Plant and order performance</h2>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        {[
          { label: 'Total Sales', value: summary.totalSales, icon: <TrendingUp size={16} /> },
          { label: 'Total Orders', value: summary.totalOrders, icon: <ShoppingBag size={16} /> },
          { label: 'Revenue', value: formatCurrency(summary.revenue), icon: <DollarSign size={16} /> },
        ].map((card) => (
          <div key={card.label} className="glass-panel" style={{ borderRadius: '18px', padding: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>{card.label}</span>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.4rem', borderRadius: '10px' }}>{card.icon}</div>
            </div>
            <div style={{ fontWeight: '700', fontSize: '1.2rem', marginTop: '0.4rem' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '0.9rem' }}>
        <div style={{ display: 'grid', gap: '0.7rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <Search size={16} color="var(--primary)" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search plant or customer" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <CalendarDays size={16} color="var(--primary)" />
            <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
            <Filter size={16} color="var(--primary)" />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="packing">Packing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.7rem' }}>
        {filteredOrders.map((order) => (
          <div key={order.id} className="glass-panel" style={{ borderRadius: '18px', padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: '700' }}>{order.plantName}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Customer: {order.customer}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Ordered on {order.orderDate}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '700' }}>Qty {order.quantity}</div>
              <div style={{ color: 'var(--primary)', fontWeight: '700' }}>{formatCurrency(order.totalAmount)}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{order.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
