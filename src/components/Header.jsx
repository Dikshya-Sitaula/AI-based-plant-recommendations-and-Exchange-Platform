import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronDown, X, Menu, Home, Info, Mail, 
  LayoutDashboard, Camera, Store, Trophy, MapPin, 
  Settings, LogOut, User 
} from 'lucide-react';
import logo from "../assets/Leaf and Life logo.png";
import './Header.css';

export default function Header({ isAuthenticated, onOpenAuth, onSwitchAccount, onGetStarted }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem('leafLifeUserName') || 'Guest';

  // Close menu when clicking outside or changing route
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    setIsMenuOpen(false); // Close on route change

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [location, isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('leafLifeAuthenticated');
    localStorage.removeItem('leafLifeSubmitted');
    localStorage.removeItem('leafLifeUserName');
    window.location.href = '/';
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={20} /> },
    { label: 'About Us', href: '/about', icon: <Info size={20} /> },
    { label: 'Contact', href: '/contact', icon: <Mail size={20} /> },
  ];

  const dashboardLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Smart Scan', href: '/scan', icon: <Camera size={20} /> },
    { label: 'Marketplace', href: '/marketplace', icon: <Store size={20} /> },
    { label: 'Community', href: '/rewards', icon: <Trophy size={20} /> },
    { label: 'Smart Recs', href: '/recommendation', icon: <MapPin size={20} /> },
  ];

  return (
    <>
      {/* Backdrop */}
      {isMenuOpen && <div className="header-backdrop-blur" onClick={() => setIsMenuOpen(false)} />}
      
      <header className="main-app-header">
        <div className="header-inner">
          {/* Logo - Left */}
          <Link to="/" className="header-logo-container">
            <img src={logo} alt="Leaf and Life" className="header-logo-img" />
            <span className="header-brand-name">Leaf & Life</span>
          </Link>

          {/* Desktop Nav - Middle */}
          <nav className="desktop-main-nav">
            {navLinks.map(link => (
              <Link key={link.href} to={link.href} className="desktop-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - Right */}
          <div className="desktop-header-actions">
            {!isAuthenticated ? (
              <button className="btn-header-primary" onClick={onGetStarted}>
                Get Started
              </button>
            ) : (
              <Link to="/dashboard" className="btn-header-secondary">
                Go to Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Hamburger - Right */}
          <button 
            className="mobile-hamburger-btn" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <div className={`mobile-navigation-drawer ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
          <div className="drawer-content">
            {/* Section 1: Public Links */}
            <div className="drawer-section">
              <div className="drawer-nav-list">
                {navLinks.map(link => (
                  <Link key={link.href} to={link.href} className="drawer-link">
                    <span className="drawer-link-icon">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="drawer-divider" />

            {/* Section 2: Dashboard Menu */}
            <div className="drawer-section">
              <h3 className="drawer-section-title">Dashboard Menu</h3>
              <div className="drawer-nav-list">
                {dashboardLinks.map(link => (
                  <Link key={link.href} to={link.href} className="drawer-link">
                    <span className="drawer-link-icon">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: User Profile - Fixed Bottom */}
          <div className="drawer-footer-profile">
            {isAuthenticated ? (
              <div className="profile-container">
                <div className="profile-info-row">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=E2E8CE&color=2D5A27`} 
                    alt={userName} 
                    className="profile-avatar" 
                  />
                  <div className="profile-text">
                    <span className="profile-name">{userName}</span>
                    <span className="profile-role">Plant Parent</span>
                  </div>
                </div>
                <div className="profile-actions-row">
                  <button className="profile-action-item">
                    <Settings size={20} />
                    <span>Settings</span>
                  </button>
                  <button className="profile-action-item logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <button className="drawer-auth-btn" onClick={() => { setIsMenuOpen(false); onOpenAuth(); }}>
                <User size={20} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
   