import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { Store, Camera, Trophy, LayoutDashboard, MapPin, LogOut, Settings, Sprout, ShieldCheck } from 'lucide-react';
import './Layout.css';
import logo from "../assets/Leaf and Life logo.png";
import AuthModal from './AuthModal';
import Header from './Header';

export default function Layout() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('leafLifeAuthenticated') === 'true';
  });
  const [userName, setUserName] = useState(() => {
    if (typeof window === 'undefined') return 'Guest';
    return localStorage.getItem('leafLifeUserName') || 'Guest';
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
    localStorage.removeItem('leafLifeSubmitted');
    localStorage.removeItem('leafLifeUserName');
    setIsAuthenticated(false);
    setUserName('Guest');
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
      {/* Mobile Top Header */}
      <div className="layout-mobile-header">
        <Header 
          isAuthenticated={isAuthenticated} 
          onOpenAuth={openAuthModal}
          onGetStarted={handleGetStarted}
          onSwitchAccount={handleSwitchAccount}
        />
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(data) => {
          localStorage.setItem('leafLifeAuthenticated', 'true');
          localStorage.setItem('leafLifeSubmitted', 'true');
          const nameToSet = data.fullName || data.email.split('@')[0];
          localStorage.setItem('leafLifeUserName', nameToSet);
          setIsAuthenticated(true);
          setUserName(nameToSet);
          setAuthOpen(false);
          navigate('/dashboard');
        }}
      />
      
      {/* Mobile Top Header */}
      <div className="mobile-header-wrapper">
        <Header 
          isAuthenticated={isAuthenticated}
          userName={userName}
          onOpenAuth={openAuthModal}
          onSwitchAccount={handleSwitchAccount}
          onGetStarted={handleGetStarted}
        />
      </div>

      {/* Sidebar Navigation (Desktop) - Original Order */}
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
            <NavLink to="/nursery/dashboard" className="sidebar-nav-item">
              <Sprout size={20} />
              <span>Nursery Portal</span>
            </NavLink>
            <NavLink to="/admin/dashboard" className="sidebar-nav-item">
              <ShieldCheck size={20} />
              <span>Admin Portal</span>
            </NavLink>
            <div className="sidebar-divider"></div>
            <Link to="/" className="sidebar-nav-item exit-link">
              <LogOut size={20} style={{ transform: 'rotate(180deg)' }} />
              <span>Back to Home</span>
            </Link>
          </nav>
        </div>
        
        <div className="sidebar-bottom">
          <div className="user-profile">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=E2E8CE&color=2D5A27`} 
              alt={userName} 
              className="user-avatar" 
            />
            <div className="user-info">
              <span className="user-name">{userName}</span>
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

      {/* Bottom Navigation for Mobile - Centered Smart Scan */}
      <nav className="bottom-nav">
<<<<<<< HEAD
        <Link to="/" className="nav-item">
          <LogOut size={22} style={{ transform: 'rotate(180deg)' }} />
          <span>Home</span>
        </Link>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={22} />
          <span>Feed</span>
=======
        <NavLink to="/marketplace" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Store size={24} />
          <span>Market</span>
        </NavLink>
        <NavLink to="/recommendation" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <MapPin size={24} />
          <span>Recommend</span>
>>>>>>> f22f288fcc9965c2b390f95a5245b797e1638216
        </NavLink>
        <NavLink to="/scan" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <div className="scan-btn">
            <Camera size={26} />
          </div>
<<<<<<< HEAD
          <span>Scan</span>
        </NavLink>
        <NavLink to="/marketplace" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Store size={22} />
          <span>Shop</span>
=======
          <span>Smart Scan</span>
        </NavLink>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={24} />
          <span>Dashboard</span>
>>>>>>> f22f288fcc9965c2b390f95a5245b797e1638216
        </NavLink>
        <NavLink to="/rewards" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Trophy size={22} />
          <span>Ranks</span>
        </NavLink>
      </nav>
    </div>
  );
}
