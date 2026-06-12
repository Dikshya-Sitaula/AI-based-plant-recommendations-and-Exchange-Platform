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
  };

  const handleMegaMenuClose = () => {
    setMegaMenuOpen(false);
  };

  const brandMenuItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const megaMenuItems = [
    { label: 'Marketplace', href: '/marketplace', icon: '🛒' },
    { label: 'Smart Recommendation', href: '/recommendation', icon: '💡' },
    { label: 'Smart Scan', href: '/scan', icon: '📷' },
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Community', href: '/rewards', icon: '👥' },
  ];

  const isFeaturePage = ['/marketplace', '/scan', '/recommendation', '/rewards', '/dashboard'].some(path => location.pathname.startsWith(path));

  return (
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
            )}
          </button>

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
                  </Link>
                ))}
              </div>

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
              </div>
            </div>
          )}
        </div>

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
  );
}
