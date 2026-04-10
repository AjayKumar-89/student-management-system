const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');
router.use(protect);
router.get('/', async (req, res) => {
  try {
    const { search, status, grade } = req.query;
    const q = {};
    if (search) q.$or = [{ name: { $regex: search, $options:'i' } }, { code: { $regex: search, $options:'i' } }];
    if (status) q.status = status; if (grade) q.grade = grade;
    const data = await Course.find(q).sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
router.get('/:id', async (req, res) => {
  try { const d = await Course.findById(req.params.id); if (!d) return res.status(404).json({ success: false, message: 'Not found' }); res.json({ success: true, data: d }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
router.post('/', async (req, res) => {
  try { const d = await Course.create(req.body); res.status(201).json({ success: true, data: d }); }
  catch (e) { if (e.code===11000) return res.status(400).json({ success:false, message:'Course code exists' }); res.status(500).json({ success: false, message: e.message }); }
});
router.put('/:id', async (req, res) => {
  try { const d = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }); if (!d) return res.status(404).json({ success:false, message:'Not found' }); res.json({ success:true, data:d }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
router.delete('/:id', async (req, res) => {
  try { await Course.findByIdAndDelete(req.params.id); res.json({ success:true, message:'Deleted' }); }
  catch (e) { res.status(500).json({ success: false, message: e.message }); }
});
module.exports = router;
