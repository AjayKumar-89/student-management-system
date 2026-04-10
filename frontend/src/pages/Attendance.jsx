import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchAttendance, fetchAttendanceSummary, fetchStudents } from '../api';

const generateAttendance = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map(week => ({
    week,
    data: days.map(day => ({
      day,
      present: Math.floor(Math.random() * 20 + 75),
      absent: Math.floor(Math.random() * 10 + 5),
    }))
  }));
};

const attendance = generateAttendance();

export default function Attendance() {
  const [summary, setSummary] = useState({ total: 0, present: 0, absent: 0, late: 0, rate: 0 });
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [summaryResult, studentsResult, attendanceResult] = await Promise.all([
          fetchAttendanceSummary(),
          fetchStudents(),
          fetchAttendance({ date: new Date().toISOString().slice(0, 10) }), // today's attendance
        ]);

        setSummary(summaryResult.data);

        // Calculate student attendance (simplified: assume 100 total days, count present)
        const attendanceMap = {};
        attendanceResult.data.forEach(record => {
          const studentId = record.student._id;
          if (!attendanceMap[studentId]) {
            attendanceMap[studentId] = { present: 0, total: 100 }; // assume 100 days
          }
          if (record.status === 'Present') attendanceMap[studentId].present += 1;
        });

        const studentList = studentsResult.data.map(student => ({
          id: student._id,
          name: student.name,
          grade: student.grade,
          avatar: student.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
          color: '#2563eb', // default color
          present: attendanceMap[student._id]?.present || 0,
          total: 100,
        }));

        setStudentAttendance(studentList);
      } catch (err) {
        setError(err.message || 'Could not load attendance data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const weekData = attendance[selectedWeek].data;
  const avgPresent = Math.round(weekData.reduce((a, b) => a + b.present, 0) / weekData.length);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">Attendance</div>
          <div className="page-sub">Track daily and weekly attendance</div>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: 16, padding: 16, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Avg Attendance', value: summary.rate + '%', color: '#2563eb' },
          { label: 'Present Today', value: loading ? '…' : summary.present, color: '#10b981' },
          { label: 'Absent Today', value: loading ? '…' : summary.absent, color: '#ef4444' },
          { label: 'Late Arrivals', value: loading ? '…' : summary.late, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-cols-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-head">
            <span className="card-title">Weekly Overview</span>
            <div style={{ display: 'flex', gap: 6 }}>
              {attendance.map((w, i) => (
                <button key={i} className={`btn btn-sm ${selectedWeek === i ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSelectedWeek(i)}>
                  {w.week}
                </button>
              ))}
            </div>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekData} barGap={4} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="present" name="Present" radius={[6, 6, 0, 0]} fill="#2563eb" />
                <Bar dataKey="absent" name="Absent" radius={[6, 6, 0, 0]} fill="#fca5a5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <span className="card-title">Attendance by Day</span>
          </div>
          <div className="card-body">
            {weekData.map(d => (
              <div key={d.day} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.day}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.present}% present</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: d.present + '%', background: d.present > 80 ? '#10b981' : d.present > 65 ? '#f59e0b' : '#ef4444' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <span className="card-title">Student Attendance Record</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Grade</th>
                <th>Present Days</th>
                <th>Total Days</th>
                <th>Percentage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32 }}>Loading attendance records…</td></tr>
              ) : studentAttendance.length ? (
                studentAttendance.map(s => {
                  const pct = Math.round((s.present / s.total) * 100);
                  const status = pct >= 85 ? 'Excellent' : pct >= 70 ? 'Good' : 'Poor';
                  const pillCls = pct >= 85 ? 'pill-green' : pct >= 70 ? 'pill-yellow' : 'pill-red';
                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="s-avatar" style={{ background: s.color + '20', color: s.color }}>{s.avatar}</div>
                          <span style={{ fontWeight: 600 }}>{s.name}</span>
                        </div>
                      </td>
                      <td>{s.grade}</td>
                      <td style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{s.present}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.total}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: pct + '%', background: pct >= 85 ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace', minWidth: 36 }}>{pct}%</span>
                        </div>
                      </td>
                      <td><span className={`pill ${pillCls}`}>{status}</span></td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No attendance records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
