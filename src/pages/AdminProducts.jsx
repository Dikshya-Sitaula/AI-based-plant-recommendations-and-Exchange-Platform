import { useEffect, useState } from 'react';
import { getPortalState, formatCurrency } from '../data/portalData';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getPortalState().nurseryProducts);
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gap: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1rem 1.2rem' }}>
        <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.3rem' }}>Admin Product View</p>
        <h2 style={{ fontSize: '1.5rem' }}>All nursery listings in the marketplace</h2>
      </div>

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        {products.map((product) => (
          <div key={product.id} className="glass-panel" style={{ borderRadius: '18px', padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: '700' }}>{product.name}</div>
              <div style={{ color: 'var(--text-secondary)' }}>{product.category}</div>
              <div style={{ color: 'var(--primary)', fontWeight: '700' }}>{formatCurrency(product.price)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Stock: {product.quantity}</div>
              <div style={{ color: product.availability === 'In Stock' ? 'var(--primary)' : '#b54708', fontWeight: '700' }}>{product.availability}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
