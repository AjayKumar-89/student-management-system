const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const Course = require('./models/Course');
const Event = require('./models/Event');
const Attendance = require('./models/Attendance');

const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Student.deleteMany(),
      Staff.deleteMany(),
      Course.deleteMany(),
      Event.deleteMany(),
      Attendance.deleteMany()
    ]);
    console.log('🗑️  Old data cleared');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'ajay@123gmail.com',
      password: 'ajay@123',
      role: 'admin'
    });
    console.log('✅ Admin created → email: ajay@123gmail.com | password: ajay@123');

    // Create students
    const studentData = [
      { name: 'Arjun Sharma', email: 'arjun@student.com', grade: '10', section: 'A', gender: 'Male', gpa: 3.8, status: 'Active', phone: '9876543210', parentName: 'Rajesh Sharma' },
      { name: 'Priya Patel', email: 'priya@student.com', grade: '10', section: 'B', gender: 'Female', gpa: 3.9, status: 'Active', phone: '9876543211', parentName: 'Suresh Patel' },
      { name: 'Rohit Kumar', email: 'rohit@student.com', grade: '11', section: 'A', gender: 'Male', gpa: 3.5, status: 'Active', phone: '9876543212', parentName: 'Mohan Kumar' },
      { name: 'Sneha Gupta', email: 'sneha@student.com', grade: '11', section: 'B', gender: 'Female', gpa: 3.7, status: 'Active', phone: '9876543213', parentName: 'Anil Gupta' },
      { name: 'Vikram Singh', email: 'vikram@student.com', grade: '12', section: 'A', gender: 'Male', gpa: 3.6, status: 'Active', phone: '9876543214', parentName: 'Harpal Singh' },
      { name: 'Anjali Mehta', email: 'anjali@student.com', grade: '12', section: 'B', gender: 'Female', gpa: 3.4, status: 'Active', phone: '9876543215', parentName: 'Deepak Mehta' },
      { name: 'Karan Verma', email: 'karan@student.com', grade: '9', section: 'A', gender: 'Male', gpa: 3.2, status: 'Active', phone: '9876543216', parentName: 'Sanjay Verma' },
      { name: 'Pooja Joshi', email: 'pooja@student.com', grade: '9', section: 'B', gender: 'Female', gpa: 3.9, status: 'Active', phone: '9876543217', parentName: 'Ramesh Joshi' },
    ];
    const students = [];
    for (const data of studentData) {
      const student = await Student.create(data);
      students.push(student);
    }
    console.log(`✅ ${students.length} students created`);

    // Create staff
    const staffData = [
      { name: 'Dr. Rajesh Kumar', email: 'rajesh@staff.com', department: 'Science', designation: 'HOD Science', gender: 'Male', status: 'Active', subjects: ['Physics', 'Chemistry'], phone: '9876500001' },
      { name: 'Mrs. Sunita Sharma', email: 'sunita@staff.com', department: 'Mathematics', designation: 'Senior Teacher', gender: 'Female', status: 'Active', subjects: ['Mathematics'], phone: '9876500002' },
      { name: 'Mr. Amit Patel', email: 'amit@staff.com', department: 'English', designation: 'Teacher', gender: 'Male', status: 'Active', subjects: ['English', 'Literature'], phone: '9876500003' },
      { name: 'Ms. Kavita Singh', email: 'kavita@staff.com', department: 'Social Studies', designation: 'Teacher', gender: 'Female', status: 'Active', subjects: ['History', 'Geography'], phone: '9876500004' },
      { name: 'Mr. Deepak Jain', email: 'deepak@staff.com', department: 'Computer Science', designation: 'HOD CS', gender: 'Male', status: 'Active', subjects: ['Computer Science', 'IT'], phone: '9876500005' },
    ];
    const staff = [];
    for (const data of staffData) {
      const s = await Staff.create(data);
      staff.push(s);
    }
    console.log(`✅ ${staff.length} staff created`);

    // Create courses
    const courseData = [
      { name: 'Mathematics Grade 10', code: 'MATH10', instructor: 'Mrs. Sunita Sharma', grade: '10', credits: 4, capacity: 35, enrolled: 28, status: 'Active', schedule: 'Mon, Wed, Fri - 9:00 AM', room: '101' },
      { name: 'Physics Grade 11', code: 'PHY11', instructor: 'Dr. Rajesh Kumar', grade: '11', credits: 4, capacity: 30, enrolled: 25, status: 'Active', schedule: 'Tue, Thu - 10:00 AM', room: 'Lab 2' },
      { name: 'English Literature Grade 12', code: 'ENG12', instructor: 'Mr. Amit Patel', grade: '12', credits: 3, capacity: 40, enrolled: 35, status: 'Active', schedule: 'Mon-Fri - 11:00 AM', room: '201' },
      { name: 'Computer Science Grade 11', code: 'CS11', instructor: 'Mr. Deepak Jain', grade: '11', credits: 4, capacity: 25, enrolled: 20, status: 'Active', schedule: 'Wed, Fri - 2:00 PM', room: 'Computer Lab' },
      { name: 'History Grade 9', code: 'HIST9', instructor: 'Ms. Kavita Singh', grade: '9', credits: 3, capacity: 40, enrolled: 38, status: 'Active', schedule: 'Tue, Thu - 9:00 AM', room: '102' },
      { name: 'Chemistry Grade 12', code: 'CHEM12', instructor: 'Dr. Rajesh Kumar', grade: '12', credits: 4, capacity: 30, enrolled: 22, status: 'Active', schedule: 'Mon, Wed - 1:00 PM', room: 'Lab 1' },
    ];
    const courses = [];
    for (const data of courseData) {
      const course = await Course.create(data);
      courses.push(course);
    }
    console.log(`✅ ${courses.length} courses created`);

    // Create events
    const now = new Date();
    await Event.insertMany([
      { title: 'Annual Science Fair', type: 'Academic', startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7), location: 'School Auditorium', organizer: 'Science Department', status: 'Upcoming', description: 'Students showcase their science projects' },
      { title: 'Sports Day', type: 'Sports', startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14), location: 'School Ground', organizer: 'Sports Committee', status: 'Upcoming', description: 'Annual sports competition for all grades' },
      { title: 'Parent-Teacher Meeting', type: 'Meeting', startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3), location: 'Classrooms', organizer: 'Principal Office', status: 'Upcoming', description: 'Quarterly PTM for all grades' },
      { title: 'Republic Day Celebration', type: 'Cultural', startDate: new Date(now.getFullYear(), 0, 26), location: 'School Ground', organizer: 'School Administration', status: 'Completed', description: 'National holiday celebration' },
      { title: 'Mid-Term Exams', type: 'Exam', startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20), location: 'Exam Hall', organizer: 'Exam Committee', status: 'Upcoming', description: 'Mid-term examination for all classes' },
    ]);
    console.log('✅ Events created');

    await Attendance.insertMany([
      { student: students[0]._id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), status: 'Present', subject: 'Mathematics', remarks: 'On time', markedBy: admin._id },
      { student: students[1]._id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), status: 'Absent', subject: 'Mathematics', remarks: 'Sick leave', markedBy: admin._id },
      { student: students[2]._id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1), status: 'Late', subject: 'Physics', remarks: 'Late due to traffic', markedBy: admin._id },
      { student: students[3]._id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), status: 'Present', subject: 'English', remarks: 'Participated actively', markedBy: admin._id },
      { student: students[4]._id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), status: 'Present', subject: 'Computer Science', remarks: 'Good focus', markedBy: admin._id },
      { student: students[5]._id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2), status: 'Absent', subject: 'History', remarks: 'Family emergency', markedBy: admin._id },
      { student: students[6]._id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate()), status: 'Present', subject: 'Chemistry', remarks: 'Excellent', markedBy: admin._id },
      { student: students[7]._id, date: new Date(now.getFullYear(), now.getMonth(), now.getDate()), status: 'Late', subject: 'Mathematics', remarks: 'Missed bus', markedBy: admin._id },
    ]);
    console.log('✅ Attendance created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Login: ajay@123gmail.com | ajay@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }

  process.exit();
};

seed();
