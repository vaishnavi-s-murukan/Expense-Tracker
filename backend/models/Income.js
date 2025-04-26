const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  icon: {
    type: String,      // store icon name or URL
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Income', incomeSchema);
