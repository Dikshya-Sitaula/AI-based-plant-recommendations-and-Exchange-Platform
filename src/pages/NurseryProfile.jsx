import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Mail, PhoneCall, UserCircle2 } from 'lucide-react';
import { getPortalState } from '../data/portalData';

export default function NurseryProfile() {
  const navigate = useNavigate();
  const nurseryId = localStorage.getItem('leafLifeNurseryId') || '';
  const [nursery, setNursery] = useState(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('leafLifeNurseryAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/nursery/signin');
      return;
    }
    const state = getPortalState();
    setNursery(state.nurseries.find((entry) => entry.id === nurseryId));
  }, [navigate, nurseryId]);

  if (!nursery) return null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.7rem', borderRadius: '14px' }}>
            <UserCircle2 size={24} color="var(--primary)" />
          </div>
          <div>
            <p style={{ color: 'var(--primary)', fontWeight: '700' }}>Nursery Profile</p>
            <h2 style={{ fontSize: '1.5rem' }}>{nursery.nurseryName}</h2>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><UserCircle2 size={16} color="var(--primary)" /> <strong>Owner:</strong> {nursery.ownerName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Mail size={16} color="var(--primary)" /> <strong>Email:</strong> {nursery.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><PhoneCall size={16} color="var(--primary)" /> <strong>Phone:</strong> {nursery.phone}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}><Home size={16} color="var(--primary)" /> <strong>Address:</strong> {nursery.address}</div>
        </div>
      </div>
    </div>
  );
}
