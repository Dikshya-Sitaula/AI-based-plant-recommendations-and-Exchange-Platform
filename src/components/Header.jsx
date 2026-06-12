import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setBrandDropdownOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setMegaMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBrandDropdownClose = () => {
    setBrandDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleMegaMenuClose = () => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const brandMenuItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const megaMenuItems = [
    { label: 'Marketplace', href: '/marketplace', icon: <ShoppingCart size={24} />, color: 'blue', desc: 'Hyperlocal plant exchange' },
    { label: 'Recommendation', href: '/recommendation', icon: <Sparkles size={24} />, color: 'purple', desc: 'Smart space optimization' },
    { label: 'Smart Scan', href: '/scan', icon: <Camera size={28} />, color: 'primary', desc: 'AI plant identification' },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={24} />, color: 'orange', desc: 'Manage your portfolio' },
    { label: 'Community', href: '/rewards', icon: <Users size={24} />, color: 'teal', desc: 'Eco challenges & rewards' },
  ];

  const isFeaturePage = ['/marketplace', '/scan', '/recommendation', '/rewards', '/dashboard'].some(path => location.pathname.startsWith(path));

  return (
    <header className={`app-header ${isFeaturePage ? 'feature-header' : ''}`}>
      {/* Brand Section - Original Desktop Dropdown */}
      <div className="header-brand-section">
        <div className="brand-dropdown-wrapper desktop-only" ref={brandDropdownRef}>
          <button 
            className="brand-button" 
            onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
          >
            <img src={logo} alt="Leaf and Life" className="header-logo" />
            <span className="brand-name">Leaf & Life</span>
            <ChevronDown size={18} className={`dropdown-icon ${brandDropdownOpen ? 'open' : ''}`} />
          </button>

          {brandDropdownOpen && (
            <div className="brand-dropdown-menu">
              <div className="dropdown-header">
                <h3>Navigation</h3>
                <button className="close-btn" onClick={handleBrandDropdownClose}><X size={18} /></button>
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

        {/* Brand Section - Simple Link for Mobile */}
        <Link to="/" className="brand-logo-link mobile-only" onClick={() => setMobileMenuOpen(false)}>
          <img src={logo} alt="Leaf and Life" className="header-logo" />
          <span className="brand-name">Leaf & Life</span>
        </Link>
        
        {/* Original Desktop Mega Menu Trigger */}
        <div className="mega-menu-wrapper desktop-only" ref={megaMenuRef}>
          <button 
            className="nav-link-btn" 
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
          >
            Explore Features
            <ChevronDown size={16} className={`dropdown-icon ${megaMenuOpen ? 'open' : ''}`} />
          </button>

          {megaMenuOpen && (
            <div className="mega-menu">
              <div className="mega-menu-header">
                <h2>Platform Features</h2>
                <button className="close-btn" onClick={handleMegaMenuClose}><X size={20} /></button>
              </div>
              <div className="mega-menu-grid">
                {megaMenuItems.map((item) => (
                  <Link 
                    key={item.href} 
                    to={item.href} 
                    className={`mega-menu-item-link ${item.color}`}
                    onClick={handleMegaMenuClose}
                  >
                    <div className="mega-icon-box">{item.icon}</div>
                    <div className="mega-text-box">
                      <span className="mega-label">{item.label}</span>
                      <span className="mega-desc">{item.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mega-menu-footer">
                <p>Helping you grow greener urban spaces.</p>
                <Link to="/about" className="learn-more" onClick={handleMegaMenuClose}>Learn Our Story →</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions Section */}
      <div className="header-actions">
        {isAuthenticated && !isFeaturePage && (
          <button 
            type="button" 
            className="btn-secondary desktop-only"
            onClick={onSwitchAccount}
          >
            Switch Account
          </button>
        )}

        <button
          type="button"
          className="btn-primary desktop-only"
          onClick={onGetStarted}
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
        </button>

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
                    className={`mobile-feature-item ${item.color}`}
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
  );
}
