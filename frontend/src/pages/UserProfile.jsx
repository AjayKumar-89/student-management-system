import React, { useState, useEffect } from 'react';
import { updateProfile } from '../api';
import { User, Mail, Lock, Shield } from 'lucide-react';

export default function UserProfile({ currentUser, onUserUpdated }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setForm({ name: currentUser.name || '', email: currentUser.email || '', password: '' });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const dataToSubmit = { name: form.name, email: form.email };
      if (form.password.trim() !== '') {
        dataToSubmit.password = form.password;
      }
      const data = await updateProfile(dataToSubmit);
      onUserUpdated(data.user);
      setMessage('Profile updated successfully! ✨');
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ 
          width: 80, height: 80, borderRadius: 40, background: 'linear-gradient(135deg, #2563eb, #1e3a8a)', 
          color: '#fff', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', border: '4px solid #eff6ff', boxShadow: '0 8px 24px rgba(37,99,235,0.2)'
        }}>
          {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>My Profile</h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f8faff', padding: '6px 14px', borderRadius: 99, border: '1px solid #e2e8f0' }}>
          <Shield size={14} color="#2563eb" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role: {currentUser?.role}</span>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, padding: 36, border: '1px solid #e8eef8', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          <div>
            <label style={S.label}>Full Name</label>
            <div style={S.inputWrap}>
              <span style={S.icon}><User size={16} /></span>
              <input 
                style={S.input} type="text" value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} required 
              />
            </div>
          </div>

          <div>
            <label style={S.label}>Email Address</label>
            <div style={S.inputWrap}>
              <span style={S.icon}><Mail size={16} /></span>
              <input 
                style={S.input} type="email" value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})} required 
              />
            </div>
          </div>

          <div>
            <label style={S.label}>New Password (Optional)</label>
            <div style={S.inputWrap}>
              <span style={S.icon}><Lock size={16} /></span>
              <input 
                style={S.input} type="password" value={form.password} placeholder="Leave blank to keep current password"
                onChange={e => setForm({...form, password: e.target.value})} minLength={6}
              />
            </div>
          </div>

          {message && <div style={{ background: '#ecfdf5', color: '#059669', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1px solid #a7f3d0' }}>{message}</div>}
          {error && <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1px solid #fecaca' }}>{error}</div>}

          <button type="submit" style={S.btn} disabled={loading}>
            {loading ? 'Saving Changes...' : 'Update Profile ✨'}
          </button>
        </form>
      </div>
    </div>
  );
}

const S = {
  label: { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' },
  inputWrap: { display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 12, background: '#f8faff', transition: 'all .15s', overflow: 'hidden' },
  icon: { padding: '0 14px', color: '#94a3b8', display: 'flex', alignItems: 'center' },
  input: { flex: 1, border: 'none', background: 'transparent', padding: '12px 14px 12px 0', fontSize: 14, color: '#0f172a', outline: 'none', fontFamily: 'inherit' },
  btn: { padding: '14px', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all .18s', boxShadow: '0 4px 16px rgba(37,99,235,0.35)', marginTop: 10 }
};
