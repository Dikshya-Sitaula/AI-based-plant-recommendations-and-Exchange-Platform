import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ShoppingBag, CreditCard, Loader2 } from 'lucide-react';
import './MobileBill.css';

export default function MobileBill() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('pending'); // pending, completed, error

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:5000/api/payment/bill/${sessionId}`);
        const data = await response.json();
        if (data) {
          setSession(data);
          setStatus(data.status);
        }
      } catch (err) {
        console.error("Error fetching bill:", err);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };
    fetchBill();
  }, [sessionId]);

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate bank processing delay
    setTimeout(async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:5000/api/payment/complete/${sessionId}`, {
          method: 'POST'
        });
        if (response.ok) {
          setStatus('completed');
        } else {
          throw new Error("Payment failed");
        }
      } catch (err) {
        alert("Payment simulation failed.");
      } finally {
        setProcessing(false);
      }
    }, 2000);
  };

  if (loading) return (
    <div className="bill-state-container">
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      <p className="bill-state-desc" style={{ textAlign: 'center' }}>Loading your bill...</p>
    </div>
  );

  if (status === 'error' || !session) return (
    <div className="bill-state-container">
      <XCircle size={64} color="#ff4b4b" />
      <h2 className="bill-state-title">Bill Not Found</h2>
      <p className="bill-state-desc">This payment session may have expired or is invalid.</p>
      <div className="bill-state-actions">
        <button onClick={() => navigate('/')} className="btn-primary" style={{ width: '100%' }}>Return Home</button>
      </div>
    </div>
  );

  if (status === 'completed') return (
    <div className="bill-state-container">
      <div className="bill-success-icon-wrap">
        <CheckCircle size={64} />
      </div>
      <h1 className="bill-state-title">Payment Successful!</h1>
      <p className="bill-state-desc">
        Your transaction for <b>Rs. {session.total_amount}</b> has been processed via eSewa.
      </p>
      <div className="bill-state-actions">
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ width: '100%' }}>Go to Dashboard</button>
        <p className="bill-footer-note">You can close this window now.</p>
      </div>
    </div>
  );

  return (
    <div className="mobile-bill-container">
      <div className="bill-card animate-fade-in">
        {/* Header */}
        <div className="bill-header">
          <ShoppingBag size={48} className="bill-header-icon" />
          <h2>Payment Summary</h2>
          <p>Order #{session.id.split('-')[1]}</p>
        </div>

        {/* Bill Items */}
        <div className="bill-body">
          <h3>Items in your cart</h3>
          <div className="bill-items-list">
            {session.cart_items.map((item, idx) => (
              <div key={idx} className="bill-item">
                <img 
                  src={item.image.startsWith('http') ? item.image.replace('localhost', window.location.hostname) : `http://${window.location.hostname}:5000${item.image}`} 
                  alt={item.name} 
                  className="bill-item-img"
                />
                <div className="bill-item-info">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="bill-item-price">
                  {item.price}
                </div>
              </div>
            ))}
          </div>

          <div className="bill-summary">
            <div className="bill-summary-row">
              <span>Subtotal</span>
              <span>Rs. {session.total_amount}</span>
            </div>
            <div className="bill-summary-row">
              <span>Service Fee</span>
              <span style={{ color: 'var(--primary)' }}>FREE</span>
            </div>
            <div className="bill-total-box">
              <span className="bill-total-label">Total Bill</span>
              <span className="bill-total-value">Rs. {session.total_amount}</span>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handlePayment}
            disabled={processing}
            className="btn-pay"
          >
            {processing ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <CreditCard size={24} />
                Pay with eSewa
              </>
            )}
          </button>

          <p className="bill-footer-note">
            Secure payment powered by Leaf-Life Bank Gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
