# StyleHub — Barber & Salon Appointment Booking System

A full MERN stack web application for barber and salon appointment booking.

---

## Tech Stack

- **Frontend:** React, React Router v6, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Tokens) + bcryptjs

---

## Project Structure

```
stylehub/
  backend/
    models/        User.js, Booking.js
    routes/        auth.js, barbers.js, bookings.js, admin.js
    middleware/    auth.js
    server.js
    seed.js
    .env.example
  frontend/
    src/
      pages/       Home, Login, Register, BarberProfile, BarberDashboard, AdminPanel, BookingSuccess
      components/  Navbar, BarberCard, TimeSlotPicker, ProtectedRoute
      context/     AuthContext.js
      services/    api.js
    public/
```

---

## Setup Instructions

### Step 1 — Prerequisites

Make sure you have installed:
- Node.js (v18 or higher)
- npm
- MongoDB Atlas account (free at mongodb.com/atlas)

---

### Step 2 — Clone and install

```bash
# Backend
cd stylehub/backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### Step 3 — Environment variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in:

```
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.mongodb.net/stylehub
JWT_SECRET=any_long_random_string_here
FRONTEND_URL=http://localhost:3000
```

To get your MongoDB URI:
1. Go to mongodb.com/atlas and create a free account
2. Create a new cluster (free tier)
3. Click Connect → Connect your application
4. Copy the connection string and replace `<password>` with your password

---

### Step 4 — Seed the database with sample data

```bash
cd backend
npm run seed
```

This creates:
- Admin: admin@stylehub.com / admin123
- Barber 1: john@stylehub.com / barber123 (John Fade)
- Barber 2: mike@stylehub.com / barber123 (Mike Cuts)

---

### Step 5 — Run the application

Open two terminals:

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```
Frontend runs on http://localhost:3000

---

## Features

**Customer (no account required)**
- Browse all barbers on the home page
- Search by name, location, or service
- View barber profile with services, pricing, working hours
- Book an appointment in 3 steps: select service → choose date/time → enter details
- Booking confirmation page

**Barber**
- Register and login
- Dashboard with booking management (confirm, cancel, complete)
- Edit profile, bio, photo, location
- Manage services (add, edit, remove)
- Set weekly availability schedule

**Admin**
- View all barbers and bookings
- Delete barbers
- View stats (total barbers, bookings, pending, confirmed)

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Barber register |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | JWT | Get current user |
| GET | /api/barbers | Public | List all barbers |
| GET | /api/barbers/:id | Public | Barber profile |
| GET | /api/barbers/:id/slots | Public | Available time slots |
| PUT | /api/barbers/profile | JWT | Update own profile |
| POST | /api/bookings | Public | Create booking |
| GET | /api/bookings/my | JWT | Barber's bookings |
| PUT | /api/bookings/:id/status | JWT | Update booking status |
| GET | /api/admin/barbers | Admin | All barbers |
| DELETE | /api/admin/barbers/:id | Admin | Delete barber |
| GET | /api/admin/bookings | Admin | All bookings |
| GET | /api/admin/stats | Admin | Dashboard stats |

---

## Deploy to GitHub

### Step 1 — Create repository on GitHub
Go to github.com → New repository → Name it `stylehub` → Do not initialize with README → Create

### Step 2 — Initialize and push

```bash
cd stylehub

# Initialize git
git init

# Create .gitignore
echo "node_modules
.env
build
.DS_Store" > .gitignore

# Add all files
git add .

# First commit
git commit -m "Initial commit - StyleHub barber booking system"

# Add your GitHub repo as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/stylehub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Deploy to Production

**Backend — Railway**
1. Go to railway.app and sign up with GitHub
2. New Project → Deploy from GitHub repo → Select stylehub
3. Set root directory to `backend`
4. Add environment variables (same as .env)
5. Railway gives you a live URL like https://stylehub-backend.railway.app

**Frontend — Vercel**
1. Go to vercel.com and sign up with GitHub
2. Import your stylehub repo
3. Set root directory to `frontend`
4. Add environment variable: REACT_APP_API_URL = your Railway backend URL
5. Update api.js baseURL to use process.env.REACT_APP_API_URL
6. Deploy

**Database — MongoDB Atlas**
Already set up in step 3. Make sure your IP whitelist includes 0.0.0.0/0 for Railway access.

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@stylehub.com | admin123 |
| Barber | john@stylehub.com | barber123 |
| Barber | mike@stylehub.com | barber123 |

---

*StyleHub v1.0 — Built with MERN Stack*
