import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const s = {
    nav: { background:'#fff', borderBottom:'1.5px solid #EBEBEB', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 12px rgba(91,46,255,0.06)' },
    inner: { maxWidth:1200, margin:'0 auto', padding:'0 24px', height:68, display:'flex', alignItems:'center', justifyContent:'space-between' },
    logo: { display:'flex', alignItems:'center', gap:8 },
    logoIcon: { width:34, height:34, background:'#5B2EFF', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16 },
    logoText: { fontSize:20, fontWeight:800, color:'#5B2EFF', letterSpacing:'-0.5px' },
    right: { display:'flex', alignItems:'center', gap:10 },
    link: { color:'#555', fontSize:14, fontWeight:500, padding:'8px 14px', borderRadius:10, transition:'all 0.2s' },
    name: { color:'#5B2EFF', fontSize:14, fontWeight:600, padding:'6px 12px', background:'#EEE9FF', borderRadius:99 }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <Link to="/" style={s.logo}>
          <div style={s.logoIcon}>S</div>
          <span style={s.logoText}>StyleHub</span>
        </Link>
        <div style={s.right}>
          <Link to="/" style={s.link}>Find Barbers</Link>
          {!user ? (
            <>
              <Link to="/login" style={s.link}>Login</Link>
              <Link to="/register">
                <button style={{ padding:'9px 20px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:600, fontSize:14, cursor:'pointer', transition:'all 0.2s' }}>
                  Join as Barber
                </button>
              </Link>
            </>
          ) : (
            <>
              <span style={s.name}>Hi, {user.name.split(' ')[0]}</span>
              {user.role === 'barber' && <Link to="/dashboard" style={s.link}>Dashboard</Link>}
              {user.role === 'admin'  && <Link to="/admin"     style={s.link}>Admin</Link>}
              <button onClick={handleLogout} style={{ padding:'9px 18px', borderRadius:12, border:'1.5px solid #EBEBEB', background:'#fff', color:'#555', fontWeight:500, fontSize:13, cursor:'pointer' }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
