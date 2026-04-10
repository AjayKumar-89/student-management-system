import React from 'react';
import { Home, Users, BookOpen, Briefcase, ClipboardList, Calendar, BarChart2, Bell, Mail, Settings, LogOut, Search, Shield, User } from 'lucide-react';

const nav = [
  { id: 'dashboard',  icon: <Home size={19} />,        label: 'Dashboard' },
  { id: 'students',   icon: <Users size={19} />,        label: 'Students' },
  { id: 'courses',    icon: <BookOpen size={19} />,     label: 'Courses' },
  { id: 'staff',      icon: <Briefcase size={19} />,    label: 'Staff' },
  { id: 'attendance', icon: <ClipboardList size={19} />,label: 'Attendance' },
  { id: 'events',     icon: <Calendar size={19} />,     label: 'Events' },
  { id: 'reports',    icon: <BarChart2 size={19} />,    label: 'Reports' },
];

export default function Layout({ page, setPage, onLogout, currentUser, children }) {
  const finalNav = [...nav];
  if (currentUser?.role === 'admin') {
    finalNav.push({ id: 'adminPanel', icon: <Shield size={19} />, label: 'Admin Panel' });
  }
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">S</div>
        {finalNav.map(n => (
          <button key={n.id} className={`nav-btn ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)} title={n.label}>
            {n.icon}
          </button>
        ))}
        <div className="nav-spacer" />
        <button className="nav-btn" title="Settings"><Settings size={18} /></button>
        <button className="nav-btn" onClick={onLogout} title="Logout" style={{ color: '#f87171' }}><LogOut size={18} /></button>
      </aside>

      <div className="main">
        <header className="topbar">
          <span className="topbar-title">Student Management System</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="search-bar" style={{ width: 190 }}>
              <Search size={13} style={{ color: 'var(--light)', flexShrink: 0 }} />
              <input placeholder="Quick search..." />
            </div>
            <button className="icon-btn"><Bell size={15} /><span className="badge" /></button>
            <button className="icon-btn"><Mail size={15} /></button>
            <div 
              className="avatar-chip" 
              onClick={() => setPage('userProfile')} 
              style={{ cursor: 'pointer', background: page === 'userProfile' ? 'rgba(37,99,235,0.08)' : undefined }}
              title="My Profile"
            >
              <div className="avatar">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={14} color="#fff" />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>{currentUser?.name || 'User'}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{currentUser?.role || 'Guest'}</span>
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
