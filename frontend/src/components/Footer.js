import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0F0A1E', color: '#fff', marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 32px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>S</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>StyleHub</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, maxWidth: 260, marginBottom: 24 }}>
              Find and book the best barbers near you. Premium haircuts, fades, and styling — effortlessly.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['📘', '📸', '🐦', '💼'].map((icon, i) => (
                <div key={i} style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.08)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(91,46,255,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Platform', links: ['Find Barbers', 'How it Works', 'Pricing', 'Reviews'] },
            { title: 'For Barbers', links: ['Join StyleHub', 'Dashboard', 'Grow Your Business', 'Support'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] }
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 18 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map(link => (
                  <Link key={link} to="/" style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s', fontWeight: 500 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>© 2026 StyleHub. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <Link key={item} to="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
