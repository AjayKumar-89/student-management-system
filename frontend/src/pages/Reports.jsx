import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const gradeData = [
  { grade: '9th', students: 320 },
  { grade: '10th', students: 350 },
  { grade: '11th', students: 290 },
  { grade: '12th', students: 290 },
];

const genderData = [
  { name: 'Male', value: 640, color: '#2563eb' },
  { name: 'Female', value: 580, color: '#be185d' },
  { name: 'Other', value: 30, color: '#8b5cf6' },
];

const monthlyAdmissions = [
  { month: 'Aug', admissions: 45 },
  { month: 'Sep', admissions: 12 },
  { month: 'Oct', admissions: 8 },
  { month: 'Nov', admissions: 5 },
  { month: 'Dec', admissions: 2 },
  { month: 'Jan', admissions: 15 },
  { month: 'Feb', admissions: 9 },
  { month: 'Mar', admissions: 7 },
];

const gpaData = [
  { range: '3.5–4.0', count: 280 },
  { range: '3.0–3.5', count: 420 },
  { range: '2.5–3.0', count: 310 },
  { range: '2.0–2.5', count: 180 },
  { range: '<2.0', count: 60 },
];

export default function Reports() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <div className="page-title">Reports & Analytics</div>
          <div className="page-sub">Comprehensive school performance overview</div>
        </div>
        <button className="btn btn-primary">Export PDF</button>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Pass Rate', value: '94.2%', delta: '+2.1%', color: '#10b981' },
          { label: 'Avg GPA', value: '3.24', delta: '+0.12', color: '#2563eb' },
          { label: 'Avg Attendance', value: '87%', delta: '-1.3%', color: '#f59e0b' },
          { label: 'New This Year', value: '103', delta: '+18', color: '#7c3aed' },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: k.delta.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: 600, marginTop: 6 }}>{k.delta} vs last year</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-head"><span className="card-title">Students by Grade</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={gradeData} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
                <Bar dataKey="students" name="Students" radius={[8, 8, 0, 0]}>
                  {gradeData.map((_, i) => <Cell key={i} fill={['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">Gender Distribution</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {genderData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend iconType="circle" iconSize={10} formatter={v => <span style={{ fontSize: 12, fontWeight: 600 }}>{v}</span>} />
                <Tooltip formatter={v => [v, 'Students']} contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head"><span className="card-title">Monthly Admissions</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyAdmissions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="admissions" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 4 }} name="Admissions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><span className="card-title">GPA Distribution</span></div>
          <div className="card-body">
            {gpaData.map((g, i) => (
              <div key={g.range} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>GPA {g.range}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{g.count}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: (g.count / 420 * 100) + '%',
                    background: ['#2563eb', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'][i]
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
