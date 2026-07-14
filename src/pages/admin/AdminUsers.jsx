import { useEffect, useState } from 'react';
import { getAdminUsers } from './AdminUtils';
import './AdminModule.css';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getAdminUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch users error:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="admin-content-inner flex items-center justify-center min-h-[400px]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-content-inner animate-fade-in">
      <div className="page-header">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>User Management</h1>
          <p className="module-copy">Manage customer accounts and administrative privileges.</p>
        </div>
      </div>

      <div className="panel-card mt-6">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th><User size={16} /> User</th>
                <th><Mail size={16} /> Email</th>
                <th><Shield size={16} /> Role</th>
                <th><Calendar size={16} /> Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!users || users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="avatar-small">
                          {(user.full_name || user.email || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-semibold">{user.full_name || 'Anonymous User'}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-chip role-${(user.role || 'user').toLowerCase()}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button className="text-button">Edit</button>
                      <button className="text-button text-danger">Deactivate</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
