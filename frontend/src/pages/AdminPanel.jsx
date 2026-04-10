import React, { useState, useEffect } from 'react';
import { fetchUsersAdmin, createUserAdmin, updateUserAdmin, deleteUserAdmin } from '../api';
import { UserPlus, Edit3, Trash2, Shield, User, X } from 'lucide-react';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsersAdmin();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const openCreateModal = () => {
    setForm({ name: '', email: '', password: '', role: 'staff' });
    setError('');
    setModalMode('create');
  };

  const openEditModal = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setSelectedUser(user);
    setError('');
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setActionLoading(true);
    try {
      const dataToSubmit = { ...form };
      if (modalMode === 'edit' && !dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      
      if (modalMode === 'create') {
        const data = await createUserAdmin(dataToSubmit);
        setUsers([data.user, ...users]);
      } else {
        const data = await updateUserAdmin(selectedUser._id, dataToSubmit);
        setUsers(users.map(u => u._id === selectedUser._id ? data.user : u));
      }
      closeModal();
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to completely remove this user? This cannot be undone.')) return;
    try {
      await deleteUserAdmin(id);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield color="#c2410c" size={26} /> Admin Control Panel
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Manage system personnel, modify roles, or delete users entirely.</p>
        </div>
        <button onClick={openCreateModal} style={{ ...S.btn, background: '#c2410c', boxShadow: '0 4px 16px rgba(194, 65, 12, 0.3)' }}>
          <UserPlus size={16} /> New User
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e8eef8', boxShadow: '0 8px 40px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading users...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8faff', borderBottom: '1.5px solid #e2e8f0' }}>
                <th style={S.th}>Name</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>Role</th>
                <th style={S.th} align="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid #e8eef8', transition: 'background 0.2s' }}>
                  <td style={S.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 18, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontWeight: 700, fontSize: 13 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={S.td}><span style={{ color: '#475569' }}>{user.email}</span></td>
                  <td style={S.td}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                      background: user.role === 'admin' ? '#fefce8' : user.role === 'teacher' ? '#f0fdf4' : '#eff6ff',
                      color: user.role === 'admin' ? '#a16207' : user.role === 'teacher' ? '#15803d' : '#1d4ed8',
                      border: `1px solid ${user.role === 'admin' ? '#fef08a' : user.role === 'teacher' ? '#bbf7d0' : '#bfdbfe'}`
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={S.td} align="right">
                    <button onClick={() => openEditModal(user)} style={{ ...S.actionBtn, color: '#2563eb', background: '#eff6ff', marginRight: 8 }} title="Edit">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(user._id)} style={{ ...S.actionBtn, color: '#dc2626', background: '#fef2f2' }} title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalMode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 440, borderRadius: 24, boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'scaleIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', borderBottom: '1px solid #e2e8f0', background: '#f8faff' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{modalMode === 'create' ? 'Add New User' : 'Edit User Profile'}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={S.label}>Full Name</label>
                <input style={S.input} type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              
              <div>
                <label style={S.label}>Email Address</label>
                <input style={S.input} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>

              <div>
                <label style={S.label}>Role Allocation</label>
                <select style={S.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})} required>
                  <option value="staff">Staff</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label style={S.label}>{modalMode === 'edit' ? 'Overwrite Password (Optional)' : 'Password'}</label>
                <input style={S.input} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={modalMode === 'create'} minLength={6} placeholder={modalMode === 'edit' ? 'Leave blank to keep existing' : 'Minimum 6 characters'} />
              </div>

              {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>{error}</div>}

              <button type="submit" style={{ ...S.btn, width: '100%', marginTop: 8 }} disabled={actionLoading}>
                {actionLoading ? 'Applying...' : modalMode === 'create' ? 'Create User' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  th: { padding: '16px 24px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left' },
  td: { padding: '16px 24px', fontSize: 14 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all .18s', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', fontFamily: 'inherit' },
  actionBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' },
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' },
  input: { width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, background: '#f8faff', fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: 'inherit', transition: 'border 0.2s', boxSizing: 'border-box' }
};
