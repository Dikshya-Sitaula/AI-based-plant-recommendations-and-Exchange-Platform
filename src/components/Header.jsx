import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, X, Menu } from 'lucide-react';
import logo from "../assets/Leaf and Life logo.png";
import './Header.css';

export default function Header({ isAuthenticated, onOpenAuth, onSwitchAccount, onGetStarted }) {
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
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
    
    // Body scroll lock on mobile when menus are open
    if (brandDropdownOpen || megaMenuOpen) {
      if (window.innerWidth <= 480) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [brandDropdownOpen, megaMenuOpen]);

  const handleBrandDropdownClose = () => {
    setBrandDropdownOpen(false);
  };

  const handleMegaMenuClose = () => {
    setMegaMenuOpen(false);
  };

  const brandMenuItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '#contact' },
  ];

  const megaMenuItems = [
    { label: 'Marketplace', href: '/marketplace', icon: '🛒' },
    { label: 'Smart Recommendation', href: '/recommendation', icon: '💡' },
    { label: 'Smart Scan', href: '/scan', icon: '📷' },
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Community', href: '/rewards', icon: '👥' },
  ];

  const isAnyMenuOpen = brandDropdownOpen || megaMenuOpen;

  // Re-ordering menu items for better mobile flow
  const allFeatures = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Marketplace', href: '/marketplace', icon: '🛒' },
    { label: 'Smart Scan', href: '/scan', icon: '📷' },
    { label: 'Recommend', href: '/recommendation', icon: '💡' },
    { label: 'Community', href: '/rewards', icon: '👥' },
  ];

  return (
    <>
      {/* Unified Mobile Backdrop */}
      {isAnyMenuOpen && (
        <div 
          className="header-backdrop" 
          onClick={() => {
            setBrandDropdownOpen(false);
            setMegaMenuOpen(false);
          }}
        />
      )}
      
      <header className="app-header">
        <div className="header-brand-section">
          {/* Mobile Menu Icon */}
          <button 
            className="mobile-menu-trigger" 
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="brand-logo-link">
            <img src={logo} alt="Leaf and Life" className="header-logo" />
            <span className="brand-name">Leaf & Life</span>
          </Link>
        </div>

        <div className="header-center">
          {/* Desktop Navigation - Hidden on mobile via CSS */}
          <nav className="desktop-nav">
            {brandMenuItems.map((item) => (
              <Link key={item.href} to={item.href} className="desktop-nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="header-actions">
          {isAuthenticated && (
            <button 
              type="button" 
              className="btn-secondary switch-account-btn"
              onClick={onSwitchAccount}
            >
              <span className="btn-text">Switch Account</span>
            </button>
          )}

          {/* Unified Menu Trigger (Mobile) / Get Started (Desktop) */}
          <div className="mega-menu-wrapper" ref={megaMenuRef}>
            <button
              type="button"
              className="btn-primary get-started-btn"
              onClick={() => {
                if (isAuthenticated) {
                  onGetStarted();
                } else {
                  setMegaMenuOpen(!megaMenuOpen);
                }
              }}
              aria-expanded={megaMenuOpen}
              aria-haspopup="true"
            >
              <span className="btn-text">Get Started</span>
              <ChevronDown
                size={18}
                className={`dropdown-icon ${megaMenuOpen ? 'open' : ''}`}
              />
            </button>

            {/* Premium Unified Mobile Menu / Mega Menu */}
            {megaMenuOpen && !isAuthenticated && (
              <div className="mega-menu premium-unified-menu">
                <div className="mega-menu-header">
                  <div>
                    <h2>Explore Features</h2>
                    <p className="menu-subtitle">Unlock the full potential of your green space</p>
                  </div>
                  <button className="close-btn" onClick={handleMegaMenuClose} aria-label="Close menu">
                    <X size={24} />
                  </button>
                </div>

                <div className="mega-menu-grid">
                  {allFeatures.map((item) => (
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

                {/* Navigation Section (Highly visible on mobile) */}
                <div className="mobile-nav-section">
                  <h3 className="section-label">Quick Links</h3>
                  <div className="mobile-nav-links">
                    {brandMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="mobile-nav-item"
                        onClick={handleMegaMenuClose}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mega-menu-footer">
                  <div className="footer-content">
                    <p>New to Leaf & Life?</p>
                    <button 
                      className="btn-primary-small"
                      onClick={() => {
                        setMegaMenuOpen(false);
                        onOpenAuth();
                      }}
                    >
                      Join Community
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
   