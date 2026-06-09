import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Leaf,
  Lock,
  Mail,
  X,
} from 'lucide-react';
import './AuthModal.css';
import logo from '../assets/Leaf and Life logo.png';

export default function AuthModal({ open, onClose, onSuccess }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  const [mode, setMode] = useState('signIn'); // 'signIn' | 'create'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Password criteria logic
  const passwordCriteria = {
    length: password.length >= 6,
    alphanumeric: /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const canSubmit = useMemo(() => {
    const hasEmail = email.trim().length > 0;
    const isPasswordValid = passwordCriteria.length && passwordCriteria.alphanumeric && passwordCriteria.special;
    
    if (mode === 'signIn') return hasEmail && password.length > 0;
    return fullName.trim() !== '' && hasEmail && isPasswordValid && confirmPassword === password;
  }, [email, password, confirmPassword, mode, passwordCriteria, fullName]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setError('');
    setFullName('');
    setSubmitting(false);
    setTimeout(() => firstFieldRef.current?.focus(), 0);
  }, [open]);

  if (!open) return null;

  const submitLabel = mode === 'signIn' ? 'Sign Into Leaf & Life' : 'Create My Account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailTrimmed = email.trim();

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailTrimmed) || emailTrimmed.includes('@.')) {
      setError('invalid username');
      firstFieldRef.current?.focus();
      return;
    }

    if (mode === 'create') {
      if (!fullName.trim()) {
        setError('Full Name is required.');
        return;
      }
      if (!passwordCriteria.length || !passwordCriteria.special || !passwordCriteria.alphanumeric) {
        setError('Password does not meet criteria.');
        return;
      }
      if (password !== confirmPassword) {
        setError('invalid password');
        return;
      }
    }

    setSubmitting(true);
    try {
      const endpoint = mode === 'signIn' ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(`http://${window.location.hostname}:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: mode === 'create' ? fullName : undefined,
          email: emailTrimmed,
          password,
          confirmPassword: mode === 'create' ? confirmPassword : undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Something went wrong.');
        return;
      }

      onSuccess?.({ email: emailTrimmed, rememberMe, mode, fullName: data.fullName, userId: data.userId });
    } catch (err) {
      setError('Could not connect to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="am-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="am-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="am-decor am-decor-1" aria-hidden="true" />
        <div className="am-decor am-decor-2" aria-hidden="true" />
        <div className="am-decor am-decor-3" aria-hidden="true" />

        <header className="am-header">
          <div className="am-brand">
            <span className="am-brand-mark" aria-hidden="true">
              <img src={logo} alt="" className="am-brand-img" />
            </span>
            <span className="am-brand-text">Leaf &amp; Life</span>
          </div>
          <h2 className="am-title" id={titleId}>
            {mode === 'signIn' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          <p className="am-subtitle">
            {mode === 'signIn'
              ? 'Your plants missed you while you were away.'
              : 'Join the community and grow smarter, together.'}
          </p>
        </header>

        <div className="am-card">
          <div className="am-toggle" role="tablist" aria-label="Auth mode">
            <button
              type="button"
              className={mode === 'signIn' ? 'am-toggle-btn is-active' : 'am-toggle-btn'}
              role="tab"
              aria-selected={mode === 'signIn'}
              onClick={() => setMode('signIn')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={mode === 'create' ? 'am-toggle-btn is-active' : 'am-toggle-btn'}
              role="tab"
              aria-selected={mode === 'create'}
              onClick={() => setMode('create')}
            >
              Create Account
            </button>
          </div>

          <form className="am-form" onSubmit={handleSubmit}>
            {mode === 'create' && (
              <div className="am-field">
                <label className="am-label" htmlFor="am-fullname">Full Name</label>
                <div className="am-input-wrap">
                  <span className="am-icon" aria-hidden="true"><Leaf size={18} /></span>
                  <input
                    id="am-fullname"
                    ref={firstFieldRef}
                    className="am-input"
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="am-field">
              <label className="am-label" htmlFor="am-email">Email Address</label>
              <div className="am-input-wrap">
                <span className="am-icon" aria-hidden="true"><Mail size={18} /></span>
                <input
                  id="am-email"
                  ref={mode === 'signIn' ? firstFieldRef : null}
                  className="am-input"
                  type="email"
                  autoComplete="email"
                  placeholder="hello@sproutemail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="am-field">
              <div className="am-label-row">
                <label className="am-label" htmlFor="am-password">Password</label>
                <button
                  type="button"
                  className="am-link"
                  onClick={() => setError('Password reset isn’t wired yet.')}
                >
                  Forgot password?
                </button>
              </div>
              <div className="am-input-wrap">
                <span className="am-icon" aria-hidden="true"><Lock size={18} /></span>
                <input
                  id="am-password"
                  className="am-input"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="am-icon-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {mode === 'create' && (
                <div className="am-criteria">
                  <span className={passwordCriteria.length ? 'is-valid' : ''}>min. 6 char</span>,{' '}
                  <span className={passwordCriteria.alphanumeric ? 'is-valid' : ''}>alphanumeric</span>,{' '}
                  <span className={passwordCriteria.special ? 'is-valid' : ''}>1 special character</span>
                </div>
              )}
            </div>

            {mode === 'create' && (
              <div className="am-field">
                <label className="am-label" htmlFor="am-confirm">Confirm Password</label>
                <div className="am-input-wrap">
                  <span className="am-icon" aria-hidden="true"><Lock size={18} /></span>
                  <input
                    id="am-confirm"
                    className="am-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="am-icon-btn"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <div className="am-meta">
              <label className="am-check">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <div className="am-security">
                <Leaf size={14} />
                <span>Secure sign-in</span>
              </div>
            </div>

            {error && (
              <div className="am-error" role="alert" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button className="am-submit" type="submit" disabled={!canSubmit || submitting}>
              {submitting ? 'Please wait…' : submitLabel}
            </button>
          </form>

          <div className="am-continue-separator" role="separator" aria-orientation="horizontal">
            <span className="am-continue-separator-line" aria-hidden="true" />
            <span className="am-continue-separator-text">or continue with</span>
            <span className="am-continue-separator-line" aria-hidden="true" />
          </div>

          <div className="am-social-icon-row">
            <button
              type="button"
              className="am-social-icon-btn am-social-icon-btn-google"
              aria-label="Continue with Google"
              onClick={() => setError('Google sign-in isn’t wired yet.')}
            >
              <GoogleMark className="am-social-svg" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="am-social-icon-btn am-social-icon-btn-apple"
              aria-label="Continue with Apple"
              onClick={() => setError('Apple sign-in isn’t wired yet.')}
            >
              <AppleMark className="am-social-svg am-social-svg-apple" />
            </button>
          </div>

          <div className="am-phone-wrap">
            <button
              type="button"
              className="am-phone-link"
              onClick={() => setError('Phone sign-in isn’t wired yet.')}
            >
              Continue with Phone Number
            </button>
          </div>

          <footer className="am-footer">
            <p className="am-footer-text">
              {mode === 'signIn' ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              type="button"
              className="am-footer-cta"
              onClick={() => setMode((m) => (m === 'signIn' ? 'create' : 'signIn'))}
            >
              {mode === 'signIn' ? 'Join the Leaf & Life Community' : 'Back to Sign In'}
            </button>
          </footer>
        </div>

        <button type="button" className="am-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

/** Official multicolor Google “G” mark (brand colors). */
function GoogleMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="28" height="28" focusable="false">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/** Apple logo mark (monochrome silhouette, 24×24). */
function AppleMark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="28"
      height="28"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#ffffff"
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
      />
    </svg>
  );
}

