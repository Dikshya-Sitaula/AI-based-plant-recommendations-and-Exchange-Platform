import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';
import logo from "../assets/Leaf and Life logo.png";

export default function Contact() {
  const navigate = useNavigate();
  const [charCount, setCharCount] = useState(0);
  const [nameValid, setNameValid] = useState(false);
  const [emailState, setEmailState] = useState({ show: false, ok: false });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [btnText, setBtnText] = useState('Send Message');
  const [btnIcon, setBtnIcon] = useState('ph:arrow-right');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('leafLifeSubmitted') === 'true';
  });

  // Form Field Refs
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const subjectRef = useRef(null);
  const msgRef = useRef(null);
  const btnBarRef = useRef(null);
  const dotGridRef = useRef(null);
  const heroRightRef = useRef(null);

  // Field filled state classes helpers
  const [filledFields, setFilledFields] = useState({
    name: false,
    email: false,
    subject: false,
    msg: false,
  });

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFilledFields((prev) => ({ ...prev, [field]: !!value }));

    if (field === 'name') {
      setNameValid(value.trim().length > 1);
    }

    if (field === 'email') {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailState({ show: value.length > 0, ok });
    }

    if (field === 'msg') {
      setCharCount(value.length);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleGetStarted = () => {
    if (!isSubmitted) {
      navigate('/');
      return;
    }
    navigate('/dashboard');
  };

  const handleNavClick = (path) => {
    if (!isSubmitted) {
      navigate('/');
      return;
    }
    navigate(path);
  };

  const handleFaqToggle = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const scrollToForm = (e) => {
    e.preventDefault();
    if (heroRightRef.current) {
      heroRightRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    const n = nameRef.current.value.trim();
    const em = emailRef.current.value.trim();
    const ms = msgRef.current.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);

    let bad = false;

    const validationArray = [
      { el: nameRef.current, v: n },
      { el: emailRef.current, v: em, extra: emailOk },
      { el: msgRef.current, v: ms },
    ];

    validationArray.forEach((f) => {
      const fail = !f.v || f.extra === false;
      if (fail) {
        f.el.classList.add('err');
        f.el.addEventListener(
          'input',
          () => f.el.classList.remove('err'),
          { once: true }
        );
        bad = true;
      }
    });

    if (bad) return;

    setSending(true);
    setBtnText('Sending…');
    setBtnIcon('ph:spinner-gap');

    let w = 0;
    const iv = setInterval(() => {
      w = Math.min(w + Math.random() * 9, 90);
      if (btnBarRef.current) btnBarRef.current.style.width = w + '%';
    }, 110);

    setTimeout(() => {
      clearInterval(iv);
      if (btnBarRef.current) btnBarRef.current.style.width = '100%';
      setTimeout(() => {
        setFormSubmitted(true);
        setSending(false);
      }, 300);
    }, 2000);
  };

  useEffect(() => {
    // --- CUSTOM CURSOR INTERACTION ---
    const cur = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    let cx = 0, cy = 0, rx = 0, ry = 0;

    const handleMouseMove = (e) => {
      cx = e.clientX;
      cy = e.clientY;
      if (cur) {
        cur.style.left = cx + 'px';
        cur.style.top = cy + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId;
    const loop = () => {
      rx += (cx - rx) * 0.1;
      ry += (cy - ry) * 0.1;
      if (ring) {
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    const growTargets = document.querySelectorAll('a, button, .way-card, .sup-item, .faq-trig, .loc-item');
    growTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
    });

    const textTargets = document.querySelectorAll('input, textarea, select');
    textTargets.forEach((el) => {
      el.addEventListener('focus', () => document.body.classList.add('cursor-text'));
      el.addEventListener('blur', () => document.body.classList.remove('cursor-text'));
    });

    const handleMouseLeave = () => {
      if (cur && ring) {
        cur.style.opacity = '0';
        ring.style.opacity = '0';
      }
    };
    const handleMouseEnter = () => {
      if (cur && ring) {
        cur.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // --- PAGE BAR & SCROLL SCRIPT ---
    const bar = document.getElementById('pageBar');
    const handleScroll = () => {
      if (bar) {
        bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
      }
      document.getElementById('mainNav')?.classList.toggle('scrolled', window.scrollY > 40);
      if (dotGridRef.current) {
        dotGridRef.current.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- INTERSECTION OBSERVER (SCROLL REVEAL) ---
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.sr').forEach((el) => io.observe(el));

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const faqs = [
    { q: "How does plant recommendation work?", a: "Our recommendation system suggests plants based on your space, sunlight conditions, and location. The AI analyzes your inputs and curates the most suitable options tailored to your living environment." },
    { q: "Can I swap plants with nearby users?", a: "Yes. Users can buy, sell, thrift, and swap plants through our hyperlocal marketplace. The platform connects you with plant lovers nearby for an easy and sustainable exchange experience." },
    { q: "Can nurseries join the platform?", a: "Absolutely. Local nurseries can join and promote their plants digitally to reach a wider audience. We offer dedicated tools for nurseries to manage listings and connect efficiently with customers." },
    { q: "How does plant identification work?", a: "Simply upload a plant image and our AI-powered system identifies the plant and provides detailed care guidance. Trained on thousands of species, it delivers accurate results within seconds." },
    { q: "Is this platform beginner friendly?", a: "Yes. Designed especially for beginners who want smarter plant care guidance. Step-by-step recommendations, visual guides, and community support make it simple for everyone to start their green journey." }
  ];

  return (
    <div className="contact-page-wrapper">
      <div id="pageBar"></div>
      <div id="cursor"></div>
      <div id="cursor-ring"></div>

      {/* NAV */}
      <nav className="nav" id="mainNav">
        <div className="nav-logo">
          <button type="button" className="nav-logo-btn" onClick={handleLogoClick}>
            <span className="logo-mark"><img src={logo} alt="Leaf & Life logo" style={{ width: '20px', height: 'auto' }} /></span>
            <span>Leaf &amp; Life</span>
          </button>
        </div>
        <div className="nav-center">
          <button type="button" className="nav-link" onClick={() => navigate('/')}>Home</button>
          <button type="button" className="nav-link" onClick={() => handleNavClick('/about')}>About Us</button>
          <button type="button" className="nav-link active" onClick={() => navigate('/contact')}>Contact</button>
        </div>
        <div className="nav-actions">
          {isSubmitted && (
            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                localStorage.removeItem('leafLifeSubmitted');
                setIsSubmitted(false);
                navigate('/');
              }}
            >
              Switch Account
            </button>
          )}
          <button type="button" className="btn-solid" onClick={handleGetStarted}><span>Get Started</span></button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-left">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
          <div className="dot-grid" id="dotGrid" ref={dotGridRef}></div>
          <div>
            <div className="hero-eyebrow"><span className="ey-line"></span> Get In Touch</div>
            <h1 className="hero-h1" id="heroH1">
              <span className="word" style={{ animationDelay: '.15s' }}>We'd</span>&nbsp;
              <span className="word" style={{ animationDelay: '.23s' }}>love</span><br />
              <span className="word" style={{ animationDelay: '.31s' }}>to</span>&nbsp;
              <span className="word" style={{ animationDelay: '.39s' }}>hear</span><br />
              <span className="word" style={{ animationDelay: '.47s' }}>from</span>&nbsp;
              <em><span className="word" style={{ animationDelay: '.55s' }}>you.</span></em>
            </h1>
            <p className="hero-desc">Whether it's a plant question, a partnership inquiry, or a technical issue — our team is here to help you grow.</p>
            <div className="hero-chips">
              <div className="chip" style={{ animationDelay: '.85s' }}><iconify-icon icon="ph:lightning-fill" width="13"></iconify-icon>24–48hr response</div>
              <div className="chip" style={{ animationDelay: '.93s' }}><iconify-icon icon="ph:users-three-fill" width="13"></iconify-icon>450+ active users</div>
              <div className="chip" style={{ animationDelay: '1.01s' }}><iconify-icon icon="ph:storefront-fill" width="13"></iconify-icon>80+ nurseries</div>
              <div className="chip" style={{ animationDelay: '1.09s' }}><iconify-icon icon="ph:clock-fill" width="13"></iconify-icon>Mon–Sat 9am–6pm</div>
            </div>
          </div>
          <div className="hero-scroll"><span className="sline"></span><span className="sdot"></span>Scroll to explore</div>
        </div>

        {/* FORM */}
        <div className="hero-right" id="heroRight" ref={heroRightRef}>
          <div className="form-anim fa1">
            <div className="pill-label">
              <div className="pill-dot"><iconify-icon icon="ph:paper-plane-tilt-fill" width="11"></iconify-icon></div>
              Send a Message
            </div>
          </div>
          <h2 className="form-title form-anim fa2">Start a<br /><em>conversation.</em></h2>
          <p className="form-sub form-anim fa3">Fill out the form and our team will get back to you as soon as possible.</p>

          {!formSubmitted ? (
            <div id="form-content">
              <div className="f-row">
                <div className="f-wrap">
                  <input
                    className={`f-input ${filledFields.name ? 'filled' : ''}`}
                    type="text"
                    id="f-name"
                    ref={nameRef}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) => handleInputChange(e, 'name')}
                  />
                  <label className="f-lbl" htmlFor="f-name">Full Name</label>
                  <iconify-icon
                    className={`v-ico ${nameValid ? 'show' : ''}`}
                    id="vi-name"
                    icon="ph:check-circle-fill"
                    style={{ color: 'var(--g500)' }}
                  ></iconify-icon>
                </div>
                <div className="f-wrap">
                  <input
                    className={`f-input ${filledFields.email ? 'filled' : ''}`}
                    type="email"
                    id="f-email"
                    ref={emailRef}
                    placeholder=" "
                    autoComplete="off"
                    onChange={(e) => handleInputChange(e, 'email')}
                  />
                  <label className="f-lbl" htmlFor="f-email">Email Address</label>
                  <iconify-icon
                    className={`v-ico ${emailState.show ? 'show' : ''}`}
                    id="vi-email"
                    icon={emailState.ok ? 'ph:check-circle-fill' : 'ph:x-circle-fill'}
                    style={{ color: emailState.ok ? 'var(--g500)' : '#e74c3c' }}
                  ></iconify-icon>
                </div>
              </div>

              <div className="f-group">
                <div className="f-wrap">
                  <select
                    className={`f-input f-select ${filledFields.subject ? 'filled' : ''}`}
                    id="f-subject"
                    ref={subjectRef}
                    defaultValue=""
                    onChange={(e) => handleInputChange(e, 'subject')}
                  >
                    <option value="" disabled></option>
                    <option>Plant Recommendation Help</option>
                    <option>Marketplace Support</option>
                    <option>Nursery Partnership</option>
                    <option>Technical Assistance</option>
                    <option>General Inquiry</option>
                    <option>Feedback &amp; Suggestions</option>
                  </select>
                  <label className="f-lbl" htmlFor="f-subject">How can we help?</label>
                  <span className="sel-arrow"><iconify-icon icon="ph:caret-down" width="14"></iconify-icon></span>
                </div>
              </div>

              <div className="f-group">
                <div className="f-wrap f-ta-wrap">
                  <textarea
                    className={`f-input f-textarea ${filledFields.msg ? 'filled' : ''}`}
                    id="f-msg"
                    ref={msgRef}
                    placeholder=" "
                    maxLength="500"
                    onChange={(e) => handleInputChange(e, 'msg')}
                  ></textarea>
                  <label className="f-lbl" htmlFor="f-msg">Your Message</label>
                  <span className={`char-cnt ${charCount > 450 ? (charCount > 490 ? 'over' : 'warn') : ''}`} id="charCnt">
                    {charCount} / 500
                  </span>
                </div>
                <div className="f-err" id="err-msg">
                  <iconify-icon icon="ph:warning-circle-fill" width="13"></iconify-icon>
                  Please write your message
                </div>
              </div>

              <div className="form-ft">
                <p className="form-note">
                  <iconify-icon icon="ph:shield-check-fill" width="13" style={{ color: 'var(--g500)' }}></iconify-icon>
                  Response within 24–48 hours.
                </p>
                <button
                  className="btn-send"
                  id="submitBtn"
                  disabled={sending}
                  onClick={handleSubmit}
                >
                  <div className="btn-bar" id="btnBar" ref={btnBarRef}></div>
                  <span id="btnTxt">{btnText}</span>
                  <iconify-icon
                    icon={btnIcon}
                    className="arr"
                    id="btnIco"
                    width="16"
                    style={sending ? { animation: 'spin .65s linear infinite' } : {}}
                  ></iconify-icon>
                </button>
              </div>
            </div>
          ) : (
            <div className="form-success" id="formSuccess" style={{ display: 'block' }}>
              <div className="s-ring"><iconify-icon icon="ph:check-bold" width="30"></iconify-icon></div>
              <div className="s-title">Message Sent!</div>
              <div className="s-sub">Thank you for reaching out. We'll get back to you within 24–48 hours.</div>
            </div>
          )}
        </div>
      </div>

      {/* WAYS */}
      <section className="ways-section">
        <div className="hatch"></div>
        <div className="wrap">
          <div className="sec-head sr">
            <div className="s-ey">Reach Out</div>
            <h2 className="s-h2">We're always <em>here for you.</em></h2>
          </div>
          <div className="ways-grid">
            <div className="way-card sr d1">
              <div className="way-reveal"></div>
              <div className="way-arr"><iconify-icon icon="ph:arrow-up-right-bold" width="14"></iconify-icon></div>
              <div className="way-inner">
                <div className="way-num">01</div>
                <div className="way-ico"><iconify-icon icon="ph:envelope-simple-fill" width="23"></iconify-icon></div>
                <div className="way-title">Email Support</div>
                <div className="way-desc">For inquiries, feedback, technical help, or general support from our team.</div>
                <div className="way-val">support@leafandlife.com</div>
              </div>
            </div>
            <div className="way-card sr d2">
              <div className="way-reveal"></div>
              <div className="way-arr"><iconify-icon icon="ph:arrow-up-right-bold" width="14"></iconify-icon></div>
              <div className="way-inner">
                <div className="way-num">02</div>
                <div className="way-ico"><iconify-icon icon="ph:phone-call-fill" width="23"></iconify-icon></div>
                <div className="way-title">Phone Support</div>
                <div className="way-desc">Available Monday through Saturday during working hours for direct assistance.</div>
                <div className="way-val">+977 98XXXXXXXX</div>
              </div>
            </div>
            <div className="way-card sr d3">
              <div className="way-reveal"></div>
              <div className="way-arr"><iconify-icon icon="ph:arrow-up-right-bold" width="14"></iconify-icon></div>
              <div className="way-inner">
                <div className="way-num">03</div>
                <div className="way-ico"><iconify-icon icon="ph:map-pin-fill" width="23"></iconify-icon></div>
                <div className="way-title">Our Location</div>
                <div className="way-desc">Building greener communities from the heart of the Himalayas.</div>
                <div className="way-val">Kathmandu, Nepal</div>
              </div>
            </div>
            <div className="way-card sr d4">
              <div className="way-reveal"></div>
              <div className="way-arr"><iconify-icon icon="ph:arrow-up-right-bold" width="14"></iconify-icon></div>
              <div className="way-inner">
                <div className="way-num">04</div>
                <div className="way-ico"><iconify-icon icon="ph:share-network-fill" width="23"></iconify-icon></div>
                <div className="way-title">Community &amp; Socials</div>
                <div className="way-desc">Stay connected and grow alongside our plant-loving community online.</div>
                <div className="way-val">Instagram · Facebook · LinkedIn</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT */}
      <section className="support-section">
        <div className="wrap">
          <div className="sup-intro sr">
            <div>
              <div className="s-ey">Support Areas</div>
              <h2 className="s-h2">How can we<br /><em>help you?</em></h2>
            </div>
            <div style={{ paddingBottom: '6px' }}>
              <p style={{ fontSize: '.95rem', color: 'var(--txt2)', lineHeight: '1.82' }}>
                We are committed to making your plant journey simple, smart, and enjoyable every step of the way.
              </p>
            </div>
          </div>
          <div className="sup-list">
            <div className="sup-item sr d1">
              <div className="si-l">
                <div className="si-ico"><iconify-icon icon="ph:plant-fill" width="24"></iconify-icon></div>
                <div className="si-title">Plant Recommendation Help</div>
              </div>
              <div className="si-r">
                <div className="si-desc">Need help finding plants suitable for your space, sunlight, or environment? Our AI-powered system guides you with tailored suggestions perfectly matched to your living space.</div>
                <div className="si-link">Learn more <iconify-icon icon="ph:arrow-right" width="12"></iconify-icon></div>
              </div>
            </div>
            <div className="sup-item sr d2">
              <div className="si-l">
                <div className="si-ico"><iconify-icon icon="ph:storefront-fill" width="24"></iconify-icon></div>
                <div className="si-title">Marketplace Support</div>
              </div>
              <div className="si-r">
                <div className="si-desc">Questions about buying, selling, swapping, or thrifting plants? Our team assists with listings, connections, and all marketplace-related queries efficiently.</div>
                <div className="si-link">Learn more <iconify-icon icon="ph:arrow-right" width="12"></iconify-icon></div>
              </div>
            </div>
            <div className="sup-item sr d3">
              <div className="si-l">
                <div className="si-ico"><iconify-icon icon="ph:handshake-fill" width="24"></iconify-icon></div>
                <div className="si-title">Nursery Partnerships</div>
              </div>
              <div className="si-r">
                <div className="si-desc">Are you a nursery owner looking to go digital? Let's help your business grow by reaching more plant enthusiasts through our hyperlocal platform with dedicated tools.</div>
                <div className="si-link">Learn more <iconify-icon icon="ph:arrow-right" width="12"></iconify-icon></div>
              </div>
            </div>
            <div className="sup-item sr d4">
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

      {/* FAQ */}
      <section className="faq-section">
        <div className="faq-mesh"></div>
        <div className="faq-dots-bg"></div>
        <div className="wrap">
          <div className="faq-layout">
            <div className="sr">
              <div className="faq-pill">
                <div className="faq-pd"><iconify-icon icon="ph:question-fill" width="11"></iconify-icon></div>
                Common Questions
              </div>
              <h2 className="faq-h2">Frequently<br /><em>Asked.</em></h2>
              <p className="faq-sub">Everything you need to know. Can't find an answer? Reach out directly.</p>
              <div className="faq-nudge">
                <div className="faq-nudge-t">Still have questions?</div>
                <div className="faq-nudge-s">Our team is always happy to help. Send us a message and we'll respond promptly.</div>
                <a href="#" className="faq-nudge-btn" onClick={scrollToForm}>
                  Contact Support <iconify-icon icon="ph:arrow-right" width="14"></iconify-icon>
                </a>
              </div>
            </div>
            <div className="faq-list sr d2">
              {faqs.map((faq, index) => (
                <div className={`faq-item ${activeFaq === index ? 'open' : ''}`} key={index}>
                  <button className="faq-trig" onClick={() => handleFaqToggle(index)}>
                    {faq.q}
                    <div className="faq-plus">
                      <iconify-icon icon="ph:plus" className="plus-ico" width="14"></iconify-icon>
                    </div>
                  </button>
                  <div className="faq-body" style={{ maxHeight: activeFaq === index ? '280px' : '0px' }}>
                    <div className="faq-bi">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="loc-section">
        <div className="wrap">
          <div className="loc-layout">
            <div className="map-visual sr">
              <div className="map-grid-bg"></div>
              <div className="map-center">
                <div className="rw">
                  <div className="rr rr1"></div>
                  <div className="rr rr2"></div>
                  <div className="rr rr3"></div>
                  <div className="map-pin"><iconify-icon icon="ph:map-pin-fill" width="24"></iconify-icon></div>
                </div>
              </div>
              <div className="map-badge">
                <div className="map-city">Kathmandu, Nepal</div>
                <div className="map-city-sub">Leaf &amp; Life HQ · Est. 2024</div>
              </div>
              <button className="map-btn-float"><iconify-icon icon="ph:map-trifold-fill" width="14"></iconify-icon>View on Maps</button>
            </div>
            <div className="sr d1">
              <div className="pill-label" style={{ opacity: 1 }}>
                <div className="pill-dot"><iconify-icon icon="ph:map-pin-fill" width="11"></iconify-icon></div> Our Base
              </div>
              <h2 className="loc-h2">Rooted in<br /><em>community.</em></h2>
              <p className="loc-sub">Based in Kathmandu with a mission to make sustainable living more accessible through technology and community-driven action across the region.</p>
              <div className="loc-items">
                <div className="loc-item">
                  <div className="loc-ico"><iconify-icon icon="ph:globe-hemisphere-east-fill" width="16"></iconify-icon></div>
                  <div>
                    <div className="loc-t">Based in Kathmandu, Nepal</div>
                    <div className="loc-v">Connecting gardeners, nurseries, and beginners across Nepal for a greener tomorrow.</div>
                  </div>
                </div>
                <div className="loc-item">
                  <div className="loc-ico"><iconify-icon icon="ph:users-three-fill" width="16"></iconify-icon></div>
                  <div>
                    <div className="loc-t">Serving Plant Lovers Nationwide</div>
                    <div className="loc-v">Our hyperlocal platform bridges plant lovers with trusted nurseries everywhere.</div>
                  </div>
                </div>
                <div className="loc-item">
                  <div className="loc-ico"><iconify-icon icon="ph:clock-fill" width="16"></iconify-icon></div>
                  <div>
                    <div className="loc-t">Working Hours</div>
                    <div className="loc-v">Monday – Saturday · 9:00 AM – 6:00 PM NPT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner sr">
          <h2 className="cta-h2">Ready to Start Your Green Journey?</h2>
          <p className="cta-desc">Make your living space greener, healthier, and smarter with AI-powered plant guidance and a connected plant community.</p>
          <div className="cta-actions">
            <button type="button" className="cta-btn-primary" onClick={handleGetStarted}>Get Started Now</button>
            <button type="button" className="cta-btn-ghost" onClick={() => handleNavClick('/marketplace')}>Explore Marketplace</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="Leaf & Life" style={{ width: '24px', height: 'auto' }} />
              <span>Leaf &amp; Life</span>
            </div>
            <p className="footer-desc">AI-powered plant recommendation and exchange platform designed to promote greener living through technology and community.</p>
          </div>
          <div>
            <h5 className="footer-h">Platform</h5>
            <ul className="footer-list">
              <li><button type="button" className="footer-link" onClick={() => navigate('/')}>Home</button></li>
              <li><button type="button" className="footer-link" onClick={() => handleNavClick('/scan')}>Smart Scan</button></li>
              <li><button type="button" className="footer-link" onClick={() => handleNavClick('/marketplace')}>Marketplace</button></li>
              <li><button type="button" className="footer-link" onClick={() => handleNavClick('/rewards')}>Community</button></li>
            </ul>
          </div>
          <div>
            <h5 className="footer-h">Company</h5>
            <ul className="footer-list">
              <li><button type="button" className="footer-link" onClick={() => navigate('/about')}>About Us</button></li>
              <li><button type="button" className="footer-link" onClick={() => navigate('/contact')}>Contact</button></li>
              <li><a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Privacy Policy</a></li>
              <li><a href="#" className="footer-link" onClick={(e) => e.preventDefault()}>Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h5 className="footer-h">Connect</h5>
            <div className="footer-social">
              <a href="#" className="footer-social-btn" onClick={(e) => e.preventDefault()} aria-label="Instagram">
                <iconify-icon icon="ph:instagram-logo" width="18"></iconify-icon>
              </a>
              <a href="#" className="footer-social-btn" onClick={(e) => e.preventDefault()} aria-label="LinkedIn">
                <iconify-icon icon="ph:linkedin-logo" width="18"></iconify-icon>
              </a>
              <a href="#" className="footer-social-btn" onClick={(e) => e.preventDefault()} aria-label="Facebook">
                <iconify-icon icon="ph:facebook-logo" width="18"></iconify-icon>
              </a>
              <a href="#" className="footer-social-btn" onClick={(e) => e.preventDefault()} aria-label="Twitter">
                <iconify-icon icon="ph:twitter-logo" width="18"></iconify-icon>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Leaf &amp; Life. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}