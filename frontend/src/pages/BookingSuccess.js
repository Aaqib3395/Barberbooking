import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function BookingSuccess() {
  const { state } = useLocation();

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ textAlign:'center', maxWidth:460 }}>
        <div style={{ width:90, height:90, background:'linear-gradient(135deg,#5B2EFF,#7B52FF)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', fontSize:40 }}>✓</div>
        <h1 style={{ fontSize:28, fontWeight:800, marginBottom:10, color:'#1A1A1A' }}>Booking Confirmed!</h1>
        <p style={{ color:'#777', fontSize:15, marginBottom:30, lineHeight:1.6 }}>
          Your appointment has been booked successfully. You'll receive a confirmation shortly.
        </p>

        {state && (
          <div style={{ background:'#fff', border:'1.5px solid #EBEBEB', borderRadius:18, padding:24, marginBottom:28, boxShadow:'0 4px 20px rgba(91,46,255,0.08)', textAlign:'left' }}>
            <div style={{ fontSize:13, color:'#AAA', fontWeight:600, textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Booking Details</div>
            {[
              { label:'Barber',  value: state.barber },
              { label:'Service', value: state.service },
              { label:'Date',    value: state.date },
              { label:'Time',    value: state.time }
            ].map(({ label, value }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #F5F5F5', fontSize:14 }}>
                <span style={{ color:'#999' }}>{label}</span>
                <span style={{ fontWeight:600, color:'#1A1A1A' }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <Link to="/">
            <button style={{ padding:'12px 28px', borderRadius:12, border:'1.5px solid #EBEBEB', background:'#fff', color:'#555', fontWeight:600, fontSize:14, cursor:'pointer' }}>
              Find More Barbers
            </button>
          </Link>
          <Link to="/">
            <button style={{ padding:'12px 28px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
