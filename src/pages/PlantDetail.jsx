import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Thermometer, Sun, Wind, MapPin, ShoppingCart, X, Minus, Plus, QrCode, CheckCircle, Loader2, Trash2, Leaf, Lock, Unlock, Droplets, Sparkles } from 'lucide-react';
import PLANT_DETAILS from './plantData';
import CARE_TIPS from './careTips.json';
import './PlantDetail.css';

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('leafLifeUserId') || 1;
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
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Purchase Flow State
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQRPrompt, setShowQRPrompt] = useState(false);
  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, completed
  const [success, setSuccess] = useState(false);
  const [isTipsPayment, setIsTipsPayment] = useState(false);

  const plantId = parseInt(id);

  const fetchPlantAndImages = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/plants`);
      const data = await response.json();
      // Also fetch from collection if not in marketplace
      const collResponse = await fetch(`http://${window.location.hostname}:5000/api/user/${currentUserId}/collection`);
      const collData = await collResponse.json();
      
      const allPlants = [...data, ...collData];
      const found = allPlants.find(p => p.id === plantId);
      
      if (found) {
        setPlant(found);
        const imagesResponse = await fetch(`http://${window.location.hostname}:5000/api/plants/${plantId}/images`);
        const imagesData = await imagesResponse.json();
        setImages(imagesData);
      }
    } catch (err) {
      console.error("Error fetching plant details or images:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlantAndImages();
  }, [plantId, currentUserId]);

  const carouselImages = images.length > 0 ? images : (plant ? [plant.image] : []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

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

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const numeric = priceStr.toString().replace(/[^0-9]/g, '');
    return parseInt(numeric) || 0;
  };

  const handleProceedToPayment = async () => {
    const userStr = localStorage.getItem('leafLifeAuthenticated');
    if (!userStr) {
      alert('Please log in to purchase.');
      return;
    }
    
    const amount = cart.reduce((sum, item) => sum + (parsePrice(item.price) * (item.quantity || 1)), 0);

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart, userId: currentUserId, amount })
      });
      const data = await response.json();

      setPaymentSessionId(data.sessionId);
      setPaymentStatus('pending');
      setShowCart(false);
      setShowQRPrompt(true);
      setIsTipsPayment(false);
    } catch (err) {
      alert("Failed to initiate payment.");
    }
  };

  const handleUnlockTips = async () => {
    const userStr = localStorage.getItem('leafLifeAuthenticated');
    if (!userStr) {
      alert('Please log in to unlock specialized tips.');
      return;
    }

    const tipsItem = {
      id: `UNLOCK-TIPS-${plant.id}`,
      name: `Specialized Care Tips for ${plant.name}`,
      price: "Rs. 50",
      quantity: 1,
      image: plant.image
    };

    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/payment/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: [tipsItem], userId: currentUserId, amount: 50 })
      });
      const data = await response.json();

      setPaymentSessionId(data.sessionId);
      setPaymentStatus('pending');
      setShowQRPrompt(true);
      setIsTipsPayment(true);
    } catch (err) {
      alert("Failed to initiate payment for tips.");
    }
  };

  const handleFinalizePurchase = async () => {
    if (isTipsPayment) {
        setSuccess(true);
        setShowQRPrompt(false);
        fetchPlantAndImages(); // Refresh to show tips
    } else {
        setCart([]);
        localStorage.removeItem('cart');
        setSuccess(true);
        setShowQRPrompt(false);
        fetchPlantAndImages();
    }
  };

  const closeModals = () => {
    setShowQuantitySelector(false);
    setShowQRPrompt(false);
    setSuccess(false);
    setPaymentSessionId(null);
    setIsTipsPayment(false);
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading plant details...</div>;
  if (!plant) {
    return (
      <div className="plant-detail-container">
        <button className="back-btn" onClick={() => navigate('/marketplace')}>
          <ArrowLeft size={20} /> Back to Marketplace
        </button>
        <div className="error-state">Plant not found</div>
      </div>
    );
  }

  const detail = PLANT_DETAILS[plant.id] || {};
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  
  const isOwned = plant.buyer_id === parseInt(currentUserId);
  const careTips = CARE_TIPS[plant.name] || CARE_TIPS[plant.name.split(' (')[0]];
  
  const API_BASE = `http://${window.location.hostname}:5000`;
  const HOST_IP = '192.168.16.102'; // Your computer's local IP
  const billURL = `http://${HOST_IP}:5173/bill/${paymentSessionId}`;

  return (
    <>
      <div className="animate-fade-in plant-detail-container">
        {/* Fixed Floating Cart Icon */}
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
          <div className="header-cart-icon" onClick={() => setShowCart(true)} style={{ position: 'relative', cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)', color: 'var(--primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ff4b4b', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <button className="back-btn" onClick={() => isOwned ? navigate('/dashboard') : navigate('/marketplace')} style={{ marginBottom: 0 }}>
            <ArrowLeft size={20} /> {isOwned ? 'Back to Dashboard' : 'Back to Marketplace'}
          </button>
        </div>

        <div className="plant-detail-card">
          <div className="detail-header-new">
            <h1 className="detail-title-new">{plant.name}</h1>
            <p className="scientific-name-new"><i>({plant.scientific_name || detail.scientificName})</i></p>
          </div>

          <div className="carousel-section">
            <div className="carousel-container">
              <img 
                src={carouselImages[currentSlide]?.startsWith('http') ? carouselImages[currentSlide] : `http://${window.location.hostname}:5000${carouselImages[currentSlide]}`} 
                alt={plant.name} 
                className="carousel-img" 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400'; }} 
              />
              <div className="carousel-badge">{plant.type}</div>
              {carouselImages.length > 1 && (
                <>
                  <button className="carousel-arrow left" onClick={handlePrevSlide}><ArrowLeft size={20} /></button>
                  <button className="carousel-arrow right" onClick={handleNextSlide}><span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}><ArrowLeft size={20} /></span></button>
                  <div className="carousel-counter">{currentSlide + 1}/{carouselImages.length}</div>
                </>
              )}
            </div>
          </div>

          <div className="detail-section" style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Scientific Name:</span>
                <span style={{ fontSize: '1.1rem', color: '#333', fontStyle: 'italic' }}>{detail.scientificName || plant.scientific_name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nepali Name:</span>
                <span style={{ fontSize: '1.1rem', color: '#333', fontWeight: '600' }}>{detail.nepaliName || plant.nepali_name}</span>
              </div>
            </div>
          </div>

          <div className="detail-section" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Leaf size={20} className="text-primary" /> About This Plant
            </h3>
            <p style={{ lineHeight: '1.8', color: '#4a4a4a', fontSize: '1.05rem', textAlign: 'justify' }}>
              {detail.description || plant.description}
            </p>
          </div>

          {!isOwned && (
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">Price</span>
                <span className="metadata-value">{plant.price}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">Nursery / Location</span>
                <span className="metadata-value">{plant.location}</span>
              </div>
            </div>
          )}

          {/* Specialized Care Tips Section */}
          {isOwned && (
            <div className="detail-section" style={{ marginTop: '2rem', padding: '2rem', background: '#f8fbf9', borderRadius: '1.5rem', border: '1px solid #e0eadd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1a1a1a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={22} style={{ color: '#FFD700' }} /> Specialized Care Tips
                </h3>
                {plant.tips_unlocked ? (
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#e6f7ef', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
                        <Unlock size={14} /> UNLOCKED
                    </span>
                ) : (
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fffbeb', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
                        <Lock size={14} /> LOCKED
                    </span>
                )}
              </div>

              {plant.tips_unlocked ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  <div style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#3b82f6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Droplets size={18} /> <strong>Watering</strong>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.5' }}>{careTips?.watering || 'Water when top soil is dry.'}</p>
                  </div>
                  <div style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sun size={18} /> <strong>Sunlight</strong>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.5' }}>{careTips?.sunlight || 'Prefers bright indirect light.'}</p>
                  </div>
                  <div style={{ background: 'white', padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Leaf size={18} /> <strong>Pro Tip</strong>
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.5' }}>{careTips?.tips || 'Keep away from cold drafts.'}</p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '1rem' }}>Unlock personalized, expert care routines and maintenance schedules for your <strong>{plant.name}</strong>.</p>
                  <button 
                    onClick={handleUnlockTips}
                    className="btn-primary" 
                    style={{ padding: '0.8rem 2rem', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--gradient-primary)', border: 'none' }}
                  >
                    Unlock for Rs. 50 <Sparkles size={18} />
                  </button>
                </div>
              )}
            </div>
          )}

          {!isOwned && (
            <div className="detail-actions-bottom">
              <button className="add-to-cart-big-new" onClick={handleBuyClick}>
                <ShoppingCart size={22} />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Select Quantity Modal */}
      {showQuantitySelector && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={closeModals}>
          <div className="glass-panel modal-content animate-scale-up" style={{ zIndex: 10001, background: 'white', color: 'black', opacity: 1, transform: 'none', textAlign: 'center', padding: '2.5rem', borderRadius: '2rem', maxWidth: '420px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f5f5f5', borderRadius: '50%', padding: '5px' }} onClick={closeModals}><X size={20} /></button>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Select Quantity</h3>
              <p style={{ color: '#666', fontSize: '1rem' }}>How many <b>{plant.name}</b>s do you want?</p>
            </div>
            <div className="quantity-controls" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '2rem 0' }}>
              <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '52px', height: '52px', borderRadius: '14px', border: '1px solid #ddd', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={24} /></button>
              <span style={{ fontSize: '2.25rem', fontWeight: '800' }}>{quantity}</span>
              <button type="button" onClick={() => setQuantity(Math.min(10, quantity + 1))} style={{ width: '52px', height: '52px', borderRadius: '14px', border: '1px solid #ddd', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={24} /></button>
            </div>
            <button type="button" onClick={handleAddToCart} style={{ width: '100%', padding: '1.1rem', borderRadius: '9999px', background: 'var(--gradient-primary)', color: 'white', fontWeight: '700', fontSize: '1.1rem', border: 'none', boxShadow: '0 4px 12px rgba(46, 96, 58, 0.2)', cursor: 'pointer' }}>Add to Cart</button>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRPrompt && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={closeModals}>
          <div className="glass-panel modal-content text-center animate-scale-up" style={{ zIndex: 10001, background: 'white', padding: '2rem', borderRadius: '2rem', maxWidth: '420px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" onClick={closeModals} style={{ position: 'absolute', top: '15px', right: '15px', color: 'black', background: '#f5f5f5', borderRadius: '50%', padding: '5px' }}><X size={20} /></button>
            <div className="modal-header">
              <div className="qr-icon" style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', justifyContent: 'center' }}><QrCode size={48} /></div>
              <h3>Scan to Pay</h3>
              <p style={{ fontSize: '0.875rem', color: '#666' }}>Scan this with your mobile to see the bill and pay.</p>
              <p style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.25rem', marginTop: '0.5rem' }}>
                Total: Rs. {isTipsPayment ? 50 : cart.reduce((sum, item) => sum + (parsePrice(item.price) * item.quantity), 0)}
              </p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', display: 'inline-block', margin: '1.5rem 0', border: '1px solid #eee' }}>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(billURL)}`} alt="Payment QR Code" style={{ width: '200px', height: '200px' }} />
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
            <h3>{isTipsPayment ? 'Specialized Tips Unlocked!' : 'Purchase Successful!'}</h3>
            <p>{isTipsPayment ? `You now have access to expert care tips for your ${plant.name}.` : 'Your order has been placed successfully.'}</p>
            <div className="modal-actions" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="button" onClick={isTipsPayment ? closeModals : () => navigate('/dashboard')} className="btn-primary w-full">{isTipsPayment ? 'View Tips' : 'Go to Dashboard'}</button>
              <button type="button" onClick={closeModals} className="btn-text w-full">Continue Browsing</button>
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
              <p style={{ color: '#666' }}>{cart.length === 0 ? 'Your cart is empty' : `Items: ${cartCount}`}</p>
            </div>
            {cart.length > 0 ? (
              <>
                <div className="cart-items-list" style={{ maxHeight: '350px', overflowY: 'auto', textAlign: 'left', paddingRight: '5px' }}>
                  {cart.map((item, index) => (
                    <div key={item.id || `cart-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                      <img src={item.image.startsWith('http') ? item.image.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000${item.image}`} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=400'; }} />
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
                  <button type="button" onClick={handleProceedToPayment} style={{ width: '100%', padding: '1.25rem', borderRadius: '9999px', background: 'var(--gradient-primary)', color: 'white', border: 'none', fontWeight: '700', fontSize: '1.1rem', cursor: 'pointer' }}>Proceed to Checkout</button>
                  <button type="button" onClick={() => setShowCart(false)} style={{ color: '#888', fontWeight: '500', cursor: 'pointer', textAlign: 'center', padding: '5px' }}>Back to Shopping</button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '50px 0' }}>
                <div style={{ background: '#f5f7f5', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px' }}><ShoppingCart size={45} style={{ opacity: 0.3, color: 'var(--primary)' }} /></div>
                <button type="button" onClick={() => setShowCart(false)} style={{ width: '100%', padding: '1.1rem', borderRadius: '9999px', background: 'var(--gradient-primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Browse Marketplace</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
