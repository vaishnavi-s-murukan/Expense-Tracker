const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String, // income / expense
  category: String,
  amount: Number,
  description: String,
  date: String
});
module.exports = mongoose.model('Transaction', transactionSchema);
