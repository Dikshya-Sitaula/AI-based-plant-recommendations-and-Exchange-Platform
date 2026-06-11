import { Plus, Droplets, MapPin, Wind, Trophy, Leaf, ShoppingCart, X, Trash2, QrCode, Loader2, CheckCircle, Minus } from 'lucide-react';
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

  // Cart and Payment States
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      return [];
    }
  });
  const [showCart, setShowCart] = useState(false);
  const [showQRPrompt, setShowQRPrompt] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [success, setSuccess] = useState(false);
  const [networkIp, setNetworkIp] = useState(window.location.hostname);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const fetchNetworkIp = async () => {
        try {
          const response = await fetch(`http://${window.location.hostname}:5000/api/network-info`);
          const data = await response.json();
          if (data.ip && data.ip !== 'localhost') {
            setNetworkIp(data.ip);
          }
        } catch (err) {
          console.error("Error fetching network IP:", err);
        }
      };
      fetchNetworkIp();
    }
  }, []);

  // Polling for payment status
  useEffect(() => {
    let interval;
    if (showQRPrompt && paymentSessionId && paymentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`http://${networkIp}:5000/api/payment/status/${paymentSessionId}`);
          const data = await response.json();
          if (data.status === 'completed') {
            setPaymentStatus('completed');
            clearInterval(interval);
            handleFinalizePurchase();
          } else if (data.status === 'expired') {
            clearInterval(interval);
            setShowQRPrompt(false);
            alert("Payment session expired. Please try again.");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showQRPrompt, paymentSessionId, paymentStatus, networkIp]);

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const numeric = priceStr.toString().replace(/[^0-9]/g, '');
    return parseInt(numeric) || 0;
  };

  const handleProceedToPayment = async () => {
    const userAuthenticated = localStorage.getItem('leafLifeAuthenticated') === 'true';
    if (!userAuthenticated) {
      alert('Please log in to purchase.');
      return;
    }
    
    const amount = cart.reduce((sum, item) => sum + (parsePrice(item.price) * (item.quantity || 1)), 0);

    try {
      const response = await fetch(`http://${networkIp}:5000/api/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart, userId, amount })
      });
      const data = await response.json();

      setPaymentSessionId(data.sessionId);
      setPaymentStatus('pending');
      setShowCart(false);
      setShowQRPrompt(true);
    } catch (err) {
      alert("Failed to initiate payment.");
    }
  };

  const handleFinalizePurchase = () => {
    setCart([]);
    localStorage.removeItem('cart');
    setSuccess(true);
    setShowQRPrompt(false);
  };

  const closeModals = () => {
    setShowQRPrompt(false);
    setSuccess(false);
    setPaymentSessionId(null);
  };

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

  // Group collection by plant name to show quantity badges
  const groupedCollection = collection.reduce((acc, plant) => {
    const existing = acc.find(item => item.name === plant.name);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...plant, quantity: 1 });
    }
    return acc;
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="dashboard-content animate-fade-in">
      {/* Fixed Floating Cart Icon */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <div className="header-cart-icon" onClick={() => setShowCart(true)} style={{ cursor: 'pointer', padding: '12px', background: 'white', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: 'var(--primary)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ff4b4b', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
              {cartCount}
            </span>
          )}
        </div>
      </div>

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
            {groupedCollection.length > 0 ? (
              <ul className="task-list">
                {groupedCollection.slice(0, 2).map(plant => (
                  <li key={plant.id} className="task-item">
                    <div className="task-checkbox"></div>
                    <div className="task-info">
                      <span className="task-name">{plant.name} {plant.quantity > 1 && `(x${plant.quantity})`}</span>
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
          {groupedCollection.map(plant => (
            <div key={plant.id} className="plant-card" onClick={() => navigate(`/marketplace/${plant.id}`)} style={{ cursor: 'pointer' }}>
              <div className="plant-image-container">
                <img 
                  src={
                    plant.image.startsWith('http') 
                      ? (plant.image.includes('/plants/') 
                          ? plant.image.replace(/http:\/\/[^\/:]+(:\d+)?/, `http://${window.location.hostname}:5000`)
                          : plant.image)
                      : `http://${window.location.hostname}:5000${encodeURI(plant.image)}`
                  } 
                  alt={plant.name} 
                  className="plant-image" 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879598555-259160a2bece?q=80&w=400'; }}
                />
                {plant.quantity > 1 && (
                  <div className="plant-quantity-badge">
                    x{plant.quantity}
                  </div>
                )}
                <div className="plant-location-badge">
                  <MapPin size={12} />
                  {plant.location || 'Home'}
                </div>
              </div>
              <div className="plant-info">
                <h3 className="plant-name">{plant.name}</h3>
                <p className="plant-status">Healthy • {plant.quantity > 1 ? `${plant.quantity} plants` : '1 plant'}</p>
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

      {/* Cart Modal */}
      {showCart && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={() => setShowCart(false)}>
          <div className="glass-panel modal-content animate-scale-up" style={{ zIndex: 10001, background: 'white', color: 'black', opacity: 1, transform: 'none', maxWidth: '460px', width: '95%', padding: '2rem', borderRadius: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" style={{ position: 'absolute', top: '15px', right: '15px', background: '#f5f5f5', borderRadius: '50%', padding: '5px', border: 'none', cursor: 'pointer' }} onClick={() => setShowCart(false)}><X size={28} /></button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Your Cart</h3>
              <p style={{ color: '#666' }}>{cart.length === 0 ? 'Your cart is empty' : `Items: ${cartCount}`}</p>
            </div>
            {cart.length > 0 ? (
              <>
                <div className="cart-items-list" style={{ maxHeight: '350px', overflowY: 'auto', textAlign: 'left', paddingRight: '5px' }}>
                  {cart.map((item, index) => (
                    <div key={item.id || `cart-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                      <img src={item.image?.startsWith('http') ? item.image.replace('localhost', networkIp) : `http://${networkIp}:5000${item.image}`} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879598555-259160a2bece?q=80&w=400'; }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{item.name}</h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '5px' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1rem' }}>{item.price}</span>
                          <span style={{ background: '#f0f4f1', color: '#555', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700' }}>x {item.quantity}</span>
                        </div>
                      </div>
                      <button onClick={() => handleRemoveFromCart(item.id)} style={{ color: '#ff4b4b', padding: '10px', background: '#fff0f0', borderRadius: '12px', border: 'none', cursor: 'pointer' }}><Trash2 size={20} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '25px', padding: '20px', background: '#f9fbf9', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee' }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>Total Amount</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>Rs. {cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0)}</span>
                </div>
                <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button type="button" onClick={handleProceedToPayment} style={{ width: '100%', padding: '1.25rem', borderRadius: '9999px', background: '#3D704D', color: 'white', border: 'none', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}>Proceed to Checkout</button>
                  <button type="button" onClick={() => setShowCart(false)} style={{ color: '#888', fontWeight: '500', cursor: 'pointer', textAlign: 'center', padding: '5px', background: 'none', border: 'none' }}>Back to Dashboard</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <div style={{ background: '#f5f7f5', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}><ShoppingCart size={45} style={{ opacity: 0.3, color: 'var(--primary)' }} /></div>
                <button type="button" onClick={() => { setShowCart(false); navigate('/marketplace'); }} style={{ width: '100%', padding: '1.1rem', borderRadius: '9999px', background: 'var(--gradient-primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Browse Marketplace</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showQRPrompt && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={closeModals}>
          <div className="glass-panel modal-content text-center animate-scale-up" style={{ zIndex: 10001, background: 'white', color: 'black', opacity: 1, transform: 'none', padding: '2rem', borderRadius: '2rem', maxWidth: '420px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" onClick={closeModals} style={{ position: 'absolute', top: '15px', right: '15px', color: 'black', background: '#f5f5f5', borderRadius: '50%', padding: '5px', border: 'none' }}><X size={20} /></button>
            <div className="modal-header">
              <div className="qr-icon" style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}><QrCode size={48} /></div>
              <h3>Scan to Pay</h3>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>Scan this with your mobile to see the bill and pay.</p>
              <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.25rem', marginTop: '0.5rem' }}>
                Total: Rs. {cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0)}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block', margin: '1.5rem 0', border: '1px solid #eee' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.protocol}//${networkIp}${window.location.port ? ':' + window.location.port : ''}/bill/${paymentSessionId}`)}`} alt="Payment QR Code" style={{ width: '200px', height: '200px' }} />
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#888', wordBreak: 'break-all', maxWidth: '200px' }}>
                {`${window.location.protocol}//${networkIp}${window.location.port ? ':' + window.location.port : ''}/bill/${paymentSessionId}`}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '1rem' }}>
              <Loader2 className="animate-spin" size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Waiting for mobile scan...</span>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={closeModals}>
          <div className="glass-panel modal-content text-center animate-scale-up" style={{ zIndex: 10001, background: 'white', padding: '2rem', borderRadius: '1.5rem', maxWidth: '420px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '80px', height: '80px', background: '#eef2ef', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}><CheckCircle size={48} /></div>
            <h3>Purchase Successful!</h3>
            <p>Your order has been placed successfully.</p>
            <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="button" onClick={closeModals} className="btn-primary w-full" style={{ padding: '1rem', borderRadius: '9999px', background: 'var(--gradient-primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Continue Browsing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
