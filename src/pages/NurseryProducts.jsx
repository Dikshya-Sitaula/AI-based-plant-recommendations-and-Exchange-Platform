import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, Power, Search } from 'lucide-react';
import { deleteNurseryProduct, getNurseryProducts, toggleNurseryProductStatus, formatCurrency } from '../data/portalData';

export default function NurseryProducts() {
  const navigate = useNavigate();
  const nurseryId = localStorage.getItem('leafLifeNurseryId') || '';
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('leafLifeNurseryAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/nursery/signin');
      return;
    }
    setProducts(getNurseryProducts(nurseryId));
  }, [navigate, nurseryId]);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase();
    return products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query));
  }, [products, search]);

  const handleDelete = (productId) => {
    deleteNurseryProduct(productId);
    setProducts(getNurseryProducts(nurseryId));
  };

  const handleToggle = (productId, currentAvailability) => {
    const nextAvailability = currentAvailability === 'In Stock' ? 'Disabled' : 'In Stock';
    toggleNurseryProductStatus(productId, nextAvailability);
    setProducts(getNurseryProducts(nurseryId));
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gap: '1rem' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <p style={{ color: 'var(--primary)', fontWeight: '700', marginBottom: '0.25rem' }}>Plant Management</p>
          <h2 style={{ fontSize: '1.5rem' }}>Your Nursery Products</h2>
        </div>
        <Link to="/nursery/products/add" className="btn-primary" style={{ justifyContent: 'center', gap: '0.5rem' }}>
          <PlusCircle size={18} /> Add Plant
        </Link>
      </div>

      <div className="glass-panel" style={{ borderRadius: '18px', padding: '0.9rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.7rem 0.9rem', borderRadius: '12px' }}>
          <Search size={16} color="var(--primary)" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="glass-panel" style={{ borderRadius: '18px', padding: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <img src={product.image} alt={product.name} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '14px' }} />
              <div>
                <div style={{ fontWeight: '700', fontSize: '1.05rem' }}>{product.name}</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{product.category}</div>
                <div style={{ color: 'var(--primary)', fontWeight: '700', marginTop: '0.2rem' }}>{formatCurrency(product.price)}</div>
                <div style={{ color: product.availability === 'In Stock' ? 'var(--primary)' : '#b54708', marginTop: '0.2rem', fontWeight: '600' }}>{product.availability}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--bg-secondary)', padding: '0.4rem 0.7rem', borderRadius: '999px', fontSize: '0.9rem' }}>Qty {product.quantity}</span>
              <Link to={`/nursery/products/${product.id}/edit`} className="btn-secondary" style={{ padding: '0.7rem 0.9rem' }}>
                <Pencil size={16} />
              </Link>
              <button onClick={() => handleToggle(product.id, product.availability)} className="btn-secondary" style={{ padding: '0.7rem 0.9rem' }}>
                <Power size={16} />
              </button>
              <button onClick={() => handleDelete(product.id)} className="btn-secondary" style={{ padding: '0.7rem 0.9rem', color: '#b54708' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
