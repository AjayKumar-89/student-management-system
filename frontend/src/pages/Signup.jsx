import React from 'react';
import SignupForm from '../components/SignupForm';

export default function Signup({ onLogin, onSwitchToLogin }) {
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

          <h1 style={S.bigText}>Join the<br />Platform<br />Today!</h1>
          <p style={S.tagline}>Create an account to manage<br />students, staff, courses & more.</p>

          {/* Stats */}
          <div style={S.statsRow}>
            {[['Fast', 'Setup'], ['Secure', 'Data'], ['100%', 'Reliable']].map(([v, l]) => (
              <div key={l} style={S.statBox}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 500, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={S.right}>
        <SignupForm onLogin={onLogin} onSwitchToLogin={onSwitchToLogin} />

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
    background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 55%, #0f172a 100%)', // slightly different gradient for signup to distinguish
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
    overflowY: 'auto',
  },
};
