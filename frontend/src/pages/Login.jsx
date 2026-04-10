import React from 'react';
import LoginForm from '../components/LoginForm';

export default function Login({ onLogin, onSwitchToSignup }) {
  return (
    <div style={S.page}>
      {/* Left panel */}
      <div style={S.left}>
        {/* Floating blobs */}
        <div style={{ ...S.blob, width: 320, height: 320, top: -80, left: -80, background: 'rgba(37,99,235,0.18)' }} />
        <div style={{ ...S.blob, width: 200, height: 200, bottom: 40, left: 60, background: 'rgba(139,92,246,0.15)' }} />
        <div style={{ ...S.blob, width: 150, height: 150, top: '40%', right: -40, background: 'rgba(16,185,129,0.12)' }} />

        <div style={S.leftContent}>
          {/* Logo */}
          <div style={S.logo}>
            <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: -1 }}>S</span>
          </div>

          <h1 style={S.bigText}>Student<br />Management<br />System</h1>
          <p style={S.tagline}>All-in-one platform to manage<br />students, staff, courses & more.</p>

          {/* Stats */}
          <div style={S.statsRow}>
            {[['1,250', 'Students'], ['12', 'Courses'], ['25', 'Staff']].map(([v, l]) => (
              <div key={l} style={S.statBox}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={S.right}>
        <LoginForm onLogin={onLogin} onSwitchToSignup={onSwitchToSignup} />

        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 24 }}>© 2026 · All rights reserved</p>
      </div>
    </div>
  );
}

const S = {
  page: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  left: {
    width: '48%',
    background: 'linear-gradient(145deg, #0d1b3e 0%, #1e3a8a 55%, #1d4ed8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(40px)',
  },
  leftContent: {
    position: 'relative',
    zIndex: 2,
    padding: '0 48px',
  },
  logo: {
    width: 52, height: 52,
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff',
    marginBottom: 32,
  },
  bigText: {
    fontSize: 42,
    fontWeight: 900,
    color: '#fff',
    lineHeight: 1.1,
    letterSpacing: -1,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.7,
    marginBottom: 36,
  },
  statsRow: {
    display: 'flex',
    gap: 12,
  },
  statBox: {
    background: 'rgba(255,255,255,0.09)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: '12px 18px',
    textAlign: 'center',
    minWidth: 80,
  },
  right: {
    flex: 1,
    background: '#f8faff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
  },
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
  input: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    padding: '11px 12px 11px 12px',
    fontSize: 13,
    color: '#0f172a',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  loginBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all .18s',
    letterSpacing: '0.01em',
    boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
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
};
