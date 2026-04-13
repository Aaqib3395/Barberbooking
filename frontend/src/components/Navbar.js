import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: scrolled ? 'rgba(255,255,255,0.95)' : '#fff',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: '1.5px solid #E8E4F3',
        boxShadow: scrolled ? '0 4px 32px rgba(91,46,255,0.08)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #5B2EFF, #7B52FF)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(91,46,255,0.35)' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: 'Plus Jakarta Sans' }}>S</span>
            </div>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: '#5B2EFF', letterSpacing: '-0.5px', lineHeight: 1 }}>StyleHub</div>
              <div style={{ fontSize: 9, color: '#9898B0', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>Book & Style</div>
            </div>
          </Link>

          {/* Center nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[{ path: '/', label: 'Explore' }, { path: '/login', label: 'For Barbers' }].map(({ path, label }) => (
              <Link key={path} to={path} style={{
                padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                color: isActive(path) ? '#5B2EFF' : '#4A4A6A',
                background: isActive(path) ? '#EEE9FF' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { if (!isActive(path)) { e.currentTarget.style.background = '#F4F2FF'; e.currentTarget.style.color = '#5B2EFF'; }}}
              onMouseLeave={e => { if (!isActive(path)) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A4A6A'; }}}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!user ? (
              <>
                <Link to="/login">
                  <button style={{ padding: '9px 18px', borderRadius: 10, border: '1.5px solid #E8E4F3', background: '#fff', color: '#4A4A6A', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#5B2EFF'; e.currentTarget.style.color = '#5B2EFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E4F3'; e.currentTarget.style.color = '#4A4A6A'; }}>
                    Sign In
                  </button>
                </Link>
                <Link to="/register">
                  <button style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #5B2EFF, #7B52FF)', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 16px rgba(91,46,255,0.3)', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(91,46,255,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(91,46,255,0.3)'; }}>
                    Join as Barber ✦
                  </button>
                </Link>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: '#F4F2FF', borderRadius: 10, border: '1.5px solid #E8E4F3' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#5B2EFF' }}>{user.name.split(' ')[0]}</span>
                </div>
                {user.role === 'barber' && (
                  <Link to="/dashboard">
                    <button style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #E8E4F3', background: '#fff', color: '#4A4A6A', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>Dashboard</button>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin">
                    <button style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #E8E4F3', background: '#fff', color: '#4A4A6A', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>Admin</button>
                  </Link>
                )}
                <button onClick={handleLogout} style={{ padding: '9px 16px', borderRadius: 10, border: '1.5px solid #FFE4E6', background: '#FFF5F5', color: '#CC1F32', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
