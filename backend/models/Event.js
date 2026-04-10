const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['Academic','Sports','Cultural','Holiday','Meeting','Exam','Other'], default: 'Other' },
  startDate: { type: Date, required: true }, endDate: Date,
  startTime: String, endTime: String, location: String, organizer: String,
  status: { type: String, enum: ['Upcoming','Ongoing','Completed','Cancelled'], default: 'Upcoming' },
  targetAudience: String, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Event', eventSchema);
