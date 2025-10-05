const express = require('express');
const router = express.Router();
const Turf = require('../models/Turf');

// Get all turfs
router.get('/', async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a turf
router.post('/', async (req, res) => {
  const turf = new Turf({
    name: req.body.name,
    location: req.body.location,
    pricePerHour: req.body.pricePerHour,
    capacity: req.body.capacity
  });

  try {
    const newTurf = await turf.save();
    res.status(201).json(newTurf);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a turf
router.put('/:id', async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    if (req.body.name) turf.name = req.body.name;
    if (req.body.location) turf.location = req.body.location;
    if (req.body.pricePerHour) turf.pricePerHour = req.body.pricePerHour;
    if (req.body.capacity) turf.capacity = req.body.capacity;

    const updatedTurf = await turf.save();
    res.json(updatedTurf);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a turf
router.delete('/:id', async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    await turf.deleteOne();
    res.json({ message: 'Turf deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;