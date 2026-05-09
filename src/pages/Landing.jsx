import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  Camera,
  Check,
  CheckCircle2,
  Droplets,
  Flame,
  Globe,
  HeartPulse,
  Info,
  Leaf,
  Mail,
  MapPin,
  RefreshCw,
  Scan,
  Search,
  ShoppingBag,
  ShoppingCart,
  Users,
  Wind,
} from 'lucide-react';
import './Landing.css';
import logo from "../assets/Leaf and Life logo.png";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="lp-root">
      {/* Navbar */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-brand" aria-label="Leaf & Life Home">
            <span className="lp-brand-mark" aria-hidden="true">
              <Leaf size={18} />
            </span>
            <span className="lp-brand-text">Leaf &amp; Life</span>
          </Link>

          <div className="lp-nav-links">
            <Link className="lp-nav-link" to="/marketplace">Marketplace</Link>
            <Link className="lp-nav-link" to="/scan">Smart Scan</Link>
            <Link className="lp-nav-link" to="/rewards">Community</Link>
            <Link className="lp-nav-link" to="/dashboard">Dashboard</Link>
            <Link className="lp-nav-link" to="/recommendation">Recommendation</Link>
          </div>

          <button
            type="button"
            className="lp-btn lp-btn-primary"
            onClick={() => navigate('/marketplace')}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lp-hero">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-copy">
            <div className="lp-pill">
              <span className="lp-pill-icon" aria-hidden="true"><ZapLike /></span>
              AI-POWERED ECO SYSTEM
            </div>

            <h1 className="lp-hero-title">
              Grow Smarter,<br />
              Live <span className="lp-emphasis">Greener.</span>
            </h1>

            <p className="lp-hero-subtitle">
              An AI-powered platform that helps users identify plants, discover the right plants for their space,
              and exchange plants locally through a sustainable community marketplace.
            </p>

            <div className="lp-hero-actions">
              <button
                type="button"
                className="lp-btn lp-btn-primary lp-btn-lg"
                onClick={() => navigate('/marketplace')}
              >
                Explore Plants <ArrowRight size={18} />
              </button>
              <button
                type="button"
                className="lp-btn lp-btn-ghost lp-btn-lg"
                onClick={() => navigate('/marketplace')}
              >
                Join Marketplace
              </button>
            </div>

            <div className="lp-checklist">
              <div className="lp-check">
                <CheckCircle2 size={16} className="lp-check-icon" />
                <span>AI-Based Recommendations</span>
              </div>
              <div className="lp-check">
                <CheckCircle2 size={16} className="lp-check-icon" />
                <span>Hyperlocal Plant Exchange</span>
              </div>
              <div className="lp-check">
                <CheckCircle2 size={16} className="lp-check-icon" />
                <span>Beginner-Friendly Plant Care</span>
              </div>
            </div>
          </div>

          <div className="lp-hero-media">
            <div className="lp-glow" aria-hidden="true" />
            <div className="lp-hero-card">
              <img
                src="https://uxmagic.blob.core.windows.net/public/agent-images/hero-plant-tech-refined-1778265289739-p3xgcle4khj.png"
                alt="Premium indoor plant"
                className="lp-hero-img"
              />
              <div className="lp-float lp-bounce">
                <div className="lp-float-icon" aria-hidden="true">
                  <Search size={22} />
                </div>
                <div className="lp-float-copy">
                  <p className="lp-float-kicker">AI Scanner Active</p>
                  <p className="lp-float-title">Identifying: Monstera Deliciosa</p>
                </div>
                <div className="lp-float-dots" aria-hidden="true">
                  <span className="lp-dot lp-dot-1" />
                  <span className="lp-dot lp-dot-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="lp-section lp-section-muted">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-kicker">The Problem</span>
            <h2 className="lp-h2">Urban Living is Becoming Less Green.</h2>
            <p className="lp-lead">
              Urban communities are facing increasing air pollution, rising temperatures, and limited green spaces.
              Growing plants at home is harder than ever.
            </p>
          </div>

          <div className="lp-grid lp-grid-4">
            <div className="lp-card">
              <div className="lp-card-icon lp-ic-red"><Flame size={22} /></div>
              <h3 className="lp-h3">Environmental Challenges</h3>
              <p className="lp-p">Air pollution, heatwaves, and shrinking green spaces are affecting healthier urban living.</p>
            </div>
            <div className="lp-card">
              <div className="lp-card-icon lp-ic-orange"><ShoppingCart size={22} /></div>
              <h3 className="lp-h3">Limited Accessibility</h3>
              <p className="lp-p">Plants are often expensive and difficult to access, especially for students and apartment residents.</p>
            </div>
            <div className="lp-card">
              <div className="lp-card-icon lp-ic-blue"><Info size={22} /></div>
              <h3 className="lp-h3">Lack of Knowledge</h3>
              <p className="lp-p">Beginners often don’t know how to care for plants or which plants are suitable for their homes.</p>
            </div>
            <div className="lp-card">
              <div className="lp-card-icon lp-ic-purple"><RefreshCw size={22} /></div>
              <h3 className="lp-h3">No Exchange System</h3>
              <p className="lp-p">There is no dedicated platform for users to swap, thrift, or exchange plants efficiently.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="lp-section">
        <div className="lp-container lp-two-col">
          <div className="lp-solution-visual">
            <div className="lp-visual-shell">
              <div className="lp-mini-grid">
                <div className="lp-mini-col">
                  <div className="lp-mini lp-float-up">
                    <Scan size={26} />
                    <p className="lp-mini-title">AI Scanner</p>
                    <p className="lp-mini-sub">99.8% Accuracy</p>
                  </div>
                  <div className="lp-mini lp-mini-solid lp-float-up-delayed">
                    <Droplets size={26} />
                    <p className="lp-mini-title">Smart Watering</p>
                    <p className="lp-mini-sub">Next: 2 days</p>
                  </div>
                </div>
                <div className="lp-mini-col lp-mini-col-offset">
                  <div className="lp-mini lp-float-up">
                    <Wind size={26} />
                    <p className="lp-mini-title">Air Quality</p>
                    <p className="lp-mini-sub">Excellent (+12%)</p>
                  </div>
                  <div className="lp-mini lp-mini-tertiary lp-float-up-delayed">
                    <Users size={26} />
                    <p className="lp-mini-title">Marketplace</p>
                    <p className="lp-mini-sub">12 Swaps nearby</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lp-solution-copy">
            <span className="lp-kicker">Our Solution</span>
            <h2 className="lp-h2">Technology That Makes Plant Care Simple.</h2>
            <p className="lp-lead">
              Our platform combines AI-powered plant identification, personalized recommendations,
              and a community-driven marketplace to make plant care easier and more accessible.
            </p>
            <div className="lp-bullets">
              {[
                'AI Plant Identification',
                'Smart Space Recs',
                'Hyperlocal Marketplace',
                'Personalized Care',
                'Air Quality Awareness',
                'Community Rewards',
              ].map((t) => (
                <div className="lp-bullet" key={t}>
                  <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (reusing your current Landing page cards) */}
      <section className="lp-section lp-section-card" id="features">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-kicker">Key Features</span>
            <h2 className="lp-h2">Everything You Need for Greener Living.</h2>
          </div>

          <div className="lp-grid lp-grid-3">
            <Link to="/scan" className="lp-feature">
              <Camera size={28} className="lp-feature-icon" />
              <h3 className="lp-h3">AI Identification</h3>
              <p className="lp-p">
                Snap a photo and instantly know your plant&apos;s name, needs, and ideal location in your home based on light and space.
              </p>
            </Link>

            <Link to="/recommendation" className="lp-feature">
              <MapPin size={28} className="lp-feature-icon" />
              <h3 className="lp-h3">Space &amp; Location-Based Recommendation</h3>
              <p className="lp-p">
                Tell us about your space, and we&apos;ll recommend the perfect plants for your environment. No photos required!
              </p>
            </Link>

            <Link to="/marketplace" className="lp-feature">
              <ShoppingBag size={28} className="lp-feature-icon" />
              <h3 className="lp-h3">Hyperlocal Marketplace</h3>
              <p className="lp-p">
                Buy, sell, swap, or thrift plants with people in your neighborhood. Support local nurseries and reduce waste.
              </p>
            </Link>

            <Link to="/rewards" className="lp-feature">
              <Award size={28} className="lp-feature-icon" />
              <h3 className="lp-h3">Community Rewards</h3>
              <p className="lp-p">
                Track your air quality impact, join eco-challenges, and earn badges for sustainable plant parenting.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="lp-section lp-section-muted">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-kicker">How It Works</span>
            <h2 className="lp-h2">Simple, Smart, and Beginner-Friendly.</h2>
          </div>
          <div className="lp-steps">
            <div className="lp-step">
              <div className="lp-step-num">1</div>
              <h4 className="lp-h4">Upload Image</h4>
              <p className="lp-p">Identify plants instantly using AI.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">2</div>
              <h4 className="lp-h4">Enter Space</h4>
              <p className="lp-p">Tell the system about your environment.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">3</div>
              <h4 className="lp-h4">Get Recs</h4>
              <p className="lp-p">Discover suitable plants and care.</p>
            </div>
            <div className="lp-step">
              <div className="lp-step-num">4</div>
              <h4 className="lp-h4">Buy or Swap</h4>
              <p className="lp-p">Connect with nearby users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-impact">
            <div className="lp-impact-glow" aria-hidden="true" />
            <div className="lp-impact-grid">
              <div>
                <span className="lp-kicker lp-kicker-tertiary">Our Impact</span>
                <h2 className="lp-h2 lp-h2-invert">Growing Greener Communities Together.</h2>
                <div className="lp-stats">
                  <div className="lp-stat">
                    <p className="lp-stat-val">1200+</p>
                    <p className="lp-stat-lbl">Plants Shared</p>
                  </div>
                  <div className="lp-stat">
                    <p className="lp-stat-val">450+</p>
                    <p className="lp-stat-lbl">Active Users</p>
                  </div>
                  <div className="lp-stat">
                    <p className="lp-stat-val">80+</p>
                    <p className="lp-stat-lbl">Local Nurseries</p>
                  </div>
                  <div className="lp-stat">
                    <p className="lp-stat-val">65%</p>
                    <p className="lp-stat-lbl">Improved Retention</p>
                  </div>
                </div>
              </div>

              <div className="lp-orbit-wrap" aria-hidden="true">
                <div className="lp-orbit">
                  <div className="lp-orbit-core">
                    <span>Building Sustainable Living</span>
                  </div>
                  <Leaf size={20} className="lp-orbit-leaf" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-section lp-cta">
        <div className="lp-container lp-cta-inner">
          <h2 className="lp-cta-title">Ready to Start Your Green Journey?</h2>
          <p className="lp-lead">
            Make your living space greener, healthier, and smarter with AI-powered plant guidance and a connected plant community.
          </p>
          <div className="lp-hero-actions lp-cta-actions">
            <button type="button" className="lp-btn lp-btn-primary lp-btn-xl" onClick={() => navigate('/marketplace')}>
              Get Started Now
            </button>
            <button type="button" className="lp-btn lp-btn-ghost lp-btn-xl" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <div className="lp-footer-logo">
                <img src={logo} alt="Leaf & Life" className="lp-footer-img" />
                <span className="lp-brand-text">Leaf &amp; Life</span>
              </div>
              <p className="lp-p">
                AI-powered plant recommendation and exchange platform designed to promote greener living through technology and community.
              </p>
            </div>
            <div>
              <h5 className="lp-footer-h">Platform</h5>
              <ul className="lp-footer-list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/scan">Smart Scan</Link></li>
                <li><Link to="/marketplace">Marketplace</Link></li>
                <li><Link to="/rewards">Community</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="lp-footer-h">Company</h5>
              <ul className="lp-footer-list">
                <li><a href="#" onClick={(e) => e.preventDefault()}>About Us</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Contact</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h5 className="lp-footer-h">Connect</h5>
              <div className="lp-social">
                <a className="lp-social-btn" href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram">
                  <Camera size={18} />
                </a>
                <a className="lp-social-btn" href="#" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">
                  <Globe size={18} />
                </a>
                <a className="lp-social-btn" href="#" onClick={(e) => e.preventDefault()} aria-label="Facebook">
                  <Users size={18} />
                </a>
                <a className="lp-social-btn" href="#" onClick={(e) => e.preventDefault()} aria-label="Twitter">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <p>© 2026 Leaf &amp; Life. All rights reserved.</p>
            <div className="lp-footer-bottom-links">
              <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ZapLike() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M13 2L3 14h7l-1 8l10-12h-7l1-8z"
      />
    </svg>
  );
}
