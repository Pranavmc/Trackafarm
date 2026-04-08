const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Animal = require('../models/Animal');
const MilkRecord = require('../models/MilkRecord');
const { protect, requireRole } = require('../middleware/auth');

const adminOnly = [protect, requireRole('admin')];

// GET /api/admin/users - all users
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { status, role } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/admin/users/:id/status - approve/reject
router.patch('/users/:id/status', ...adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'pending'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User ${status} successfully`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', ...adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats - system-wide stats
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const [totalFarmers, pendingFarmers, totalAnimals, totalMilk] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'farmer', status: 'pending' }),
      Animal.countDocuments({ isActive: true }),
      MilkRecord.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }]),
    ]);
    res.json({
      totalFarmers,
      pendingFarmers,
      totalAnimals,
      totalMilkLiters: totalMilk[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/animals - all animals
router.get('/animals', ...adminOnly, async (req, res) => {
  try {
    const animals = await Animal.find({ isActive: true })
      .populate('farmerId', 'name farmName email')
      .sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
