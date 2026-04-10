import React, { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Courses from './pages/Courses';
import Staff from './pages/Staff';
import Attendance from './pages/Attendance';
import Events from './pages/Events';
import Reports from './pages/Reports';
import UserProfile from './pages/UserProfile';
import AdminPanel from './pages/AdminPanel';
import { fetchMe } from './api';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('authToken')));
  const [authMode, setAuthMode] = useState('login');
  const [page, setPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  const pages = {
    dashboard: <Dashboard currentUser={currentUser} />,
    students: <Students currentUser={currentUser} />,
    courses: <Courses currentUser={currentUser} />,
    staff: <Staff currentUser={currentUser} />,
    attendance: <Attendance currentUser={currentUser} />,
    events: <Events currentUser={currentUser} />,
    reports: <Reports currentUser={currentUser} />,
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setLoggedIn(Boolean(token));
    if (token) {
      fetchMe().then(data => {
        if (data && data.user) {
          setCurrentUser(data.user);
        }
      }).catch(err => {
        console.error('Failed to fetch user', err);
        localStorage.removeItem('authToken');
        setLoggedIn(false);
      });
    }
  }, [loggedIn]);

  if (!loggedIn) {
    if (authMode === 'signup') {
      return <Signup onLogin={() => setLoggedIn(true)} onSwitchToLogin={() => setAuthMode('login')} />;
    }
    return <Login onLogin={() => setLoggedIn(true)} onSwitchToSignup={() => setAuthMode('signup')} />;
  }

  return (
    <Layout
      page={page}
      setPage={setPage}
      currentUser={currentUser}
      onLogout={() => {
        localStorage.removeItem('authToken');
        setLoggedIn(false);
        setCurrentUser(null);
      }}
    >
      {page === 'userProfile' ? <UserProfile currentUser={currentUser} onUserUpdated={setCurrentUser} /> :
       page === 'adminPanel' && currentUser?.role === 'admin' ? <AdminPanel /> :
       pages[page] || <Dashboard />}
    </Layout>
  );
}
