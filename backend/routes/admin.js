const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.use(protect, adminOnly);

// GET /api/admin/barbers
router.get('/barbers', async (req, res) => {
  try {
    const barbers = await User.find({ role: 'barber' }).select('-password');
    res.json(barbers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/barbers/:id
router.delete('/barbers/:id', async (req, res) => {
  try {
    const barber = await User.findByIdAndDelete(req.params.id);
    if (!barber) return res.status(404).json({ message: 'Barber not found' });
    await Booking.deleteMany({ barber: req.params.id });
    res.json({ message: 'Barber and related bookings deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/barbers/:id  — edit barber profile
router.put('/barbers/:id', async (req, res) => {
  try {
    const barber = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!barber) return res.status(404).json({ message: 'Barber not found' });
    res.json(barber);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('barber', 'name email photo').sort({ date: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const totalBarbers  = await User.countDocuments({ role: 'barber' });
    const totalBookings = await Booking.countDocuments();
    const pending       = await Booking.countDocuments({ status: 'pending' });
    const confirmed     = await Booking.countDocuments({ status: 'confirmed' });
    res.json({ totalBarbers, totalBookings, pending, confirmed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
