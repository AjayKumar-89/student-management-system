import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, BookOpen, GraduationCap, Briefcase, ChevronRight, FileText, CreditCard, UserPlus, Library } from 'lucide-react';
import { attendanceData, activities, notices } from '../data/mockData';
import { fetchDashboardStats, fetchTopStudents, fetchUpcomingEvents } from '../api';

const actIcons = { assignment: <FileText size={15} />, payment: <CreditCard size={15} />, admission: <UserPlus size={15} />, library: <Library size={15} /> };

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalStaff: 0,
    totalCourses: 0,
    upcomingEvents: 0,
    todayAttendance: { present: 0, absent: 0, rate: 0 },
  });
  const [topStudents, setTopStudents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError('');
      try {
        const [statsResult, topResult, eventsResult] = await Promise.all([
          fetchDashboardStats(),
          fetchTopStudents(),
          fetchUpcomingEvents(),
        ]);

        setStats(statsResult.data || {});
        setTopStudents(topResult.data || []);
        setEvents(eventsResult.data || []);
      } catch (err) {
        setError(err.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="page">
      <div className="stat-grid">
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: <Users size={21} />, cls: 'blue' },
          { label: 'Active Students', value: stats.activeStudents, icon: <GraduationCap size={21} />, cls: 'green' },
          { label: 'Courses', value: stats.totalCourses, icon: <BookOpen size={21} />, cls: 'orange' },
          { label: 'Staff Members', value: stats.totalStaff, icon: <Briefcase size={21} />, cls: 'purple' },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-icon">{s.icon}</div>
            <div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-val">{loading ? '…' : s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, padding: 16, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="g-main" style={{ marginBottom: 18 }}>
        <div className="card">
          <div className="card-head"><span className="card-title">Student Attendance</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="weekly" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb' }} name="Weekly" />
                <Line type="monotone" dataKey="monthly" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }} name="Monthly" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Upcoming Events</span></div>
          <div className="card-body" style={{ padding: '10px 18px' }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Loading events…</div>
            ) : events.length ? (
              events.map((ev) => (
                <div key={ev._id || ev.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #f8faff', cursor: 'pointer' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', flexShrink: 0 }}>
                    <BookOpen size={14} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ev.title || ev.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{formatDate(ev.startDate)}</div>
                  </div>
                  <ChevronRight size={15} style={{ color: 'var(--light)' }} />
                </div>
              ))
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No upcoming events</div>
            )}
          </div>
        </div>
      </div>

      <div className="g3">
        <div className="card">
          <div className="card-head"><span className="card-title">Top Students</span></div>
          <div className="card-body" style={{ padding: '10px 18px' }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>Loading top students…</div>
            ) : topStudents.length ? (
              topStudents.map((s) => (
                <div key={s._id || s.studentId} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f8faff' }}>
                  <div className="s-avatar" style={{ background: '#dbeafe', color: '#1d4ed8' }}>{s.name.slice(0, 2).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.grade ? `${s.grade} Grade` : ''}</div>
                  </div>
                  <span className="gpa-badge">GPA {s.gpa}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No top students available</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Recent Activity</span></div>
          <div className="card-body" style={{ padding: '10px 18px' }}>
            {activities.map((a) => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: '1px solid #f8faff' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: a.bg, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  {actIcons[a.icon]}
                </div>
                <div style={{ flex: 1, fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>{a.text}</div>
                <span style={{ fontSize: 11, color: 'var(--light)', whiteSpace: 'nowrap', paddingTop: 1 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">📢 Notice Board</span></div>
          <div className="card-body" style={{ padding: '10px 18px' }}>
            {notices.map((n) => (
              <div key={n.id} style={{ display: 'flex', gap: 10, padding: '10px 0', borderBottom: '1px solid #f8faff', alignItems: 'flex-start' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.color, marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>{n.text}</span>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>View All</button>
          </div>
        </div>
      </div>
    </div>
  );
}
