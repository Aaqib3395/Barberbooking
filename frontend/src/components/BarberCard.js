import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

function getOpenDays(av) {
  if (!av) return '';
  const open = DAYS.filter(d => av[d]?.isOpen);
  if (open.length === 0) return 'Closed';
  if (open.length === 6 || open.length === 7) return 'Mon – Sat';
  return open.slice(0,2).map(d => d.slice(0,3)).join(', ') + (open.length > 2 ? ` +${open.length - 2}` : '');
}

function Stars({ rating = 4.8 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', gap: 1 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ color: i <= Math.floor(rating) ? '#FFB800' : '#E8E4F3', fontSize: 12 }}>★</span>
        ))}
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color: '#4A4A6A' }}>{rating}</span>
    </div>
  );
}

export default function BarberCard({ barber, delay = 0 }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const minPrice = barber.services?.length ? Math.min(...barber.services.map(s => s.price)) : 0;
  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const reviews = Math.floor(40 + Math.random() * 120);

  return (
    <div
      className="anim-fadeUp"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{
        background: '#fff',
        border: '1.5px solid',
        borderColor: hovered ? '#D4C5FF' : '#E8E4F3',
        borderRadius: 24,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 64px rgba(91,46,255,0.16)' : '0 4px 16px rgba(91,46,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
          <img
            src={barber.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(barber.name)}&background=EEE9FF&color=5B2EFF&size=400&bold=true`}
            alt={barber.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,10,30,0.5) 0%, transparent 60%)' }} />

          {/* Like button */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
            style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', fontSize: 16, transition: 'all 0.2s', transform: liked ? 'scale(1.15)' : 'scale(1)' }}>
            {liked ? '❤️' : '🤍'}
          </button>

          {/* Availability badge */}
          <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
            <div style={{ background: 'rgba(0,196,140,0.9)', borderRadius: 99, padding: '4px 10px', fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(8px)' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block' }}></span>
              Available Today
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0F0A1E', letterSpacing: '-0.3px' }}>{barber.name}</div>
              {barber.location && <div style={{ fontSize: 12, color: '#9898B0', marginTop: 2, display: 'flex', alignItems: 'center', gap: 3 }}>📍 {barber.location}</div>}
            </div>
            <Stars rating={parseFloat(rating)} />
          </div>

          {barber.bio && (
            <p style={{ fontSize: 13, color: '#6E6E8A', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {barber.bio}
            </p>
          )}

          {/* Service chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {barber.services?.slice(0, 3).map((sv, i) => (
              <span key={i} style={{ background: '#F4F2FF', color: '#5B2EFF', borderRadius: 99, padding: '4px 10px', fontSize: 11, fontWeight: 600, border: '1px solid #E8E4F3' }}>
                {sv.name}
              </span>
            ))}
            {barber.services?.length > 3 && (
              <span style={{ background: '#F4F2FF', color: '#9898B0', borderRadius: 99, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>
                +{barber.services.length - 3} more
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#9898B0' }}>
            <span>🕐 {getOpenDays(barber.availability)}</span>
            <span>·</span>
            <span>{reviews} reviews</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1.5px solid #F4F2FF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: '#9898B0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>From</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#5B2EFF', letterSpacing: '-0.5px' }}>${minPrice}</div>
          </div>
          <Link to={`/barber/${barber._id}`}>
            <button style={{
              padding: '10px 22px', borderRadius: 12, border: 'none',
              background: hovered ? 'linear-gradient(135deg,#5B2EFF,#7B52FF)' : '#F4F2FF',
              color: hovered ? '#fff' : '#5B2EFF',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: hovered ? '0 8px 24px rgba(91,46,255,0.35)' : 'none',
              fontFamily: 'Plus Jakarta Sans'
            }}>
              Book Now →
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
