import { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import './Scan.css';

export default function Recommendation() {
  const [location, setLocation] = useState('');
  const [spaceType, setSpaceType] = useState('indoor');
  const [lightLevel, setLightLevel] = useState('2');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation("New York, NY (Detected)");
        },
        (error) => {
          console.error("Location error", error);
          alert("Could not detect location. Please enter manually.");
        }
      );
    }
  };

  const handleRecommendationSubmit = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <div className="recommendation-page" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="features-header text-center mb-6">
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Space & Location-Based Plant Recommendation</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Tell us about your space, and we'll recommend the perfect plants for your environment. No photos required!</p>
      </div>
      
      <div className="recommendation-content" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
        {!showResults ? (
          <div className="location-form-container glass-panel" style={{ padding: '2rem', borderRadius: '1rem' }}>
            <form onSubmit={handleRecommendationSubmit} className="smart-setup-form">
              {/* Step 1 */}
              <div className="form-group">
                <label><span className="step-number">1</span> Where are you located?</label>
                <div className="location-input-group">
                  <div className="input-with-icon">
                    <MapPin size={18} className="icon" />
                    <input 
                      type="text" 
                      placeholder="Enter city or zip code" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                  <button type="button" className="btn-outline" onClick={requestLocation}>
                    <MapPin size={16} /> Use My Location
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label><span className="step-number">2</span> Where will your new plant live?</label>
                <div className="space-grid">
                  <label className={`space-card ${spaceType === 'indoor' ? 'selected' : ''}`}>
                    <input type="radio" name="space" value="indoor" onChange={(e) => setSpaceType(e.target.value)} checked={spaceType === 'indoor'} />
                    <span className="emoji">🏠</span>
                    <span className="space-title">Indoor</span>
                    <span className="space-desc">Low light, stable temp</span>
                  </label>
                  <label className={`space-card ${spaceType === 'rooftop' ? 'selected' : ''}`}>
                    <input type="radio" name="space" value="rooftop" onChange={(e) => setSpaceType(e.target.value)} checked={spaceType === 'rooftop'} />
                    <span className="emoji">☀️</span>
                    <span className="space-title">Rooftop</span>
                    <span className="space-desc">Direct sun, high wind</span>
                  </label>
                  <label className={`space-card ${spaceType === 'balcony' ? 'selected' : ''}`}>
                    <input type="radio" name="space" value="balcony" onChange={(e) => setSpaceType(e.target.value)} checked={spaceType === 'balcony'} />
                    <span className="emoji">🪴</span>
                    <span className="space-title">Balcony</span>
                    <span className="space-desc">Partial shade</span>
                  </label>
                  <label className={`space-card ${spaceType === 'garden' ? 'selected' : ''}`}>
                    <input type="radio" name="space" value="garden" onChange={(e) => setSpaceType(e.target.value)} checked={spaceType === 'garden'} />
                    <span className="emoji">🌳</span>
                    <span className="space-title">Garden/Open</span>
                    <span className="space-desc">Direct ground</span>
                  </label>
                </div>
              </div>

              {/* Step 3 */}
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label><span className="step-number">3</span> How much natural light does this spot get?</label>
                <div className="light-slider-container">
                  <input 
                    type="range" min="1" max="3" 
                    value={lightLevel} 
                    onChange={(e) => setLightLevel(e.target.value)} 
                    className="light-slider" 
                  />
                  <div className="light-labels">
                    <div className={`light-label ${lightLevel === '1' ? 'active' : ''}`}>
                      <span className="emoji">☁️</span>
                      <span className="light-title">Low</span>
                      <span className="light-desc">No direct windows</span>
                    </div>
                    <div className={`light-label ${lightLevel === '2' ? 'active' : ''}`}>
                      <span className="emoji">🌤️</span>
                      <span className="light-title">Medium</span>
                      <span className="light-desc">Bright indirect light</span>
                    </div>
                    <div className={`light-label ${lightLevel === '3' ? 'active' : ''}`}>
                      <span className="emoji">☀️</span>
                      <span className="light-title">High</span>
                      <span className="light-desc">Direct sun 6+ hrs</span>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full mt-6">
                Get Recommendations <ArrowRight size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div className="results-view text-left">
            <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="section-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Recommended for you</h3>
              <button className="btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => setShowResults(false)}>
                Edit Details
              </button>
            </div>
            
            <div className="glass-panel" style={{ backgroundColor: 'var(--bg-surface)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
              <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: '600' }}>Your Environment</h3>
              <ul className="care-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>📍 <strong>Location:</strong> {location || 'Not specified'}</li>
                <li style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>🏠 <strong>Space:</strong> {spaceType.charAt(0).toUpperCase() + spaceType.slice(1)}</li>
                <li style={{ color: 'var(--text-secondary)' }}>☀️ <strong>Light:</strong> {lightLevel === '1' ? 'Low' : lightLevel === '2' ? 'Medium' : 'High'}</li>
              </ul>
            </div>

            <h3 className="section-title" style={{ fontSize: '1rem', marginBottom: '1rem', fontWeight: '600' }}>Top Matches</h3>
            <div className="recommendations" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[1, 2].map(i => (
                <div key={i} className="plant-card" onClick={() => navigate('/marketplace')} style={{ background: 'var(--bg-surface)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'transform 0.2s ease' }}>
                  <div className="plant-img-placeholder" style={{ height: '120px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                    <img 
                      src={i === 1 ? "https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?auto=format&fit=crop&w=400&q=80" : "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=400&q=80"} 
                      alt={i === 1 ? 'Snake Plant' : 'ZZ Plant'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </div>
                  <div className="plant-info" style={{ padding: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', fontWeight: '600' }}>{i === 1 ? 'Snake Plant' : 'ZZ Plant'}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '600', margin: 0 }}>Perfect Match</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
