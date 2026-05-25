import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RecommendationForm from '../components/RecommendationForm';
import './Scan.css';

export default function Scan() {
  const [step, setStep] = useState('scan'); // 'scan', 'location', 'results'
  const [stream, setStream] = useState(null);
  const [location, setLocation] = useState('');
  const [spaceType, setSpaceType] = useState('indoor');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Initialize camera when step is 'scan'
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      // Fallback if camera fails
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    setIsScanning(true);
    // Simulate AI scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setStep('location');
    }, 2000);
  };

  const handleSubmitLocation = (e, { location: loc, selectedSpace }) => {
    e.preventDefault();
    if (loc) setLocation(loc);
    setSpaceType(selectedSpace);
    setStep('results');
  };

  return (
    <div className="animate-fade-in scan-container">
      {step === 'scan' && (
        <div className="scan-view">
          <h2 className="title-medium text-center">Identify Plant</h2>
          <p className="text-subtle text-center mb-4">Center the plant in the frame</p>
          
          <div className="camera-container">
            {stream ? (
              <video ref={videoRef} autoPlay playsInline className="camera-feed" />
            ) : (
              <div className="camera-fallback">
                <Camera size={48} color="var(--text-muted)" />
                <p>Camera access required</p>
              </div>
            )}
            
            {/* Viewfinder overlay */}
            <div className="viewfinder">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            
            {isScanning && (
              <div className="scanning-overlay">
                <div className="scan-line"></div>
                <p>Analyzing plant...</p>
              </div>
            )}
          </div>
          
          <button 
            className="btn-capture"
            onClick={handleCapture}
            disabled={isScanning || !stream}
          >
            <div className="inner-circle"></div>
          </button>
        </div>
      )}

      {step === 'location' && (
        <div className="location-view">
          <div className="identified-header">
            <div className="plant-image-bg">
              <img src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80" alt="Monstera" />
              <div className="identified-overlay">
                <span className="badge-identified">✓ IDENTIFIED</span>
                <h2>Monstera Deliciosa</h2>
                <p>Swiss Cheese Plant</p>
              </div>
            </div>
          </div>

          <div className="location-form-container scan-rec-form-wrap">
            <h3 className="text-center form-title">Let's find the perfect spot</h3>
            <div className="rec-page rec-page--embedded">
              <div className="rec-container">
                <RecommendationForm
                  showHeader={false}
                  onSubmit={handleSubmitLocation}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'results' && (
        <div className="results-view">
          <div className="result-header">
            <div className="plant-avatar">🌿</div>
            <div>
              <h2 className="title-medium" style={{ marginBottom: 0 }}>Monstera Deliciosa</h2>
              <p className="text-subtle">Swiss Cheese Plant</p>
            </div>
          </div>
          
          <h3 className="section-title">Similar Plants in Marketplace</h3>
          <div className="recommendations">
            {[1, 2].map(i => (
              <div key={i} className="plant-card" onClick={() => navigate('/marketplace')}>
                <div className="plant-img-placeholder" style={{ overflow: 'hidden' }}>
                  <img 
                    src={i === 1 ? "https://images.unsplash.com/photo-1613145451296-6d601b0b3d88?auto=format&fit=crop&w=400&q=80" : "https://images.unsplash.com/photo-1599598425947-33001c402cd0?auto=format&fit=crop&w=400&q=80"} 
                    alt="Philodendron" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div className="plant-info">
                  <h4>Philodendron</h4>
                  <p>$25 • Thrift</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="btn-secondary w-full mt-4" onClick={() => setStep('scan')}>
            Scan Another Plant
          </button>
        </div>
      )}
    </div>
  );
}
