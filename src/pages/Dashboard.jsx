import { Plus, Droplets, MapPin, Wind, Trophy, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('leafLifeUserName') || 'Alex';
  const userId = localStorage.getItem('leafLifeUserId') || 1;
  const [ownedCount, setOwnedCount] = useState(0);
  const [totalCO2, setTotalCO2] = useState("0.0");
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch(`http://${window.location.hostname}:5000/api/user/${userId}/stats`);
        const statsData = await statsRes.json();
        setOwnedCount(statsData.ownedCount || 0);
        setTotalCO2(statsData.totalCO2 || "0.0");

        const collectionRes = await fetch(`http://${window.location.hostname}:5000/api/user/${userId}/collection`);
        const collectionData = await collectionRes.json();
        setCollection(collectionData || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [userId]);

  // Calculate AQI based on plants (Simulated improvement)
  // Baseline AQI is 100 (Unhealthy for sensitive groups), improved by plants
  const baseAQI = 100;
  const aqiImprovement = Math.min(60, ownedCount * 5); // Max 60 point improvement
  const currentAQI = baseAQI - aqiImprovement;
  const aqiStatus = currentAQI <= 50 ? 'Excellent' : currentAQI <= 80 ? 'Good' : 'Moderate';
  const progressPercent = Math.min(100, (ownedCount / 10) * 100);

  return (
    <div className="dashboard-content animate-fade-in">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">Hi, {userName}! 👋</h1>
          <p className="dashboard-subtext">
            {ownedCount === 0 
              ? "Start your green journey today." 
              : "Your urban jungle is thriving."}
          </p>
        </div>
      </header>
      
      {/* Top Row: Stats Cards */}
      <div className="dashboard-stats-grid">
        {/* Card: Plants Owned */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Plants Owned</h3>
            <div className="stat-icon-wrap bg-teal-light">
              <Leaf size={20} className="text-teal" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="stat-value-display">
              <span className="stat-value-number">{ownedCount}</span>
              <span className="stat-value-label">Active Plants</span>
            </div>
            <p className="stat-card-footer">
              <strong>{ownedCount > 0 ? `+${ownedCount}` : '0'}</strong> total
            </p>
          </div>
        </div>

        {/* Card: Air Quality Impact */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Air Quality Impact</h3>
            <div className="stat-icon-wrap bg-green-light">
              <Wind size={20} className="text-primary" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="aqi-display">
              <span className="aqi-number">{currentAQI}</span>
              <span className="aqi-label" style={{ color: currentAQI <= 50 ? '#10B981' : '#F59E0B' }}>
                AQI ({aqiStatus})
              </span>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
            <p className="stat-card-footer"><strong>{totalCO2}kg</strong> of CO₂ filtered</p>
          </div>
        </div>

        {/* Card 2: Care Schedule */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Care Schedule</h3>
            <div className="stat-icon-wrap bg-blue-light">
              <Droplets size={20} className="text-blue" />
            </div>
          </div>
          <div className="stat-card-body">
            {collection.length > 0 ? (
              <ul className="task-list">
                {collection.slice(0, 2).map(plant => (
                  <li key={plant.id} className="task-item">
                    <div className="task-checkbox"></div>
                    <div className="task-info">
                      <span className="task-name">{plant.name}</span>
                      <span className="task-action">Check soil moisture</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#888', margin: '1rem 0' }}>No pending tasks. Add plants to see your schedule!</p>
            )}
            <button className="btn-text" onClick={() => navigate('/marketplace')}>Find More Plants</button>
          </div>
        </div>

        {/* Card 3: Active Challenges */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Active Challenges</h3>
            <div className="stat-icon-wrap bg-orange-light">
              <Trophy size={20} className="text-orange" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="challenge-info">
              <h4 className="challenge-name">Eco-Initiator</h4>
              <p className="challenge-desc">Own your first 3 plants.</p>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill bg-orange" style={{ width: `${Math.min(100, (ownedCount / 3) * 100)}%` }}></div>
              </div>
              <span className="progress-text">{Math.min(3, ownedCount)}/3 completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Your Collection Section */}
      <section className="collection-section">
        <div className="collection-header">
          <h2 className="section-title">Your Collection</h2>
          {collection.length > 0 && (
            <button className="btn-primary" onClick={() => navigate('/scan')}>Manage All</button>
          )}
        </div>

        <div className="collection-grid">
          {collection.map(plant => (
            <div key={plant.id} className="plant-card" onClick={() => navigate(`/marketplace/${plant.id}`)} style={{ cursor: 'pointer' }}>
              <div className="plant-image-container">
                <img 
                  src={plant.image.startsWith('http') ? plant.image : `http://${window.location.hostname}:5000${plant.image}`} 
                  alt={plant.name} 
                  className="plant-image" 
                />
                <div className="plant-location-badge">
                  <MapPin size={12} />
                  {plant.location || 'Home'}
                </div>
              </div>
              <div className="plant-info">
                <h3 className="plant-name">{plant.name}</h3>
                <p className="plant-status">Healthy • Growing</p>
              </div>
            </div>
          ))}
          
          {/* Add New Card */}
          <div className="plant-card add-new-card" onClick={() => navigate('/marketplace')}>
            <div className="add-new-icon-wrap">
              <Plus size={32} />
            </div>
            <h3 className="add-new-title">Add New</h3>
            <p className="add-new-desc">Explore the Marketplace</p>
          </div>
        </div>
      </section>
    </div>
  );
}
  