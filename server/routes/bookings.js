const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/bookings - Fetching all bookings');
    const bookings = await Booking.find().sort({ createdAt: -1 });
    console.log(`Found ${bookings.length} bookings`);
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ 
      message: 'Error fetching bookings',
      error: err.message 
    });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ 
      message: 'Error fetching booking',
      error: err.message 
    });
  }
});

// Create a booking
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/bookings - Creating booking:', req.body);
    
    const booking = new Booking({
      customerName: req.body.customerName,
      phone: req.body.phone,
      turfId: req.body.turfId,
      turfName: req.body.turfName,
      date: req.body.date,
      timeSlot: req.body.timeSlot,
      duration: req.body.duration,
      players: req.body.players,
      totalPrice: req.body.totalPrice,
      status: req.body.status || 'confirmed'
    });

    const newBooking = await booking.save();
    console.log('Booking created successfully:', newBooking._id);
    res.status(201).json(newBooking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({ 
      message: 'Error creating booking',
      error: err.message 
    });
  }
});

// Update a booking
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT /api/bookings/:id - Updating booking:', req.params.id);
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update all provided fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] != null) {
        booking[key] = req.body[key];
      }
    });

    const updatedBooking = await booking.save();
    console.log('Booking updated successfully');
    res.json(updatedBooking);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(400).json({ 
      message: 'Error updating booking',
      error: err.message 
    });
  }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    console.log('DELETE /api/bookings/:id - Deleting booking:', req.params.id);
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    console.log('Booking deleted successfully');
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ 
      message: 'Error deleting booking',
      error: err.message 
    });
  }
});

module.exports = router;