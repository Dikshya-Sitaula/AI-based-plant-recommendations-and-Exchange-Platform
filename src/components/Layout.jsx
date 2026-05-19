import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Store, Camera, Trophy, LayoutDashboard, MapPin, LogOut, Settings } from 'lucide-react';
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
    <div className="app-container dashboard-layout">
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
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <Link to="/" className="sidebar-logo">
            <img src={logo} alt="Leaf and Life" className="sidebar-logo-img" />
            <span className="sidebar-logo-text">Leaf &amp; Life</span>
          </Link>
          
          <nav className="sidebar-nav">
            <NavLink to="/dashboard" className="sidebar-nav-item">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/scan" className="sidebar-nav-item">
              <Camera size={20} />
              <span>Smart Scan</span>
            </NavLink>
            <NavLink to="/marketplace" className="sidebar-nav-item">
              <Store size={20} />
              <span>Marketplace</span>
            </NavLink>
            <NavLink to="/rewards" className="sidebar-nav-item">
              <Trophy size={20} />
              <span>Community</span>
            </NavLink>
            <NavLink to="/recommendation" className="sidebar-nav-item">
              <MapPin size={20} />
              <span>Smart Recs</span>
            </NavLink>
          </nav>
        </div>
        
        <div className="sidebar-bottom">
          <div className="user-profile">
            <img src="https://ui-avatars.com/api/?name=Alex&background=E2E8CE&color=2D5A27" alt="Alex" className="user-avatar" />
            <div className="user-info">
              <span className="user-name">Alex</span>
              <span className="user-role">Plant Parent</span>
            </div>
          </div>
          <div className="sidebar-actions">
            <button className="sidebar-action-btn">
              <Settings size={18} />
            </button>
            <button className="sidebar-action-btn" onClick={handleSwitchAccount}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

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
          <span>Rewards</span>
        </NavLink>
      </nav>
    </div>
  );
}
