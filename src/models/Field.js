const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String },
  image: { type: String, default: '' },
  available: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Field', fieldSchema);
