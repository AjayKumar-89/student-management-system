const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', async (req, res) => {
  try {
    const { search, department, status } = req.query; const q = {};
    if (search) q.$or = [{ name: { $regex: search, $options:'i' } }, { email: { $regex: search, $options:'i' } }];
    if (department) q.department = department; if (status) q.status = status;
    const data = await Staff.find(q).sort({ createdAt: -1 }); res.json({ success:true, count:data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
router.get('/:id', async (req,res) => { try { const d = await Staff.findById(req.params.id); if(!d) return res.status(404).json({success:false,message:'Not found'}); res.json({success:true,data:d}); } catch(e){res.status(500).json({success:false,message:e.message});} });
router.post('/', async (req,res) => { try { const d = await Staff.create(req.body); res.status(201).json({success:true,data:d}); } catch(e){ if(e.code===11000) return res.status(400).json({success:false,message:'Email exists'}); res.status(500).json({success:false,message:e.message}); } });
router.put('/:id', async (req,res) => { try { const d = await Staff.findByIdAndUpdate(req.params.id,req.body,{new:true}); if(!d) return res.status(404).json({success:false,message:'Not found'}); res.json({success:true,data:d}); } catch(e){res.status(500).json({success:false,message:e.message});} });
router.delete('/:id', async (req,res) => { try { await Staff.findByIdAndDelete(req.params.id); res.json({success:true,message:'Deleted'}); } catch(e){res.status(500).json({success:false,message:e.message});} });
module.exports = router;
