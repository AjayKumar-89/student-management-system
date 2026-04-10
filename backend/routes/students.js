const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { search, grade, status, page=1, limit=50 } = req.query;
    const q = {};
    if (search) q.$or = [{ name: { $regex: search, $options:'i' } }, { email: { $regex: search, $options:'i' } }, { studentId: { $regex: search, $options:'i' } }];
    if (grade) q.grade = grade;
    if (status) q.status = status;
    const total = await Student.countDocuments(q);
    const data = await Student.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(Number(limit));
    res.json({ success: true, count: total, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: s });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const s = await Student.create(req.body);
    res.status(201).json({ success: true, data: s });
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ success: false, message: 'Email already exists' });
    res.status(500).json({ success: false, message: e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const s = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!s) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: s });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    const s = await Student.findByIdAndDelete(req.params.id);
    if (!s) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
