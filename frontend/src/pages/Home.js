import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { barbersAPI } from '../services/api';
import BarberCard from '../components/BarberCard';

const CATEGORIES = [
  { icon: '✂️', label: 'Haircut',   count: '120+' },
  { icon: '🪒', label: 'Shaving',   count: '80+' },
  { icon: '💈', label: 'Fade',      count: '95+' },
  { icon: '🎨', label: 'Coloring',  count: '45+' },
  { icon: '💆', label: 'Styling',   count: '60+' },
  { icon: '🧔', label: 'Beard',     count: '75+' },
];

const HERO_SLIDES = [
  { title: 'Classic Haircut', img: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=500&fit=crop' },
  { title: 'Skin Fade',       img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=500&fit=crop' },
  { title: 'Buzz Cut',        img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=500&fit=crop' },
];

const STATS = [
  { value: '500+', label: 'Skilled Barbers' },
  { value: '10k+', label: 'Happy Clients' },
  { value: '50+', label: 'Cities' },
  { value: '4.9★', label: 'Avg Rating' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: '🔍', title: 'Find Your Barber', desc: 'Browse top-rated barbers in your area by style, price, and availability.' },
  { step: '02', icon: '📅', title: 'Book a Slot',      desc: 'Pick a service, choose your date and time. Instant confirmation, no waiting.' },
  { step: '03', icon: '💈', title: 'Get Styled',       desc: 'Show up and enjoy a premium barbershop experience. Looking fresh is easy.' },
];

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #E8E4F3', borderRadius: 24, overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: 220 }} />
      <div style={{ padding: 20 }}>
        <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '80%' }} />
      </div>
    </div>
  );
}

export default function Home() {
  const [barbers, setBarbers]     = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [heroIndex, setHeroIndex] = useState(0);
  const searchRef = useRef(null);

  useEffect(() => {
    barbersAPI.getAll()
      .then(r => { setBarbers(r.data); setFiltered(r.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 3000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (v) => {
    setSearch(v);
    const q = v.toLowerCase();
    setFiltered(!q ? barbers : barbers.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.location?.toLowerCase().includes(q) ||
      b.services?.some(s => s.name.toLowerCase().includes(q))
    ));
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #0F0A1E 0%, #1A0E3D 60%, #2D1070 100%)', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden', position: 'relative', padding: '80px 0' }}>

        {/* Background circles */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(91,46,255,0.15)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(123,82,255,0.1)', filter: 'blur(60px)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', width: '100%' }}>

          {/* Left: Text */}
          <div className="anim-fadeUp">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(91,46,255,0.25)', borderRadius: 99, padding: '7px 16px', marginBottom: 28, border: '1px solid rgba(91,46,255,0.4)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C48C', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.5 }}>500+ Barbers Available Now</span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1.5px' }}>
              Book Your Barber<br />
              <span style={{ background: 'linear-gradient(135deg, #B794FF, #7B52FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Appointments</span>
              <br />Effortlessly
            </h1>

            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 40, maxWidth: 420 }}>
              Find skilled barbers near you, explore trending styles, and book instantly — all in one place.
            </p>

            {/* Search */}
            <div style={{ display: 'flex', gap: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '8px 8px 8px 20px', border: '1.5px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', marginBottom: 32 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', fontSize: 18 }}>🔍</span>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search barbers, styles, locations..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: '#fff', outline: 'none', padding: '6px 0', fontWeight: 500 }}
              />
              <button
                onClick={() => searchRef.current?.focus()}
                style={{ padding: '11px 24px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 16px rgba(91,46,255,0.4)', fontFamily: 'Plus Jakarta Sans' }}>
                Search
              </button>
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => { searchRef.current?.scrollIntoView({ behavior:'smooth' }); document.getElementById('barbers-section')?.scrollIntoView({ behavior:'smooth' }); }}
                style={{ padding: '14px 32px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 8px 32px rgba(91,46,255,0.4)', fontFamily: 'Plus Jakarta Sans' }}>
                Booking Now 📅
              </button>
              <Link to="/register">
                <button style={{ padding: '14px 28px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.25)', background: 'transparent', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                  Join as Barber →
                </button>
              </Link>
            </div>
          </div>

          {/* Right: Image carousel */}
          <div className="anim-fadeUp anim-d2" style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center' }}>
            {HERO_SLIDES.map((slide, i) => {
              const isCenter = i === heroIndex;
              const offset = i - heroIndex;
              return (
                <div key={i} style={{
                  position: 'relative',
                  width: isCenter ? 220 : 160,
                  height: isCenter ? 320 : 260,
                  borderRadius: 28,
                  overflow: 'hidden',
                  transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                  flexShrink: 0,
                  opacity: Math.abs(offset) > 1 ? 0.4 : isCenter ? 1 : 0.7,
                  transform: isCenter ? 'scale(1) translateY(-10px)' : 'scale(0.9)',
                  boxShadow: isCenter ? '0 30px 80px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.2)',
                }}>
                  <img src={slide.img} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '6px 14px', backdropFilter: 'blur(8px)', display: 'inline-block' }}>
                      <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{slide.title}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1.5px solid #E8E4F3' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {STATS.map((stat, i) => (
              <div key={stat.label} style={{ padding: '28px 24px', textAlign: 'center', borderRight: i < 3 ? '1.5px solid #E8E4F3' : 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F4F2FF'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#5B2EFF', letterSpacing: '-1px' }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: '#9898B0', fontWeight: 600, marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 24px' }}>

        {/* ── DEAL BANNER ─────────────────────── */}
        <div style={{ background: 'linear-gradient(135deg, #5B2EFF 0%, #7B52FF 60%, #9B72FF 100%)', borderRadius: 28, overflow: 'hidden', marginBottom: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '36px 48px', position: 'relative' }}
          className="anim-fadeUp">
          <div style={{ position: 'absolute', top: -60, right: 200, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: -40, right: 80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ zIndex: 1 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>✦ Exclusive Deal</div>
            <div style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 8, letterSpacing: '-0.5px' }}>
              Get Special Discounts<br /><span style={{ color: '#FFE082' }}>Up to 50% Off</span>
            </div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>Limited time offer on premium barber sessions</div>
            <button style={{ padding: '12px 28px', borderRadius: 99, border: '2px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Plus Jakarta Sans', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Book Now ↗
            </button>
          </div>
          <div style={{ fontSize: 100, opacity: 0.18, zIndex: 1 }}>💈</div>
        </div>

        {/* ── CATEGORIES ──────────────────────── */}
        <section style={{ marginBottom: 56 }} className="anim-fadeUp anim-d1">
          <div className="section-header">
            <h2 className="section-title">Popular Categories</h2>
            <span className="section-link">See All ›</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 14 }}>
            {CATEGORIES.map((cat, i) => {
              const isActive = activeCategory === cat.label;
              return (
                <div key={cat.label} onClick={() => setActiveCategory(isActive ? 'All' : cat.label)}
                  style={{
                    background: isActive ? 'linear-gradient(135deg,#5B2EFF,#7B52FF)' : '#fff',
                    border: '1.5px solid', borderColor: isActive ? '#5B2EFF' : '#E8E4F3',
                    borderRadius: 20, padding: '20px 14px', textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 8px 32px rgba(91,46,255,0.3)' : 'none',
                    transform: isActive ? 'scale(1.04)' : 'scale(1)'
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = '#5B2EFF'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(91,46,255,0.12)'; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = '#E8E4F3'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}}>
                  <div style={{ fontSize: 30, marginBottom: 8 }}>{cat.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#fff' : '#0F0A1E', marginBottom: 3 }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: isActive ? 'rgba(255,255,255,0.7)' : '#9898B0', fontWeight: 600 }}>{cat.count}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────── */}
        <section style={{ marginBottom: 64, background: 'linear-gradient(135deg,#F4F2FF,#EEE9FF)', borderRadius: 28, padding: '48px 40px' }} className="anim-fadeUp">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F0A1E', letterSpacing: '-0.5px', marginBottom: 8 }}>How It Works</h2>
            <p style={{ fontSize: 15, color: '#6E6E8A' }}>Book your next haircut in 3 simple steps</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', position: 'relative', boxShadow: '0 4px 20px rgba(91,46,255,0.08)', textAlign: 'center', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(91,46,255,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(91,46,255,0.08)'; }}>
                <div style={{ position: 'absolute', top: -1, right: 20, fontSize: 48, fontWeight: 900, color: '#EEE9FF', lineHeight: 1, fontFamily: 'Plus Jakarta Sans' }}>{step.step}</div>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{step.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F0A1E', marginBottom: 10, letterSpacing: '-0.2px' }}>{step.title}</div>
                <div style={{ fontSize: 13, color: '#6E6E8A', lineHeight: 1.7 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BARBERS GRID ────────────────────── */}
        <section id="barbers-section">
          <div className="section-header">
            <h2 className="section-title">
              {search ? `Results for "${search}"` : 'Top Rated Barbers'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: '#9898B0', fontWeight: 600, background: '#F4F2FF', padding: '5px 12px', borderRadius: 99 }}>
                {filtered.length} barbers
              </span>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(290px,1fr))', gap: 24 }}>
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F0A1E', marginBottom: 8 }}>No barbers found</div>
              <div style={{ fontSize: 14, color: '#9898B0' }}>Try a different search term</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {filtered.map((b, i) => <BarberCard key={b._id} barber={b} delay={i * 80} />)}
            </div>
          )}
        </section>
      </div>

      {/* ── CTA SECTION ─────────────────────── */}
      <section style={{ background: '#0F0A1E', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#7B52FF', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>✦ Join StyleHub</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 16, lineHeight: 1.2 }}>
            Are you a barber? <span style={{ color: '#7B52FF' }}>Grow your business.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36 }}>
            Join hundreds of barbers already using StyleHub to fill their calendar and grow their clientele.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/register">
              <button style={{ padding: '15px 36px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 8px 32px rgba(91,46,255,0.4)', fontFamily: 'Plus Jakarta Sans' }}>
                Get Started Free →
              </button>
            </Link>
            <Link to="/">
              <button style={{ padding: '15px 28px', borderRadius: 14, border: '1.5px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 15, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
