const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Expense', 'Revenue'], required: true },
    category: { 
      type: String, 
      enum: ['Feed', 'Medicine', 'Labor', 'Utility', 'Milk Sale', 'Animal Sale', 'Other'],
      required: true 
    },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // Link to FeedLog, MilkRecord, etc.
    status: { type: String, enum: ['Paid', 'Pending', 'Void'], default: 'Paid' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
