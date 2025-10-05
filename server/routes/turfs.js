const express = require('express');
const router = express.Router();
const Turf = require('../models/Turf');

// Get all turfs
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/turfs - Fetching all turfs');
    const turfs = await Turf.find();
    console.log(`Found ${turfs.length} turfs`);
    res.json(turfs);
  } catch (err) {
    console.error('Error fetching turfs:', err);
    res.status(500).json({ 
      message: 'Error fetching turfs',
      error: err.message 
    });
  }
});

// Get single turf
router.get('/:id', async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json(turf);
  } catch (err) {
    console.error('Error fetching turf:', err);
    res.status(500).json({ 
      message: 'Error fetching turf',
      error: err.message 
    });
  }
});

// Create a turf
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/turfs - Creating turf:', req.body);
    
    const turf = new Turf({
      name: req.body.name,
      location: req.body.location,
      pricePerHour: req.body.pricePerHour,
      capacity: req.body.capacity
    });

    const newTurf = await turf.save();
    console.log('Turf created successfully:', newTurf._id);
    res.status(201).json(newTurf);
  } catch (err) {
    console.error('Error creating turf:', err);
    res.status(400).json({ 
      message: 'Error creating turf',
      error: err.message 
    });
  }
});

// Update a turf
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT /api/turfs/:id - Updating turf:', req.params.id);
    
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    if (req.body.name != null) turf.name = req.body.name;
    if (req.body.location != null) turf.location = req.body.location;
    if (req.body.pricePerHour != null) turf.pricePerHour = req.body.pricePerHour;
    if (req.body.capacity != null) turf.capacity = req.body.capacity;

    const updatedTurf = await turf.save();
    console.log('Turf updated successfully');
    res.json(updatedTurf);
  } catch (err) {
    console.error('Error updating turf:', err);
    res.status(400).json({ 
      message: 'Error updating turf',
      error: err.message 
    });
  }
});

// Delete a turf
router.delete('/:id', async (req, res) => {
  try {
    console.log('DELETE /api/turfs/:id - Deleting turf:', req.params.id);
    
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    await Turf.findByIdAndDelete(req.params.id);
    console.log('Turf deleted successfully');
    res.json({ message: 'Turf deleted successfully' });
  } catch (err) {
    console.error('Error deleting turf:', err);
    res.status(500).json({ 
      message: 'Error deleting turf',
      error: err.message 
    });
  }
});

module.exports = router;