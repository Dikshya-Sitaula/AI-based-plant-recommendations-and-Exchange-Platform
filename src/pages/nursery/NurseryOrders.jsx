import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNurserySession, getNurseryOrders } from './NurseryUtils';
import './NurseryModule.css';

export default function NurseryOrders() {
  const navigate = useNavigate();
  const session = getNurserySession();
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [dateRange, setDateRange] = useState('');

  useEffect(() => {
    if (!session) {
      navigate('/nursery/signin');
      return;
    }
    const fetchOrders = async () => {
      const data = await getNurseryOrders(session.userId);
      setOrders(data);
    };
    fetchOrders();
  }, [navigate, session]);

  const filteredOrders = orders.filter((order) => {
    const matchesQuery = order.plantName.toLowerCase().includes(query.toLowerCase())
      || order.customerName.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'All' || order.status === status;
    const matchesDate = !dateRange || order.orderDate === dateRange;
    return matchesQuery && matchesStatus && matchesDate;
  });

  const summary = {
    totalSales: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    totalOrders: orders.length,
    revenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  };

  return (
    <div className="module-page nursery-page animate-fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">Sales Report</p>
          <h1>Nursery sales overview</h1>
          <p className="module-copy">Search orders by status, date, or plant name.</p>
        </div>
      </div>

      <div className="panel-grid">
        <div className="stat-card panel-card">
          <span>Total Sales</span>
          <strong>Rs. {summary.totalSales}</strong>
        </div>
        <div className="stat-card panel-card">
          <span>Total Orders</span>
          <strong>{summary.totalOrders}</strong>
        </div>
        <div className="stat-card panel-card">
          <span>Revenue</span>
          <strong>Rs. {summary.revenue}</strong>
        </div>
      </div>

      <div className="filter-row">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by plant or customer"
          className="input-field"
        />
        <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Completed</option>
          <option>Processing</option>
          <option>Delivered</option>
        </select>
        <input
          type="date"
          className="input-field"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        />
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Plant</th>
              <th>Qty</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">No orders match your filters.</td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.plantName}</td>
                  <td>{order.quantity}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.customerName}</td>
                  <td>Rs. {order.totalAmount}</td>
                  <td><span className={`status-chip status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
