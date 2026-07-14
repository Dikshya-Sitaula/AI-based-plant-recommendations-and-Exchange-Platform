import { useEffect, useState } from 'react';
import { getAdminOrders } from './AdminUtils';
import './AdminModule.css';
import { ShoppingCart, Calendar, User, Store, CheckCircle2, Clock } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getAdminOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="admin-content-inner animate-fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Platform Orders</h1>
          <p className="module-copy">Track every transaction and trade request occurring in the Leaf-Life ecosystem.</p>
        </div>
      </div>

      <div className="mt-6 panel-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Plant</th>
                <th>Customer</th>
                <th>Nursery / Seller</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">No platform-wide orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="order-id">#ORD-{order.id}</span></td>
                    <td><span className="font-semibold">{order.plantName}</span></td>
                    <td>
                      <div className="user-icon-cell">
                        <User size={14} /> <span>{order.customerName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-icon-cell">
                        <Store size={14} /> <span>{order.nursery_name || 'Individual'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-icon-cell">
                        <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge-modern ${order.status.toLowerCase()}`}>
                        {order.status === 'approved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
