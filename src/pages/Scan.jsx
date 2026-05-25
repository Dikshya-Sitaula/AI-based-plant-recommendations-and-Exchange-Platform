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

  // Initialize camera
  useEffect(() => {
    if (step === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [step]);

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
                  style={{ width: '90px', height: '90px', borderRadius: '1rem', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>{identification.localPlant.name}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.25rem', margin: '4px 0' }}>{identification.localPlant.price}</p>
                  <button 
                    onClick={() => navigate(`/marketplace`)} 
                    className="btn-primary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', width: 'auto', marginTop: '5px' }}
                  >
                    <ShoppingCart size={14} /> View in Marketplace
                  </button>
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
              {identification.allMatches.slice(1).map((match, i) => (
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
    </div>
  );
}
