import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { createStudent, deleteStudent, fetchStudents, updateStudent } from '../api';

function generateColor(name) {
  const colors = ['#2563eb', '#059669', '#7c3aed', '#d97706', '#ef4444', '#0891b2', '#be185d'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function generateAvatar(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function StudentModal({ student, onSave, onClose }) {
  const [form, setForm] = useState(
    student || {
      name: '', email: '', grade: '9th', gpa: '3.0', status: 'Active', phone: '', dob: '', address: '',
    }
  );

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    onSave({
      ...form,
      gpa: parseFloat(form.gpa) || 3.0,
      id: student?.id || undefined,
    });
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">{student ? 'Edit Student' : 'Add New Student'}</span>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className="form-input"
                type="email"
                placeholder="john@school.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Grade</label>
              <select
                className="form-input filter-select"
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
              >
                {['9th', '10th', '11th', '12th'].map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">GPA</label>
              <input
                className="form-input"
                type="number"
                min="0"
                max="4"
                step="0.1"
                placeholder="3.5"
                value={form.gpa}
                onChange={(e) => setForm({ ...form, gpa: e.target.value })}
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
              <label className="form-label">Date of Birth</label>
              <input
                className="form-input"
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
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
                <option>Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                className="form-input"
                placeholder="123 Main Street"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{student ? 'Update' : 'Add Student'}</button>
        </div>
      </div>
    </div>
  );
}

function mapStudent(student) {
  return {
    id: student._id,
    name: student.name,
    email: student.email,
    grade: student.grade,
    gpa: student.gpa || 0,
    status: student.status || 'Active',
    phone: student.phone || '',
    dob: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().slice(0, 10) : '',
    address: student.address || '',
    enrolled: student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString('en-US') : '',
    avatar: generateAvatar(student.name),
    color: generateColor(student.name),
  };
}

export default function Students({ currentUser }) {
  const role = currentUser?.role || 'staff';
  const isAdmin = role === 'admin';
  const canAdd = isAdmin || role === 'teacher';
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchStudents();
        setStudents(result.data.map(mapStudent));
      } catch (err) {
        setError(err.message || 'Could not load students');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  const filtered = students.filter((s) => {
    const searchValue = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(searchValue) || s.email.toLowerCase().includes(searchValue);
    const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchGrade && matchStatus;
  });

  const handleSave = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      grade: data.grade,
      gpa: data.gpa,
      status: data.status,
      phone: data.phone,
      dateOfBirth: data.dob || null,
      address: data.address,
    };

    try {
      if (modal === 'add') {
        const result = await createStudent(payload);
        setStudents((prev) => [...prev, mapStudent(result.data)]);
      } else {
        const result = await updateStudent(data.id, payload);
        setStudents((prev) => prev.map((s) => (s.id === data.id ? mapStudent(result.data) : s)));
      }
      setModal(null);
    } catch (err) {
      alert(err.message || 'Could not save student');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete student');
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">Students</div>
          <div className="page-sub">{students.length} total students enrolled</div>
        </div>
        {canAdd && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Student
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-head" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="search-bar" style={{ width: 'auto', flex: 1, minWidth: 180 }}>
            <Search size={14} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
            <input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="filter-select" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
              <option value="All">All Grades</option>
              {['9th', '10th', '11th', '12th'].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="card" style={{ marginBottom: 16, padding: 16, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Grade</th>
                <th>GPA</th>
                <th>Phone</th>
                <th>Enrolled</th>
                <th>Status</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading students…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No students found</td></tr>
              ) : filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="s-avatar" style={{ background: s.color + '20', color: s.color }}>{s.avatar}</div>
                      <span style={{ fontWeight: 600 }}>{s.name}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                  <td>{s.grade}</td>
                  <td>
                    <span className="gpa-badge">{s.gpa}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.phone}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{s.enrolled}</td>
                  <td>
                    <span className={`pill ${s.status === 'Active' ? 'pill-green' : 'pill-red'}`}>
                      {s.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="icon-btn" onClick={() => setModal(s)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="icon-btn" onClick={() => handleDelete(s.id)} title="Delete" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <StudentModal student={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
