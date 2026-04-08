const express = require('express');
const router = express.Router();
const FeedLog = require('../models/FeedLog');
const FeedInventory = require('../models/FeedInventory');
const Transaction = require('../models/Transaction');
const { protect, requireApproved } = require('../middleware/auth');

const auth = [protect, requireApproved];

// POST /api/feed (Log a feeding event and decrement inventory)
router.post('/', ...auth, async (req, res) => {
  try {
    const { animalId, date, feedType, feedQuantityKg, waterLiters, cost, notes } = req.body;
    if (!animalId || !feedType || feedQuantityKg === undefined)
      return res.status(400).json({ message: 'Animal, feed type, and quantity are required' });

    // 1. Create the feeding log
    const log = await FeedLog.create({
      animalId, farmerId: req.user._id,
      date: date || new Date(),
      feedType, feedQuantityKg, waterLiters, cost, notes,
    });

    // 2. Decrement from inventory
    await FeedInventory.findOneAndUpdate(
      { farmerId: req.user._id, feedType },
      { $inc: { quantityKg: -feedQuantityKg } },
      { upsert: true, new: true } // Creates it if it doesn't exist (with negative value initially, which farmer will restock)
    );

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/feed/inventory (Get current stock levels)
router.get('/inventory', ...auth, async (req, res) => {
  try {
    const inventory = await FeedInventory.find({ farmerId: req.user._id });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/feed/inventory/restock (Add stock to inventory)
router.post('/inventory/restock', ...auth, async (req, res) => {
  try {
    const { feedType, quantityKg, unitCost } = req.body;
    if (!feedType || !quantityKg) return res.status(400).json({ message: 'Type and quantity required' });

    const inv = await FeedInventory.findOneAndUpdate(
      { farmerId: req.user._id, feedType },
      { 
        $inc: { quantityKg: Number(quantityKg) },
        $set: { lastRestocked: new Date(), unitCost: unitCost || 0 }
      },
      { upsert: true, new: true }
    );

    // Create a financial transaction for the restock
    await Transaction.create({
      farmerId: req.user._id,
      type: 'Expense',
      category: 'Feed',
      amount: Number(quantityKg) * (unitCost || 0),
      description: `Restocked ${quantityKg}kg of ${feedType}`,
      referenceId: inv._id
    });

    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/feed/inventory/threshold (Update low stock alert level)
router.patch('/inventory/threshold', ...auth, async (req, res) => {
  try {
    const { feedType, threshold } = req.body;
    const inv = await FeedInventory.findOneAndUpdate(
      { farmerId: req.user._id, feedType },
      { $set: { lowStockThreshold: threshold } },
      { new: true }
    );
    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/feed
router.get('/', ...auth, async (req, res) => {
  try {
    const { animalId, startDate, endDate } = req.query;
    const filter = { farmerId: req.user._id };
    if (animalId) filter.animalId = animalId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const logs = await FeedLog.find(filter)
      .populate('animalId', 'tagId name breed')
      .sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/feed/stats
router.get('/stats', ...auth, async (req, res) => {
  try {
    const stats = await FeedLog.aggregate([
      { $match: { farmerId: req.user._id } },
      {
        $group: {
          _id: '$feedType',
          totalKg: { $sum: '$feedQuantityKg' },
          totalCost: { $sum: '$cost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalKg: -1 } },
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/feed/:id
router.delete('/:id', ...auth, async (req, res) => {
  try {
    await FeedLog.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    res.json({ message: 'Log deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
