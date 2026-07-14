import { useEffect, useState } from 'react';
import { getAdminNurseries } from './AdminUtils';
import './AdminModule.css';
import { Store, MapPin, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';

export default function AdminNurseries() {
  const [nurseries, setNurseries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNurseries = async () => {
      setLoading(true);
      const data = await getAdminNurseries();
      setNurseries(data);
      setLoading(false);
    };
    fetchNurseries();
  }, []);

  return (
    <div className="admin-content-inner animate-fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>Partner Nurseries</h1>
          <p className="module-copy">Manage registered nurseries and verify their application status.</p>
        </div>
      </div>

      <div className="admin-grid-layout mt-6">
        {nurseries.length === 0 ? (
          <div className="panel-card empty-state">
            <Store size={48} />
            <p>No registered nurseries found.</p>
          </div>
        ) : (
          nurseries.map((nursery) => (
            <div key={nursery.id} className="panel-card nursery-admin-card">
              <div className="card-top">
                <div className="nursery-logo">{nursery.nursery_name ? nursery.nursery_name[0] : 'N'}</div>
                <div className="nursery-info">
                  <h3>{nursery.nursery_name}</h3>
                  <span className="id-tag">ID: {nursery.external_id}</span>
                </div>
                <div className={`status-pill ${nursery.password ? 'verified' : 'pending'}`}>
                  {nursery.password ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {nursery.password ? 'Active' : 'Missing Auth'}
                </div>
              </div>
              
              <div className="card-details">
                <div className="detail-item">
                  <Mail size={14} /> <span>{nursery.email}</span>
                </div>
                <div className="detail-item">
                  <Phone size={14} /> <span>{nursery.phone || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={14} /> <span>{nursery.location}</span>
                </div>
              </div>

              <div className="card-actions">
                <button className="primary-inline">View Inventory</button>
                <button className="secondary-inline">Edit</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
