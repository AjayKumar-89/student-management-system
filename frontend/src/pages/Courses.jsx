import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, BookOpen } from 'lucide-react';
import { createCourse, deleteCourse, fetchCourses, updateCourse } from '../api';

function buildCourseCode(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase())
    .filter(Boolean)
    .join('-')
    .slice(0, 12);
}

function CourseModal({ course, onSave, onClose }) {
  const [form, setForm] = useState(
    course || { name: '', teacher: '', students: '', schedule: '', status: 'Active', room: '' }
  );

  const handleSubmit = () => {
    if (!form.name || !form.teacher) return;
    onSave({
      ...form,
      students: parseInt(form.students, 10) || 0,
      code: course?.code || buildCourseCode(form.name),
      id: course?.id,
    });
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">{course ? 'Edit Course' : 'Add New Course'}</span>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Course Name *</label>
              <input
                className="form-input"
                placeholder="Mathematics"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Teacher *</label>
              <input
                className="form-input"
                placeholder="Dr. Smith"
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Students</label>
              <input
                className="form-input"
                type="number"
                placeholder="30"
                value={form.students}
                onChange={(e) => setForm({ ...form, students: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Room</label>
              <input
                className="form-input"
                placeholder="A101"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
              />
            </div>
            <div className="form-group full">
              <label className="form-label">Schedule</label>
              <input
                className="form-input"
                placeholder="Mon/Wed 9:00 AM"
                value={form.schedule}
                onChange={(e) => setForm({ ...form, schedule: e.target.value })}
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
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{course ? 'Update' : 'Add Course'}</button>
        </div>
      </div>
    </div>
  );
}

const courseColors = ['#2563eb', '#059669', '#7c3aed', '#d97706', '#ef4444', '#0891b2'];

function mapCourse(item) {
  return {
    id: item._id,
    name: item.name,
    teacher: item.instructor || item.teacher || '',
    students: item.enrolled ?? item.students ?? 0,
    schedule: item.schedule || '',
    room: item.room || '',
    status: item.status || 'Active',
    code: item.code || '',
  };
}

export default function Courses({ currentUser }) {
  const isAdmin = currentUser?.role === 'admin';
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchCourses();
        setCourses(result.data.map(mapCourse));
      } catch (err) {
        setError(err.message || 'Could not load courses');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.teacher.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data) => {
    const payload = {
      name: data.name,
      code: data.code,
      instructor: data.teacher,
      enrolled: data.students,
      schedule: data.schedule,
      room: data.room,
      status: data.status,
    };

    try {
      if (modal === 'add') {
        const result = await createCourse(payload);
        setCourses((prev) => [...prev, mapCourse(result.data)]);
      } else {
        const result = await updateCourse(data.id, payload);
        setCourses((prev) => prev.map((course) => (course.id === data.id ? mapCourse(result.data) : course)));
      }
      setModal(null);
    } catch (err) {
      alert(err.message || 'Could not save course');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((course) => course.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete course');
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">Courses</div>
          <div className="page-sub">{courses.length} courses available</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Course
          </button>
        )}
      </div>

      <div className="filter-row">
        <div className="search-bar" style={{ width: 260 }}>
          <Search size={14} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
          <input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="tabs" style={{ width: 'auto', marginBottom: 0 }}>
          <button className={`tab ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>Grid</button>
          <button className={`tab ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}>Table</button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, padding: 16, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>Loading courses…</div>
          ) : filtered.length ? (
            filtered.map((c, i) => (
              <div key={c.id} className="card" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ height: 6, background: courseColors[i % courseColors.length], borderRadius: '16px 16px 0 0' }} />
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: courseColors[i % courseColors.length] + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: courseColors[i % courseColors.length] }}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.teacher}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                    <span className="pill pill-blue">{c.students} Students</span>
                    <span className={`pill ${c.status === 'Active' ? 'pill-green' : 'pill-red'}`}>{c.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>📅 {c.schedule}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>🏫 Room: {c.room}</div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                      <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setModal(c)}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', justifyContent: 'center' }} onClick={() => handleDelete(c.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No courses found</div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Teacher</th>
                  <th>Students</th>
                  <th>Schedule</th>
                  <th>Room</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32 }}>Loading courses…</td></tr>
                ) : filtered.length ? (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{c.teacher}</td>
                      <td>{c.students}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{c.schedule}</td>
                      <td>{c.room}</td>
                      <td><span className={`pill ${c.status === 'Active' ? 'pill-green' : 'pill-red'}`}>{c.status}</span></td>
                      {isAdmin && (
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="icon-btn" onClick={() => setModal(c)}><Pencil size={14} /></button>
                            <button className="icon-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No courses found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && <CourseModal course={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
