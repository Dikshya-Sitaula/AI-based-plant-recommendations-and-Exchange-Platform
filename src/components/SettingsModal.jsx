import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Shield, Bell, Trash2, MapPin, Phone, Lock, Heart, Star, Zap, Clock, Leaf, CloudRain, Camera, Edit2 } from 'lucide-react';
import './SettingsModal.css';
import { API_BASE_URL } from '../apiConfig';

export default function SettingsModal({ open, onClose, userId, currentUserName, onUpdateName, onUpdateAvatar }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // { text: '', type: 'success' | 'error' }
  const [profileData, setProfileData] = useState({
    fullName: currentUserName || '',
    email: '',
    preferredLocation: '',
    githubHandle: '',
    createdAt: '',
    profileImage: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  
  const [stats, setStats] = useState({
    ownedCount: 0,
    totalCO2: "0.0"
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [avatarFile, setAvatarFile] = useState(null);

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
      const response = await fetch(`${API_BASE_URL}/api/auth/profile/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setProfileData({
          fullName: data.full_name || '',
          email: data.email || '',
          phoneNumber: data.phone_number || '',
          preferredLocation: data.preferred_location || '',
          githubHandle: data.github_handle || '',
          createdAt: data.created_at || '',
          profileImage: data.profile_image || ''
        });
        if (data.profile_image) {
          setAvatarPreview(data.profile_image.startsWith('http') ? data.profile_image : `${API_BASE_URL}${data.profile_image}`);
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const statsRes = await fetch(`${API_BASE_URL}/api/user/${userId}/stats`);
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
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('fullName', profileData.fullName || '');
      formData.append('email', profileData.email || '');
      formData.append('phoneNumber', profileData.phoneNumber || '');
      formData.append('preferredLocation', profileData.preferredLocation || '');
      formData.append('githubHandle', profileData.githubHandle || '');
      
      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile/update`, {
        method: 'POST',
        body: formData
        // Note: Content-Type header should NOT be set manually for FormData so boundary is generated
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('leafLifeUserName', profileData.fullName);
        if (onUpdateName) onUpdateName(profileData.fullName);
        
        if (data.profileImage && onUpdateAvatar) {
          onUpdateAvatar(data.profileImage.startsWith('http') ? data.profileImage : `${API_BASE_URL}${data.profileImage}`);
        }
        
        showMessage('Profile updated successfully!');
        setAvatarFile(null); // Clear selected file after success
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
      const response = await fetch(`${API_BASE_URL}/api/auth/profile/change-password`, {
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
        const response = await fetch(`${API_BASE_URL}/api/auth/profile/delete`, {
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
              className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield size={18} />
              <span>Security</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div>
                    <h3 className="settings-section-title" style={{ marginBottom: '0.25rem' }}>Public Profile</h3>
                    <p style={{ color: '#888', fontSize: '0.875rem' }}>Manage your account details and garden identity.</p>
                  </div>
                  <div className="account-badge">
                    <Star size={14} fill="currentColor" />
                    <span>Member since {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'June 2026'}</span>
                  </div>
                </div>

                {/* Profile Picture Section */}
                <div className="profile-pic-section">
                  <div className="profile-pic-wrapper">
                    <img 
                      src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.fullName)}&background=E2E8CE&color=2D5A27&size=128`} 
                      alt="Profile" 
                      className="profile-avatar-img"
                    />
                    <label htmlFor="avatar-upload" className="avatar-edit-badge">
                      <Camera size={16} />
                      <input 
                        id="avatar-upload"
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setAvatarFile(file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setAvatarPreview(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                    </label>
                  </div>
                  <div className="profile-pic-info">
                    <h4>Profile Picture</h4>
                    <p>JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <div style={{ height: '1.5rem' }}></div>


                {/* Garden Impact Stats */}
                <div className="settings-stats-inline">
                  <div className="stat-inline-card">
                    <div className="stat-inline-icon" style={{ background: '#eef2ef', color: 'var(--primary)' }}>
                      <Leaf size={18} />
                    </div>
                    <div className="stat-inline-info">
                      <span className="stat-inline-label">Plants Owned</span>
                      <span className="stat-inline-value">{stats.ownedCount}</span>
                    </div>
                  </div>
                  <div className="stat-inline-card">
                    <div className="stat-inline-icon" style={{ background: '#f0f7ff', color: '#3b82f6' }}>
                      <CloudRain size={18} />
                    </div>
                    <div className="stat-inline-info">
                      <span className="stat-inline-label">CO2 Reduced</span>
                      <span className="stat-inline-value">{stats.totalCO2}kg</span>
                    </div>
                  </div>
                </div>


                <div style={{ height: '3rem' }}></div> {/* Section Spacer */}

                <div className="settings-form-grid">
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
                </div>

                <div style={{ height: '2.5rem' }}></div> {/* Bottom Spacer */}


                <div className="settings-actions" style={{ marginTop: '1.5rem' }}>

                  <button type="submit" className="save-settings-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>


            )}

            {activeTab === 'security' && (
              <div className="animate-fade-in">
                <form onSubmit={handleChangePassword}>

                  <h3 className="settings-section-title">Change Password</h3>
                  <div style={{ height: '1.5rem' }}></div> {/* Spacer */}

                  <div className="settings-form-grid">
                    <div className="settings-form-group">
                      <label>Current Password</label>
                      <input 
                        type="password" 
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        autoComplete="new-password"
                      />
                    </div>
                    <div className="settings-form-group">
                      <label>Confirm Password</label>
                      <input 
                        type="password" 
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="settings-actions">
                    <button type="submit" className="save-settings-btn" disabled={loading}>
                      Update Password
                    </button>
                  </div>
                </form>

                <div style={{ height: '4rem' }}></div> {/* Large Spacer before Danger Zone */}


                <div className="danger-zone">
                  <h3 className="settings-section-title" style={{ color: '#ef4444' }}>Danger Zone</h3>
                  <div style={{ background: '#fff5f5', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #fee2e2' }}>
                    <p style={{ fontSize: '0.9rem', color: '#b91c1c', marginBottom: '1rem', fontWeight: '500' }}> Once you delete your account, there is no going back. All your garden history, plants, and progress will be permanently erased. </p>
                    <button onClick={handleDeleteAccount} className="delete-account-btn">
                      <Trash2 size={16} style={{ marginRight: '8px' }} />
                      Delete Account
                    </button>
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
