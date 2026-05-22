import React, { useState, useEffect, useRef } from 'react';
import './Contact.css';

export default function Contact() {
  // Navigation active state
  const [activeNav, setActiveNav] = useState('contact');

  // Form Field States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Form Validation & Interaction States
  const [filledFields, setFilledFields] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false
  });
  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Form Submission States
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // Mouse Cursor Tracking state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState(''); // 'grow' or 'text'
  const totalScrollRef = useRef(0);

  // Custom Cursor Fluid Animation Loop
  useEffect(() => {
    let reqId;
    const animateRing = () => {
      setRingPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.15,
        y: prev.y + (mousePos.y - prev.y) * 0.15
      }));
      reqId = requestAnimationFrame(animateRing);
    };
    reqId = requestAnimationFrame(animateRing);
    return () => cancelAnimationFrame(reqId);
  }, [mousePos]);

  // Track Mouse Movements & Scroll Progress
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        totalScrollRef.current = (window.scrollY / total) * 100;
      }
      
      const navElement = document.getElementById('mainNav');
      if (navElement) {
        navElement.classList.toggle('scrolled', window.scrollY > 20);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    // Setup Intersection Observer for Reveal elements
    const elementsToReveal = document.querySelectorAll('.sr');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, { threshold: 0.1 });

    elementsToReveal.forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  // Form Event Handlers
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const shortId = id.replace('f-', ''); // Maps 'f-name' -> 'name'

    setFormData(prev => ({ ...prev, [shortId]: value }));
    setFilledFields(prev => ({ ...prev, [shortId]: value.trim() !== '' }));

    // Reset errors on fresh input
    if (errors[shortId]) {
      setErrors(prev => ({ ...prev, [shortId]: false }));
    }

    // Interactive indicators
    if (shortId === 'name') {
      setValidName(value.trim().length > 1);
    }
    if (shortId === 'email') {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
      setValidEmail(emailOk);
    }
    if (shortId === 'message') {
      setCharCount(value.length);
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const shortId = id.replace('f-', '');
    setFilledFields(prev => ({ ...prev, [shortId]: value.trim() !== '' }));
  };

  const scrollToForm = (e) => {
    e.preventDefault();
    const target = document.getElementById('headline');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (e) => {
    const btn = e.currentTarget;
    const item = btn.closest('.faq-item');
    const body = item.querySelector('.faq-body');
    const isOpen = item.classList.contains('open');

    // Close all FAQs first
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-body').style.maxHeight = null;
    });

    // Toggle current selection
    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  };

  const handleSubmit = () => {
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    
    const newErrors = {
      name: formData.name.trim().length === 0,
      email: !isEmailValid,
      message: formData.message.trim().length === 0
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.message) {
      return;
    }

    // Proceed to simulated sending workflow animation
    setIsSending(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + Math.random() * 12, 90);
      setProgressBarWidth(progress);
    }, 80);

    setTimeout(() => {
      clearInterval(interval);
      setProgressBarWidth(100);
      setTimeout(() => {
        setIsSending(false);
        setIsSuccess(true);
      }, 150);
    }, 1400);
  };

  // Cursor Element Classes Wrapper Helper
  const bodyCursorClass = cursorType === 'grow' ? 'cursor-grow' : cursorType === 'text' ? 'cursor-text' : '';

  return (
    <div className={`contact-root ${bodyCursorClass}`}>
      {/* ─── CUSTOM CURSOR ─── */}
      <div id="cursor" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}></div>
      <div id="cursor-ring" style={{ left: `${ringPos.x}px`, top: `${ringPos.y}px` }}></div>

      {/* ─── TOP SCROLL PROGRESS BAR ─── */}
      <div id="pageBar" style={{ width: `${totalScrollRef.current}%` }}></div>

      {/* ─── NAVIGATION BAR ─── */}
      <nav className="nav" id="mainNav">
        <a href="#" className="nav-logo" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
          <div className="logo-mark">
            <iconify-icon icon="ph:leaf-fill" width="18"></iconify-icon>
          </div>
          <span>Leaf &amp; Life</span>
        </a>
        <ul className="nav-links">
          <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Home</a></li>
          <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>About Us</a></li>
          <li><a href="#" className={activeNav === 'contact' ? 'active' : ''} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Contact</a></li>
        </ul>
        <div className="nav-actions">
          <button className="btn-solid" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
            <span>Get Started</span>
          </button>
        </div>
      </nav>

      {/* ─── HERO SPLIT SECTION ─── */}
      <section className="hero">
        {/* Left Aspect Side Column Frame */}
        <div className="hero-left">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
          <div className="dot-grid" id="dotGrid"></div>

          <div>
            <div className="hero-eyebrow"><span className="ey-line"></span>Connect with us</div>
            <h1 className="hero-h1" id="headline">
              <span className="word">Let's</span> <span className="word">grow</span> <br/>
              <span className="word">something</span> <span className="word"><em>beautiful</em></span> <span className="word">together.</span>
            </h1>
            <p className="hero-desc">Have questions about plant care, local exchanges, or nursery features? Our green team is here to guide your journey smoothly.</p>
          </div>

          <div>
            <div className="hero-chips">
              <div className="chip" style={{ animationDelay: '.85s' }} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
                <iconify-icon icon="ph:sparkles-fill"></iconify-icon>AI Guidance Support
              </div>
              <div className="chip" style={{ animationDelay: '.95s' }} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
                <iconify-icon icon="ph:storefront-fill"></iconify-icon>Marketplace Help
              </div>
              <div className="chip" style={{ animationDelay: '1.05s' }} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
                <iconify-icon icon="ph:tree-nursery-fill"></iconify-icon>Nursery Solutions
              </div>
            </div>
            <div className="hero-scroll">
              <span>Scroll to Explore</span>
              <div className="sdot"></div>
              <div className="sline"></div>
            </div>
          </div>
        </div>

        {/* Right Aspect Contact Workspace Form Panel Side */}
        <div className="hero-right">
          {!isSuccess ? (
            <div className="form-anim fa2" id="formWrapper">
              <div className="form-anim fa1">
                <div className="pill-label">
                  <div className="pill-dot"><iconify-icon icon="ph:envelope-simple-open-fill" width="11"></iconify-icon></div>
                  Drop a line
                </div>
                <h2 className="form-title">Send a <em>message.</em></h2>
                <p className="form-sub">We usually reply within a day or two maximum.</p>
              </div>

              <div className="f-row">
                <div className="f-wrap">
                  <input 
                    type="text" 
                    className={`f-input ${filledFields.name ? 'filled' : ''} ${errors.name ? 'err' : ''}`}
                    id="f-name" 
                    placeholder=" " 
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onMouseEnter={() => setCursorType('text')}
                    onMouseLeave={() => setCursorType('')}
                    autoComplete="off"
                  />
                  <label className="f-lbl" htmlFor="f-name">Your Name</label>
                  <span className={`v-ico ${validName ? 'show' : ''}`} style={{ color: 'var(--g500)' }}><iconify-icon icon="ph:check-circle-fill"></iconify-icon></span>
                  {errors.name && <div className="f-err show"><iconify-icon icon="ph:warning-circle-fill" width="13"></iconify-icon>Please enter your name</div>}
                </div>

                <div className="f-wrap">
                  <input 
                    type="email" 
                    className={`f-input ${filledFields.email ? 'filled' : ''} ${errors.email ? 'err' : ''}`}
                    id="f-email" 
                    placeholder=" " 
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onMouseEnter={() => setCursorType('text')}
                    onMouseLeave={() => setCursorType('')}
                    autoComplete="off"
                  />
                  <label className="f-lbl" htmlFor="f-email">Email Address</label>
                  <span className={`v-ico ${validEmail ? 'show' : ''}`} style={{ color: 'var(--g500)' }}><iconify-icon icon="ph:check-circle-fill"></iconify-icon></span>
                  {errors.email && <div className="f-err show"><iconify-icon icon="ph:warning-circle-fill" width="13"></iconify-icon>Enter a valid email address</div>}
                </div>
              </div>

              <div className="f-group">
                <div className="f-wrap">
                  <select 
                    className={`f-input f-select ${filledFields.subject ? 'filled' : ''}`} 
                    id="f-subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onMouseEnter={() => setCursorType('grow')}
                    onMouseLeave={() => setCursorType('')}
                  >
                    <option value="" disabled hidden></option>
                    <option value="Recommendation Help">Plant Recommendation Help</option>
                    <option value="Marketplace Support">Marketplace Support</option>
                    <option value="Nursery Partnership">Nursery Partnership</option>
                    <option value="Technical Assistance">Technical Assistance</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Feedback">Feedback &amp; Suggestions</option>
                  </select>
                  <label className="f-lbl" htmlFor="f-subject">How can we help?</label>
                  <span className="sel-arrow"><iconify-icon icon="ph:caret-down" width="14"></iconify-icon></span>
                </div>
              </div>

              <div className="f-group">
                <div className="f-wrap f-ta-wrap">
                  <textarea 
                    className={`f-input f-textarea ${filledFields.message ? 'filled' : ''} ${errors.message ? 'err' : ''}`}
                    id="f-msg" 
                    placeholder=" " 
                    maxLength="500"
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onMouseEnter={() => setCursorType('text')}
                    onMouseLeave={() => setCursorType('')}
                  ></textarea>
                  <label className="f-lbl" htmlFor="f-msg">Your Message</label>
                  <span className={`char-cnt ${charCount > 450 ? 'warn' : ''} ${charCount > 490 ? 'over' : ''}`}>{charCount} / 500</span>
                </div>
                {errors.message && <div className="f-err show"><iconify-icon icon="ph:warning-circle-fill" width="13"></iconify-icon>Please write your message</div>}
              </div>

              <div className="form-ft">
                <p className="form-note">
                  <iconify-icon icon="ph:shield-check-fill" width="13" style={{ color: 'var(--g500)' }}></iconify-icon> Response within 24–48 hours.
                </p>
                <button 
                  className="btn-send" 
                  disabled={isSending} 
                  onClick={handleSubmit}
                  onMouseEnter={() => setCursorType('grow')}
                  onMouseLeave={() => setCursorType('')}
                >
                  <div className="btn-bar" style={{ width: `${progressBarWidth}%` }}></div>
                  <span>{isSending ? 'Sending…' : 'Send Message'}</span>
                  <iconify-icon 
                    icon={isSending ? 'ph:spinner-gap' : 'ph:arrow-right'} 
                    className="arr" 
                    width="16"
                    style={{ animation: isSending ? 'spin .65s linear infinite' : 'none' }}
                  ></iconify-icon>
                </button>
              </div>
            </div>
          ) : (
            <div className="form-success" style={{ display: 'block' }}>
              <div className="s-ring"><iconify-icon icon="ph:check-bold" width="30"></iconify-icon></div>
              <div className="s-title">Message Sent!</div>
              <div className="s-sub">Thank you for reaching out. We'll get back to you within 24–48 hours.</div>
            </div>
          )}
        </div>
      </section>

      {/* ─── WAYS CONTACT TILES SECTION ─── */}
      <section className="ways-section">
        <div className="hatch"></div>
        <div className="wrap">
          <div className="sec-head sr">
            <div className="s-ey">Reach Out</div>
            <h2 className="s-h2">We're always <em>here for you.</em></h2>
          </div>
          <div className="ways-grid">
            <div className="way-card sr d1" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
              <div className="way-reveal"></div>
              <div className="way-arr"><iconify-icon icon="ph:arrow-up-right-bold" width="14"></iconify-icon></div>
              <div className="way-inner">
                <div className="way-num">01</div>
                <div className="way-ico"><iconify-icon icon="ph:envelope-simple-fill" width="23"></iconify-icon></div>
                <div className="way-title">Email Support</div>
                <div className="way-desc">For inquiries, feedback, technical help.</div>
                <div className="way-val">hello@leafandlife.com</div>
              </div>
            </div>
            <div className="way-card sr d2" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
              <div className="way-reveal"></div>
              <div className="way-arr"><iconify-icon icon="ph:arrow-up-right-bold" width="14"></iconify-icon></div>
              <div className="way-inner">
                <div className="way-num">02</div>
                <div className="way-ico"><iconify-icon icon="ph:phone-fill" width="23"></iconify-icon></div>
                <div className="way-title">Call Helpline</div>
                <div className="way-desc">Direct support for immediate platform assistance.</div>
                <div className="way-val">+977 1-4200000</div>
              </div>
            </div>
            <div className="way-card sr d3" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
              <div className="way-reveal"></div>
              <div className="way-arr"><iconify-icon icon="ph:arrow-up-right-bold" width="14"></iconify-icon></div>
              <div className="way-inner">
                <div className="way-num">03</div>
                <div className="way-ico"><iconify-icon icon="ph:map-pin-fill" width="23"></iconify-icon></div>
                <div className="way-title">Main Office</div>
                <div className="way-desc">Visit our central community workspace.</div>
                <div className="way-val">Kathmandu, Nepal</div>
              </div>
            </div>
            <div className="way-card sr d4" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
              <div className="way-reveal"></div>
              <div className="way-arr"><iconify-icon icon="ph:arrow-up-right-bold" width="14"></iconify-icon></div>
              <div className="way-inner">
                <div className="way-num">04</div>
                <div className="way-ico"><iconify-icon icon="ph:chats-fill" width="23"></iconify-icon></div>
                <div className="way-title">Live Chat</div>
                <div className="way-desc">Available 9 AM – 6 PM for quick help notes.</div>
                <div className="way-val">Instant Reply</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUPPORT CHANNELS ROW CONTAINER ─── */}
      <section className="support-section">
        <div className="wrap">
          <div className="sup-intro">
            <div className="sr">
              <div className="s-ey">Channels</div>
              <h2 className="s-h2">Tailored support for<br/><em>every plant lover.</em></h2>
            </div>
          </div>
          <div className="sup-list">
            <div className="sup-item sr d1" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
              <div className="si-l">
                <div className="si-ico"><iconify-icon icon="ph:sparkles-fill" width="24"></iconify-icon></div>
                <div className="si-title">AI Guidance Assistance</div>
              </div>
              <div className="si-r">
                <div className="si-desc">Get quick structural answers on plant scanner diagnosis parameters, space metric optimization metrics, and customized recommendation logic rules.</div>
                <div className="si-link">Learn more <iconify-icon icon="ph:arrow-right" width="12"></iconify-icon></div>
              </div>
            </div>
            <div className="sup-item sr d2" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
              <div className="si-l">
                <div className="si-ico"><iconify-icon icon="ph:storefront-fill" width="24"></iconify-icon></div>
                <div className="si-title">Marketplace Assistance</div>
              </div>
              <div className="si-r">
                <div className="si-desc">Our team assists with listings, connections, and all marketplace-related queries efficiently.</div>
                <div className="si-link">Learn more <iconify-icon icon="ph:arrow-right" width="12"></iconify-icon></div>
              </div>
            </div>
            <div className="sup-item sr d3" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
              <div className="si-l">
                <div className="si-ico"><iconify-icon icon="ph:handshake-fill" width="24"></iconify-icon></div>
                <div className="si-title">Nursery Partnerships</div>
              </div>
              <div className="si-r">
                <div className="si-desc">Are you a nursery owner looking to go digital? Let's help your business grow by reaching more plant enthusiasts through our hyperlocal platform with dedicated tools.</div>
                <div className="si-link">Learn more <iconify-icon icon="ph:arrow-right" width="12"></iconify-icon></div>
              </div>
            </div>
            <div className="sup-item sr d4" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
              <div className="si-l">
                <div className="si-ico"><iconify-icon icon="ph:gear-six-fill" width="24"></iconify-icon></div>
                <div className="si-title">Technical Assistance</div>
              </div>
              <div className="si-r">
                <div className="si-desc">Experiencing technical issues or account problems? Our dedicated support team will resolve them quickly so your green journey stays smooth and uninterrupted.</div>
                <div className="si-link">Learn more <iconify-icon icon="ph:arrow-right" width="12"></iconify-icon></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACCORDION FAQS WRAPPER ─── */}
      <section className="faq-section">
        <div className="faq-mesh"></div><div className="faq-dots-bg"></div>
        <div className="wrap">
          <div className="faq-layout">
            <div className="sr">
              <div className="faq-pill"><div class="faq-pd"><iconify-icon icon="ph:question-fill" width="11"></iconify-icon></div>Common Questions</div>
              <h2 className="faq-h2">Frequently<br/><em>Asked.</em></h2>
              <p class="faq-sub">Everything you need to know. Can't find an answer? Reach out directly.</p>
              <div className="faq-nudge">
                <div className="faq-nudge-t">Still have questions?</div>
                <div className="faq-nudge-s">Our team is always happy to help. Send us a message and we'll respond promptly.</div>
                <a href="#" className="faq-nudge-btn" onClick={scrollToForm} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Contact Support <iconify-icon icon="ph:arrow-right" width="14"></iconify-icon></a>
              </div>
            </div>
            <div className="faq-list sr d2">
              <div className="faq-item">
                <button className="faq-trig" onClick={toggleFaq} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
                  How does plant recommendation work?
                  <div className="faq-plus"><iconify-icon icon="ph:plus" className="plus-ico" width="14"></iconify-icon></div>
                </button>
                <div className="faq-body">
                  <div className="faq-bi">Our recommendation system suggests plants based on your space, sunlight conditions, and location. The AI analyzes your inputs and curates the most suitable options tailored to your living environment.</div>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-trig" onClick={toggleFaq} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
                  Can I swap plants with nearby users?
                  <div className="faq-plus"><iconify-icon icon="ph:plus" className="plus-ico" width="14"></iconify-icon></div>
                </button>
                <div className="faq-body">
                  <div className="faq-bi">Yes! The hyperlocal marketplace allows you to connect with plant lovers in your neighborhood to swap, buy, sell, or thrift plants easily and sustainably.</div>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-trig" onClick={toggleFaq} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
                  Is the plant scanner free to use?
                  <div className="faq-plus"><iconify-icon icon="ph:plus" className="plus-ico" width="14"></iconify-icon></div>
                </button>
                <div className="faq-body">
                  <div className="faq-bi">Yes, our primary AI identification scanner is free for all users to promote accessible and widespread green urban living.</div>
                </div>
              </div>
              <div className="faq-item">
                <button className="faq-trig" onClick={toggleFaq} onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>
                  Who can join the platform?
                  <div className="faq-plus"><iconify-icon icon="ph:plus" className="plus-ico" width="14"></iconify-icon></div>
                </button>
                <div className="faq-body">
                  <div className="faq-bi">Anyone! From absolute beginners who want care guidance to experienced gardeners, collectors, and professional local commercial nurseries who want smarter plant care guidance. Step-by-step recommendations, visual guides, and community support make it simple for everyone to start their green journey.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LOCATION GEOLOCATION DETAILS MAP GRID ─── */}
      <section className="loc-section">
        <div className="wrap">
          <div className="loc-layout">
            <div className="map-visual sr">
              <div className="map-grid-bg"></div>
              <div className="map-center"><div className="rw"><div className="rr rr1"></div><div className="rr rr2"></div><div className="rr rr3"></div><div className="map-pin"><iconify-icon icon="ph:map-pin-fill" width="24"></iconify-icon></div></div></div>
              <div className="map-badge"><div className="map-city">Kathmandu, Nepal</div><div className="map-city-sub">Leaf &amp; Life HQ · Est. 2024</div></div>
              <button className="map-btn-float" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}><iconify-icon icon="ph:map-trifold-fill" width="14"></iconify-icon>View on Maps</button>
            </div>
            <div className="sr d1">
              <div className="pill-label" style={{ opacity: 1 }}><div className="pill-dot"><iconify-icon icon="ph:map-pin-fill" width="11"></iconify-icon></div>Our Base</div>
              <h2 className="loc-h2">Rooted in<br/><em>community.</em></h2>
              <p className="loc-sub">Based in Kathmandu with a mission to make sustainable living more accessible through technology and community-driven action across the region.</p>
              <div className="loc-items">
                <div className="loc-item"><div className="loc-ico"><iconify-icon icon="ph:globe-hemisphere-east-fill" width="16"></iconify-icon></div><div><div className="loc-t">Based in Kathmandu, Nepal</div><div class="loc-v">Connecting gardeners, nurseries, and beginners across Nepal for a greener tomorrow.</div></div></div>
                <div className="loc-item"><div className="loc-ico"><iconify-icon icon="ph:users-three-fill" width="16"></iconify-icon></div><div><div className="loc-t">Serving Plant Lovers Nationwide</div><div class="loc-v">Our hyperlocal platform bridges plant lovers with trusted nurseries everywhere.</div></div></div>
                <div className="loc-item"><div className="loc-ico"><iconify-icon icon="ph:clock-fill" width="16"></iconify-icon></div><div><div className="loc-t">Working Hours</div><div class="loc-v">Our support desk operates Sunday to Friday, 9:00 AM to 6:00 PM (NPT).</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA SECTION (MATCHED WITH LANDING.JSX) ─── */}
      <section className="lp-cta">
        <div className="wrap lp-cta-inner">
          <h2 className="lp-cta-title">Ready to Start Your Green Journey?</h2>
          <p className="lp-lead">
            Make your living space greener, healthier, and smarter with AI-powered plant guidance and a connected plant community.
          </p>
          <div className="lp-cta-actions">
            <button type="button" className="lp-btn lp-btn-primary" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Get Started Now</button>
            <button type="button" className="lp-btn lp-btn-ghost" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Explore Marketplace</button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER SECTION (MATCHED WITH LANDING.JSX) ─── */}
      <footer className="lp-footer">
        <div className="wrap">
          <div className="lp-footer-grid">
            <div className="lp-footer-brand">
              <div className="lp-footer-logo">
                <iconify-icon icon="ph:leaf-fill" width="22" style={{ color: 'var(--g700)' }}></iconify-icon>
                <span>Leaf &amp; Life</span>
              </div>
              <p className="lp-footer-tagline">Connecting urban spaces with nature through AI plant identification and local trading.</p>
            </div>

            <div>
              <h5 className="lp-footer-h">Platform</h5>
              <ul className="lp-footer-links">
                <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>AI Plant Scanner</a></li>
                <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Smart Matches</a></li>
                <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Marketplace</a></li>
                <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Care Guides</a></li>
              </ul>
            </div>

            <div>
              <h5 className="lp-footer-h">Company</h5>
              <ul className="lp-footer-links">
                <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>About Us</a></li>
                <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Our Impact</a></li>
                <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Nursery Partners</a></li>
                <li><a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h5 className="lp-footer-h">Connect</h5>
              <div className="lp-social">
                <a className="lp-social-btn" href="#" aria-label="Instagram" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}><iconify-icon icon="ph:instagram-logo" width="18"></iconify-icon></a>
                <a className="lp-social-btn" href="#" aria-label="LinkedIn" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}><iconify-icon icon="ph:linkedin-logo" width="18"></iconify-icon></a>
                <a className="lp-social-btn" href="#" aria-label="Facebook" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}><iconify-icon icon="ph:facebook-logo" width="18"></iconify-icon></a>
                <a className="lp-social-btn" href="#" aria-label="Twitter" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}><iconify-icon icon="ph:twitter-logo" width="18"></iconify-icon></a>
              </div>
            </div>
          </div>

          <div className="lp-footer-bottom">
            <p>© 2026 Leaf &amp; Life. All rights reserved.</p>
            <div className="lp-footer-bottom-links">
              <a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Privacy Policy</a>
              <a href="#" onMouseEnter={() => setCursorType('grow')} onMouseLeave={() => setCursorType('')}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}