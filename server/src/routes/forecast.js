const express = require('express');
const router = express.Router();
const MilkRecord = require('../models/MilkRecord');
const { protect, requireApproved } = require('../middleware/auth');
const { forecast } = require('../utils/forecasting');

const auth = [protect, requireApproved];

// GET /api/forecast?days=7&period=30
router.get('/', ...auth, async (req, res) => {
  try {
    const { days = 7, period = 60 } = req.query;
    const forecastDays = Math.min(parseInt(days), 30);
    const histDays = Math.min(parseInt(period), 365);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - histDays);

    // Aggregate daily totals
    const dailyAgg = await MilkRecord.aggregate([
      { $match: { farmerId: req.user._id, date: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalLiters: { $sum: '$quantity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill missing days with 0
    const historicalValues = dailyAgg.map((d) => d.totalLiters);
    const historicalLabels = dailyAgg.map((d) => d._id);

    // Run forecast
    const predictions = forecast(historicalValues, forecastDays);

    // Build labels for forecast dates
    const forecastLabels = [];
    const today = new Date();
    for (let i = 1; i <= forecastDays; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      forecastLabels.push(d.toISOString().split('T')[0]);
    }

    res.json({
      historical: historicalLabels.map((date, i) => ({ date, value: historicalValues[i] })),
      forecast: forecastLabels.map((date, i) => ({ date, value: predictions[i] })),
      summary: {
        avgHistorical: historicalValues.length
          ? Math.round((historicalValues.reduce((a, b) => a + b, 0) / historicalValues.length) * 100) / 100
          : 0,
        forecastedTotal: Math.round(predictions.reduce((a, b) => a + b, 0) * 100) / 100,
        trend: predictions.length >= 2
          ? predictions[predictions.length - 1] > predictions[0] ? 'Increasing' : 'Decreasing'
          : 'Stable',
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
