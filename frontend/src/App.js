import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home            from './pages/Home';
import Login           from './pages/Login';
import Register        from './pages/Register';
import BarberProfile   from './pages/BarberProfile';
import BookingSuccess  from './pages/BookingSuccess';
import BarberDashboard from './pages/BarberDashboard';
import AdminPanel      from './pages/AdminPanel';

function Layout() {
  const location = useLocation();
  const hideFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/barber/:id"      element={<BarberProfile />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/dashboard" element={
          <ProtectedRoute role="barber"><BarberDashboard /></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
        } />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}
