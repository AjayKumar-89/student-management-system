const API_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthToken = () => localStorage.getItem('authToken');

const authHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || response.statusText || 'Request failed');
  }
  return data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const register = async (name, email, password, role = 'staff') => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  return handleResponse(response);
};

// === Users / Profile (auth needed) ===

export const fetchMe = async () => {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleResponse(response);
};

export const updateProfile = async (data) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// === Admin Access Only ===

export const fetchUsersAdmin = async () => {
  const response = await fetch(`${API_URL}/users`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  return handleResponse(response);
};

export const createUserAdmin = async (user) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
};

export const updateUserAdmin = async (id, user) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
};

export const deleteUserAdmin = async (id) => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });
  return handleResponse(response);
};

export const fetchStudents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/students${query ? `?${query}` : ''}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const createStudent = async (student) => {
  const response = await fetch(`${API_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(student),
  });
  return handleResponse(response);
};

export const updateStudent = async (id, student) => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(student),
  });
  return handleResponse(response);
};

export const deleteStudent = async (id) => {
  const response = await fetch(`${API_URL}/students/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const fetchCourses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/courses${query ? `?${query}` : ''}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const createCourse = async (course) => {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(course),
  });
  return handleResponse(response);
};

export const updateCourse = async (id, course) => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(course),
  });
  return handleResponse(response);
};

export const deleteCourse = async (id) => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const fetchStaff = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/staff${query ? `?${query}` : ''}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const createStaff = async (member) => {
  const response = await fetch(`${API_URL}/staff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(member),
  });
  return handleResponse(response);
};

export const updateStaff = async (id, member) => {
  const response = await fetch(`${API_URL}/staff/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(member),
  });
  return handleResponse(response);
};

export const deleteStaff = async (id) => {
  const response = await fetch(`${API_URL}/staff/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_URL}/dashboard/stats`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const fetchTopStudents = async () => {
  const response = await fetch(`${API_URL}/dashboard/top-students`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const fetchUpcomingEvents = async () => {
  const response = await fetch(`${API_URL}/dashboard/upcoming-events`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const fetchAttendance = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/attendance${query ? `?${query}` : ''}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const fetchAttendanceSummary = async () => {
  const response = await fetch(`${API_URL}/attendance/summary`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const createAttendance = async (record) => {
  const response = await fetch(`${API_URL}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(record),
  });
  return handleResponse(response);
};

export const createBulkAttendance = async (records) => {
  const response = await fetch(`${API_URL}/attendance/bulk`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify({ records }),
  });
  return handleResponse(response);
};

export const updateAttendance = async (id, record) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(record),
  });
  return handleResponse(response);
};

export const deleteAttendance = async (id) => {
  const response = await fetch(`${API_URL}/attendance/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const fetchEvents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/events${query ? `?${query}` : ''}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};

export const createEvent = async (event) => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(event),
  });
  return handleResponse(response);
};

export const updateEvent = async (id, event) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(event),
  });
  return handleResponse(response);
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${API_URL}/events/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  return handleResponse(response);
};