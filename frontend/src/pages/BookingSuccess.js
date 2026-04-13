import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BookingSuccess() {
  const { state } = useLocation();
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#F4F2FF,#EEE9FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 500, transition: 'all 0.5s ease', opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)' }}>

        {/* Success icon */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
          <div style={{ width: 100, height: 100, background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 20px 60px rgba(91,46,255,0.4)', fontSize: 44 }}>
            ✓
          </div>
          <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '2px solid', borderColor: 'rgba(91,46,255,0.2)', animation: 'pulse 2s infinite' }} />
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0F0A1E', letterSpacing: '-0.5px', marginBottom: 10 }}>Booking Confirmed! 🎉</h1>
        <p style={{ color: '#6E6E8A', fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
          Your appointment is locked in. Get ready to look your best!
        </p>

        {state && (
          <div style={{ background: '#fff', border: '1.5px solid #E8E4F3', borderRadius: 24, padding: '24px 28px', marginBottom: 28, boxShadow: '0 8px 32px rgba(91,46,255,0.1)', textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: '#9898B0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Appointment Details</div>
            {[
              { icon: '✂️', label: 'Barber',   value: state.barber },
              { icon: '💈', label: 'Service',  value: state.service },
              { icon: '📅', label: 'Date',     value: state.date },
              { icon: '🕐', label: 'Time',     value: state.time },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F4F2FF' }}>
                <div style={{ width: 36, height: 36, background: '#F4F2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: '#9898B0', fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#0F0A1E' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ background: 'rgba(0,196,140,0.1)', border: '1px solid rgba(0,196,140,0.25)', borderRadius: 14, padding: '12px 18px', marginBottom: 28, fontSize: 13, color: '#007A57', fontWeight: 600 }}>
          📧 A confirmation has been noted. See you there!
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link to="/">
            <button style={{ padding: '13px 28px', borderRadius: 14, border: '1.5px solid #E8E4F3', background: '#fff', color: '#4A4A6A', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
              Find More Barbers
            </button>
          </Link>
          <Link to="/">
            <button style={{ padding: '13px 28px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 6px 20px rgba(91,46,255,0.3)', fontFamily: 'Plus Jakarta Sans' }}>
              Back to Home →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
