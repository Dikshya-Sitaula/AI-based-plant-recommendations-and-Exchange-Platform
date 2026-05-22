import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Camera, 
  Globe, 
  Users, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  Send, 
  ChevronDown,
  Building2,
  PhoneCall,
  Newspaper,
  Plus,
  Minus
} from 'lucide-react';
import './Contact.css';
import logo from "../assets/Leaf and Life logo.png";
import AuthModal from '../components/AuthModal';

export default function Contact() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  const [isSubmitted, setIsSubmitted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('leafLifeSubmitted') === 'true';
  });

  // Accordion active element tracking state
  const [openFaq, setOpenFaq] = useState(null);

  // Form interactive handling states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: false, email: false, message: false });
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendSuccess, setSendSuccess] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleGetStarted = () => {
    if (!isSubmitted) {
      setShowModal(true);
      return;
    }
    navigate('/dashboard');
  };

  const handleModalSubmit = () => {
    localStorage.setItem('leafLifeSubmitted', 'true');
    setIsSubmitted(true);
    setShowModal(false);
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    
    const newErrors = {
      name: !name.trim(),
      email: !email.trim() || !emailOk,
      message: !message.trim()
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.message) {
      return;
    }

    setIsSending(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 15, 90);
      setSendProgress(progress);
    }, 70);

    setTimeout(() => {
      clearInterval(interval);
      setSendProgress(100);
      setTimeout(() => {
        setIsSending(false);
        setSendSuccess(true);
      }, 150);
    }, 1200);
  };

  // Content mapped accurately directly from your contact.html layout
  const faqData = [
    {
      q: "How fast do teams respond through the transmission channel?",
      a: "Tickets routed via our direct channel options clear ingestion queues instantly. You will hear back from a representative within 12 to 24 standard operation business hours."
    },
    {
      q: "Can I coordinate hardware modifications directly with engineers?",
      a: "Yes! If you select 'Smart Garden IoT Hardware Modules' as your inquiry topic, your structural ticket is routed to our hardware engineering department for firmware or sensor customization talks."
    },
    {
      q: "Are there platform transaction safeguards for local trading operations?",
      a: "Absolutely. Leaf & Life operates fully isolated cryptographic escrow contracts for decentralized local garden swaps to guarantee secure item exchanges across active neighborhoods."
    },
    {
      q: "Do you facilitate university research or community project grants?",
      a: "Yes, we prioritize structural educational initiatives. Reach out through our 'Institutional Ecosystem Partnerships' option for streamlined grant evaluations and hardware testing sponsorships."
    }
  ];

  return (
    <div className="lp-root contact-page-root">
      
      {/* ─── 1. NAVBAR (UNTOUCHED) ─── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <button type="button" className="lp-brand lp-brand-action" onClick={handleLogoClick}>
            <span className="lp-brand-mark" aria-hidden="true">
              <img src={logo} alt="Leaf & Life logo" className="lp-brand-img" />
            </span>
            <span className="lp-brand-text">Leaf &amp; Life</span>
          </button>

          <div className="lp-nav-center">
            <button type="button" className="lp-nav-link" onClick={() => navigate('/')}>Home</button>
            <button type="button" className="lp-nav-link" onClick={() => navigate('/about')}>About Us</button>
            <button type="button" className="lp-nav-link lp-nav-link-active" onClick={() => navigate('/contact')}>Contact</button>
          </div>

          <div className="lp-nav-actions">
            {isSubmitted && (
              <button
                type="button"
                className="lp-btn lp-btn-ghost lp-btn-sm"
                onClick={() => {
                  localStorage.removeItem('leafLifeSubmitted');
                  localStorage.removeItem('leafLifeAuthenticated');
                  window.location.reload();
                }}
              >
                Switch Account
              </button>
            )}
            <button type="button" className="lp-btn lp-btn-primary" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <AuthModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSubmit}
      />

      {/* ─── 2. CONTACT HERO FORM SECTOR FROM CONTACT.HTML ─── */}
      <main className="contact-hero-section">
        <div className="lp-container">
          <div className="contact-hero-grid">
            
            {/* Left Brand Identity Card */}
            <div className="contact-hero-left">
              <div className="contact-blob contact-blob1" aria-hidden="true"></div>
              <div className="contact-blob contact-blob2" aria-hidden="true"></div>
              <div className="contact-dot-grid" aria-hidden="true"></div>
              
              <div className="contact-left-content">
                <div className="contact-hero-eyebrow">
                  <span className="contact-ey-line"></span>Get In Touch
                </div>
                <h1 className="contact-hero-h1">
                  Let's cultivate <br />something <em>together</em>.
                </h1>
                <p className="contact-hero-desc">
                  Have questions about our smart garden solutions, community marketplace channels, or partnership models? Reach our technical teams instantly.
                </p>
              </div>

              <div className="contact-hero-chips">
                <span className="contact-chip">🌱 Smart Agriculture</span>
                <span className="contact-chip">🏪 Local Trade Help</span>
                <span className="contact-chip">✨ Plant Diagnosis AI</span>
              </div>

              <div className="contact-hero-scroll">
                <span className="contact-sdot"></span>
                <span className="contact-sline"></span>
                Direct Response Channel
              </div>
            </div>

            {/* Right Ingestion Dynamic Form Component */}
            <div className="contact-hero-right">
              {!sendSuccess ? (
                <form className="contact-form-anim" onSubmit={handleSubmit} noValidate>
                  <div className="contact-pill-label">
                    <span className="contact-pill-dot">
                      <Mail size={10} strokeWidth={3} />
                    </span>
                    Direct Channel
                  </div>
                  
                  <h2 className="contact-form-title">Send a <em>message</em></h2>
                  <p className="contact-form-sub">Expect responses within standard business operation slots.</p>

                  <div className="contact-f-group">
                    <div className="contact-f-wrap">
                      <input 
                        type="text" 
                        id="nameInput"
                        className={`contact-f-input ${name ? 'contact-filled' : ''} ${errors.name ? 'contact-err' : ''}`}
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if(errors.name) setErrors(prev => ({...prev, name: false}));
                        }}
                      />
                      <label className="contact-f-lbl" htmlFor="nameInput">Full Name</label>
                      <span className={`contact-v-ico contact-valid-tick ${(!errors.name && name.trim()) ? 'contact-show' : ''}`}>
                        <CheckCircle2 size={16} fill="#2d5a27" color="#ffffff" />
                      </span>
                    </div>
                  </div>

                  <div className="contact-f-group">
                    <div className="contact-f-wrap">
                      <input 
                        type="email" 
                        id="emailInput"
                        className={`contact-f-input ${email ? 'contact-filled' : ''} ${errors.email ? 'contact-err' : ''}`}
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if(errors.email) setErrors(prev => ({...prev, email: false}));
                        }}
                      />
                      <label className="contact-f-lbl" htmlFor="emailInput">Email Address</label>
                      <span className={`contact-v-ico contact-valid-tick ${(!errors.email && email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? 'contact-show' : ''}`}>
                        <CheckCircle2 size={16} fill="#2d5a27" color="#ffffff" />
                      </span>
                    </div>
                  </div>

                  <div className="contact-f-group">
                    <div className="contact-f-wrap">
                      <select 
                        id="topicSelect"
                        className={`contact-f-input contact-f-select ${topic ? 'contact-filled' : ''}`}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      >
                        <option value="general">General Support inquiry</option>
                        <option value="marketplace">Marketplace & Trading Escrow</option>
                        <option value="hardware">Smart Garden IoT Hardware Modules</option>
                        <option value="partnership">Institutional Ecosystem Partnerships</option>
                      </select>
                      <label className="contact-f-lbl" htmlFor="topicSelect">Inquiry Topic</label>
                      <span className="contact-sel-arrow">
                        <ChevronDown size={16} />
                      </span>
                    </div>
                  </div>

                  <div className="contact-f-group contact-f-ta-wrap">
                    <div className="contact-f-wrap">
                      <textarea 
                        id="msgInput"
                        maxLength="1000"
                        className={`contact-f-input contact-f-textarea ${message ? 'contact-filled' : ''} ${errors.message ? 'contact-err' : ''}`}
                        placeholder="Write your brief message here..."
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if(errors.message) setErrors(prev => ({...prev, message: false}));
                        }}
                      ></textarea>
                      <label className="contact-f-lbl" htmlFor="msgInput">Your Message</label>
                      <span className={`contact-char-cnt ${message.length > 900 ? 'contact-warn' : ''}`}>
                        {message.length}/1000
                      </span>
                    </div>
                  </div>

                  <div className="contact-form-ft">
                    <div className="contact-form-note">
                      <ShieldCheck size={16} color="#2d5a27" />
                      Data secure & encrypted
                    </div>
                    
                    <button type="submit" className="contact-btn-send" disabled={isSending}>
                      <div className="contact-btn-bar" style={{ width: `${sendProgress}%` }}></div>
                      <span>{isSending ? 'Sending…' : 'Transmit Request'}</span>
                      {isSending ? <Loader2 size={16} className="contact-spin" /> : <Send size={14} />}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="contact-form-success">
                  <div className="contact-s-ring">
                    <CheckCircle2 size={24} color="#2d5a27" />
                  </div>
                  <h3 className="contact-succ-h">Transmission Complete</h3>
                  <p className="contact-succ-p">Your support ticket has cleared internal ingestion pathways successfully.</p>
                  <button type="button" className="contact-btn-ghost" onClick={() => setSendSuccess(false)}>
                    Send New Ticket
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* ─── 3. ALTERNATIVE CHANNELS BLOCK FROM CONTACT.HTML ─── */}
      <section className="contact-channels-section">
        <div className="lp-container">
          <div className="contact-section-header">
            <span className="contact-sub-eyebrow">Alternative Options</span>
            <h2 className="contact-section-h2">Other ways to <em>connect</em></h2>
            <p className="contact-section-p">Skip the queue lines if your requirements align with these operational desks directly.</p>
          </div>

          <div className="contact-channels-grid">
            <div className="contact-chan-card">
              <div className="contact-chan-icon-box">
                <Building2 size={22} color="#2d5a27" />
              </div>
              <h3 className="contact-chan-title">Central HQ Office</h3>
              <p className="contact-chan-desc">Stop by our collaborative campus hubs for physical hardware system prototype viewings.</p>
              <span className="contact-chan-detail">Jalan Universiti, Bandar Sunway, MY</span>
            </div>

            <div className="contact-chan-card">
              <div className="contact-chan-icon-box">
                <PhoneCall size={22} color="#2d5a27" />
              </div>
              <h3 className="contact-chan-title">Urgent Hotline</h3>
              <p className="contact-chan-desc">Immediate telephone infrastructure integration support for emergency grower system outages.</p>
              <span className="contact-chan-detail">+60 (3) 7491-8622</span>
            </div>

            <div className="contact-chan-card">
              <div className="contact-chan-icon-box">
                <Newspaper size={22} color="#2d5a27" />
              </div>
              <h3 className="contact-chan-title">Press &amp; Media</h3>
              <p className="contact-chan-desc">Download digital brand assets, view media reports, or submit editorial presentation requests.</p>
              <span className="contact-chan-detail">media@leafandlife.org</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. FAQ ACCORDION SECTION FROM CONTACT.HTML ─── */}
      <section className="contact-faq-section">
        <div className="lp-container">
          <div className="contact-faq-inner-grid">
            
            <div className="contact-faq-sticky-left">
              <span className="contact-sub-eyebrow">Got Questions?</span>
              <h2 className="contact-section-h2">Frequently Asked <em>Inquiries</em></h2>
              <p className="contact-section-p">Quick answers regarding technical configurations, system integration latency, and marketplace security mechanics.</p>
            </div>

            <div className="contact-faq-list">
              {faqData.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className={`contact-faq-item ${isOpen ? 'contact-faq-open' : ''}`}
                    onClick={() => toggleFaq(idx)}
                  >
                    <div className="contact-faq-top">
                      <h4 className="contact-faq-q">{faq.q}</h4>
                      <button type="button" className="contact-faq-toggle-btn" aria-label="Toggle accordion view">
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </button>
                    </div>
                    <div className="contact-faq-answer-pane">
                      <p className="contact-faq-a">{faq.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. FINAL CTA SECTION (UNTOUCHED LOGIC) ─── */}
      <section className="lp-cta">
        <div className="lp-container">
          <div className="lp-cta-box">
            <div className="lp-cta-content">
              <h2 className="lp-cta-h2">Ready to cultivate your smart lifestyle?</h2>
              <p className="lp-cta-p">
                Join thousands of urban growers transforming their spaces today. No green thumb required.
              </p>
              <button type="button" className="lp-btn lp-btn-white" onClick={handleGetStarted}>
                Get Started Now <ArrowRight size={16} style={{ marginLeft: '6px' }} />
              </button>
            </div>
            <div className="lp-cta-decor" aria-hidden="true">
              <div className="lp-decor-circle"></div>
              <div className="lp-decor-circle-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. FOOTER SECTION (UNTOUCHED LOGIC) ─── */}
      <footer className="lp-footer">
        <div className="lp-container">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <div className="lp-brand">
                <span className="lp-brand-mark" aria-hidden="true">
                  <img src={logo} alt="Leaf & Life logo" className="lp-brand-img" />
                </span>
                <span className="lp-brand-text">Leaf &amp; Life</span>
              </div>
              <p className="lp-footer-tagline">
                Bridging nature and technology for sustainable, smarter urban living communities.
              </p>
            </div>

            <div className="lp-footer-links-group">
              <h5 className="lp-footer-h">Platform</h5>
              <div className="lp-footer-links">
                <button type="button" className="lp-footer-link" onClick={() => navigate('/marketplace')}>Marketplace</button>
                <button type="button" className="lp-footer-link" onClick={() => navigate('/scan')}>AI Plant Scanner</button>
                <button type="button" className="lp-footer-link" onClick={() => navigate('/recommendation')}>Smart Finder</button>
              </div>
            </div>

            <div className="lp-footer-links-group">
              <h5 className="lp-footer-h">Company</h5>
              <div className="lp-footer-links">
                <button type="button" className="lp-footer-link" onClick={() => navigate('/about')}>About Us</button>
                <button type="button" className="lp-footer-link" onClick={() => navigate('/contact')}>Contact</button>
              </div>
            </div>

            <div className="lp-footer-links-group">
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