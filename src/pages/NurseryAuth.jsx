import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Leaf, Lock, Mail, User, Phone, Home, ArrowRight } from 'lucide-react';
import { authenticateNursery, registerNursery } from '../data/portalData';

export default function NurseryAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({
    nurseryName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!form.nurseryName || !form.ownerName || !form.email || !form.phone || !form.address || !form.password) {
        setError('Please fill all required fields.');
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const created = registerNursery({
        nurseryName: form.nurseryName,
        ownerName: form.ownerName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
      });

      localStorage.setItem('leafLifeNurseryAuthenticated', 'true');
      localStorage.setItem('leafLifeNurseryId', created.id);
      localStorage.setItem('leafLifeNurseryName', created.nurseryName);
      navigate('/nursery/dashboard');
      return;
    }

    const nursery = authenticateNursery(form.email, form.password);
    if (!nursery) {
      setError('Invalid nursery credentials.');
      return;
    }

    localStorage.setItem('leafLifeNurseryAuthenticated', 'true');
    localStorage.setItem('leafLifeNurseryId', nursery.id);
    localStorage.setItem('leafLifeNurseryName', nursery.nurseryName);
    navigate('/nursery/dashboard');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 0 3rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '2rem', display: 'grid', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.4rem' }}>Nursery Portal</p>
            <h2 style={{ fontSize: '1.7rem', marginBottom: '0.3rem' }}>{mode === 'signin' ? 'Sign in to your nursery account' : 'Create your nursery account'}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Manage plants, orders, sales, and growth from one place.</p>
          </div>
          <div style={{ background: 'var(--bg-secondary)', padding: '0.9rem', borderRadius: '16px' }}>
            <Leaf size={28} color="var(--primary)" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className={`tab-button ${mode === 'signin' ? 'active' : ''}`} onClick={() => setMode('signin')}>Sign In</button>
          <button className={`tab-button ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
        </div>

        {error ? <div style={{ background: '#fff2f2', color: '#b42318', padding: '0.8rem 1rem', borderRadius: '12px' }}>{error}</div> : null}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem' }}>
          {mode === 'signup' ? (
            <>
              <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                  <span style={{ fontWeight: '600' }}>Nursery Name</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                    <Leaf size={16} color="var(--primary)" />
                    <input name="nurseryName" value={form.nurseryName} onChange={handleChange} placeholder="Green Haven" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                  </div>
                </label>
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                  <span style={{ fontWeight: '600' }}>Owner Name</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                    <User size={16} color="var(--primary)" />
                    <input name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Asha Rao" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                  </div>
                </label>
              </div>
              <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                  <span style={{ fontWeight: '600' }}>Email</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                    <Mail size={16} color="var(--primary)" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="owner@nursery.com" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                  </div>
                </label>
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                  <span style={{ fontWeight: '600' }}>Phone Number</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                    <Phone size={16} color="var(--primary)" />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                  </div>
                </label>
              </div>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                <span style={{ fontWeight: '600' }}>Address</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                  <Home size={16} color="var(--primary)" />
                  <input name="address" value={form.address} onChange={handleChange} placeholder="123 Garden Lane" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                </div>
              </label>
              <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                  <span style={{ fontWeight: '600' }}>Password</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                    <Lock size={16} color="var(--primary)" />
                    <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                  </div>
                </label>
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                  <span style={{ fontWeight: '600' }}>Confirm Password</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                    <Lock size={16} color="var(--primary)" />
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                  </div>
                </label>
              </div>
            </>
          ) : (
            <>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                <span style={{ fontWeight: '600' }}>Email</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                  <Mail size={16} color="var(--primary)" />
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="owner@nursery.com" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                </div>
              </label>
              <label style={{ display: 'grid', gap: '0.35rem' }}>
                <span style={{ fontWeight: '600' }}>Password</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.8rem 0.9rem', borderRadius: '12px' }}>
                  <Lock size={16} color="var(--primary)" />
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
                </div>
              </label>
            </>
          )}

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', gap: '0.55rem' }}>
            Continue <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          Need a nursery account? <Link to="/nursery/signup" style={{ color: 'var(--primary)', fontWeight: '700' }}>Create one here</Link>
        </p>
      </div>
    </div>
  );
}
