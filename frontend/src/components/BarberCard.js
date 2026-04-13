import React from 'react';
import { Link } from 'react-router-dom';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
function getOpenDays(av) {
  if (!av) return '';
  return DAYS.filter(d => av[d]?.isOpen).map(d => d.slice(0,3)).join(', ');
}

export default function BarberCard({ barber }) {
  const minPrice = barber.services?.length ? Math.min(...barber.services.map(s => s.price)) : 0;

  return (
    <div style={{
      background:'#fff', border:'1.5px solid #EBEBEB', borderRadius:20,
      overflow:'hidden', transition:'all 0.25s', boxShadow:'0 2px 12px rgba(91,46,255,0.06)',
      display:'flex', flexDirection:'column'
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor='#5B2EFF'; e.currentTarget.style.boxShadow='0 8px 32px rgba(91,46,255,0.15)'; e.currentTarget.style.transform='translateY(-3px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor='#EBEBEB'; e.currentTarget.style.boxShadow='0 2px 12px rgba(91,46,255,0.06)'; e.currentTarget.style.transform='translateY(0)'; }}>

      <div style={{ position:'relative' }}>
        <img
          src={barber.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(barber.name)}&background=EEE9FF&color=5B2EFF&size=300`}
          alt={barber.name}
          style={{ width:'100%', height:200, objectFit:'cover', display:'block' }}
        />
        <button style={{ position:'absolute', top:12, right:12, width:34, height:34, borderRadius:50, background:'#fff', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}>
          🤍
        </button>
      </div>

      <div style={{ padding:'16px 18px', flex:1, display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ fontSize:17, fontWeight:700, color:'#1A1A1A' }}>{barber.name}</div>
        {barber.bio && <div style={{ fontSize:13, color:'#777', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{barber.bio}</div>}
        {barber.location && <div style={{ fontSize:12, color:'#999', display:'flex', alignItems:'center', gap:4 }}>📍 {barber.location}</div>}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:4 }}>
          {barber.services?.slice(0,3).map((sv,i) => (
            <span key={i} style={{ background:'#F0EEFF', color:'#5B2EFF', borderRadius:99, padding:'4px 11px', fontSize:11, fontWeight:500 }}>{sv.name}</span>
          ))}
        </div>
        {barber.availability && <div style={{ fontSize:11, color:'#AAA' }}>Open: {getOpenDays(barber.availability)}</div>}
      </div>

      <div style={{ padding:'14px 18px', borderTop:'1.5px solid #F5F5F5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'#AAA' }}>Starting from</div>
          <div style={{ fontSize:18, fontWeight:800, color:'#5B2EFF' }}>${minPrice}</div>
        </div>
        <Link to={`/barber/${barber._id}`}>
          <button style={{ padding:'10px 22px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all 0.2s' }}>
            Book Now ↗
          </button>
        </Link>
      </div>
    </div>
  );
}
