import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
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
    { label: 'Contact', href: '#contact' },
  ];

  const megaMenuItems = [
    { label: 'Marketplace', href: '/marketplace', icon: '🛒' },
    { label: 'Smart Recommendation', href: '/recommendation', icon: '💡' },
    { label: 'Smart Scan', href: '/scan', icon: '📷' },
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Community', href: '/rewards', icon: '👥' },
  ];

  return (
    <header className="app-header">
      {/* Brand Section with Dropdown */}
      <div className="header-brand-section">
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

          {/* Brand Dropdown Menu */}
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

      {/* Center Spacer */}
      <div className="header-center"></div>

      {/* Actions Section */}
      <div className="header-actions">
        {isAuthenticated && (
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onSwitchAccount}
          >
            Switch Account
          </button>
        )}

        {/* Get Started Button with Mega Menu */}
        <div className="mega-menu-wrapper" ref={megaMenuRef}>
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
            Get Started
            {!isAuthenticated && (
              <ChevronDown
                size={18}
                className={`dropdown-icon ${megaMenuOpen ? 'open' : ''}`}
              />
            )}
          </button>

          {/* Mega Menu */}
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
      </div>
    </header>
  );
}
   