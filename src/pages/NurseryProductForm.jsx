import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNurseryProduct, getNurseryProducts, updateNurseryProduct } from '../data/portalData';

export default function NurseryProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const nurseryId = localStorage.getItem('leafLifeNurseryId') || '';
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image: '',
    availability: 'In Stock',
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('leafLifeNurseryAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/nursery/signin');
      return;
    }

    if (isEdit) {
      const product = getNurseryProducts(nurseryId).find((entry) => entry.id === id);
      if (product) {
        setForm({
          name: product.name,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          description: product.description,
          image: product.image,
          availability: product.availability,
        });
      }
    }
  }, [isEdit, id, nurseryId, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.price || !form.quantity) {
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    if (isEdit) {
      updateNurseryProduct(id, payload);
    } else {
      createNurseryProduct(nurseryId, payload);
    }

    navigate('/nursery/products');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ borderRadius: '24px', padding: '1.2rem' }}>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.7rem' }}>{isEdit ? 'Edit Product' : 'Add a New Plant'}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Populate the product details to make your nursery listing live.</p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.9rem' }}>
          <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ fontWeight: '600' }}>Name</span>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Plant name" style={{ padding: '0.8rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ fontWeight: '600' }}>Category</span>
              <input name="category" value={form.category} onChange={handleChange} placeholder="Indoor / Decor" style={{ padding: '0.8rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
            </label>
          </div>
          <div style={{ display: 'grid', gap: '0.8rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ fontWeight: '600' }}>Price</span>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="899" style={{ padding: '0.8rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
            </label>
            <label style={{ display: 'grid', gap: '0.35rem' }}>
              <span style={{ fontWeight: '600' }}>Quantity</span>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="10" style={{ padding: '0.8rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
            </label>
          </div>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span style={{ fontWeight: '600' }}>Description</span>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the plant" rows="4" style={{ padding: '0.8rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span style={{ fontWeight: '600' }}>Images</span>
            <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" style={{ padding: '0.8rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span style={{ fontWeight: '600' }}>Availability Status</span>
            <select name="availability" value={form.availability} onChange={handleChange} style={{ padding: '0.8rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Disabled">Disabled</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary">Save Plant</button>
            <button type="button" onClick={() => navigate('/nursery/products')} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
