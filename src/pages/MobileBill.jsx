import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ShoppingBag, CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

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
        const response = await fetch(`${API_BASE_URL}/api/payment/bill/${sessionId}`);
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
        const response = await fetch(`${API_BASE_URL}/api/payment/complete/${sessionId}`, {
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fbf9', padding: '2rem' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
      <p style={{ marginTop: '1rem', fontWeight: '600', color: '#666' }}>Loading your bill...</p>
    </div>
  );

  if (status === 'error' || !session) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '2rem', textAlign: 'center' }}>
      <XCircle size={64} color="#ff4b4b" />
      <h2 style={{ marginTop: '1.5rem', fontWeight: '800' }}>Bill Not Found</h2>
      <p style={{ color: '#666', marginTop: '0.5rem' }}>This payment session may have expired or is invalid.</p>
      <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '2rem', width: '100%' }}>Return Home</button>
    </div>
  );

  if (status === 'completed') return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '2rem', textAlign: 'center' }}>
      <div style={{ width: '100px', height: '100px', background: '#eef2ef', color: '#2e603a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
        <CheckCircle size={64} />
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#1a1a1a' }}>Payment Successful!</h1>
      <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.6' }}>
        Your transaction for <b>Rs. {session.total_amount}</b> has been processed via eSewa.
      </p>
      <div style={{ marginTop: '3rem', width: '100%' }}>
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', borderRadius: '9999px' }}>Go to Dashboard</button>
        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#999' }}>You can close this window now.</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f0f4f1', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        {/* Header */}
        <div style={{ background: 'var(--gradient-primary)', padding: '2.5rem 1.5rem', textAlign: 'center', color: 'white' }}>
          <ShoppingBag size={40} style={{ marginBottom: '1rem', opacity: 0.9 }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Payment Summary</h2>
          <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.5rem' }}>Order #{session.id.split('-')[1]}</p>
        </div>

        {/* Bill Items */}
        <div style={{ padding: '2rem 1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#444' }}>Items in your cart</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {session.cart_items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img 
                  src={item.image?.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`} 
                  alt={item.name} 
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>{item.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#888' }}>Quantity: {item.quantity}</p>
                </div>
                <div style={{ fontWeight: '700', color: '#1a1a1a' }}>
                  {item.price}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '2px dashed #eee', margin: '2rem 0', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ color: '#888', fontWeight: '500' }}>Subtotal</span>
              <span style={{ fontWeight: '600' }}>Rs. {session.total_amount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ color: '#888', fontWeight: '500' }}>Service Fee</span>
              <span style={{ fontWeight: '600', color: '#2e603a' }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fbf9', padding: '1.25rem', borderRadius: '1rem' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Bill</span>
              <span style={{ fontWeight: '900', fontSize: '1.5rem', color: 'var(--primary)' }}>Rs. {session.total_amount}</span>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handlePayment}
            disabled={processing}
            style={{ 
              width: '100%', 
              padding: '1.25rem', 
              borderRadius: '9999px', 
              background: '#41a124', // eSewa Green
              color: 'white', 
              border: 'none', 
              fontWeight: '800', 
              fontSize: '1.2rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.75rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(65, 161, 36, 0.2)',
              transition: 'all 0.2s ease'
            }}
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

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: '#999' }}>
            Secure payment powered by Leaf-Life Bank Gateway.
          </p>
        </div>
      </div>
    </div>
  );
}
