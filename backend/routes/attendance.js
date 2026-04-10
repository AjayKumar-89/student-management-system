const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', async (req,res) => {
  try { const {studentId,date,status,subject}=req.query; const q={};
    if(studentId) q.student=studentId; if(status) q.status=status; if(subject) q.subject=subject;
    if(date){ const d=new Date(date); q.date={$gte:new Date(d.setHours(0,0,0,0)),$lte:new Date(d.setHours(23,59,59,999))}; }
    const data=await Attendance.find(q).populate('student','name studentId grade').sort({date:-1});
    res.json({success:true,count:data.length,data}); }
  catch(e){res.status(500).json({success:false,message:e.message});}
});
router.get('/summary', async (req,res) => {
  try {
    const total=await Attendance.countDocuments();
    const present=await Attendance.countDocuments({status:'Present'});
    const absent=await Attendance.countDocuments({status:'Absent'});
    const late=await Attendance.countDocuments({status:'Late'});
    res.json({success:true,data:{total,present,absent,late,rate:total?((present/total)*100).toFixed(1):0}});
  } catch(e){res.status(500).json({success:false,message:e.message});}
});
router.post('/', async (req,res) => { try { const d=await Attendance.create({...req.body,markedBy:req.user._id}); res.status(201).json({success:true,data:d}); } catch(e){ if(e.code===11000) return res.status(400).json({success:false,message:'Already marked'}); res.status(500).json({success:false,message:e.message}); } });
router.post('/bulk', async (req,res) => { try { const r=await Attendance.insertMany(req.body.records.map(x=>({...x,markedBy:req.user._id})),{ordered:false}); res.status(201).json({success:true,count:r.length}); } catch(e){res.status(500).json({success:false,message:e.message});} });
router.put('/:id', async (req,res) => { try { const d=await Attendance.findByIdAndUpdate(req.params.id,req.body,{new:true}); res.json({success:true,data:d}); } catch(e){res.status(500).json({success:false,message:e.message});} });
router.delete('/:id', async (req,res) => { try { await Attendance.findByIdAndDelete(req.params.id); res.json({success:true,message:'Deleted'}); } catch(e){res.status(500).json({success:false,message:e.message});} });
module.exports = router;
