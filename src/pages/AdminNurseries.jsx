import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { approveNursery, getPortalState, rejectNursery, setNurseryActive } from '../data/portalData';

export default function AdminNurseries() {
  const [nurseries, setNurseries] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setNurseries(getPortalState().nurseries);
  }, []);

  const filteredNurseries = useMemo(() => {
    return nurseries.filter((nursery) => `${nursery.nurseryName} ${nursery.ownerName} ${nursery.location}`.toLowerCase().includes(search.toLowerCase()));
  }, [nurseries, search]);

  const refresh = () => setNurseries(getPortalState().nurseries);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gap: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1rem 1.2rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.3rem' }}>Nursery Management</p>
        <h2 style={{ fontSize: '1.5rem' }}>Approve, review, and manage nursery partners</h2>
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '0.8rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
          <Search size={16} color="var(--primary)" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search nursery" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        {filteredNurseries.map((nursery) => (
          <div key={nursery.id} className="glass-panel" style={{ borderRadius: '18px', padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{nursery.nurseryName}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{nursery.ownerName} • {nursery.location}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{nursery.email}</div>
              <div style={{ marginTop: '0.25rem', fontWeight: '700', color: nursery.status === 'approved' ? 'var(--primary)' : '#b54708' }}>{nursery.status}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => { approveNursery(nursery.id); refresh(); }} className="btn-secondary" style={{ padding: '0.7rem 0.9rem', color: 'var(--primary)' }}>
                <CheckCircle2 size={16} />
              </button>
              <button type="button" onClick={() => { rejectNursery(nursery.id); refresh(); }} className="btn-secondary" style={{ padding: '0.7rem 0.9rem', color: '#b54708' }}>
                <XCircle size={16} />
              </button>
              <button type="button" onClick={() => { setNurseryActive(nursery.id, !nursery.isActive); refresh(); }} className="btn-secondary" style={{ padding: '0.7rem 0.9rem' }}>
                {nursery.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
              </button>
              <Link to="/admin/products" className="btn-secondary" style={{ padding: '0.7rem 0.9rem' }}>Products</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
