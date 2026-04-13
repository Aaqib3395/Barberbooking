const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }
});

const dayScheduleSchema = new mongoose.Schema({
  isOpen: { type: Boolean, default: false },
  open: { type: String, default: '09:00' },
  close: { type: String, default: '18:00' }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['barber', 'admin'], default: 'barber' },
    bio: { type: String, default: '' },
    photo: { type: String, default: '' },
    location: { type: String, default: '' },
    phone: { type: String, default: '' },
    services: [serviceSchema],
    availability: {
      monday:    { type: dayScheduleSchema, default: () => ({}) },
      tuesday:   { type: dayScheduleSchema, default: () => ({}) },
      wednesday: { type: dayScheduleSchema, default: () => ({}) },
      thursday:  { type: dayScheduleSchema, default: () => ({}) },
      friday:    { type: dayScheduleSchema, default: () => ({}) },
      saturday:  { type: dayScheduleSchema, default: () => ({}) },
      sunday:    { type: dayScheduleSchema, default: () => ({ isOpen: false }) }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
