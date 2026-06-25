import { useEffect, useState } from 'react';
import { getPortalState } from '../data/portalData';

export default function AdminTrending() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const state = getPortalState();
    setProducts([...state.nurseryProducts].sort((a, b) => b.trendingScore - a.trendingScore));
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gap: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1rem 1.2rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.3rem' }}>Admin Trending Products</p>
        <h2 style={{ fontSize: '1.5rem' }}>Highest performing listings across the marketplace</h2>
      </div>

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        {products.map((product) => (
          <div key={product.id} className="glass-panel" style={{ borderRadius: '18px', padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: '700' }}>{product.name}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{product.category}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--primary)', fontWeight: '700' }}>Score {product.trendingScore}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Sales {product.sales} • Views {product.views}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
