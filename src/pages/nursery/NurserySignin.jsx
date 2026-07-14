import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginNurseryUser, setNurserySession } from './NurseryUtils';
import './NurseryModule.css';

export default function NurserySignin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await loginNurseryUser(email, password);
    if (result.error) {
      setError(result.error);
      return;
    }

    setNurserySession(result.user.id);
    navigate('/nursery/dashboard');
  };

  return (
    <div className="module-page nursery-page auth-page animate-fade-in">
      <div className="module-panel auth-panel">
        <h1>Nursery Sign In</h1>
        <p className="module-copy">Access your nursery dashboard and manage listings, orders, and sales.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="input-label">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nursery@example.com"
              className="input-field"
            />
          </label>

          <label className="input-label">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
              className="input-field"
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn-primary btn-block">Sign In</button>
        </form>

        <p className="auth-footer">
          New nursery? <Link to="/nursery/signup" className="link-link">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
