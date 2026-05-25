import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, ShoppingCart, X, Trash2, Plus, Minus, QrCode, Loader2, CheckCircle, Droplets, Sun, Sprout, Info } from 'lucide-react';
import RecommendationForm from '../components/RecommendationForm';
import careTipsData from './careTips.json';
import './Recommendation.css';

export default function Recommendation() {
  const [showResults, setShowResults] = useState(false);
  const [recommendedPlants, setRecommendedPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      return [];
    }
  });
  const [showCart, setShowCart] = useState(false);
  
  // Payment Flow State
  const [showQRPrompt, setShowQRPrompt] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [success, setSuccess] = useState(false);

  // Quantity/Care Selection State
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showCareModal, setShowCareModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Polling for payment status
  useEffect(() => {
    let interval;
    if (showQRPrompt && paymentSessionId && paymentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`http://${window.location.hostname}:5000/api/payment/status/${paymentSessionId}`);
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
  }, [showQRPrompt, paymentSessionId, paymentStatus]);

  const handleRecommendationSubmit = async (e, { location, selectedSpace, lightLevel }) => {
    setLoading(true);
    
    const lightMap = { 0: 'Low', 1: 'Medium', 2: 'High' };
    const sunlight = lightMap[lightLevel];
    const space = selectedSpace;

    try {
      const params = new URLSearchParams({
        space: space,
        sunlight: sunlight,
        location: location
      });

      const response = await fetch(`http://${window.location.hostname}:5000/api/recommend?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      
      const data = await response.json();
      
      setRecommendedPlants(data.plants || []);
      setSummaryData(data.summary || null);
      setShowResults(true);
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('RECOMMENDATION ERROR:', error);
      alert(`Error: ${error.message}. Please ensure the backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlantClick = (plant) => {
    setSelectedPlant(plant);
    setQuantity(1);
    setShowCareModal(true);
  };

  const handleAddToCart = () => {
    const existingItem = cart.find(item => item.id === selectedPlant.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === selectedPlant.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      setCart([...cart, { ...selectedPlant, quantity: quantity }]);
    }
    
    setShowCareModal(false);
    setSelectedPlant(null);
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleProceedToPayment = async () => {
    const userStr = localStorage.getItem('leafLifeAuthenticated');
    if (!userStr) {
      alert('Please log in to purchase.');
      return;
    }
    
    const userId = localStorage.getItem('leafLifeUserId') || 1;
    const amount = cart.reduce((sum, item) => sum + (parsePrice(item.price) * (item.quantity || 1)), 0);

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/payment/initiate`, {
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

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const numeric = priceStr.toString().replace(/[^0-9]/g, '');
    return parseInt(numeric) || 0;
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);

  const HOST_IP = '192.168.16.102'; // Your computer's local IP
  const billURL = `http://${HOST_IP}:5173/bill/${paymentSessionId}`;

  // Care Tips helper
  const getCareTips = (plantName) => {
    const cleanName = plantName.split('(')[0].trim();
    return careTipsData[cleanName] || {
      watering: "General watering (once a week).",
      sunlight: "General indirect light.",
      soil: "Standard well-draining potting mix.",
      tips: "Keep away from extreme temperatures."
    };
  };

  return (
    <div className="rec-page">
      <div className="rec-blob rec-blob1" />
      <div className="rec-blob rec-blob2" />

      {/* Header with Cart Count (Fixed) */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '10px' }}>
        <div 
          className="header-cart-icon" 
          onClick={() => setShowCart(true)} 
          style={{ 
            cursor: 'pointer', 
            padding: '12px', 
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: '-2px', 
              right: '-2px', 
              background: '#ff4b4b', 
              color: 'white', 
              fontSize: '0.65rem', 
              fontWeight: 'bold', 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: '2px solid white' 
            }}>
              {cartCount}
            </span>
          )}
        </div>
      </div>

      <div className="rec-container">
        {!showResults ? (
          <RecommendationForm 
            showHeader 
            onSubmit={handleRecommendationSubmit} 
            loading={loading}
          />
        ) : (
          <div className="results-view animate-fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h1 className="rec-title">Your Perfect <em>Plant Matches</em></h1>
              <p className="rec-subtitle">Based on your specific environment and local climate.</p>
            </header>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recommended for You</h3>
              <button className="btn-secondary" onClick={() => setShowResults(false)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', height: 'auto' }}>
                Edit Details
              </button>
            </div>
            
            <div className="plant-res-grid">
              {recommendedPlants.length > 0 ? (
                recommendedPlants.map(plant => (
                  <div key={plant.id} className="plant-res-card" onClick={() => handlePlantClick(plant)}>
                    <div className="plant-res-img-wrapper">
                      <img 
                        src={`http://${window.location.hostname}:5000${plant.image}`} 
                        alt={plant.name} 
                        className="plant-res-img"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400'; }}
                      />
                      
                      {/* HIGH VISIBILITY PULSING BADGE */}
                      <div className="care-badge">
                        <Sparkles size={16} fill="white" />
                        <span>Care Guide Included</span>
                      </div>
                    </div>

                    <div className="plant-res-info">
                      <div className="plant-res-header">
                        <h4 className="plant-res-name">{plant.name}</h4>
                        <span className="plant-res-price">{plant.price}</span>
                      </div>
                      
                      <div className="plant-res-hint">
                        <Info size={14} />
                        <span>Tap to view <strong>Specialized Care Guide</strong> for this plant.</span>
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handlePlantClick(plant); }}
                        className="plant-res-btn"
                      >
                        <ShoppingCart size={18} /> Buy Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: 'rgba(0,0,0,0.03)', borderRadius: '1.5rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🪴</div>
                  <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>No exact matches found</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '300px', margin: '0 auto' }}>
                    We couldn't find any plants matching all your criteria. Try loosening your light or space requirements!
                  </p>
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
              <button className="btn-primary" onClick={() => navigate('/marketplace')} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Browse All Plants <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Specialized Care & Quantity Modal */}
      {showCareModal && selectedPlant && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={() => setShowCareModal(false)}>
          <div className="glass-panel modal-content animate-scale-up" style={{ zLimit: 10001, background: 'white', color: 'black', opacity: 1, transform: 'none', textAlign: 'left', padding: '0', borderRadius: '2rem', maxWidth: '600px', width: '95%', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(0,0,0,0.05)', borderRadius: '50%', padding: '8px', border: 'none', cursor: 'pointer', zIndex: 10 }} onClick={() => setShowCareModal(false)}><X size={20} /></button>
            
            {/* Top Section: Plant Info */}
            <div style={{ display: 'flex', gap: '1.5rem', padding: '2rem', background: 'var(--bg-secondary)' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '1.5rem', overflow: 'hidden', flexShrink: 0 }}>
                <img src={`http://${window.location.hostname}:5000${selectedPlant.image}`} alt={selectedPlant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Personalized Guide</span>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0.25rem 0' }}>{selectedPlant.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.25rem' }}>{selectedPlant.price}</p>
              </div>
            </div>

            {/* Care Guide Grid */}
            <div style={{ padding: '2rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sprout size={20} color="var(--primary)" /> Specialized Care Guide
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Droplets size={20} color="#3b82f6" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: '700', margin: '0 0 4px 0' }}>Watering</h5>
                    <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4', margin: 0 }}>{getCareTips(selectedPlant.name).watering}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#fff7ed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sun size={20} color="#f59e0b" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: '700', margin: '0 0 4px 0' }}>Sunlight</h5>
                    <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4', margin: 0 }}>{getCareTips(selectedPlant.name).sunlight}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Sprout size={20} color="#10b981" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: '700', margin: '0 0 4px 0' }}>Soil</h5>
                    <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4', margin: 0 }}>{getCareTips(selectedPlant.name).soil}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f5f3ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Info size={20} color="#8b5cf6" />
                  </div>
                  <div>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: '700', margin: '0 0 4px 0' }}>Expert Tip</h5>
                    <p style={{ fontSize: '0.8rem', color: '#666', lineHeight: '1.4', margin: 0 }}>{getCareTips(selectedPlant.name).tips}</p>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div style={{ marginTop: '2.5rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Select Quantity</h4>
                    <p style={{ fontSize: '0.8rem', color: '#888', margin: '4px 0 0 0' }}>How many would you like to buy?</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Minus size={16} />
                    </button>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
                    <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleAddToCart} 
                  className="btn-primary" 
                  style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  <ShoppingCart size={20} /> Add to Cart — Rs. {parsePrice(selectedPlant.price) * quantity}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRPrompt && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={() => setShowQRPrompt(false)}>
          <div className="glass-panel modal-content text-center animate-scale-up" style={{ zIndex: 10001, background: 'white', color: 'black', opacity: 1, transform: 'none', padding: '2rem', borderRadius: '2rem', maxWidth: '420px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" onClick={() => setShowQRPrompt(false)} style={{ position: 'absolute', top: '15px', right: '15px', color: 'black', background: '#f5f5f5', borderRadius: '50%', padding: '5px' }}><X size={20} /></button>
            <div className="modal-header">
              <div className="qr-icon" style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}><QrCode size={48} /></div>
              <h3>Scan to Pay</h3>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>Scan this with your mobile to see the bill and pay.</p>
              <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.25rem', marginTop: '0.5rem' }}>
                Total: Rs. {totalAmount}
              </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block', margin: '1.5rem 0', border: '1px solid #eee' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(billURL)}`} 
                alt="Payment QR Code" 
                style={{ width: '200px', height: '200px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '1rem' }}>
              <Loader2 className="animate-spin" size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Waiting for mobile scan...</span>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={() => setSuccess(false)}>
          <div className="glass-panel modal-content text-center animate-scale-up" style={{ zIndex: 10001, background: 'white', padding: '2rem', borderRadius: '1.5rem', maxWidth: '420px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '80px', height: '80px', background: '#eef2ef', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}><CheckCircle size={48} /></div>
            <h3>Purchase Successful!</h3>
            <p>Your order has been placed successfully.</p>
            <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary w-full">Go to Dashboard</button>
              <button type="button" onClick={() => setSuccess(false)} className="btn-text w-full">Continue Browsing</button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={() => setShowCart(false)}>
          <div className="glass-panel modal-content animate-scale-up" style={{ zIndex: 10001, background: 'white', color: 'black', opacity: 1, transform: 'none', maxWidth: '460px', width: '95%', padding: '2rem', borderRadius: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" style={{ position: 'absolute', top: '15px', right: '15px', color: 'black', background: '#f5f5f5', borderRadius: '50%', padding: '5px', border: 'none', cursor: 'pointer' }} onClick={() => setShowCart(false)}><X size={28} /></button>
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Your Cart</h3>
              <p style={{ color: '#666' }}>
                {cart.length === 0 ? 'Your cart is empty' : `Items: ${cartCount}`}
              </p>
            </div>

            {cart.length > 0 ? (
              <>
                <div className="cart-items-list" style={{ maxHeight: '350px', overflowY: 'auto', textAlign: 'left', paddingRight: '5px' }}>
                  {cart.map((item, index) => (
                    <div key={item.id || `cart-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                      <img 
                        src={item.image.startsWith('http') ? item.image.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000${item.image}`} 
                        alt={item.name} 
                        style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400'; }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>{item.name}</h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '5px' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1rem' }}>{item.price}</span>
                          <span style={{ background: '#f0f4f1', color: '#555', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700' }}>x {item.quantity}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromCart(item.id)}
                        style={{ color: '#ff4b4b', padding: '10px', background: '#fff0f0', borderRadius: '12px', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '25px', padding: '20px', background: '#f8fbf9', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: '#555' }}>Total Amount</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>Rs. {totalAmount}</span>
                </div>

                <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button type="button" onClick={handleProceedToPayment} className="btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '9999px', fontSize: '1.1rem' }}>Proceed to Checkout</button>
                  <button type="button" onClick={() => setShowCart(false)} style={{ color: '#888', fontWeight: '500', cursor: 'pointer', textAlign: 'center', padding: '5px', background: 'none', border: 'none' }}>Back to Recommendations</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <div style={{ background: '#f5f7f5', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}>
                  <ShoppingCart size={45} style={{ opacity: 0.3, color: 'var(--primary)' }} />
                </div>
                <button type="button" onClick={() => setShowCart(false)} className="btn-primary" style={{ width: '100%' }}>Explore More Plants</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
