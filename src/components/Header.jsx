import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
<<<<<<< HEAD
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
=======
import { ChevronDown, X, Menu, ShoppingCart, Sparkles, Camera, LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import logo from "../assets/Leaf and Life logo.png";
import './Header.css';

export default function Header({ isAuthenticated, userName, onOpenAuth, onSwitchAccount, onGetStarted }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const brandDropdownRef = useRef(null);
  const megaMenuRef = useRef(null);
>>>>>>> f22f288fcc9965c2b390f95a5245b797e1638216

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

<<<<<<< HEAD
  const navLinks = [
    { label: 'Home', href: '/', icon: <Home size={20} /> },
    { label: 'About Us', href: '/about', icon: <Info size={20} /> },
    { label: 'Contact', href: '/contact', icon: <Mail size={20} /> },
=======
  const handleMegaMenuClose = () => {
    setMegaMenuOpen(false);
  };

  const brandMenuItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
>>>>>>> f22f288fcc9965c2b390f95a5245b797e1638216
  ];

  const dashboardLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Smart Scan', href: '/scan', icon: <Camera size={20} /> },
    { label: 'Marketplace', href: '/marketplace', icon: <Store size={20} /> },
    { label: 'Community', href: '/rewards', icon: <Trophy size={20} /> },
    { label: 'Smart Recs', href: '/recommendation', icon: <MapPin size={20} /> },
  ];

  const isFeaturePage = ['/marketplace', '/scan', '/recommendation', '/rewards', '/dashboard'].some(path => location.pathname.startsWith(path));

  return (
<<<<<<< HEAD
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
=======
    <header className={`app-header ${isFeaturePage ? 'feature-header' : ''}`}>
      {/* Brand Section - Desktop (Dropdown) */}
      <div className="header-brand-section desktop-only">
        <div className="brand-dropdown-wrapper" ref={brandDropdownRef}>
          <button
            className="brand-button"
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
            aria-expanded={brandDropdownOpen}
          >
            <img src={logo} alt="Leaf and Life" className="header-logo" />
            <span className="brand-name">Leaf & Life</span>
            <ChevronDown
              size={18}
              className={`dropdown-icon ${brandDropdownOpen ? 'open' : ''}`}
            />
          </button>

          {brandDropdownOpen && (
            <div className="brand-dropdown-menu">
              <div className="dropdown-header">
                <h3>Navigation</h3>
                <button className="close-btn" onClick={handleBrandDropdownClose}>
                  <X size={18} />
                </button>
              </div>
              <nav className="dropdown-nav">
                {brandMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="dropdown-item"
                    onClick={handleBrandDropdownClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Brand Section - Mobile (Simple Link) */}
      <Link to="/" className="brand-logo-link mobile-only" onClick={() => setMobileMenuOpen(false)}>
        <img src={logo} alt="Leaf and Life" className="header-logo" />
        <span className="brand-name">Leaf & Life</span>
      </Link>

      {/* Center Spacer (Desktop Only) */}
      <div className="header-center desktop-only"></div>

      {/* Actions Section */}
      <div className="header-actions">
        {isAuthenticated && (
          <button
            type="button"
            className="btn-secondary desktop-only"
            onClick={onSwitchAccount}
          >
            Switch Account
          </button>
        )}

        {/* Get Started / Mega Menu - Desktop */}
        <div className="mega-menu-wrapper desktop-only" ref={megaMenuRef}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              if (isAuthenticated) {
                onGetStarted();
              } else {
                setMegaMenuOpen(!megaMenuOpen);
              }
            }}
            aria-expanded={megaMenuOpen}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            {!isAuthenticated && (
              <ChevronDown
                size={18}
                className={`dropdown-icon ${megaMenuOpen ? 'open' : ''}`}
              />
>>>>>>> f22f288fcc9965c2b390f95a5245b797e1638216
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

<<<<<<< HEAD
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
=======
          {megaMenuOpen && !isAuthenticated && (
            <div className="mega-menu">
              <div className="mega-menu-header">
                <h2>Explore Features</h2>
                <button className="close-btn" onClick={handleMegaMenuClose}>
                  <X size={20} />
                </button>
              </div>

              <div className="mega-menu-grid">
                {megaMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="mega-menu-item"
                    onClick={handleMegaMenuClose}
                  >
                    <div className="mega-menu-icon">{item.icon}</div>
                    <span className="mega-menu-label">{item.label}</span>
>>>>>>> f22f288fcc9965c2b390f95a5245b797e1638216
                  </Link>
                ))}
              </div>
            </div>

<<<<<<< HEAD
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
=======
              <div className="mega-menu-footer">
                <p>Sign in to access all features</p>
                <button
                  className="btn-primary-small"
                  onClick={() => {
                    setMegaMenuOpen(false);
                    onOpenAuth();
                  }}
                >
                  Sign In Now
                </button>
>>>>>>> f22f288fcc9965c2b390f95a5245b797e1638216
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
<<<<<<< HEAD
      </header>
    </>
=======

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle mobile-only" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay - Modern Drawer for Mobile */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay animate-fade-in">
          <div className="mobile-menu-content animate-slide-up">
            <div className="mobile-menu-header">
              <div className="header-logo-group">
                <img src={logo} alt="Leaf & Life" className="header-logo" />
                <span className="brand-name">Leaf & Life</span>
              </div>
              <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <nav className="mobile-nav-links">
              <h3>Navigation</h3>
              {brandMenuItems.map((item) => (
                <Link 
                  key={item.href} 
                  to={item.href} 
                  className={`mobile-nav-item ${location.pathname === item.href ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mobile-menu-divider" />

            <nav className="mobile-feature-links">
              <h3>Explore Features</h3>
              <div className="mobile-feature-grid">
                {megaMenuItems.map((item) => (
                  <Link 
                    key={item.href} 
                    to={item.href} 
                    className="mobile-feature-item"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="feature-icon">{item.icon}</span>
                    <span className="feature-label">{item.label}</span>
                  </Link>
                ))}
              </div>
            </nav>

            {/* User Profile Section in Mobile Menu */}
            {isAuthenticated && (
              <div className="mobile-user-profile-section">
                <div className="mobile-menu-divider" />
                <div className="mobile-user-profile-card">
                  <div className="user-info-row">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=E2E8CE&color=2D5A27`} 
                      alt={userName} 
                      className="user-avatar" 
                    />
                    <div className="user-meta">
                      <span className="user-name">{userName}</span>
                      <span className="user-role">Plant Parent</span>
                    </div>
                  </div>
                  <div className="user-actions-row">
                    <button className="mobile-action-btn">
                      <Settings size={20} />
                      <span>Settings</span>
                    </button>
                    <button className="mobile-action-btn logout" onClick={() => {
                      setMobileMenuOpen(false);
                      onSwitchAccount();
                    }}>
                      <LogOut size={20} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mobile-menu-footer">
              {!isAuthenticated && (
                <button 
                  className="btn-primary w-full" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onGetStarted();
                  }}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
>>>>>>> f22f288fcc9965c2b390f95a5245b797e1638216
  );
}
