const express = require('express');
const router = express.Router();
const MilkRecord = require('../models/MilkRecord');
const Animal = require('../models/Animal');
const Transaction = require('../models/Transaction');
const { protect, requireApproved } = require('../middleware/auth');

const auth = [protect, requireApproved];

// POST /api/milk
router.post('/', ...auth, async (req, res) => {
  try {
    const { animalId, date, quantity, session, pricePerLiter, notes } = req.body;
    if (!animalId || !quantity) return res.status(400).json({ message: 'Animal and quantity are required' });

    const animal = await Animal.findOne({ _id: animalId, farmerId: req.user._id });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    const record = await MilkRecord.create({
      animalId, farmerId: req.user._id,
      date: date || new Date(),
      quantity, session, pricePerLiter: pricePerLiter || 35, notes,
    });

    // Create revenue transaction
    await Transaction.create({
      farmerId: req.user._id,
      type: 'Revenue',
      category: 'Milk Sale',
      amount: quantity * (pricePerLiter || 35),
      description: `${quantity}L Harvest - ${session} Session`,
      referenceId: record._id
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/milk - paginated history
router.get('/', ...auth, async (req, res) => {
  try {
    const { animalId, startDate, endDate, page = 1, limit = 20 } = req.query;
    const filter = { farmerId: req.user._id };
    if (animalId) filter.animalId = animalId;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const skip = (page - 1) * limit;
    const [records, total] = await Promise.all([
      MilkRecord.find(filter)
        .populate('animalId', 'tagId name breed')
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      MilkRecord.countDocuments(filter),
    ]);
    res.json({ records, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/milk/stats - aggregated stats
router.get('/stats', ...auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyStats = await MilkRecord.aggregate([
      {
        $match: {
          farmerId: req.user._id,
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalLiters: { $sum: '$quantity' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMilk = await MilkRecord.aggregate([
      { $match: { farmerId: req.user._id, date: { $gte: todayStart } } },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    const totalAll = await MilkRecord.aggregate([
      { $match: { farmerId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);

    res.json({
      dailyStats,
      todayLiters: todayMilk[0]?.total || 0,
      totalLiters: totalAll[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/milk/:id
router.delete('/:id', ...auth, async (req, res) => {
  try {
    await MilkRecord.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
