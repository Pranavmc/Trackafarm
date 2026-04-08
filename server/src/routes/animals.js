const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const { protect, requireApproved } = require('../middleware/auth');

const auth = [protect, requireApproved];

// GET /api/animals
router.get('/', ...auth, async (req, res) => {
  try {
    const { search, healthStatus, breed } = req.query;
    const filter = { farmerId: req.user._id, isActive: true };
    if (healthStatus) filter.healthStatus = healthStatus;
    if (breed) filter.breed = new RegExp(breed, 'i');
    if (search) {
      filter.$or = [
        { tagId: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') },
        { breed: new RegExp(search, 'i') },
      ];
    }
    const animals = await Animal.find(filter).sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/animals
router.post('/', ...auth, async (req, res) => {
  try {
    const { tagId, name, breed, dob, color, healthStatus, gender, weight, fatherTag, motherTag, notes } = req.body;
    if (!tagId || !breed) return res.status(400).json({ message: 'Tag ID and breed are required' });

    const exists = await Animal.findOne({ tagId, farmerId: req.user._id });
    if (exists) return res.status(400).json({ message: 'Animal with this Tag ID already registered' });

    const animal = await Animal.create({
      tagId, name, breed, dob, color, healthStatus, gender, weight, fatherTag, motherTag, notes,
      farmerId: req.user._id,
    });
    res.status(201).json(animal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/animals/count/summary
router.get('/count/summary', ...auth, async (req, res) => {
  try {
    const summary = await Animal.aggregate([
      { $match: { farmerId: req.user._id, isActive: true } },
      { $group: { _id: '$healthStatus', count: { $sum: 1 } } },
    ]);
    const total = await Animal.countDocuments({ farmerId: req.user._id, isActive: true });
    res.json({ total, summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/animals/:id
router.get('/:id', ...auth, async (req, res) => {
  try {
    const animal = await Animal.findOne({ _id: req.params.id, farmerId: req.user._id });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/animals/:id
router.put('/:id', ...auth, async (req, res) => {
  try {
    const animal = await Animal.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/animals/:id
router.delete('/:id', ...auth, async (req, res) => {
  try {
    const animal = await Animal.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    res.json({ message: 'Animal removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/animals/:id/health-event
router.post('/:id/health-event', ...auth, async (req, res) => {
  try {
    const { eventType, date, medicine, dosage, nextDueDate, withdrawalPeriodEnd, notes } = req.body;
    const animal = await Animal.findOne({ _id: req.params.id, farmerId: req.user._id });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    animal.healthEvents.push({ eventType, date, medicine, dosage, nextDueDate, withdrawalPeriodEnd, notes });
    
    // Automatically flag as 'Under Treatment' or 'Vaccinated' based on the event
    if (eventType === 'Treatment' || eventType === 'Deworming') animal.healthStatus = 'Under Treatment';
    if (eventType === 'Vaccination') animal.healthStatus = 'Vaccinated';
    
    await animal.save();
    res.status(201).json(animal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/animals/:id/reproduction-event
router.post('/:id/reproduction-event', ...auth, async (req, res) => {
  try {
    const { eventType, date, bullId, expectedCalvingDate, result, notes } = req.body;
    const animal = await Animal.findOne({ _id: req.params.id, farmerId: req.user._id });
    if (!animal) return res.status(404).json({ message: 'Animal not found' });
    if (animal.gender !== 'Female') return res.status(400).json({ message: 'Reproduction events are only for female cattle' });

    let calculatedCalvingDate = expectedCalvingDate;
    
    // If it's an insemination and positive pregnancy check, calculate 283 days gestation
    if (eventType === 'Insemination' && !expectedCalvingDate) {
       const gestationDays = 283;
       const d = new Date(date || Date.now());
       d.setDate(d.getDate() + gestationDays);
       calculatedCalvingDate = d;
    }

    animal.reproductionEvents.push({ eventType, date, bullId, expectedCalvingDate: calculatedCalvingDate, result, notes });
    
    // Update live pregnancy status state machine
    if (eventType === 'Insemination') {
      animal.currentPregnancy = { isPregnant: false, expectedCalvingDate: calculatedCalvingDate, inseminationDate: date || Date.now() };
    } else if (eventType === 'Pregnancy Check' && result === 'Positive') {
      animal.currentPregnancy.isPregnant = true;
    } else if (eventType === 'Calving' || eventType === 'Abortion') {
      animal.currentPregnancy = { isPregnant: false, expectedCalvingDate: null, inseminationDate: null };
    }

    await animal.save();
    res.status(201).json(animal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
