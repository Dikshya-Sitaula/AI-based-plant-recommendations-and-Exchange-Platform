import { useState } from 'react';
import {
  MapPin,
  Navigation,
  Home,
  Flower2,
  Trees,
  Sun,
  CloudSun,
  SunDim,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import logo from '../assets/Leaf and Life logo.png';
import '../pages/Recommendation.css';

const SPACES = [
  { id: 'indoor', icon: <Home size={22} />, label: 'Indoor', sub: 'Low light, stable temp' },
  { id: 'rooftop', icon: <Sun size={22} />, label: 'Rooftop', sub: 'Direct sun, high wind' },
  { id: 'balcony', icon: <Flower2 size={22} />, label: 'Balcony', sub: 'Partial shade' },
  { id: 'garden', icon: <Trees size={22} />, label: 'Garden / Open', sub: 'Direct ground' },
];

const LIGHT_LEVELS = [
  { value: 0, id: 'low', icon: <SunDim size={26} />, label: 'Low', sub: 'No direct windows' },
  { value: 1, id: 'medium', icon: <CloudSun size={26} />, label: 'Medium', sub: 'Bright indirect light' },
  { value: 2, id: 'high', icon: <Sun size={26} />, label: 'High', sub: 'Direct sun 6+ hrs' },
];

function BrandLogo({ className = 'rec-logo-icon', alt = 'Leaf & Life' }) {
  return <img src={logo} alt={alt} className={className} />;
}

export default function RecommendationForm({
  showHeader = true,
  onSubmit: onSubmitProp,
  submitLabel = 'Get Recommendations',
}) {
  const [location, setLocation] = useState('');
  const [locating, setLocating] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState('indoor');
  const [lightLevel, setLightLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`);
        setLocating(false);
      },
      () => {
        setLocation('');
        setLocating(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitProp) {
      onSubmitProp(e, { location, selectedSpace, lightLevel });
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      {showHeader && (
        <div className="rec-header">
          <div className="rec-badge">
            <BrandLogo className="rec-logo-icon rec-logo-icon-badge" alt="" />
            AI-Powered
          </div>
          <h1 className="rec-title">
            Space &amp; Location-Based<br />
            <em>Plant Recommendation</em>
          </h1>
          <p className="rec-subtitle">
            Tell us about your space, and we'll recommend the perfect plants for your environment.
            No photos required!
          </p>
        </div>
      )}

      <form className="rec-card" onSubmit={handleSubmit} noValidate>
        <div className="rec-step">
          <div className="rec-step-head">
            <span className="rec-step-num">1</span>
            <span className="rec-step-label">Where are you located?</span>
          </div>
          <div className="rec-location-row">
            <div className="rec-input-wrap">
              <MapPin size={16} className="rec-input-icon" />
              <input
                className="rec-input"
                type="text"
                placeholder="Enter city or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              type="button"
              className={`rec-loc-btn${locating ? ' locating' : ''}`}
              onClick={handleUseMyLocation}
              disabled={locating}
            >
              {locating ? (
                <Loader2 size={15} className="spin" />
              ) : (
                <Navigation size={15} />
              )}
              {locating ? 'Detecting…' : 'Use My Location'}
            </button>
          </div>
        </div>

        <div className="rec-divider" />

        <div className="rec-step">
          <div className="rec-step-head">
            <span className="rec-step-num">2</span>
            <span className="rec-step-label">Where will your new plant live?</span>
          </div>
          <div className="rec-space-grid">
            {SPACES.map((space) => {
              const active = selectedSpace === space.id;
              return (
                <button
                  key={space.id}
                  type="button"
                  className={`rec-space-card${active ? ' active' : ''}`}
                  onClick={() => setSelectedSpace(space.id)}
                >
                  <span className="rec-space-ico">{space.icon}</span>
                  <span className="rec-space-text">
                    <span className="rec-space-name">{space.label}</span>
                    <span className="rec-space-sub">{space.sub}</span>
                  </span>
                  {active && (
                    <span className="rec-space-check">
                      <BrandLogo className="rec-logo-icon rec-logo-icon-check" alt="" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rec-divider" />

        <div className="rec-step">
          <div className="rec-step-head">
            <span className="rec-step-num">3</span>
            <span className="rec-step-label">How much natural light does this spot get?</span>
          </div>

          <div className="rec-slider-wrap">
            <input
              className="rec-slider"
              type="range"
              min={0}
              max={2}
              step={1}
              value={lightLevel}
              onChange={(e) => setLightLevel(Number(e.target.value))}
              style={{ '--pct': `${(lightLevel / 2) * 100}%` }}
            />
            <div className="rec-slider-ticks">
              {LIGHT_LEVELS.map((l) => (
                <span
                  key={l.id}
                  className={`rec-tick${lightLevel === l.value ? ' active' : ''}`}
                  onClick={() => setLightLevel(l.value)}
                />
              ))}
            </div>
          </div>

          <div className="rec-light-grid">
            {LIGHT_LEVELS.map((l) => {
              const active = lightLevel === l.value;
              return (
                <button
                  key={l.id}
                  type="button"
                  className={`rec-light-card${active ? ' active' : ''}`}
                  onClick={() => setLightLevel(l.value)}
                >
                  <span className={`rec-light-ico${active ? ' active' : ''}`}>{l.icon}</span>
                  <span className="rec-light-label">{l.label}</span>
                  <span className="rec-light-sub">{l.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className={`rec-submit${loading ? ' loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" />
              Finding your perfect plants…
            </>
          ) : (
            <>
              <span className="rec-submit-logo-wrap">
                <BrandLogo className="rec-logo-icon rec-logo-icon-btn" alt="" />
              </span>
              {submitLabel}
              <ArrowRight size={18} className="rec-submit-arr" />
            </>
          )}
        </button>
      </form>
    </>
  );
}
 