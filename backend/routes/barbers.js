const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Time slot helpers
function addMinutes(time, mins) {
  let [h, m] = time.split(':').map(Number);
  m += mins;
  while (m >= 60) { h++; m -= 60; }
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function generateSlots(open, close, duration, bookedSlots) {
  const slots = [];
  let current = open;
  while (timeToMinutes(current) + duration <= timeToMinutes(close)) {
    const end = addMinutes(current, duration);
    const isBooked = bookedSlots.some(b => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd   = timeToMinutes(b.endTime);
      const sStart = timeToMinutes(current);
      const sEnd   = timeToMinutes(end);
      return sStart < bEnd && sEnd > bStart;
    });
    slots.push({ time: current, available: !isBooked });
    current = addMinutes(current, 30);
  }
  return slots;
}

// GET /api/barbers  — public list
router.get('/', async (req, res) => {
  try {
    const barbers = await User.find({ role: 'barber', isActive: true }).select('-password');
    res.json(barbers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/barbers/:id  — public profile
router.get('/:id', async (req, res) => {
  try {
    const barber = await User.findOne({ _id: req.params.id, role: 'barber' }).select('-password');
    if (!barber) return res.status(404).json({ message: 'Barber not found' });
    res.json(barber);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/barbers/:id/slots?date=YYYY-MM-DD&duration=30  — public
router.get('/:id/slots', async (req, res) => {
  try {
    const { date, duration } = req.query;
    if (!date) return res.status(400).json({ message: 'date query param required' });

    const barber = await User.findById(req.params.id);
    if (!barber) return res.status(404).json({ message: 'Barber not found' });

    const dayName = new Date(date + 'T12:00:00')
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toLowerCase();

    const daySchedule = barber.availability[dayName];
    if (!daySchedule || !daySchedule.isOpen)
      return res.json({ available: false, slots: [] });

    const bookedSlots = await Booking.find({
      barber: req.params.id,
      date,
      status: { $nin: ['cancelled'] }
    });

    const dur = parseInt(duration) || 30;
    const slots = generateSlots(daySchedule.open, daySchedule.close, dur, bookedSlots);
    res.json({ available: true, slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/barbers/profile  — barber updates own profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, bio, photo, location, phone, services, availability } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, photo, location, phone, services, availability },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
