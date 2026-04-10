const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
  courseId: { type: String, unique: true },
  name: { type: String, required: true }, code: { type: String, required: true, unique: true, uppercase: true },
  description: String, instructor: String, credits: { type: Number, default: 3 },
  grade: String, schedule: String, room: String,
  capacity: { type: Number, default: 30 }, enrolled: { type: Number, default: 0 },
  status: { type: String, enum: ['Active','Inactive','Upcoming'], default: 'Active' },
  startDate: Date, endDate: Date, createdAt: { type: Date, default: Date.now }
});
courseSchema.pre('save', async function(next) {
  if (!this.courseId) {
    const count = await mongoose.model('Course').countDocuments();
    this.courseId = `CRS${String(count + 1).padStart(3, '0')}`;
  }
  next();
});
module.exports = mongoose.model('Course', courseSchema);
