import React, { useState } from 'react';
import { register } from '../api';

function SignupForm({ onLogin, onSwitchToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register(form.name, form.email, form.password, form.role);
      localStorage.setItem('authToken', result.token);
      onLogin(); // Auto-login after successful signup
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.formCard}>
      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <div style={S.welcomeBadge}>New here? ✨</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 10, marginBottom: 6 }}>Create an Account</h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>Enter your details below to register.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={S.label}>Full Name</label>
          <div style={S.inputWrap}>
            <span style={S.inputIcon}>📝</span>
            <input
              style={S.input}
              type="text"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label style={S.label}>Email</label>
          <div style={S.inputWrap}>
            <span style={S.inputIcon}>📧</span>
            <input
              style={S.input}
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label style={S.label}>Role</label>
          <div style={S.inputWrap}>
            <span style={S.inputIcon}>💼</span>
            <select
              style={S.input}
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              required
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </div>

        <div>
          <label style={S.label}>Password</label>
          <div style={S.inputWrap}>
            <span style={S.inputIcon}>🔒</span>
            <input
              style={S.input}
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength="6"
            />
          </div>
        </div>

        {error && (
          <div style={S.errorBox}>⚠️ {error}</div>
        )}

        <button type="submit" style={S.loginBtn} disabled={loading}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              <span style={S.spinner} /> Registering...
            </span>
          ) : 'Sign Up →'}
        </button>
      </form>

      <div style={S.switchContainer}>
        <span style={S.switchText}>Already have an account? </span>
        <button type="button" onClick={onSwitchToLogin} style={S.switchLink}>
          Log in here
        </button>
      </div>
    </div>
  );
}

const S = {
  formCard: {
    background: '#fff',
    borderRadius: 20,
    padding: '36px 36px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 8px 40px rgba(0,0,0,0.09)',
    border: '1px solid #e8eef8',
  },
  welcomeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    background: '#eff6ff',
    color: '#2563eb',
    fontSize: 12,
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 99,
    border: '1px solid #bfdbfe',
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: '#475569',
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    background: '#f8faff',
    transition: 'all .15s',
    overflow: 'hidden',
  },
  inputIcon: {
    padding: '0 12px',
    fontSize: 15,
    flexShrink: 0,
    lineHeight: 1,
  },
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '11px 12px 11px 0',
    fontSize: 13,
    color: '#0f172a',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    appearance: 'none',
    width: '100%',
  },
  loginBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all .18s',
    letterSpacing: '0.01em',
    boxShadow: '0 4px 16px rgba(15,23,42,0.3)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    display: 'flex',
    justifyContent: 'center',
    marginTop: 8,
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 9,
    padding: '10px 13px',
    fontSize: 13,
    color: '#dc2626',
    fontWeight: 500,
  },
  spinner: {
    display: 'inline-block',
    width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid #fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  switchContainer: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 13,
  },
  switchText: {
    color: '#64748b',
  },
  switchLink: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
    fontSize: 13,
    fontFamily: 'inherit',
    textDecoration: 'underline',
  },
};

export default SignupForm;
