export const students = [
  { id: 1, name: 'Alice Johnson', email: 'alice@school.edu', grade: '10th', gpa: 3.9, status: 'Active', phone: '+1 555-0101', dob: '2008-03-15', address: '12 Maple Ave', enrolled: '2022-08-01', avatar: 'AJ', color: '#2563eb' },
  { id: 2, name: 'Rahul Mehta', email: 'rahul@school.edu', grade: '11th', gpa: 3.8, status: 'Active', phone: '+1 555-0102', dob: '2007-07-22', address: '45 Oak Street', enrolled: '2021-08-01', avatar: 'RM', color: '#059669' },
  { id: 3, name: 'Sara Ahmed', email: 'sara@school.edu', grade: '10th', gpa: 3.7, status: 'Active', phone: '+1 555-0103', dob: '2008-01-09', address: '78 Pine Road', enrolled: '2022-08-01', avatar: 'SA', color: '#7c3aed' },
  { id: 4, name: 'James Wilson', email: 'james@school.edu', grade: '12th', gpa: 3.5, status: 'Active', phone: '+1 555-0104', dob: '2006-11-30', address: '5 Elm Close', enrolled: '2020-08-01', avatar: 'JW', color: '#d97706' },
  { id: 5, name: 'Priya Patel', email: 'priya@school.edu', grade: '9th', gpa: 3.6, status: 'Active', phone: '+1 555-0105', dob: '2009-05-18', address: '23 Birch Lane', enrolled: '2023-08-01', avatar: 'PP', color: '#ef4444' },
  { id: 6, name: 'Chen Wei', email: 'chen@school.edu', grade: '11th', gpa: 3.9, status: 'Inactive', phone: '+1 555-0106', dob: '2007-09-04', address: '90 Cedar Ave', enrolled: '2021-08-01', avatar: 'CW', color: '#0891b2' },
  { id: 7, name: 'Emily Brown', email: 'emily@school.edu', grade: '10th', gpa: 3.4, status: 'Active', phone: '+1 555-0107', dob: '2008-12-21', address: '34 Willow Way', enrolled: '2022-08-01', avatar: 'EB', color: '#be185d' },
  { id: 8, name: 'Marcus Lee', email: 'marcus@school.edu', grade: '12th', gpa: 3.2, status: 'Active', phone: '+1 555-0108', dob: '2006-06-10', address: '67 Ash Drive', enrolled: '2020-08-01', avatar: 'ML', color: '#065f46' },
];

export const courses = [
  { id: 1, name: 'Mathematics', teacher: 'Dr. Smith', students: 32, schedule: 'Mon/Wed 9:00 AM', status: 'Active', room: 'A101' },
  { id: 2, name: 'Science', teacher: 'Prof. Johnson', students: 28, schedule: 'Tue/Thu 10:00 AM', status: 'Active', room: 'Lab 2' },
  { id: 3, name: 'English Literature', teacher: 'Ms. Davis', students: 30, schedule: 'Mon/Wed 11:00 AM', status: 'Active', room: 'B202' },
  { id: 4, name: 'History', teacher: 'Mr. Brown', students: 25, schedule: 'Tue/Thu 2:00 PM', status: 'Active', room: 'C305' },
  { id: 5, name: 'Computer Science', teacher: 'Dr. Chen', students: 22, schedule: 'Fri 9:00 AM', status: 'Active', room: 'Lab 5' },
  { id: 6, name: 'Physical Education', teacher: 'Coach Miller', students: 40, schedule: 'Mon/Wed/Fri 3:00 PM', status: 'Active', room: 'Gym' },
];

export const staff = [
  { id: 1, name: 'Dr. Robert Smith', role: 'Math Teacher', email: 'r.smith@school.edu', phone: '+1 555-1001', status: 'Active', joined: '2018-08-01', avatar: 'RS', color: '#2563eb' },
  { id: 2, name: 'Prof. Lisa Johnson', role: 'Science Teacher', email: 'l.johnson@school.edu', phone: '+1 555-1002', status: 'Active', joined: '2019-01-15', avatar: 'LJ', color: '#059669' },
  { id: 3, name: 'Ms. Karen Davis', role: 'English Teacher', email: 'k.davis@school.edu', phone: '+1 555-1003', status: 'Active', joined: '2020-08-01', avatar: 'KD', color: '#7c3aed' },
  { id: 4, name: 'Mr. Tom Brown', role: 'History Teacher', email: 't.brown@school.edu', phone: '+1 555-1004', status: 'On Leave', joined: '2017-08-01', avatar: 'TB', color: '#d97706' },
  { id: 5, name: 'Dr. Amy Chen', role: 'CS Teacher', email: 'a.chen@school.edu', phone: '+1 555-1005', status: 'Active', joined: '2021-08-01', avatar: 'AC', color: '#0891b2' },
];

export const attendanceData = [
  { day: 'Mon', weekly: 88, monthly: 65 },
  { day: 'Tue', weekly: 85, monthly: 58 },
  { day: 'Wed', weekly: 90, monthly: 78 },
  { day: 'Thu', weekly: 60, monthly: 65 },
  { day: 'Fri', weekly: 56, monthly: 68 },
];

export const events = [
  { id: 1, name: 'Science Fair', date: 'April 25, 2026', type: 'Academic' },
  { id: 2, name: 'Parent-Teacher Meeting', date: 'April 28, 2026', type: 'Meeting' },
  { id: 3, name: 'Sports Day', date: 'May 3, 2026', type: 'Sports' },
  { id: 4, name: 'Annual Day', date: 'May 15, 2026', type: 'Cultural' },
];

export const activities = [
  { id: 1, text: 'Assignment submitted by John', time: '10 mins ago', icon: 'assignment', color: '#2563eb', bg: '#eff6ff' },
  { id: 2, text: 'Fee payment received from Patel family', time: '1 hour ago', icon: 'payment', color: '#059669', bg: '#ecfdf5' },
  { id: 3, text: 'New admission: Emily Brown', time: 'Today', icon: 'admission', color: '#7c3aed', bg: '#f5f3ff' },
  { id: 4, text: 'Library books returned by James', time: 'Yesterday', icon: 'library', color: '#d97706', bg: '#fffbeb' },
];

export const notices = [
  { id: 1, text: 'Semester Exams start from May 10th', color: '#2563eb' },
  { id: 2, text: 'Holiday on May 1st – Labor Day', color: '#10b981' },
  { id: 3, text: 'Fee submission deadline: April 30th', color: '#f59e0b' },
];
