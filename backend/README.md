# Student Management System - Backend API

Node.js + Express + MongoDB REST API

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection
├── middleware/
│   └── auth.js            # JWT auth middleware
├── models/
│   ├── User.js            # Admin/User model
│   ├── Student.js         # Student model
│   ├── Course.js          # Course model
│   ├── Staff.js           # Staff model
│   ├── Attendance.js      # Attendance model
│   └── Event.js           # Event model
├── routes/
│   ├── auth.js            # Login, Register, Me
│   ├── students.js        # Students CRUD
│   ├── courses.js         # Courses CRUD
│   ├── staff.js           # Staff CRUD
│   ├── attendance.js      # Attendance CRUD + bulk
│   ├── events.js          # Events CRUD
│   └── dashboard.js       # Stats & Charts
├── seed.js                # Populate sample data
├── server.js              # Main entry point
├── .env.example           # Environment variables template
└── package.json
```

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Setup MongoDB
**Option A - Local MongoDB:**
```bash
# Install MongoDB and start it
mongod
```

**Option B - MongoDB Atlas (Cloud, FREE):**
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Add to .env: MONGO_URI=mongodb+srv://...

### 4. Seed Sample Data
```bash
node seed.js
# Creates admin + sample students, staff, courses, events
```

### 5. Start Server
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

---

## 🔗 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |

### Students
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/students` | Get all (search, filter, paginate) |
| GET | `/api/students/:id` | Get one |
| POST | `/api/students` | Create |
| PUT | `/api/students/:id` | Update |
| DELETE | `/api/students/:id` | Delete |

### Courses
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/courses` | Get all |
| POST | `/api/courses` | Create |
| PUT | `/api/courses/:id` | Update |
| DELETE | `/api/courses/:id` | Delete |

### Staff
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/staff` | Get all |
| POST | `/api/staff` | Create |
| PUT | `/api/staff/:id` | Update |
| DELETE | `/api/staff/:id` | Delete |

### Attendance
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/attendance` | Get records (filter by date, student) |
| GET | `/api/attendance/summary` | Stats & rates |
| POST | `/api/attendance` | Mark single |
| POST | `/api/attendance/bulk` | Mark bulk |
| PUT | `/api/attendance/:id` | Update |
| DELETE | `/api/attendance/:id` | Delete |

### Events
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/events` | Get all |
| GET | `/api/events/upcoming` | Next 5 events |
| POST | `/api/events` | Create |
| PUT | `/api/events/:id` | Update |
| DELETE | `/api/events/:id` | Delete |

### Dashboard
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/dashboard/stats` | Summary counts |
| GET | `/api/dashboard/attendance-chart` | Last 7 days chart |
| GET | `/api/dashboard/top-students` | Top 5 by GPA |
| GET | `/api/dashboard/upcoming-events` | Next 5 events |

---

## 🔑 Authentication

All routes (except login) require JWT token:

```
Authorization: Bearer <your_token>
```

---

## 🖥️ Connect Frontend

In your frontend, update API calls like this:

```js
// src/services/api.js
const API_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Example: fetch students
export const getStudents = async () => {
  const res = await fetch(`${API_URL}/students`, { headers: getHeaders() });
  return res.json();
};
```

---

## 🚀 Deploy

**Backend → Railway / Render (FREE)**
1. Push to GitHub
2. Connect to Railway/Render
3. Add environment variables
4. Deploy!

**Database → MongoDB Atlas (FREE)**
- 512MB free tier, enough for small school

**Frontend → Vercel / Netlify (FREE)**
- Update API_URL to your deployed backend URL
