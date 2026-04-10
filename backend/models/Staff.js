const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
  staffId: { type: String, unique: true },
  name: { type: String, required: true }, email: { type: String, required: true, unique: true, lowercase: true },
  phone: String, department: String, designation: String,
  gender: { type: String, enum: ['Male','Female','Other'] },
  dateOfJoining: { type: Date, default: Date.now }, salary: Number,
  status: { type: String, enum: ['Active','Inactive','On Leave'], default: 'Active' },
  subjects: [String], address: String, createdAt: { type: Date, default: Date.now }
});
staffSchema.pre('save', async function(next) {
  if (!this.staffId) {
    const count = await mongoose.model('Staff').countDocuments();
    this.staffId = `STF${String(count + 1).padStart(3, '0')}`;
  }
  next();
});
module.exports = mongoose.model('Staff', staffSchema);
