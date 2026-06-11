import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, X, Menu, ShoppingCart, Sparkles, Scan, LayoutDashboard, Users } from 'lucide-react';
import logo from "../assets/Leaf and Life logo.png";
import './Header.css';

export default function Header({ isAuthenticated, onOpenAuth, onSwitchAccount, onGetStarted }) {
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
    { label: 'Marketplace', href: '/marketplace', icon: <ShoppingCart size={24} />, color: 'blue' },
    { label: 'Recommendation', href: '/recommendation', icon: <Sparkles size={24} />, color: 'purple' },
    { label: 'Smart Scan', href: '/scan', icon: <Scan size={28} />, color: 'primary' },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={24} />, color: 'orange' },
    { label: 'Community', href: '/rewards', icon: <Users size={24} />, color: 'teal' },
  ];

  const isFeaturePage = ['/marketplace', '/scan', '/recommendation', '/rewards', '/dashboard'].some(path => location.pathname.startsWith(path));

  return (
    <header className={`app-header ${isFeaturePage ? 'feature-header' : ''}`}>
      {/* Brand Section */}
      <div className="header-brand-section">
        <Link to="/" className="brand-logo-link" onClick={() => setMobileMenuOpen(false)}>
          <img src={logo} alt="Leaf and Life" className="header-logo" />
          <span className="brand-name">Leaf & Life</span>
        </Link>
        
        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          {brandMenuItems.map((item) => (
            <Link key={item.href} to={item.href} className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>
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
          className="mobile-menu-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
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

            <div className="mobile-menu-footer">
              {isAuthenticated && (
                <button 
                  className="btn-secondary w-full" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSwitchAccount();
                  }}
                >
                  Switch Account
                </button>
              )}
              <button 
                className="btn-primary w-full" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetStarted();
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
