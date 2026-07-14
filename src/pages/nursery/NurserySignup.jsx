import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerNurseryUser, setNurserySession } from './NurseryUtils';
import './NurseryModule.css';

export default function NurserySignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nurseryName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = await registerNurseryUser({
      nurseryName: form.nurseryName,
      ownerName: form.ownerName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      password: form.password,
    });

    if (result.error) {
      setError(result.error);
      return;
    }

    setNurserySession(result.user.id);
    navigate('/nursery/dashboard');
  };

  return (
    <div className="module-page nursery-page auth-page animate-fade-in">
      <div className="module-panel auth-panel wide-panel">
        <h1>Nursery Sign Up</h1>
        <p className="module-copy">Start selling plants, tracking orders, and managing inventory from one nursery dashboard.</p>

        <form onSubmit={handleSubmit} className="auth-form grid-form">
          <label className="input-label">
            Nursery Name
            <input
              type="text"
              value={form.nurseryName}
              onChange={handleChange('nurseryName')}
              required
              className="input-field"
            />
          </label>
          <label className="input-label">
            Owner Name
            <input
              type="text"
              value={form.ownerName}
              onChange={handleChange('ownerName')}
              required
              className="input-field"
            />
          </label>
          <label className="input-label">
            Email
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
              className="input-field"
            />
          </label>
          <label className="input-label">
            Phone Number
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange('phone')}
              required
              className="input-field"
            />
          </label>
          <label className="input-label input-full">
            Address
            <input
              type="text"
              value={form.address}
              onChange={handleChange('address')}
              required
              className="input-field"
            />
          </label>
          <label className="input-label">
            Password
            <input
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              required
              className="input-field"
            />
          </label>
          <label className="input-label">
            Confirm Password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              required
              className="input-field"
            />
          </label>

          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn-primary btn-block">Create Nursery Account</button>
        </form>

        <p className="auth-footer">
          Already registered? <Link to="/nursery/signin" className="link-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
