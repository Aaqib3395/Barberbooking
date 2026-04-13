import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { barbersAPI } from '../services/api';
import BarberCard from '../components/BarberCard';

const CATEGORIES = [
  { icon:'✂️', label:'Haircut' },
  { icon:'💄', label:'Make Up' },
  { icon:'🪒', label:'Shaving' },
  { icon:'🎨', label:'Coloring' },
  { icon:'💈', label:'Styling' }
];

export default function Home() {
  const [barbers, setBarbers]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    barbersAPI.getAll()
      .then(r => { setBarbers(r.data); setFiltered(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (v) => {
    setSearch(v);
    const q = v.toLowerCase();
    setFiltered(barbers.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.location?.toLowerCase().includes(q) ||
      b.services?.some(s => s.name.toLowerCase().includes(q))
    ));
  };

  return (
    <div>
      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg, #5B2EFF 0%, #7B52FF 100%)', padding:'60px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <div style={{ display:'inline-block', background:'rgba(255,255,255,0.15)', borderRadius:99, padding:'6px 18px', color:'#fff', fontSize:12, fontWeight:600, marginBottom:20, backdropFilter:'blur(8px)' }}>
            ✨ Find Skilled Barbers Near You
          </div>
          <h1 style={{ fontSize:'clamp(32px,5vw,52px)', fontWeight:800, color:'#fff', lineHeight:1.15, marginBottom:16 }}>
            Book Your Barber<br/><span style={{ color:'#FFE082' }}>Appointments</span> Effortlessly
          </h1>
          <p style={{ color:'rgba(255,255,255,0.8)', fontSize:16, marginBottom:36, lineHeight:1.6 }}>
            Find skilled barbers near you and explore trending styles with ease.
          </p>

          {/* Search bar */}
          <div style={{ display:'flex', gap:10, maxWidth:500, margin:'0 auto', background:'#fff', borderRadius:16, padding:'8px 8px 8px 18px', boxShadow:'0 8px 32px rgba(0,0,0,0.15)' }}>
            <span style={{ color:'#AAA', display:'flex', alignItems:'center', fontSize:18 }}>🔍</span>
            <input
              type="text"
              placeholder="Search Salon, Specialist..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              style={{ flex:1, border:'none', background:'transparent', fontSize:14, color:'#1A1A1A', outline:'none', padding:'4px 0' }}
            />
            <button style={{ padding:'10px 20px', borderRadius:10, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer' }}>
              Search
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 24px' }}>

        {/* EXCLUSIVE DEAL BANNER */}
        <div style={{ background:'linear-gradient(135deg, #5B2EFF, #7B52FF)', borderRadius:20, overflow:'hidden', marginBottom:40, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'28px 32px', position:'relative' }}>
          <div style={{ zIndex:1 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:600, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Exclusive Deals</div>
            <div style={{ fontSize:28, fontWeight:800, color:'#fff', lineHeight:1.2, marginBottom:16 }}>Get Special Discounts<br/>Up to 50%</div>
            <Link to="/">
              <button style={{ padding:'10px 24px', borderRadius:99, border:'1.5px solid rgba(255,255,255,0.5)', background:'transparent', color:'#fff', fontWeight:600, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                Book Now ↗
              </button>
            </Link>
          </div>
          <div style={{ fontSize:80, opacity:0.15, position:'absolute', right:32 }}>💈</div>
        </div>

        {/* CATEGORIES */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <h2 style={{ fontSize:20, fontWeight:700 }}>Popular Categories</h2>
            <span style={{ fontSize:13, color:'#5B2EFF', fontWeight:600, cursor:'pointer' }}>See All ›</span>
          </div>
          <div style={{ display:'flex', gap:16, overflowX:'auto', paddingBottom:4 }}>
            {CATEGORIES.map((c) => (
              <div key={c.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor:'pointer', flexShrink:0 }}>
                <div style={{ width:72, height:72, background:'#F0EEFF', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#5B2EFF'; e.currentTarget.style.transform='scale(1.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='#F0EEFF'; e.currentTarget.style.transform='scale(1)'; }}>
                  {c.icon}
                </div>
                <span style={{ fontSize:12, fontWeight:500, color:'#444' }}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BARBERS LIST */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <h2 style={{ fontSize:20, fontWeight:700 }}>
              {search ? `Results for "${search}"` : 'Highest Rated Barbers'}
            </h2>
            <span style={{ fontSize:13, color:'#999' }}>{filtered.length} barbers</span>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#AAA' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>💈</div>
              <div>Loading barbers...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#AAA' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
              <div style={{ fontSize:16, fontWeight:600, color:'#1A1A1A', marginBottom:8 }}>No barbers found</div>
              <div style={{ fontSize:14 }}>Try a different search</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
              {filtered.map(b => <BarberCard key={b._id} barber={b} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
