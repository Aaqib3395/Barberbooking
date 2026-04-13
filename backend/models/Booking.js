const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    barber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    customerName:  { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true },
    customerPhone: { type: String, required: true },
    service: {
      name:     { type: String, required: true },
      price:    { type: Number, required: true },
      duration: { type: Number, required: true }
    },
    date:      { type: String, required: true },
    startTime: { type: String, required: true },
    endTime:   { type: String, required: true },
    notes:     { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
