const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({ role: { $in: ['barber', 'admin'] } });
  console.log('Cleared existing users');

  // Create admin
  await User.create({
    name: 'Admin',
    email: 'admin@stylehub.com',
    password: 'admin123',
    role: 'admin'
  });

  // Create barber 1
  await User.create({
    name: 'John Fade',
    email: 'john@stylehub.com',
    password: 'barber123',
    role: 'barber',
    bio: 'Professional barber with 8+ years of experience specializing in modern fades and beard styling.',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    location: 'New York, USA',
    phone: '+1 555-0101',
    services: [
      { name: 'Haircut',         price: 25, duration: 30 },
      { name: 'Beard Trim',      price: 15, duration: 20 },
      { name: 'Haircut + Beard', price: 35, duration: 45 }
    ],
    availability: {
      monday:    { isOpen: true,  open: '10:00', close: '20:00' },
      tuesday:   { isOpen: true,  open: '10:00', close: '20:00' },
      wednesday: { isOpen: true,  open: '10:00', close: '20:00' },
      thursday:  { isOpen: true,  open: '10:00', close: '20:00' },
      friday:    { isOpen: true,  open: '10:00', close: '20:00' },
      saturday:  { isOpen: true,  open: '10:00', close: '20:00' },
      sunday:    { isOpen: false, open: '10:00', close: '18:00' }
    }
  });

  // Create barber 2
  await User.create({
    name: 'Mike Cuts',
    email: 'mike@stylehub.com',
    password: 'barber123',
    role: 'barber',
    bio: 'Expert in skin fades and classic cuts. Clean, precise, every time.',
    photo: 'https://randomuser.me/api/portraits/men/44.jpg',
    location: 'New York, USA',
    phone: '+1 555-0102',
    services: [
      { name: 'Basic Haircut', price: 20, duration: 30 },
      { name: 'Skin Fade',     price: 30, duration: 40 }
    ],
    availability: {
      monday:    { isOpen: true,  open: '09:00', close: '18:00' },
      tuesday:   { isOpen: true,  open: '09:00', close: '18:00' },
      wednesday: { isOpen: true,  open: '09:00', close: '18:00' },
      thursday:  { isOpen: true,  open: '09:00', close: '18:00' },
      friday:    { isOpen: true,  open: '09:00', close: '18:00' },
      saturday:  { isOpen: true,  open: '10:00', close: '17:00' },
      sunday:    { isOpen: false, open: '09:00', close: '18:00' }
    }
  });

  console.log('Seed data created successfully');
  console.log('Admin: admin@stylehub.com / admin123');
  console.log('Barber 1: john@stylehub.com / barber123');
  console.log('Barber 2: mike@stylehub.com / barber123');
  process.exit();
};

seedData().catch((err) => { console.error(err); process.exit(1); });
