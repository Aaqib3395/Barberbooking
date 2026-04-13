const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

function addMinutes(time, mins) {
  let [h, m] = time.split(':').map(Number);
  m += mins;
  while (m >= 60) { h++; m -= 60; }
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

// POST /api/bookings  — public (no account needed)
router.post('/', async (req, res) => {
  try {
    const { barberId, customerName, customerEmail, customerPhone, service, date, startTime, notes } = req.body;

    if (!barberId || !customerName || !customerEmail || !customerPhone || !service || !date || !startTime)
      return res.status(400).json({ message: 'All required fields must be provided' });

    const barber = await User.findById(barberId);
    if (!barber) return res.status(404).json({ message: 'Barber not found' });

    const endTime = addMinutes(startTime, service.duration);

    // Check for slot conflict
    const conflict = await Booking.findOne({
      barber: barberId,
      date,
      status: { $nin: ['cancelled'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (conflict) return res.status(409).json({ message: 'This time slot is no longer available' });

    const booking = await Booking.create({
      barber: barberId,
      customerName,
      customerEmail,
      customerPhone,
      service,
      date,
      startTime,
      endTime,
      notes: notes || ''
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/my  — barber sees own bookings
router.get('/my', protect, async (req, res) => {
  try {
    const { date, status } = req.query;
    const filter = { barber: req.user._id };
    if (date) filter.date = date;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter).sort({ date: 1, startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/status  — barber updates booking status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOne({ _id: req.params.id, barber: req.user._id });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
