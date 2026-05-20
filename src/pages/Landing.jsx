import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Store, Trophy, Activity, Users, MapPin, ArrowRight, ShoppingBag } from 'lucide-react';
import './Landing.css';
import './Scan.css';
import logo from "../assets/Leaf and Life logo.png";

export default function Landing() {
  const [location, setLocation] = useState('');
  const [spaceType, setSpaceType] = useState('indoor');
  const [lightLevel, setLightLevel] = useState('2');
  const [showResults, setShowResults] = useState(false);
  const [recommendedPlants, setRecommendedPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestLocation = () => {
    setLoading(true);
    
    // First try IP-based location (faster, works without prompt usually)
    const fetchIpLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.city) {
          setLocation(`${data.city}, ${data.country_name || 'Nepal'}`);
          setLoading(false);
          return true;
        }
      } catch (err) {
        console.error("IP Location Error:", err);
      }
      return false;
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
            const data = await response.json();
            
            const addr = data.address;
            // Prioritize neighborhood or suburb for high precision
            const neighborhood = addr.neighbourhood || addr.suburb || addr.village || addr.city_district || addr.town;
            const city = addr.city || addr.county || addr.state || "";
            
            // Format as "Neighborhood, City"
            let preciseLocation = "";
            if (neighborhood && city && neighborhood !== city) {
              preciseLocation = `${neighborhood}, ${city}`;
            } else {
              preciseLocation = neighborhood || city || "Kathmandu";
            }
            
            setLocation(preciseLocation);
          } catch (error) {
            console.error("Geocoding error:", error);
            await fetchIpLocation();
          } finally {
            setLoading(false);
          }
        },
        async (error) => {
          console.error("Location error", error);
          const success = await fetchIpLocation();
          if (!success) {
            setLocation("Kathmandu");
          }
          setLoading(false);
        },
        { 
          enableHighAccuracy: true, // Forces GPS for neighborhood-level precision
          timeout: 10000, 
          maximumAge: 0 
        }
      );
    } else {
      fetchIpLocation().then(success => {
        if (!success) setLocation("Kathmandu");
        setLoading(false);
      });
    }
  };

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const lightMap = { '1': 'Low', '2': 'Medium', '3': 'High' };
    const sunlight = lightMap[lightLevel];
    const spaceMap = { 'indoor': 'Indoor', 'rooftop': 'Rooftop', 'balcony': 'Balcony', 'garden': 'Rooftop' };
    const space = spaceMap[spaceType];

    try {
      const response = await fetch(`/api/recommend?space=${space}&sunlight=${sunlight}&location=${location}`);
      
      if (!response.ok) {
        const directResponse = await fetch(`http://localhost:5000/api/recommend?space=${space}&sunlight=${sunlight}&location=${location}`);
        if (!directResponse.ok) throw new Error('Recommendation failed');
        const data = await directResponse.json();
        setRecommendedPlants(data);
      } else {
        const data = await response.json();
        setRecommendedPlants(data);
      }
      setShowResults(true);
    } catch (error) {
      console.error('RECOMMENDATION ERROR:', error);
      alert(`Error: ${error.message}. Please ensure the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <Link to="/" className="logo-section" style={{ textDecoration: 'none', color: 'inherit' }}>
          <img src={logo} alt="Leaf and Life" className="app-logo" />
          <span className="logo-text">Leaf and Life</span>
        </Link>
        <nav className="desktop-nav">
          <Link to="#features">Features</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="#community">Community</Link>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="btn-text" style={{ textDecoration: 'none' }}>Log in</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Grow smarter.<br />
            <span className="text-primary">Breathe better.</span>
          </h1>
          <p className="hero-subtitle">
            Identify plants instantly, find the perfect spot in your home, and connect with local plant lovers to buy, sell, or swap. Your personal botanical assistant is here.
          </p>
          <div className="hero-actions">
            <Link to="/scan" className="btn-primary btn-large">
              <Camera size={20} />
              <span>Scan a Plant</span>
            </Link>
            <Link to="/marketplace" className="btn-secondary btn-large">
              Explore Marketplace
            </Link>
          </div>
          <div className="social-proof">
            <div className="avatars">
              <div className="avatar">👩</div>
              <div className="avatar">👨</div>
              <div className="avatar">🧑</div>
            </div>
            <p>Join <strong>10,000+</strong> plant parents</p>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="hero-image">
            <img src="https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=800&q=80" alt="Beautiful indoor plants" />
          </div>
          <div className="floating-card air-quality">
            <Activity size={16} />
            <div>
              <span className="label">Air Quality</span>
              <span className="value">+15% Improved</span>
            </div>
          </div>
          <div className="floating-card hyperlocal">
            <MapPin size={16} color="var(--accent)" />
            <div>
              <span className="label">Hyperlocal</span>
              <span className="value">24 Swaps Nearby</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="features-header">
          <h2>Everything your plants need, all in one place.</h2>
          <p>From intelligent identification to finding a new home for your cuttings, Leaf and Life builds a sustainable ecosystem for you and your plants.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{color: 'var(--primary)', backgroundColor: 'var(--primary-light)'}}>
              <Camera size={24} />
            </div>
            <h3>AI Identification</h3>
            <p>Snap a photo and instantly know your plant's name, needs, and ideal location in your home based on light and space.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: '#34d399', backgroundColor: '#ecfdf5'}}>
              <Store size={24} />
            </div>
            <h3>Hyperlocal Marketplace</h3>
            <p>Buy, sell, swap, or thrift plants with people in your neighborhood. Support local nurseries and reduce waste.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{color: 'var(--accent)', backgroundColor: '#fff1f2'}}>
              <Trophy size={24} />
            </div>
            <h3>Community Rewards</h3>
            <p>Track your air quality impact, join eco-challenges, and earn badges for sustainable plant parenting.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
