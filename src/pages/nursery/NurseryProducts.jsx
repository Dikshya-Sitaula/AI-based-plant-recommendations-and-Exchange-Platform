import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getNurserySession,
  getNurseryProducts,
  removeNurseryProduct,
  toggleNurseryProductAvailable,
  deleteNurseryProductFromServer,
  setNurseryProductAvailabilityOnServer,
} from './NurseryUtils';
import './NurseryModule.css';

export default function NurseryProducts() {
  const navigate = useNavigate();
  const session = getNurserySession();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!session) {
      navigate('/nursery/signin');
      return;
    }
    const fetchProducts = async () => {
      const data = await getNurseryProducts(session.userId);
      setProducts(data);
    };
    fetchProducts();
  }, [navigate, session]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product listing?')) return;
    try {
      await deleteNurseryProductFromServer(id);
      const data = await getNurseryProducts(session.userId);
      setProducts(data);
    } catch (err) {
      console.error('Failed to delete nursery product:', err);
      alert('Could not remove the listing. Please try again.');
    }
  };

  const handleToggle = async (id) => {
    const product = products.find((item) => item.id === id);
    const nextAvailability = !product?.available;

    try {
      await setNurseryProductAvailabilityOnServer(id, nextAvailability);
      const data = await getNurseryProducts(session.userId);
      setProducts(data);
    } catch (err) {
      console.error('Failed to sync product availability:', err);
      alert('Could not update availability on server.');
    }
  };

  return (
    <div className="module-page nursery-page animate-fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">Nursery Products</p>
          <h1>Your plant listings</h1>
          <p className="module-copy">Add new listings or update availability and stock.</p>
        </div>
        <Link to="/nursery/products/add" className="btn-primary btn-sm">Add Plant</Link>
      </div>

      {products.length === 0 ? (
        <div className="empty-panel">
          <p>No products have been added yet.</p>
          <Link to="/nursery/products/add" className="btn-primary">Add your first plant</Link>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Plant</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="table-item-cell">
                      <img src={product.image} alt={product.name} className="table-thumb" />
                      <div>
                        <p className="table-item-title">{product.name}</p>
                        <p className="table-item-subtitle">{product.description.slice(0, 40)}...</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>Rs. {product.price}</td>
                  <td>{product.quantity}</td>
                  <td><span className={`status-chip status-${product.available ? 'active' : 'inactive'}`}>{product.available ? 'Active' : 'Disabled'}</span></td>
                  <td className="actions-cell">
                    <Link to={`/nursery/products/${product.id}/edit`} className="link-link">Edit</Link>
                    <button type="button" className="text-button" onClick={() => handleToggle(product.id)}>
                      {product.available ? 'Disable' : 'Enable'}
                    </button>
                    <button type="button" className="text-button text-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
