import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Shield, Bell, Trash2, MapPin, Phone, Lock, Heart, Star, Zap, Clock } from 'lucide-react';
import './SettingsModal.css';

export default function SettingsModal({ open, onClose, userId, currentUserName, onUpdateName }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // { text: '', type: 'success' | 'error' }
  const [profileData, setProfileData] = useState({
    fullName: currentUserName || '',
    email: '',
    phoneNumber: '',
    preferredLocation: '',
    githubHandle: '',
    createdAt: ''
  });
  
  const [stats, setStats] = useState({
    ownedCount: 0,
    totalCO2: "0.0"
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState({
    watering: true,
    newsletter: false,
    marketplace: true
  });

  useEffect(() => {
    if (open && userId) {
      fetchProfile();
      fetchStats();
      setMessage({ text: '', type: '' });
    }
  }, [open, userId]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/auth/profile/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setProfileData({
          fullName: data.full_name || '',
          email: data.email || '',
          phoneNumber: data.phone_number || '',
          preferredLocation: data.preferred_location || '',
          githubHandle: data.github_handle || '',
          createdAt: data.created_at || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const statsRes = await fetch(`http://${window.location.hostname}:5000/api/user/${userId}/stats`);
      const statsData = await statsRes.json();
      setStats({
        ownedCount: statsData.ownedCount || 0,
        totalCO2: statsData.totalCO2 || "0.0"
      });
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]{2,}(\.[a-zA-Z0-9-]{2,})+$/;
    if (profileData.email && !emailRegex.test(profileData.email)) {
      showMessage('Please enter a valid email address with a proper domain (e.g. @gmail.com).', 'error');
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/auth/profile/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fullName: profileData.fullName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          preferredLocation: profileData.preferredLocation,
          githubHandle: profileData.githubHandle
        })
      });
      
      if (response.ok) {
        localStorage.setItem('leafLifeUserName', profileData.fullName);
        if (onUpdateName) onUpdateName(profileData.fullName);
        showMessage('Profile updated successfully!');
      } else {
        const error = await response.json();
        showMessage(error.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showMessage('New passwords do not match', 'error');
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await fetch(`http://${window.location.hostname}:5000/api/auth/profile/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });
      
      if (response.ok) {
        showMessage('Password changed successfully!');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        const error = await response.json();
        showMessage(error.message || 'Failed to change password', 'error');
      }
    } catch (err) {
      showMessage('Network error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://${window.location.hostname}:5000/api/auth/profile/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        if (response.ok) {
          localStorage.clear();
          window.location.href = '/';
        }
      } catch (err) {
        alert('Failed to delete account.');
      }
    }
  };

  if (!open) return null;

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-settings" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="settings-body">
          <aside className="settings-sidebar">
            <button 
              className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Profile</span>
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'memories' ? 'active' : ''}`}
              onClick={() => setActiveTab('memories')}
            >
              <Heart size={18} />
              <span>Memories</span>
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={18} />
              <span>Security</span>
            </button>
            <button 
              className={`settings-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <Bell size={18} />
              <span>Preferences</span>
            </button>
          </aside>
          
          <main className="settings-content">
            {message.text && (
              <div style={{ 
                padding: '1rem', 
                borderRadius: '0.75rem', 
                marginBottom: '1.5rem', 
                backgroundColor: message.type === 'error' ? '#fff1f1' : '#f0fdf4',
                color: message.type === 'error' ? '#ef4444' : '#166534',
                border: `1px solid ${message.type === 'error' ? '#fee2e2' : '#dcfce7'}`,
                fontWeight: '600',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {message.type === 'error' ? <Shield size={16} /> : <Lock size={16} />}
                {message.text}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile}>
                <h3 className="settings-section-title">Public Profile</h3>
                <div className="settings-form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.fullName} 
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email} 
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="yourname@example.com"
                    required
                  />
                </div>
                <div className="settings-form-group">
                  <label><Phone size={14} style={{ marginRight: '5px' }} /> Phone Number</label>
                  <input 
                    type="tel" 
                    value={profileData.phoneNumber} 
                    onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                    placeholder="+977-98XXXXXXXX"
                  />
                </div>
                <div className="settings-form-group">
                  <label><MapPin size={14} style={{ marginRight: '5px' }} /> Preferred Location</label>
                  <input 
                    type="text" 
                    value={profileData.preferredLocation} 
                    onChange={(e) => setProfileData({...profileData, preferredLocation: e.target.value})}
                    placeholder="e.g. Kathmandu, Nepal"
                  />
                </div>
                <div className="settings-actions">
                  <button type="submit" className="save-settings-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div>
                <form onSubmit={handleChangePassword}>
                  <h3 className="settings-section-title">Change Password</h3>
                  <div className="settings-form-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                    />
                  </div>
                  <div className="settings-form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    />
                  </div>
                  <div className="settings-form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    />
                  </div>
                  <div className="settings-actions">
                    <button type="submit" className="save-settings-btn" disabled={loading}>
                      Update Password
                    </button>
                  </div>
                </form>

                <div className="danger-zone">
                  <h3 className="settings-section-title" style={{ color: '#ef4444' }}>Danger Zone</h3>
                  <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}> Once you delete your account, there is no going back. Please be certain. </p>
                  <button onClick={handleDeleteAccount} className="delete-account-btn">
                    <Trash2 size={16} style={{ marginRight: '8px' }} />
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h3 className="settings-section-title">Notifications</h3>
                
                <div className="setting-toggle-row">
                  <div className="toggle-info">
                    <h4>Watering Reminders</h4>
                    <p>Receive alerts when your plants need water.</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.watering} 
                      onChange={() => setNotifications({...notifications, watering: !notifications.watering})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle-row">
                  <div className="toggle-info">
                    <h4>Marketplace Updates</h4>
                    <p>New plants and exclusive discounts.</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.marketplace} 
                      onChange={() => setNotifications({...notifications, marketplace: !notifications.marketplace})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-toggle-row">
                  <div className="toggle-info">
                    <h4>Newsletter</h4>
                    <p>Weekly tips from our plant experts.</p>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.newsletter} 
                      onChange={() => setNotifications({...notifications, newsletter: !notifications.newsletter})}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <h3 className="settings-section-title">App Theme</h3>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '1rem', border: '2px solid var(--primary)', borderRadius: '1rem', flex: 1, textAlign: 'center' }}>
                      <div style={{ width: '30px', height: '30px', background: '#fff', border: '1px solid #ccc', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Light Mode</span>
                    </div>
                    <div style={{ padding: '1rem', border: '2px solid #eee', borderRadius: '1rem', flex: 1, textAlign: 'center', opacity: 0.5 }}>
                      <div style={{ width: '30px', height: '30px', background: '#333', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
                      <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Dark (Soon)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
