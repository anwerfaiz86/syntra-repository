const mongoose = require('mongoose');

const DefectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['Open','Under Review','Resolved','Rejected'], default: 'Open' },
  reporter: String,
  imageUrl: String,
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Defect', DefectSchema);
