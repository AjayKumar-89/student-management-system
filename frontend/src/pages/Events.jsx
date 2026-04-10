import React, { useEffect, useState } from 'react';
import { Plus, X, Calendar, Trash2 } from 'lucide-react';
import { createEvent, deleteEvent, fetchEvents, updateEvent } from '../api';

const typeColors = { Academic: '#2563eb', Meeting: '#7c3aed', Sports: '#10b981', Cultural: '#d97706', Holiday: '#ef4444', Exam: '#f59e0b', Other: '#6b7280' };

function EventModal({ event, onSave, onClose }) {
  const [form, setForm] = useState(
    event || { name: '', date: '', type: 'Academic', description: '', organizer: '', venue: '' }
  );

  const handleSubmit = () => {
    if (!form.name || !form.date) return;
    onSave({
      ...form,
      id: event?.id,
    });
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <span className="modal-title">{event ? 'Edit Event' : 'Add Event'}</span>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Event Name *</label>
              <input
                className="form-input"
                placeholder="Science Fair"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-input filter-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                {Object.keys(typeColors).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Organizer</label>
              <input
                className="form-input"
                placeholder="Dr. Smith"
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Venue</label>
              <input
                className="form-input"
                placeholder="Main Hall"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
              />
            </div>
            <div className="form-group full">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Event details..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {event ? 'Update' : 'Add Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

function mapEvent(item) {
  return {
    id: item._id,
    name: item.title,
    date: item.startDate ? new Date(item.startDate).toISOString().slice(0, 10) : '',
    type: item.type || 'Other',
    description: item.description || '',
    organizer: item.organizer || '',
    venue: item.location || '',
  };
}

export default function Events({ currentUser }) {
  const isAdmin = currentUser?.role === 'admin';
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await fetchEvents();
        setEvents(result.data.map(mapEvent));
      } catch (err) {
        setError(err.message || 'Could not load events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filtered = filter === 'All' ? events : events.filter((e) => e.type === filter);

  const handleSave = async (data) => {
    const payload = {
      title: data.name,
      startDate: data.date,
      type: data.type,
      description: data.description,
      organizer: data.organizer,
      location: data.venue,
    };

    try {
      if (modal === 'add') {
        const result = await createEvent(payload);
        setEvents((prev) => [...prev, mapEvent(result.data)]);
      } else {
        const result = await updateEvent(data.id, payload);
        setEvents((prev) => prev.map((event) => (event.id === data.id ? mapEvent(result.data) : event)));
      }
      setModal(null);
    } catch (err) {
      alert(err.message || 'Could not save event');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete event');
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">Events</div>
          <div className="page-sub">{events.length} upcoming events</div>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            <Plus size={16} /> Add Event
          </button>
        )}
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, padding: 16, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="filter-row">
        {['All', ...Object.keys(typeColors)].map((t) => (
          <button
            key={t}
            className={`btn ${filter === t ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>Loading events…</div>
        ) : filtered.length ? (
          filtered
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((ev) => {
              const color = typeColors[ev.type] || '#2563eb';
              const d = new Date(ev.date);
              return (
                <div key={ev.id} className="card" style={{ overflow: 'visible' }}>
                  <div
                    style={{
                      background: color,
                      borderRadius: '16px 16px 0 0',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.75)',
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {ev.type}
                      </div>
                      <div style={{ color: 'white', fontWeight: 700, fontSize: 16, marginTop: 4 }}>
                        {ev.name}
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: 10,
                        padding: '6px 10px',
                        textAlign: 'center',
                        minWidth: 44,
                      }}
                    >
                      <div style={{ color: 'white', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>
                        {d.getDate()}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: 600 }}>
                        {d.toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
                      {ev.description}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>👤 {ev.organizer}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>📍 {ev.venue}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        📅 {d.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ flex: 1, justifyContent: 'center' }}
                          onClick={() => setModal(ev)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => handleDelete(ev.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            No events found
          </div>
        )}
      </div>

      {modal && <EventModal event={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}
