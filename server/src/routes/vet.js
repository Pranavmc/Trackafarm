const express = require('express');
const router = express.Router();
const VetRecord = require('../models/VetRecord');
const { protect, requireApproved } = require('../middleware/auth');

const auth = [protect, requireApproved];

// POST /api/vet
router.post('/', ...auth, async (req, res) => {
  try {
    const { animalId, type, medicine, dosage, cost, date, nextDueDate, veterinarianName, diagnosis, notes, status } = req.body;
    if (!animalId || !type) return res.status(400).json({ message: 'Animal and type are required' });
    const record = await VetRecord.create({
      animalId, farmerId: req.user._id,
      type, medicine, dosage, cost, date, nextDueDate, veterinarianName, diagnosis, notes, status,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/vet
router.get('/', ...auth, async (req, res) => {
  try {
    const { animalId, type } = req.query;
    const filter = { farmerId: req.user._id };
    if (animalId) filter.animalId = animalId;
    if (type) filter.type = type;
    const records = await VetRecord.find(filter)
      .populate('animalId', 'tagId name breed')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/vet/upcoming - due in next 30 days
router.get('/upcoming', ...auth, async (req, res) => {
  try {
    const now = new Date();
    const in30 = new Date();
    in30.setDate(in30.getDate() + 30);
    const upcoming = await VetRecord.find({
      farmerId: req.user._id,
      nextDueDate: { $gte: now, $lte: in30 },
    })
      .populate('animalId', 'tagId name breed')
      .sort({ nextDueDate: 1 });
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/vet/:id
router.put('/:id', ...auth, async (req, res) => {
  try {
    const record = await VetRecord.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user._id },
      req.body,
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/vet/:id
router.delete('/:id', ...auth, async (req, res) => {
  try {
    await VetRecord.findOneAndDelete({ _id: req.params.id, farmerId: req.user._id });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
