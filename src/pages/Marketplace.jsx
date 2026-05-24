import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Heart, MapPin, ShoppingCart, X, Minus, Plus, QrCode, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import './Marketplace.css';

function PlantCard({ plant, onAddToCart, onClick }) {
  const handleAction = (e) => {
    e.stopPropagation();
    onAddToCart(plant, 1);
  };

  return (
    <div className="plant-card" onClick={() => onClick(plant.id)}>
      <div className="plant-image-wrap">
        <img src={plant.image} alt={plant.name} className="marketplace-img" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400'; }} />
        <div className="badge">{plant.type}</div>
        <button className="like-btn" onClick={(e) => e.stopPropagation()}><Heart size={18} /></button>
      </div>
      <div className="plant-details">
        <div className="plant-info-top">
          <h3>{plant.name}</h3>
          <p className="price">{plant.price}</p>
        </div>
        <div className="location">
          <MapPin size={14} />
          <span>{plant.location}</span>
        </div>
        
        <button 
          className="add-to-cart-card" 
          onClick={handleAction}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("Cart parse error:", err);
      return [];
    }
  });
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    console.log("Current Cart State:", cart);
  }, [cart]);

  useEffect(() => {
    console.log("showCart state changed to:", showCart);
  }, [showCart]);

  // Purchase Flow State
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQRPrompt, setShowQRPrompt] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, completed
  const [success, setSuccess] = useState(false);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('pendingMarketplacePurchase');
    if (savedSession) {
      const { sessionId, plant, quantity: savedQuantity } = JSON.parse(savedSession);
      setPaymentSessionId(sessionId);
      setSelectedPlant(plant);
      setQuantity(savedQuantity);
      setShowQRPrompt(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/plants');
        const data = await response.json();
        setPlants(data);
      } catch (err) {
        console.error("Error fetching plants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

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

  const filteredPlants = plants.filter(plant => {
    if (activeTab !== 'all' && plant.type !== activeTab) return false;
    if (searchQuery && !plant.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleAddToCart = (plant, qty) => {
    const existingItem = cart.find(item => item.id === plant.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === plant.id 
          ? { ...item, quantity: item.quantity + qty } 
          : item
      ));
    } else {
      setCart([...cart, { ...plant, quantity: qty }]);
    }
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const numeric = priceStr.toString().replace(/[^0-9]/g, '');
    return parseInt(numeric) || 0;
  };

  const handleBuyClick = (e, plant) => {
    e.stopPropagation();
    setSelectedPlant(plant);
    setQuantity(1);
    setShowQuantitySelector(true);
  };

  const handleModalAddToCart = () => {
    handleAddToCart(selectedPlant, quantity);
    setShowQuantitySelector(false);
    setSelectedPlant(null);
  };

  const handleProceedToPayment = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Please log in to purchase.');
      return;
    }
    const user = JSON.parse(userStr);
    const amount = parseInt(selectedPlant.price.replace('Rs. ', '').replace('$', '')) * quantity;

    try {
      const response = await fetch('http://localhost:5000/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plantId: selectedPlant.id, userId: user.id, quantity, amount })
      });
      const data = await response.json();

      // Save to localStorage for persistence
      localStorage.setItem('pendingMarketplacePurchase', JSON.stringify({
        sessionId: data.sessionId,
        plant: selectedPlant,
        quantity: quantity
      }));

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
      const buyResponse = await fetch(`http://localhost:5000/api/plants/${selectedPlant.id}/buy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, quantity })
      });

      if (buyResponse.ok) {
        localStorage.removeItem('pendingMarketplacePurchase'); // Clear session
        setShowQRPrompt(false);
        setSuccess(true);
        // Refresh plants
        const refreshRes = await fetch('http://localhost:5000/api/plants');
        const newData = await refreshRes.json();
        setPlants(newData);
      }
    } catch (err) {
      console.error("Finalization error:", err);
    }
  };

  const closeModals = () => {
    if (showQRPrompt) {
      localStorage.removeItem('pendingMarketplacePurchase');
    }
    setShowQuantitySelector(false);
    setShowQRPrompt(false);
    setSuccess(false);
    setSelectedPlant(null);
    setPaymentSessionId(null);
  };

  const goToDetail = (id) => {
    navigate(`/marketplace/${id}`);
  };

  // Determine local IP for mobile access
  const localIP = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
  const paymentURL = `http://${localIP}:5173/payment-mobile/${paymentSessionId}`;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="animate-fade-in marketplace-container">
      <div className="marketplace-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="title-medium">Marketplace</h2>
          <div className="floating-cart" onClick={() => setShowCart(true)}>
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
        </div>
        <div className="search-bar">
          <Search size={20} className="icon" />
          <input 
            type="text" 
            placeholder="Search plants..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-icon" type="button"><Filter size={20} /></button>
        </div>
      </div>

      <div className="tabs-container">
        {['all', 'swap', 'thrift', 'buy', 'sell'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="plants-grid">
        {loading ? (
          <p>Loading plants...</p>
        ) : filteredPlants.map(plant => (
          <PlantCard 
            key={plant.id} 
            plant={plant} 
            onAddToCart={handleAddToCart} 
            onClick={goToDetail} 
          />
        ))}
      </div>

      {showQuantitySelector && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="glass-panel modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" onClick={closeModals}><X size={20} /></button>
            <div className="modal-header">
              <h3>Select Quantity</h3>
              <p>How many {selectedPlant?.name}s do you want?</p>
            </div>
            <div className="quantity-controls">
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="qty-btn"><Minus size={20} /></button>
              <span className="qty-value">{quantity}</span>
              <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} className="qty-btn"><Plus size={20} /></button>
            </div>
            <button type="button" onClick={handleModalAddToCart} className="btn-primary w-full">Add to Cart</button>
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
                Total: Rs. {parseInt(selectedPlant?.price.replace('Rs. ', '').replace('$', '')) * quantity}
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
            <p>You bought {quantity} {selectedPlant?.name}(s).</p>
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
                    <div key={item.id || index} className="cart-item">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="cart-item-img" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400'; }}
                      />
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <div className="cart-item-qty-row">
                          <p>{item.price}</p>
                          <div className="cart-item-qty">x{item.quantity}</div>
                        </div>
                      </div>
                      <button 
                        className="remove-item-btn" 
                        onClick={() => handleRemoveFromCart(item.id)}
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Total Amount</span>
                  <span>Rs. {cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0)}</span>
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
