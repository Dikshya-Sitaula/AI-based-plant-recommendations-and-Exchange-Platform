import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Eye, Heart, ShoppingBag } from 'lucide-react';
import { getNurseryProducts } from '../data/portalData';

export default function NurseryTrending() {
  const navigate = useNavigate();
  const nurseryId = localStorage.getItem('leafLifeNurseryId') || '';
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('leafLifeNurseryAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/nursery/signin');
      return;
    }
    setProducts(getNurseryProducts(nurseryId).sort((a, b) => b.trendingScore - a.trendingScore));
  }, [navigate, nurseryId]);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gap: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1rem 1.2rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.3rem' }}>Trending Products</p>
        <h2 style={{ fontSize: '1.5rem' }}>Top performing plants from your nursery</h2>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {products.map((product) => (
          <div key={product.id} className="glass-panel" style={{ borderRadius: '20px', padding: '0.9rem' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '14px', marginBottom: '0.7rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <h3 style={{ fontSize: '1.05rem' }}>{product.name}</h3>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.35rem 0.5rem', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--primary)', fontWeight: '700' }}>
                <TrendingUp size={14} /> {product.trendingScore}
              </div>
            </div>
            <div style={{ display: 'grid', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShoppingBag size={15} /> Sales: {product.sales}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Eye size={15} /> Views: {product.views}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Heart size={15} /> Wishlist: {product.wishlistCount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
