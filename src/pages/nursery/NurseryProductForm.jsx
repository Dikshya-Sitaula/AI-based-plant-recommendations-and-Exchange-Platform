import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getNurserySession,
  getNurseryProducts,
  syncNurseryProductToServer,
} from './NurseryUtils';
import './NurseryModule.css';

const categories = ['Indoor', 'Air Purifying', 'Flowering', 'Outdoor', 'Succulent'];

export default function NurseryProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const session = getNurserySession();
  const [form, setForm] = useState({
    name: '',
    category: categories[0],
    price: '',
    quantity: '',
    description: '',
    image: '',
    available: true,
  });
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (!session) {
      navigate('/nursery/signin');
      return;
    }

    if (id) {
      const fetchProduct = async () => {
        const products = await getNurseryProducts(session.userId);
        const product = products.find(p => p.id.toString() === id);
        if (!product) {
          navigate('/nursery/products');
          return;
        }
        setEditingProduct(product);
        setForm({
          name: product.name,
          category: product.type || product.category, // Handle both column names
          price: product.price,
          quantity: product.quantity || 0,
          description: product.description,
          image: product.image,
          available: !!product.available,
        });
      };
      fetchProduct();
    }
  }, [navigate, session, id]);

  const handleChange = (field) => (event) => {
    const value = field === 'available' ? event.target.checked : event.target.value;
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.price) {
      setError('Please complete all required fields.');
      return;
    }

    try {
      await syncNurseryProductToServer(session.userId, {
        id,
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description,
        image: form.image || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=60',
        available: form.available,
      });
      navigate('/nursery/products');
    } catch (syncError) {
      console.error('Nursery product sync error:', syncError);
      setError('Failed to save product. Please try again.');
    }
  };

  return (
    <div className="module-page nursery-page animate-fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">{id ? 'Edit Product' : 'Add Plant'}</p>
          <h1>{id ? 'Update your listing' : 'Create a new plant listing'}</h1>
          <p className="module-copy">Keep your stock, pricing, and availability up to date.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel-card form-panel grid-form">
        <label className="input-label input-full">
          Plant Name
          <input value={form.name} onChange={handleChange('name')} className="input-field" required />
        </label>

        <label className="input-label">
          Category
          <select value={form.category} onChange={handleChange('category')} className="input-field">
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label className="input-label">
          Price (Rs.)
          <input type="number" min="0" value={form.price} onChange={handleChange('price')} className="input-field" required />
        </label>

        <label className="input-label">
          Quantity
          <input type="number" min="0" value={form.quantity} onChange={handleChange('quantity')} className="input-field" required />
        </label>

        <label className="input-label input-full">
          Description
          <textarea value={form.description} onChange={handleChange('description')} className="textarea-field" rows="4" />
        </label>

        <label className="input-label input-full">
          Image URL
          <input value={form.image} onChange={handleChange('image')} className="input-field" placeholder="Paste image URL or leave blank" />
        </label>

        <label className="input-checkbox">
          <input type="checkbox" checked={form.available} onChange={handleChange('available')} />
          <span>Available for sale</span>
        </label>

        {error && <div className="form-error">{error}</div>}

        <div className="button-row">
          <button type="button" className="btn-secondary" onClick={() => navigate('/nursery/products')}>Cancel</button>
          <button type="submit" className="btn-primary">{id ? 'Save Changes' : 'Add Plant'}</button>
        </div>
      </form>
    </div>
  );
}
