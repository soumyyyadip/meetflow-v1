const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['facilitator', 'attendee'], default: 'attendee' },
  initials: { type: String },
  color: { type: String, default: '#2D6A4F' },
}, { _id: true });

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  assignee: { type: String },
  due: { type: String },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'done'],
    default: 'open',
  },
}, { _id: true });

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },  // stored as YYYY-MM-DD string
  time: { type: String, default: '10:00 AM' },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'in-progress', 'cancelled'],
    default: 'upcoming'
  },
  participants: [participantSchema],
  minutes: { type: String, default: '' },
  notes: { type: String, default: '' },
  decisions: [{ type: String }],
  actionItems: [taskSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);
