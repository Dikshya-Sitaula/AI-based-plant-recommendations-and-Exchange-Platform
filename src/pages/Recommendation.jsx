import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MapPin, ArrowRight, ShoppingCart, X, Trash2, Plus, Minus, QrCode, Loader2, CheckCircle } from 'lucide-react';
import RecommendationForm from '../components/RecommendationForm';
import './Recommendation.css';
import { API_BASE_URL } from '../apiConfig';

export default function Recommendation() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const openAuthModal = outletContext?.openAuthModal;
  const isAuthenticated = outletContext?.isAuthenticated ?? (localStorage.getItem('leafLifeAuthenticated') === 'true');
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

  // Quantity Selection State
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [networkIp, setNetworkIp] = useState(window.location.hostname);

  // In-App Toast Notification
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    // Only try to detect network IP if we are on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const fetchNetworkIp = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/network-info`);
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

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Polling for payment status
  useEffect(() => {
    let interval;
    if (showQRPrompt && paymentSessionId && paymentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/payment/status/${paymentSessionId}`);
          const data = await response.json();
          if (data.status === 'completed') {
            setPaymentStatus('completed');
            clearInterval(interval);
            handleFinalizePurchase();
          } else if (data.status === 'expired') {
            clearInterval(interval);
            setShowQRPrompt(false);
            showToast("Payment session expired. Please try again.", 'error');
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showQRPrompt, paymentSessionId, paymentStatus, networkIp]);

  const handleRecommendationSubmit = async (e, { location, selectedSpace, lightLevel }) => {
    if (!isAuthenticated) {
      const recCount = parseInt(localStorage.getItem('leafLifeGuestRecCount') || '0', 10);
      if (recCount >= 1) {
        showToast('Guest recommendation limit reached (1 max). Please sign in!', 'warn');
        if (openAuthModal) openAuthModal();
        return;
      }
    }

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

      const response = await fetch(`${API_BASE_URL}/api/recommend?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      
      const data = await response.json();
      
      if (!isAuthenticated) {
        localStorage.setItem('leafLifeGuestRecCount', '1');
      }
      setRecommendedPlants(data.plants || []);
      setSummaryData(data.summary || null);
      setShowResults(true);
      
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('RECOMMENDATION ERROR:', error);
      showToast(error.message || 'Failed to fetch recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };


  const handleAddToCartClick = (plant) => {
    if (!isAuthenticated) {
      if (openAuthModal) openAuthModal();
      else showToast('Please log in or sign up to add items to cart.', 'warn');
      return;
    }
    setSelectedPlant(plant);
    setQuantity(1);
    setShowQuantitySelector(true);
  };

  const handlePlantCardClick = (plantId) => {
    navigate(`/marketplace/${plantId}`, { 
      state: { 
        from: 'recommendation',
        answers: {
          location: summaryData?.location,
          space: summaryData?.space,
          sunlight: summaryData?.sunlight
        }
      } 
    });
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
    
    setShowQuantitySelector(false);
    setSelectedPlant(null);
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleProceedToPayment = async () => {
    const userStr = localStorage.getItem('leafLifeAuthenticated');
    if (!userStr) {
      if (openAuthModal) openAuthModal();
      else showToast('Please log in to purchase.', 'warn');
      return;
    }
    
    const userId = localStorage.getItem('leafLifeUserId') || 1;
    const amount = cart.reduce((sum, item) => sum + (parsePrice(item.price) * (item.quantity || 1)), 0);

    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart, userId, amount })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate payment');
      }

      setPaymentSessionId(data.sessionId);
      setPaymentStatus('pending');
      setShowCart(false);
      setShowQRPrompt(true);
    } catch (err) {
      showToast(err.message || "Failed to initiate payment.", 'error');
    }
  };

  const handleFinalizePurchase = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/complete/${paymentSessionId}`, {
        method: 'POST'
      });
      if (response.ok) {
        setCart([]);
        localStorage.removeItem('cart');
        setSuccess(true);
        setShowQRPrompt(false);
      } else {
        showToast("Failed to finalize checkout.", 'error');
      }
    } catch (err) {
      console.error("Checkout finalization error:", err);
      showToast("Something went wrong.", 'error');
    }
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const numeric = priceStr.toString().replace(/[^0-9]/g, '');
    return parseInt(numeric) || 0;
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalAmount = cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0);

  // Determine host for mobile access
  const HOST_URL = `${window.location.protocol}//${networkIp}${window.location.port ? ':' + window.location.port : ''}`;
  const billURL = `${HOST_URL}/bill/${paymentSessionId}`;

  return (
    <div className="rec-page">
      {/* In-App Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, padding: '14px 24px', borderRadius: '12px', fontWeight: '600',
          fontSize: '0.95rem', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          background: toast.type === 'error' ? '#FF4B4B' : toast.type === 'warn' ? '#F59E0B' : '#2D6A4F',
          color: 'white', display: 'flex', alignItems: 'center', gap: '10px',
          maxWidth: '90vw', animation: 'fadeInDown 0.3s ease',
          pointerEvents: 'none'
        }}>
          <span>{toast.type === 'error' ? '❌' : toast.type === 'warn' ? '⚠️' : '✅'}</span>
          {toast.message}
        </div>
      )}
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

            {summaryData && (
              <div className="summary-banner" style={{ 
                background: 'white', 
                padding: '1.25rem', 
                borderRadius: '1.25rem', 
                marginBottom: '2rem', 
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid #eef2ef',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Location</div>
                  <div style={{ color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {summaryData.location}
                  </div>
                </div>
                <div style={{ width: '1px', height: '30px', background: '#eee' }} />
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Avg. Temp</div>
                  <div style={{ fontWeight: '700' }}>{summaryData.averageTemp}</div>
                </div>
                <div style={{ width: '1px', height: '30px', background: '#eee' }} />
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Setting</div>
                  <div style={{ fontWeight: '700', textTransform: 'capitalize' }}>{summaryData.space}</div>
                </div>
                <div style={{ width: '1px', height: '30px', background: '#eee' }} />
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#888', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Light</div>
                  <div style={{ fontWeight: '700' }}>{summaryData.sunlight}</div>
                </div>
                
                {summaryData.note && (
                  <div style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem', background: '#f0f7f2', borderRadius: '0.5rem', fontSize: '0.8rem', color: '#46603a', textAlign: 'center', fontWeight: '600' }}>
                    ✨ {summaryData.note}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Recommended for You</h3>
              <button className="btn-secondary" onClick={() => setShowResults(false)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', height: 'auto' }}>
                Edit Details
              </button>
            </div>
            
            <div className="plant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {recommendedPlants.length > 0 ? (
                recommendedPlants.map(plant => (
                  <div key={plant.id} className="rec-card" style={{ 
                    padding: 0,
                    overflow: 'hidden', 
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div 
                      onClick={() => handlePlantCardClick(plant.id)}
                      style={{ height: '200px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}
                    >
                      <img src={plant.image?.startsWith('http') ? plant.image : `${API_BASE_URL}${plant.image}`} alt={plant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: '700', margin: 0 }}>{plant.name}</h4>
                        <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{plant.price}</span>
                      </div>
                      
                      <button 
                        onClick={() => handleAddToCartClick(plant)}
                        className="btn-primary"
                        style={{ width: '100%', padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                      >
                        <ShoppingCart size={18} /> Add to Cart
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

      {/* Select Quantity Modal */}
      {showQuantitySelector && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={() => setShowQuantitySelector(false)}>
          <div className="glass-panel modal-content animate-scale-up" style={{ zIndex: 10001, background: 'white', color: 'black', opacity: 1, transform: 'none', textAlign: 'center', padding: '2.5rem', borderRadius: '2rem', maxWidth: '420px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f5f5f5', borderRadius: '50%', padding: '5px', border: 'none', cursor: 'pointer' }} onClick={() => setShowQuantitySelector(false)}><X size={20} /></button>
            
            <div className="modal-header">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Select Quantity</h3>
              <p style={{ color: '#666', fontSize: '1rem' }}>How many <b>{selectedPlant?.name}</b>s do you want?</p>
            </div>

            <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', margin: '2rem 0' }}>
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Minus size={20} />
              </button>
              <span className="qty-value" style={{ fontSize: '2rem', fontWeight: '800', minWidth: '40px' }}>{quantity}</span>
              <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="qty-btn" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '1px solid #ddd', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Plus size={20} />
              </button>
            </div>

            <button 
              type="button" 
              onClick={handleAddToCart} 
              className="btn-primary" 
              style={{ width: '100%', padding: '1.1rem', fontSize: '1.1rem', marginTop: '1rem', borderRadius: '9999px' }}
            >
              Add to Cart
            </button>
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
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#888', wordBreak: 'break-all', maxWidth: '200px' }}>
                {billURL}
              </div>
            </div>

            <button 
              onClick={handleFinalizePurchase}
              style={{ 
                width: '100%', 
                padding: '1.25rem', 
                fontSize: '1.1rem', 
                borderRadius: '9999px', 
                background: 'var(--primary)', 
                color: 'white', 
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(46, 96, 58, 0.2)'
              }}
            >
              Done & Checkout
            </button>
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999' }}>Click Done after you have completed the payment.</p>
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
                        src={item.image?.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`} 
                        alt={item.name} 
                        style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1416879598555-259160a2bece?q=80&w=400'; }}
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
                <button type="button" onClick={() => { setShowCart(false); navigate('/marketplace'); }} className="btn-primary" style={{ width: '100%' }}>Explore More Plants</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
