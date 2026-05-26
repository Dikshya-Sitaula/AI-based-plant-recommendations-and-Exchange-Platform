import { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, Search, Leaf, ArrowRight, Home, Loader2, CheckCircle, ShoppingCart, RefreshCw, X, Info, Droplets, Sun, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import careTipsData from './careTips.json';
import './Scan.css';

export default function Scan() {
  const [step, setStep] = useState('scan'); // 'scan', 'results'
  const [stream, setStream] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [identification, setIdentification] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      return [];
    }
  });

  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Auto-start camera when on scan step
  useEffect(() => {
    if (step === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [step]);

  const handleIdentify = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    
    // Capture frame from video
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');

      try {
        const response = await fetch(`http://${window.location.hostname}:5000/api/identify`, {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Identification failed');
        
        const data = await response.json();
        setIdentification(data);
        setStep('results');
      } catch (err) {
        console.error("Identify error:", err);
        alert("Sorry, we couldn't identify this plant. Please try a clearer shot of a leaf.");
      } finally {
        setIsScanning(false);
      }
    }, 'image/jpeg', 0.8);
  };

  const handleAddToCart = () => {
    if (!identification?.localPlant) return;
    
    const plant = identification.localPlant;
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
    alert("Added to cart!");
  };

  const handleLocalPlantClick = (id) => {
    navigate(`/marketplace/${id}`, { 
      state: { 
        from: 'scan',
        identification: {
          commonName: identification.commonName,
          scientificName: identification.scientificName,
          score: identification.score
        }
      } 
    });
  };

  const getCareTips = (plantName) => {
    if (!plantName) return {
      watering: "General watering (once a week).",
      sunlight: "General indirect light.",
      soil: "Standard well-draining potting mix.",
      tips: "Keep away from extreme temperatures."
    };

    const cleanName = plantName.split('(')[0].trim();
    return careTipsData[cleanName] || {
      watering: "General watering (once a week).",
      sunlight: "General indirect light.",
      soil: "Standard well-draining potting mix.",
      tips: "Keep away from extreme temperatures."
    };
  };

  return (
    <div className="animate-fade-in scan-container">
      {/* Floating Cart Icon */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <div className="header-cart-icon" onClick={() => navigate('/marketplace')} style={{ cursor: 'pointer', padding: '10px', background: 'white', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: 'var(--primary)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={24} />
          {cart.length > 0 && (
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ff4b4b', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white' }}>
              {cart.reduce((sum, item) => sum + (item.quantity || 0), 0)}
            </span>
          )}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {step === 'scan' && (
        <div className="scan-view">
          <div className="scan-header">
            <h2 className="title-medium text-center">AI Plant Identifier</h2>
            <p className="text-subtle text-center">Powered by Pl@ntNet™ Technology</p>
          </div>
          
          <div className="camera-container">
            {stream ? (
              <video ref={videoRef} autoPlay playsInline className="camera-feed" />
            ) : (
              <div className="camera-fallback">
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
                <p>Initializing Camera...</p>
              </div>
            )}
            
            <div className="viewfinder">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
              
              <div className="scan-hint">
                <Info size={14} /> Center a leaf in the frame for best results
              </div>
            </div>
            
            {isScanning && (
              <div className="scanning-overlay">
                <div className="scan-line"></div>
                <div className="scan-status">
                  <RefreshCw className="animate-spin" size={20} />
                  <span>Analyzing Species...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="scan-controls">
            <button 
              className="btn-capture-main"
              onClick={handleIdentify}
              disabled={isScanning || !stream}
            >
              <div className="inner-circle">
                <Camera size={32} />
              </div>
            </button>
            <p className="capture-label">Tap to Identify</p>
          </div>
        </div>
      )}

      {step === 'results' && identification && (
        <div className="results-view animate-slide-up" style={{ paddingBottom: '4rem' }}>
          <div className="result-header-modern">
            <div className="res-back-btn" onClick={() => setStep('scan')}>
              <X size={24} />
            </div>
            <div className="confidence-badge">
              {Math.round(identification.score * 100)}% Match Confidence
            </div>
          </div>

          <div className="identified-hero">
            <div className="res-plant-icon">🌿</div>
            <h1 className="res-scientific">{identification.scientificName}</h1>
            <h2 className="res-common">{identification.commonName || 'Rare Species'}</h2>
          </div>

          {identification.localPlant ? (
            <div className="local-match-card animate-scale-up">
              <div className="match-tag">✨ MATCH FOUND IN NURSERY</div>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <img 
                  src={`http://${window.location.hostname}:5000${identification.localPlant.image}`} 
                  alt={identification.localPlant.name}
                  onClick={() => handleLocalPlantClick(identification.localPlant.id)}
                  style={{ width: '90px', height: '90px', borderRadius: '1rem', objectFit: 'cover', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', cursor: 'pointer' }} onClick={() => handleLocalPlantClick(identification.localPlant.id)}>{identification.localPlant.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.25rem', margin: '4px 0' }}>{identification.localPlant.price}</p>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '5px' }}>
                    <button 
                      onClick={() => setShowQuantitySelector(true)} 
                      className="btn-primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto' }}
                    >
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button 
                      onClick={() => handleLocalPlantClick(identification.localPlant.id)} 
                      className="btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto' }}
                    >
                      Care Tips
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-local-match">
              <p>This specific variety isn't in our local nursery yet, but we've generated a care guide for you!</p>
            </div>
          )}

          {/* Care Guide Section */}
          <div className="specialized-care-section">
            <h3 className="section-title-res">
              <Sprout size={20} color="var(--primary)" /> Personalized Care Guide
            </h3>
            
            <div className="care-grid-res">
              <div className="care-item-res">
                <div className="care-icon-wrap" style={{ background: '#eef2ff' }}><Droplets size={20} color="#3b82f6" /></div>
                <div>
                  <label>Watering</label>
                  <p>{getCareTips(identification.commonName || identification.scientificName).watering}</p>
                </div>
              </div>
              <div className="care-item-res">
                <div className="care-icon-wrap" style={{ background: '#fff7ed' }}><Sun size={20} color="#f59e0b" /></div>
                <div>
                  <label>Sunlight</label>
                  <p>{getCareTips(identification.commonName || identification.scientificName).sunlight}</p>
                </div>
              </div>
              <div className="care-item-res">
                <div className="care-icon-wrap" style={{ background: '#f0fdf4' }}><Sprout size={20} color="#10b981" /></div>
                <div>
                  <label>Soil</label>
                  <p>{getCareTips(identification.commonName || identification.scientificName).soil}</p>
                </div>
              </div>
              <div className="care-item-res">
                <div className="care-icon-wrap" style={{ background: '#f5f3ff' }}><Info size={20} color="#8b5cf6" /></div>
                <div>
                  <label>Expert Tip</label>
                  <p>{getCareTips(identification.commonName || identification.scientificName).tips}</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: '0 1.5rem', marginTop: '2rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#888', marginBottom: '1rem' }}>OTHER POSSIBLE MATCHES</h4>
            <div className="other-matches">
              {identification.allMatches && identification.allMatches.slice(1).map((match, i) => (
                <div key={i} className="other-match-pill">
                  {match.name} <span>{Math.round(match.score * 100)}%</span>
                </div>
              ))}
            </div>
            
            <button className="btn-secondary w-full" style={{ marginTop: '2rem' }} onClick={() => setStep('scan')}>
              <RefreshCw size={18} /> Scan Another Plant
            </button>
          </div>
        </div>
      )}

      {/* Select Quantity Modal */}
      {showQuantitySelector && (
        <div className="modal-overlay" style={{ zIndex: 10000, display: 'flex' }} onClick={() => setShowQuantitySelector(false)}>
          <div className="glass-panel modal-content animate-scale-up" style={{ zIndex: 10001, background: 'white', color: 'black', opacity: 1, transform: 'none', textAlign: 'center', padding: '2.5rem', borderRadius: '2rem', maxWidth: '420px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" type="button" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f5f5f5', borderRadius: '50%', padding: '5px', border: 'none', cursor: 'pointer' }} onClick={() => setShowQuantitySelector(false)}><X size={20} /></button>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Select Quantity</h3>
              <p style={{ color: '#666', fontSize: '1rem' }}>How many <b>{identification?.localPlant?.name}</b>s do you want?</p>
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
    </div>
  );
}
