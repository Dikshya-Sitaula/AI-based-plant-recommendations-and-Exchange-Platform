import { Plus, Droplets, MapPin, Wind, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const COLLECTION_PLANTS = [
  { 
    id: 1, 
    name: 'Monstera Deliciosa', 
    location: 'Living Room', 
    status: 'Healthy • Last watered 2d ago', 
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: 2, 
    name: 'Snake Plant', 
    location: 'Bedroom', 
    status: 'Needs water • Last watered 14d ago', 
    image: 'https://images.unsplash.com/photo-1593482892290-f54927eba522?q=80&w=600&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    name: 'Golden Pothos', 
    location: 'Balcony', 
    status: 'Healthy • Last watered 5d ago', 
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=80&w=600&auto=format&fit=crop' 
  },
];

const CARE_TASKS = [
  { id: 1, name: 'Snake Plant', task: 'Water today' },
  { id: 2, name: 'Ficus Elastica', task: 'Mist leaves' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('leafLifeUserName') || 'Alex';

  return (
    <div className="dashboard-content animate-fade-in">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">Hi, {userName}! 👋</h1>
          <p className="dashboard-subtext">Your urban jungle is thriving.</p>
        </div>
      </header>
      
      {/* Top Row: 3 Cards */}
      <div className="dashboard-stats-grid">
        {/* Card 1: Air Quality Impact */}
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Air Quality Impact</h3>
            <div className="stat-icon-wrap bg-green-light">
              <Wind size={20} className="text-primary" />
            </div>
          </div>
          <div className="stat-card-body">
            <div className="aqi-display">
              <span className="aqi-number">42</span>
              <span className="aqi-label">AQI (Good)</span>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
            <p className="stat-card-footer"><strong>2.4kg</strong> of CO₂ filtered</p>
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
            <ul className="task-list">
              {CARE_TASKS.map(task => (
                <li key={task.id} className="task-item">
                  <div className="task-checkbox"></div>
                  <div className="task-info">
                    <span className="task-name">{task.name}</span>
                    <span className="task-action">{task.task}</span>
                  </div>
                </li>
              ))}
            </ul>
            <button className="btn-text" onClick={() => navigate('/scan')}>View All Tasks</button>
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
              <h4 className="challenge-name">The Green Thumb Swap</h4>
              <p className="challenge-desc">Trade 3 plants locally this month.</p>
            </div>
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill bg-orange" style={{ width: '66%' }}></div>
              </div>
              <span className="progress-text">2/3 completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Your Collection Section */}
      <section className="collection-section">
        <div className="collection-header">
          <h2 className="section-title">Your Collection</h2>
          <button className="btn-primary" onClick={() => navigate('/scan')}>Manage All</button>
        </div>

        <div className="collection-grid">
          {COLLECTION_PLANTS.map(plant => (
            <div key={plant.id} className="plant-card">
              <div className="plant-image-container">
                <img src={plant.image} alt={plant.name} className="plant-image" />
                <div className="plant-location-badge">
                  <MapPin size={12} />
                  {plant.location}
                </div>
              </div>
              <div className="plant-info">
                <h3 className="plant-name">{plant.name}</h3>
                <p className="plant-status">{plant.status}</p>
              </div>
            </div>
          ))}
          
          {/* Add New Card */}
          <div className="plant-card add-new-card" onClick={() => navigate('/scan')}>
            <div className="add-new-icon-wrap">
              <Plus size={32} />
            </div>
            <h3 className="add-new-title">Add New</h3>
            <p className="add-new-desc">Scan or search for a plant</p>
          </div>
        </div>
      </section>
    </div>
  );
}
