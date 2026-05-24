import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Thermometer, Sun, Wind, MapPin, ShoppingCart, X, Minus, Plus, QrCode, CheckCircle, Loader2 } from 'lucide-react';
import PLANT_DETAILS from './plantData';
import './PlantDetail.css';

// Using the same mock data array for consistency with detailed info
const PLANTS_LIST = [
  { id: 1, name: 'African Violet', type: 'buy', price: 'Rs. 35', location: 'City Nursery', image: '/plants/African Violet (Saintpaulia ionantha)/1.jpg' },
  { id: 2, name: 'Aloe Vera', type: 'buy', price: 'Rs. 15', location: 'Local Nursery', image: '/plants/Aloe Vera/1.jpg' },
  // ... (I'll fetch from API instead of using this mock list if possible, but for now I'll use it to match IDs)
];

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showCart, setShowCart] = useState(false);
  
  // Purchase Flow State
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQRPrompt, setShowQRPrompt] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, completed
  const [success, setSuccess] = useState(false);

  const plantId = parseInt(id);
  const detail = PLANT_DETAILS[plantId];

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/plants');
        const data = await response.json();
        const found = data.find(p => p.id === plantId);
        setPlant(found);
      } catch (err) {
        console.error("Error fetching plant:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [plantId]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Polling for payment status
  useEffect(() => {
    let interval;
    if (showQRPrompt && paymentSessionId && paymentStatus === 'pending') {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/payment/status/${paymentSessionId}`);
          const data = await response.json();
          if (data.status === 'completed') {
            setPaymentStatus('completed');
            clearInterval(interval);
            handleFinalizePurchase();
          } else if (data.status === 'expired') {
            clearInterval(interval);
            closeModals();
            alert("Payment session expired. Please try again.");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [showQRPrompt, paymentSessionId, paymentStatus]);

  const handleBuyClick = () => {
    setQuantity(1);
    setShowQuantitySelector(true);
  };

  const handleAddToCart = () => {
    const existingItem = cart.find(item => item.id === plant.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === plant.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      setCart([...cart, { ...plant, quantity }]);
    }
    setShowQuantitySelector(false);
  };

  const handleProceedToPayment = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please log in to purchase.');
      return;
    }
    const user = JSON.parse(userStr);
    const amount = parseInt(plant.price.replace('Rs. ', '').replace('$', '')) * quantity;

    try {
      const response = await fetch('http://localhost:5000/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantId: plant.id, userId: user.id, quantity, amount })
      });
      const data = await response.json();

      setPaymentSessionId(data.sessionId);
      setPaymentStatus('pending');
      setShowQuantitySelector(false);
      setShowQRPrompt(true);
    } catch (err) {
      alert("Failed to initiate payment.");
    }
  };

  const handleFinalizePurchase = async () => {
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);
    
    try {
      const buyResponse = await fetch(`http://localhost:5000/api/plants/${plant.id}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, quantity })
      });

      if (buyResponse.ok) {
        setShowQRPrompt(false);
        setSuccess(true);
      }
    } catch (err) {
      console.error("Finalization error:", err);
    }
  };

  const closeModals = () => {
    setShowQuantitySelector(false);
    setShowQRPrompt(false);
    setSuccess(false);
    setPaymentSessionId(null);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading plant details...</div>;
  if (!plant || !detail) {
    return (
      <div className="plant-detail-container">
        <button className="back-btn" onClick={() => navigate('/marketplace')}>
          <ArrowLeft size={20} /> Back to Marketplace
        </button>
        <div className="error-state">Plant not found</div>
      </div>
    );
  }

  // Determine local IP for mobile access
  const localIP = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
  const paymentURL = `http://${localIP}:5173/payment-mobile/${paymentSessionId}`;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="animate-fade-in plant-detail-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button className="back-btn" onClick={() => navigate('/marketplace')} style={{ marginBottom: 0 }}>
          <ArrowLeft size={20} /> Back to Marketplace
        </button>
        <div className="floating-cart" onClick={() => setShowCart(true)} style={{ position: 'static', transform: 'none' }}>
          <ShoppingCart size={24} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-image-section">
          <img src={plant.image} alt={plant.name} className="detail-img" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400'; }} />
          <div className="detail-badge">{plant.type}</div>
        </div>

        <div className="detail-info-section">
          <div className="detail-header">
            <div>
              <h1 className="detail-title">{detail.name}</h1>
              <p className="scientific-name"><i>{detail.scientificName}</i></p>
            </div>
            <p className="detail-price">{plant.price}</p>
          </div>

          <p className="detail-description">{detail.description}</p>

          <div className="detail-grid">
            <div className="detail-item">
              <MapPin className="detail-icon" size={24} />
              <div className="detail-text">
                <span className="detail-label">Suitable Location</span>
                <span className="detail-value">{detail.suitableLocation}</span>
              </div>
            </div>

            <div className="detail-item">
              <Thermometer className="detail-icon" size={24} />
              <div className="detail-text">
                <span className="detail-label">Temperature Range</span>
                <span className="detail-value">{detail.minTemp} - {detail.maxTemp}</span>
              </div>
            </div>

            <div className="detail-item">
              <Sun className="detail-icon" size={24} />
              <div className="detail-text">
                <span className="detail-label">Sunlight</span>
                <span className="detail-value">{detail.sunlight}</span>
              </div>
            </div>

            <div className="detail-item">
              <Wind className="detail-icon" size={24} />
              <div className="detail-text">
                <span className="detail-label">Air Quality Score</span>
                <span className="detail-value">{detail.airQualityScore}/10</span>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            <button className="add-to-cart-big" onClick={handleBuyClick}>
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showQuantitySelector && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="glass-panel modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" onClick={closeModals}><X size={20} /></button>
            <div className="modal-header">
              <h3>Select Quantity</h3>
              <p>How many {plant.name}s do you want?</p>
            </div>
            <div className="quantity-controls">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn"><Minus size={20} /></button>
              <span className="qty-value">{quantity}</span>
              <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="qty-btn"><Plus size={20} /></button>
            </div>
            <button type="button" onClick={handleAddToCart} className="btn-primary w-full">Add to Cart</button>
          </div>
        </div>
      )}

      {showQRPrompt && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="glass-panel modal-content animate-scale-up text-center" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" onClick={closeModals}><X size={20} /></button>
            <div className="modal-header">
              <div className="qr-icon" style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}><QrCode size={48} /></div>
              <h3>Scan to Pay</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Scan this with your mobile to see the bill and pay.</p>
              <p className="purchase-summary" style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.25rem' }}>
                Total: Rs. {parseInt(plant.price.replace('Rs. ', '').replace('$', '')) * quantity}
              </p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block', margin: '1.5rem 0', border: '1px solid #eee' }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentURL)}`} 
                alt="Payment QR Code" 
                style={{ width: '200px', height: '200px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem' }}>
              <Loader2 className="animate-spin" size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Waiting for mobile scan...</span>
            </div>
            
            <p className="text-subtle" style={{ fontSize: '0.75rem', marginTop: '1rem' }}>
              Keep this window open. Once you pay on your phone, this will update automatically.
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="glass-panel modal-content animate-scale-up text-center" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon"><CheckCircle size={48} /></div>
            <h3>Purchase Successful!</h3>
            <p>You bought {quantity} {plant.name}(s).</p>
            <div className="modal-actions">
              <button type="button" onClick={() => navigate('/dashboard')} className="btn-primary w-full">Go to Dashboard</button>
              <button type="button" onClick={closeModals} className="btn-text w-full">Continue Shopping</button>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="glass-panel modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" onClick={() => setShowCart(false)}><X size={20} /></button>
            <div className="modal-header">
              <h3>Your Cart</h3>
              <p>{cart.length === 0 ? 'Your cart is empty' : `You have ${cartCount} items in your cart`}</p>
            </div>

            {cart.length > 0 && (
              <>
                <div className="cart-items-list">
                  {cart.map((item, index) => (
                    <div key={index} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>{item.price}</p>
                      </div>
                      <div className="cart-item-qty">x{item.quantity}</div>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Total Amount</span>
                  <span>Rs. {cart.reduce((sum, item) => sum + (parseInt(item.price.replace('Rs. ', '').replace('$', '')) * item.quantity), 0)}</span>
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => { setShowCart(false); alert('Checkout feature coming soon!'); }} className="btn-primary w-full">Proceed to Checkout</button>
                  <button type="button" onClick={() => { setCart([]); setShowCart(false); }} className="btn-text w-full">Clear Cart</button>
                </div>
              </>
            )}
            
            {cart.length === 0 && (
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCart(false)} className="btn-primary w-full">Back to Shopping</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
