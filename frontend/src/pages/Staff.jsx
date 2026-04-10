import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { createStaff, deleteStaff, fetchStaff, updateStaff } from '../api';

function initialsFromName(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function randomColor(name) {
  const colors = ['#2563eb', '#059669', '#7c3aed', '#d97706', '#0891b2', '#ef4444'];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function StaffModal({ member, onSave, onClose }) {
  const [form, setForm] = useState(
    member || { name: '', role: '', email: '', phone: '', status: 'Active', joined: '' }
  );

  const handleSubmit = () => {
    if (!form.name || !form.role) return;
    onSave({
      ...form,
      designation: form.role,
      department: form.department || '',
      dateOfJoining: form.joined || new Date().toISOString().slice(0, 10),
      avatar: initialsFromName(form.name),
      color: member?.color || randomColor(form.name),
      id: member?.id,
    });
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">{member ? 'Edit Staff Member' : 'Add Staff Member'}</span>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                className="form-input"
                placeholder="Dr. Jane Smith"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <input
                className="form-input"
                placeholder="Math Teacher"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="jane@school.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-input"
                placeholder="+1 555-0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-input filter-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Joining Date</label>
              <input
                className="form-input"
                type="date"
                value={form.joined}
                onChange={(e) => setForm({ ...form, joined: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{member ? 'Update' : 'Add Member'}</button>
        </div>
      </div>
    </div>
  );
}

function mapStaff(item) {
  return {
    id: item._id,
    name: item.name,
    role: item.designation || item.role || '',
    email: item.email || '',
    phone: item.phone || '',
    joined: item.dateOfJoining ? new Date(item.dateOfJoining).toISOString().slice(0, 10) : '',
    status: item.status || 'Active',
    avatar: initialsFromName(item.name),
    color: randomColor(item.name),
  };
}

export default function Staff({ currentUser }) {
  const isAdmin = currentUser?.role === 'admin';
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchStaff();
        setStaff(result.data.map(mapStaff));
      } catch (err) {
        setError(err.message || 'Could not load staff');
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, []);

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      designation: data.role,
      department: data.department || '',
      dateOfJoining: data.joined || new Date().toISOString().slice(0, 10),
      status: data.status,
    };

    try {
      if (modal === 'add') {
        const result = await createStaff(payload);
        setStaff((prev) => [...prev, mapStaff(result.data)]);
      } else {
        const result = await updateStaff(data.id, payload);
        setStaff((prev) => prev.map((member) => (member.id === data.id ? mapStaff(result.data) : member)));
      }
      setModal(null);
    } catch (err) {
      alert(err.message || 'Could not save staff member');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      await deleteStaff(id);
      setStaff((prev) => prev.filter((member) => member.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete staff member');
    }
  };

  const statusPill = (st) => {
    if (st === 'Active') return 'pill-green';
    if (st === 'On Leave') return 'pill-yellow';
    return 'pill-red';
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">Staff</div>
          <div className="page-sub">{staff.length} staff members</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Staff
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total Staff', value: staff.length, color: '#2563eb' },
          { label: 'Active', value: staff.filter((s) => s.status === 'Active').length, color: '#10b981' },
          { label: 'On Leave', value: staff.filter((s) => s.status === 'On Leave').length, color: '#f59e0b' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 10, height: 40, borderRadius: 99, background: s.color }} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, padding: 16, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <div className="search-bar" style={{ width: 250 }}>
            <Search size={14} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
            <input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Role</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32 }}>Loading staff…</td></tr>
              ) : filtered.length ? (
                filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="s-avatar" style={{ background: s.color + '20', color: s.color }}>{s.avatar}</div>
                        <span style={{ fontWeight: 600 }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.role}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.phone}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.joined}</td>
                    <td><span className={`pill ${statusPill(s.status)}`}>{s.status}</span></td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="icon-btn" onClick={() => setModal(s)}><Pencil size={14} /></button>
                          <button className="icon-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(s.id)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No staff found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <StaffModal member={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
