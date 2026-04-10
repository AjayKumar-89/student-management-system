const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');
router.use(protect);

router.get('/stats', async (req,res) => {
  try {
    const [totalStudents,activeStudents,totalStaff,totalCourses,upcomingEvents] = await Promise.all([
      Student.countDocuments(), Student.countDocuments({status:'Active'}),
      Staff.countDocuments({status:'Active'}), Course.countDocuments({status:'Active'}),
      Event.countDocuments({startDate:{$gte:new Date()},status:{$ne:'Cancelled'}})
    ]);
    const today=new Date(); today.setHours(0,0,0,0);
    const tom=new Date(today); tom.setDate(tom.getDate()+1);
    const [todayPresent,todayAbsent]=await Promise.all([
      Attendance.countDocuments({date:{$gte:today,$lt:tom},status:'Present'}),
      Attendance.countDocuments({date:{$gte:today,$lt:tom},status:'Absent'})
    ]);
    const rate=todayPresent+todayAbsent>0?((todayPresent/(todayPresent+todayAbsent))*100).toFixed(1):0;
    res.json({success:true,data:{totalStudents,activeStudents,totalStaff,totalCourses,upcomingEvents,todayAttendance:{present:todayPresent,absent:todayAbsent,rate}}});
  } catch(e){res.status(500).json({success:false,message:e.message});}
});

router.get('/top-students', async (req,res) => {
  try { const data=await Student.find({status:'Active'}).sort({gpa:-1}).limit(5).select('name grade gpa studentId'); res.json({success:true,data}); }
  catch(e){res.status(500).json({success:false,message:e.message});}
});

router.get('/upcoming-events', async (req,res) => {
  try { const data=await Event.find({startDate:{$gte:new Date()},status:{$ne:'Cancelled'}}).sort({startDate:1}).limit(5); res.json({success:true,data}); }
  catch(e){res.status(500).json({success:false,message:e.message});}
});

module.exports = router;
