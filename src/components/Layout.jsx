import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Store, Camera, Trophy, LayoutDashboard, MapPin } from 'lucide-react';
import './Layout.css';
import logo from "../assets/Leaf and Life logo.png";
import AuthModal from './AuthModal';

export default function Layout() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('leafLifeAuthenticated') === 'true';
  });

  const openAuthModal = () => setAuthOpen(true);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }
    openAuthModal();
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem('leafLifeAuthenticated');
    setIsAuthenticated(false);
    openAuthModal();
  };

  useEffect(() => {
    if (!authOpen) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [authOpen]);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          localStorage.setItem('leafLifeAuthenticated', 'true');
          setIsAuthenticated(true);
          setAuthOpen(false);
          navigate('/dashboard');
        }}
      />
      <header className="top-nav">
        <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit' }}>
          <img src={logo} alt="Leaf and Life" className="app-logo" />
          <h1 className="logo-text">Leaf and Life</h1>
        </Link>
        <div className="desktop-nav">
          <NavLink to="/marketplace" className={({isActive}) => isActive ? "desktop-nav-item active" : "desktop-nav-item"}>Marketplace</NavLink>
          <NavLink to="/scan" className={({isActive}) => isActive ? "desktop-nav-item active" : "desktop-nav-item"}>Smart Scan</NavLink>
          <NavLink to="/rewards" className={({isActive}) => isActive ? "desktop-nav-item active" : "desktop-nav-item"}>Community</NavLink>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "desktop-nav-item active" : "desktop-nav-item"}>Dashboard</NavLink>
          <NavLink to="/recommendation" className={({isActive}) => isActive ? "desktop-nav-item active" : "desktop-nav-item"}>Smart Recommendation</NavLink>
        </div>
        <div className="nav-actions">
          {isAuthenticated && (
            <button type="button" className="lp-btn lp-btn-ghost lp-btn-sm" onClick={handleSwitchAccount}>
              Switch Account
            </button>
          )}
          <button type="button" className="lp-btn lp-btn-primary" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={24} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/scan" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <div className="scan-btn">
            <Camera size={28} />
          </div>
          <span>Smart Scan</span>
        </NavLink>
        <NavLink to="/recommendation" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <MapPin size={24} />
          <span>Recommend</span>
        </NavLink>
        <NavLink to="/marketplace" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Store size={24} />
          <span>Market</span>
        </NavLink>
        <NavLink to="/rewards" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Trophy size={24} />
          <span>Community</span>
        </NavLink>
      </nav>
    </div>
  );
}
