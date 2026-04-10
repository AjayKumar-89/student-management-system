const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String, grade: { type: String, required: true }, section: String,
  gender: { type: String, enum: ['Male','Female','Other'] },
  dateOfBirth: Date, address: String, parentName: String, parentPhone: String,
  status: { type: String, enum: ['Active','Inactive','Suspended'], default: 'Active' },
  gpa: { type: Number, min: 0, max: 4, default: 0 },
  enrollmentDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});
studentSchema.pre('save', async function(next) {
  if (!this.studentId) {
    const count = await mongoose.model('Student').countDocuments();
    this.studentId = `STU${String(count + 1).padStart(4, '0')}`;
  }
  next();
});
module.exports = mongoose.model('Student', studentSchema);
