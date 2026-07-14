import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNurserySession, getNurseryProducts } from './NurseryUtils';
import './NurseryModule.css';

export default function NurseryTrending() {
  const navigate = useNavigate();
  const session = getNurserySession();
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (!session) {
      navigate('/nursery/signin');
      return;
    }
    const fetchData = async () => {
      const products = await getNurseryProducts(session.userId);
      // Sort by trending (salesCount + views) locally for now
      const sorted = products
        .slice()
        .sort((a, b) => ((b.salesCount || 0) + (b.views || 0)) - ((a.salesCount || 0) + (a.views || 0)));
      setTrending(sorted);
    };
    fetchData();
  }, [navigate, session]);

  return (
    <div className="module-page nursery-page animate-fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">Trending Plants</p>
          <h1>Top performing listings</h1>
          <p className="module-copy">Review your most popular and highest-converting plants.</p>
        </div>
      </div>

      {trending.length === 0 ? (
        <div className="empty-panel">
          <p>No trending plants available.</p>
        </div>
      ) : (
        <div className="trending-grid">
          {trending.map((product) => (
            <article key={product.id} className="trending-card panel-card">
              <img src={product.image} alt={product.name} className="trending-img" />
              <div className="trending-body">
                <h3>{product.name}</h3>
                <p>{product.category}</p>
                <div className="trending-meta">
                  <span>Sales {product.salesCount || 0}</span>
                  <span>Views {product.views || 0}</span>
                </div>
                <div className="trending-score">Trending score: {(product.salesCount || 0) + (product.views || 0)}</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
