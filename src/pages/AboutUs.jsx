import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  Check,
  CheckCircle2,
  Globe,
  HeartPulse,
  Lightbulb,
  Mail,
  MapPin,
  Quote,
  ShoppingBag,
  Target,
  Users,
  Wind,
  Eye,
  Flame,
} from 'lucide-react';
import './Landing.css';
import './AboutUs.css';
import logo from "../assets/Leaf and Life logo.png";
import AuthModal from '../components/AuthModal';

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

// Custom hook for scroll-reveal animation
function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const node = ref.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  return [ref, isVisible];
}

function RevealCard({ children, delay = 0 }) {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`reveal-element ${isVisible ? 'reveal-active' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function AboutUs() {
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('leafLifeAuthenticated') === 'true';
    }
    return false;
  });

  const openAuthModal = () => {
    setAuthOpen(true);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      openAuthModal();
    }
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
    <div className="lp-root about-root">
      {/* Navbar */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <Link to="/" className="lp-brand" aria-label="Leaf & Life Home">
            <span className="lp-brand-mark" aria-hidden="true">
              <img src={logo} alt="" className="lp-brand-img" />
            </span>
            <span className="lp-brand-text">Leaf &amp; Life</span>
          </Link>

          <div className="lp-nav-links">
            <Link className="lp-nav-link" to="/">Home</Link>
            <Link className="lp-nav-link" to="/about">About Us</Link>
            <a className="lp-nav-link" href="#footer">Contact</a>
          </div>

          <div className="lp-nav-actions">
            {isAuthenticated && (
              <button type="button" className="lp-btn lp-btn-ghost lp-btn-sm" onClick={handleSwitchAccount}>
                Switch Account
              </button>
            )}
            <button
              type="button"
              className="lp-btn lp-btn-primary"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          setIsAuthenticated(true);
          localStorage.setItem('leafLifeAuthenticated', 'true');
          navigate('/dashboard');
        }}
      />

      {/* Hero Section */}
      <section className="lp-hero">
        <div className="lp-container lp-hero-grid">
          <div className="lp-hero-copy">
            <div className="lp-pill">
              <span className="lp-pill-icon" aria-hidden="true"><ZapLike /></span>
              AI-POWERED SUSTAINABLE LIVING
            </div>

            <h1 className="lp-hero-title">
              Where Technology<br />
              Meets <span className="lp-emphasis">Nature.</span>
            </h1>

            <p className="lp-hero-subtitle">
              Helping people discover the right plants, care for them with confidence, and build greener living spaces through AI-powered guidance and community-driven plant exchange.
            </p>

            <div className="lp-hero-actions">
              <button
                type="button"
                className="lp-btn lp-btn-primary lp-btn-lg"
                onClick={() => navigate('/marketplace')}
              >
                🌱 Start Exploring
              </button>
              <button
                type="button"
                className="lp-btn lp-btn-ghost lp-btn-lg"
                onClick={() => navigate('/rewards')}
              >
                🤝 Join Our Community
              </button>
            </div>

            <div className="lp-checklist">
              <div className="lp-check">
                <CheckCircle2 size={16} className="lp-check-icon" />
                <span>Make plant care beginner-friendly</span>
              </div>
              <div className="lp-check">
                <CheckCircle2 size={16} className="lp-check-icon" />
                <span>Promote sustainable urban living</span>
              </div>
              <div className="lp-check">
                <CheckCircle2 size={16} className="lp-check-icon" />
                <span>Build eco-conscious communities</span>
              </div>
            </div>
          </div>

          <div className="lp-hero-media">
            <div className="lp-glow" aria-hidden="true" />
            <div className="lp-hero-card">
              <img
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=2070&auto=format&fit=crop"
                alt="Eco Tech Dashboard"
                className="lp-hero-img"
              />
              <div className="lp-float lp-bounce">
                <div className="lp-float-icon" aria-hidden="true">
                  <Flame size={22} />
                </div>
                <div className="lp-float-copy">
                  <p className="lp-float-kicker">Live AI Analysis</p>
                  <p className="lp-float-title">Optimal Sunlight: 6 hours daily</p>
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

      {/* Our Story Section */}
      <section className="lp-section lp-section-muted">
        <div className="lp-container lp-two-col">
          <div className="lp-solution-visual about-story-visual" style={{ order: 1 }}>
            <div className="lp-visual-shell">
              <img
                src="https://uxmagic.blob.core.windows.net/public/agent-images/our_story_img-1778315363961-lyypcn5hb2.png"
                alt="Plant Care Journey"
                style={{ width: '100%', borderRadius: '32px', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="about-quote-panel">
              <Quote size={32} className="about-quote-icon" />
              <p className="about-quote-text">
                “Small green actions today can create healthier communities tomorrow.”
              </p>
            </div>
          </div>

          <div className="lp-solution-copy" style={{ order: 2 }}>
            <span className="lp-kicker">Our Journey</span>
            <h2 className="lp-h2">Why We Started This Journey</h2>
            <div className="about-story-copy">
              <p>
                Our story began with a very real and relatable problem. Many people genuinely want to bring greenery into their homes but often feel confused about where to start. Plants are purchased with excitement, only to slowly die because people are unsure about watering schedules, sunlight conditions, placement, or even the name of the plant they bought.
              </p>
              <p>
                At the same time, local nurseries and plant sellers struggle to expand digitally. Many rely solely on physical stores, limiting their visibility and access to wider communities. We saw an opportunity to create a meaningful bridge between people, plants, and technology.
              </p>
              <p>
                This inspired us to build a platform that simplifies plant care while making greenery more accessible, affordable, and community-driven. By combining AI technology with sustainable living practices, we aim to help individuals confidently create greener, healthier spaces — no matter their experience level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-kicker">What Drives Us</span>
            <h2 className="lp-h2">Our Purpose & Perspective</h2>
          </div>

          <div className="lp-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <RevealCard delay={0}>
              <div className="lp-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="lp-card-icon lp-ic-red"><Target size={24} /></div>
                <h3 className="lp-h3">Our Mission</h3>
                <p className="lp-p" style={{ marginBottom: '24px' }}>
                  We aim to make plant care simple, accessible, and enjoyable for everyone. Through AI-powered guidance, personalized recommendations, and local plant exchange, we empower people to confidently build greener homes and healthier living environments.
                </p>
                <div className="lp-bullets">
                  <div className="lp-bullet">
                    <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                    <span>Make plant care beginner-friendly</span>
                  </div>
                  <div className="lp-bullet">
                    <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                    <span>Promote sustainable urban living</span>
                  </div>
                  <div className="lp-bullet">
                    <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                    <span>Encourage affordable plant accessibility</span>
                  </div>
                  <div className="lp-bullet">
                    <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                    <span>Build eco-conscious communities</span>
                  </div>
                </div>
              </div>
            </RevealCard>

            <RevealCard delay={150}>
              <div className="lp-card lp-card-primary" style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', background: 'var(--lp-primary)', color: '#fff' }}>
                <div className="lp-card-icon lp-card-icon-light"><Eye size={24} /></div>
                <h3 className="lp-h3" style={{ color: '#fff' }}>Our Vision</h3>
                <p className="lp-p" style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '24px' }}>
                  We envision a future where technology and sustainability work together to reconnect people with nature. Our goal is to create greener cities, healthier homes, and stronger communities through smart environmental awareness and digital accessibility.
                </p>
                <div className="lp-bullets">
                  <div className="lp-bullet lp-bullet-light">
                    <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                    <span>Greener urban communities</span>
                  </div>
                  <div className="lp-bullet lp-bullet-light">
                    <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                    <span>Smarter plant care experiences</span>
                  </div>
                  <div className="lp-bullet lp-bullet-light">
                    <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                    <span>Sustainable living through technology</span>
                  </div>
                  <div className="lp-bullet lp-bullet-light">
                    <span className="lp-bullet-mark" aria-hidden="true"><Check size={14} /></span>
                    <span>Stronger local eco ecosystems</span>
                  </div>
                </div>
              </div>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="lp-section lp-section-muted">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-kicker">Our Solutions</span>
            <h2 className="lp-h2">Smart Features Designed for Greener Living</h2>
            <p className="lp-lead">Everything you need to discover, care for, and exchange plants — all in one intelligent platform.</p>
          </div>

          <div className="lp-grid lp-grid-4">
            <RevealCard delay={0}>
              <div className="lp-card lp-card-feature">
                <div className="lp-card-icon lp-ic-red"><Camera size={22} /></div>
                <h3 className="lp-h3">AI Plant Identification</h3>
                <p className="lp-p">Upload a plant image and instantly identify the plant along with care tips and environmental benefits.</p>
              </div>
            </RevealCard>
            <RevealCard delay={100}>
              <div className="lp-card lp-card-feature">
                <div className="lp-card-icon lp-ic-orange"><MapPin size={22} /></div>
                <h3 className="lp-h3">Smart Space Recs</h3>
                <p className="lp-p">Receive personalized plant suggestions based on available space, sunlight conditions, and your location.</p>
              </div>
            </RevealCard>
            <RevealCard delay={200}>
              <div className="lp-card lp-card-feature">
                <div className="lp-card-icon lp-ic-blue"><ShoppingBag size={22} /></div>
                <h3 className="lp-h3">Hyperlocal Marketplace</h3>
                <p className="lp-p">Buy, sell, swap, or thrift plants within your nearby community with ease.</p>
              </div>
            </RevealCard>
            <RevealCard delay={300}>
              <div className="lp-card lp-card-feature">
                <div className="lp-card-icon lp-ic-purple"><Wind size={22} /></div>
                <h3 className="lp-h3">Air Quality Awareness</h3>
                <p className="lp-p">Track how your plant collection contributes to improving indoor air quality and your health.</p>
              </div>
            </RevealCard>
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="lp-section">
        <div className="lp-container lp-two-col">
          <div>
            <span className="lp-kicker">Our Impact</span>
            <h2 className="lp-h2">Growing More Than Just Plants</h2>
            <p className="lp-lead">
              We believe that meaningful environmental change starts with small everyday actions. Through plant sharing, sustainable living practices, and stronger local connections, our platform helps communities grow greener together.
            </p>

            <div className="about-impact-grid">
              <div className="about-stat-card">
                <div className="about-stat-number">10K+</div>
                <div className="about-stat-label">Plant Recommendations</div>
              </div>
              <div className="about-stat-card">
                <div className="about-stat-number">500+</div>
                <div className="about-stat-label">Local Nurseries</div>
              </div>
            </div>

            <p className="about-impact-note">
              Every plant shared, every home greened, and every sustainable action contributes toward building healthier communities and a more environmentally conscious future.
            </p>
          </div>

          <div className="about-impact-media">
            <div className="about-impact-shell">
              <img
                src="https://uxmagic.blob.core.windows.net/public/agent-images/community_impact_img-1778315370103-xq75bbx0ey.png"
                alt="Community Impact"
                className="about-impact-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="lp-section lp-section-muted">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-kicker">Our People</span>
            <h2 className="lp-h2">The People Behind the Vision</h2>
            <p className="lp-lead">A passionate team of creators, innovators, and problem-solvers building technology that reconnects people with nature.</p>
          </div>

          <div className="lp-grid lp-grid-4">
            <div className="about-team-card">
              <img src="https://randomuser.me/api/portraits/women/12.jpg" alt="Dikshya Sitaula" className="about-team-avatar" />
              <h3 className="lp-h3">Dikshya Sitaula</h3>
              <p className="about-team-role">UI/UX Design Lead</p>
              <p className="lp-p">Designing intuitive, modern, and visually engaging user experiences for plant care.</p>
            </div>
            <div className="about-team-card">
              <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Rishu Prajapati" className="about-team-avatar" />
              <h3 className="lp-h3">Rishu Prajapati</h3>
              <p className="about-team-role">Backend Dev Lead</p>
              <p className="lp-p">Building the recommendation system, marketplace logic, and application performance.</p>
            </div>
            <div className="about-team-card">
              <img src="https://randomuser.me/api/portraits/women/67.jpg" alt="Adita Rai" className="about-team-avatar" />
              <h3 className="lp-h3">Adita Rai</h3>
              <p className="about-team-role">AI & Database Lead</p>
              <p className="lp-p">Managing plant datasets, intelligent systems, and AI-powered recognition.</p>
            </div>
            <div className="about-team-card">
              <img src="https://randomuser.me/api/portraits/women/89.jpg" alt="Liza Shrestha" className="about-team-avatar" />
              <h3 className="lp-h3">Liza Shrestha</h3>
              <p className="about-team-role">Project Lead & QA</p>
              <p className="lp-p">Overseeing project coordination, feature integration, and ensuring high quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="lp-section">
        <div className="lp-container">
          <div className="lp-section-head">
            <span className="lp-kicker">Our Core Values</span>
            <h2 className="lp-h2">The Values That Shape Our Vision</h2>
          </div>

          <div className="lp-grid lp-grid-4">
            <div className="about-value-card">
              <div className="about-value-icon"><Flame size={20} /></div>
              <h3 className="lp-h3">Sustainability</h3>
              <p className="lp-p">Promoting environmentally responsible habits and greener lifestyles through accessible solutions.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><Lightbulb size={20} /></div>
              <h3 className="lp-h3">Innovation</h3>
              <p className="lp-p">Using AI and smart technology to simplify plant care and make sustainable living practical.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><HeartPulse size={20} /></div>
              <h3 className="lp-h3">Community</h3>
              <p className="lp-p">Positive environmental impact grows stronger through collaboration and meaningful connections.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon"><Globe size={20} /></div>
              <h3 className="lp-h3">Accessibility</h3>
              <p className="lp-p">Making plants and plant knowledge accessible to everyone regardless of experience.</p>
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
            <button type="button" className="lp-btn lp-btn-primary lp-btn-xl" onClick={handleGetStarted}>
              Get Started Now
            </button>
            <button type="button" className="lp-btn lp-btn-ghost lp-btn-xl" onClick={() => navigate('/marketplace')}>
              Explore Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Footer (Sync with Landing Page) */}
      <footer id="footer" className="lp-footer">
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
