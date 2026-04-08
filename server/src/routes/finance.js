const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect, requireApproved } = require('../middleware/auth');

const auth = [protect, requireApproved];

// GET /api/finance/summary (Aggregate P&L data)
router.get('/summary', ...auth, async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { farmerId: req.user._id, status: 'Paid' } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const summary = {
      revenue: stats.find(s => s._id === 'Revenue')?.total || 0,
      expenses: stats.find(s => s._id === 'Expense')?.total || 0,
    };
    summary.profit = summary.revenue - summary.expenses;

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/finance/transactions
router.get('/transactions', ...auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ farmerId: req.user._id })
      .sort({ date: -1 })
      .limit(50);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/finance/transaction (Manual Entry)
router.post('/transaction', ...auth, async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    if (!type || !category || !amount) return res.status(400).json({ message: 'Missing required fields' });

    const tx = await Transaction.create({
      farmerId: req.user._id,
      type, category, amount, description, 
      date: date || new Date()
    });
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
