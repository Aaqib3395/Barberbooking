import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

export default function AdminPanel() {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState({});
  const [barbers, setBarbers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.getStats(), adminAPI.getBarbers(), adminAPI.getBookings()])
      .then(([s, b, bk]) => { setStats(s.data); setBarbers(b.data); setBookings(bk.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deleteBarber = async (id) => {
    if (!window.confirm('Delete this barber and all their bookings?')) return;
    try {
      await adminAPI.deleteBarber(id);
      setBarbers(b => b.filter(x => x._id !== id));
    } catch {}
  };

  const tabStyle = (t) => ({ padding:'10px 20px', border:'none', background: tab === t ? '#F0EEFF' : 'transparent', color: tab === t ? '#5B2EFF' : '#666', fontWeight: tab === t ? 700 : 500, fontSize:14, cursor:'pointer', borderBottom: tab === t ? '2px solid #5B2EFF' : '2px solid transparent' });

  if (loading) return <div style={{ textAlign:'center', padding:80, color:'#AAA' }}>Loading...</div>;

  const statCards = [
    { label:'Total Barbers',   value: stats.totalBarbers || 0,  icon:'✂️' },
    { label:'Total Bookings',  value: stats.totalBookings || 0, icon:'📅' },
    { label:'Pending',         value: stats.pending || 0,       icon:'⏳' },
    { label:'Confirmed',       value: stats.confirmed || 0,     icon:'✅' }
  ];

  return (
    <div style={{ background:'#F8F7FF', minHeight:'100vh' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 20px' }}>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:800 }}>Admin Panel</h1>
          <p style={{ color:'#999', fontSize:14 }}>Manage barbers and bookings</p>
        </div>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
          {statCards.map(s => (
            <div key={s.label} style={{ background:'#fff', border:'1.5px solid #EBEBEB', borderRadius:16, padding:'18px 20px', boxShadow:'0 2px 10px rgba(91,46,255,0.06)' }}>
              <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:28, fontWeight:800, color:'#5B2EFF' }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#AAA', fontWeight:600, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #EBEBEB', overflow:'hidden', boxShadow:'0 2px 10px rgba(91,46,255,0.06)' }}>
          <div style={{ display:'flex', borderBottom:'1.5px solid #EBEBEB' }}>
            <button style={tabStyle('barbers')}  onClick={() => setTab('barbers')}>✂️ Barbers ({barbers.length})</button>
            <button style={tabStyle('bookings')} onClick={() => setTab('bookings')}>📅 Bookings ({bookings.length})</button>
          </div>

          <div style={{ padding:24 }}>
            {tab === 'barbers' && (
              <div>
                {barbers.length === 0 ? <div style={{ textAlign:'center', padding:40, color:'#AAA' }}>No barbers yet.</div> : (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {barbers.map(b => (
                      <div key={b._id} style={{ background:'#F8F7FF', border:'1.5px solid #EBEBEB', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, justifyContent:'space-between', flexWrap:'wrap' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                          <img src={b.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(b.name)}&background=EEE9FF&color=5B2EFF&size=80`} alt={b.name} style={{ width:48, height:48, borderRadius:12, objectFit:'cover' }} />
                          <div>
                            <div style={{ fontWeight:700, fontSize:15 }}>{b.name}</div>
                            <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{b.email} {b.location && `· ${b.location}`}</div>
                            <div style={{ fontSize:12, color:'#AAA', marginTop:2 }}>{b.services?.length || 0} services</div>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          <span style={{ padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:600, background: b.isActive ? '#DCFCE7' : '#FEE2E2', color: b.isActive ? '#15803D' : '#B91C1C' }}>
                            {b.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button onClick={() => deleteBarber(b._id)} style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'#FEE2E2', color:'#B91C1C', fontWeight:600, fontSize:12, cursor:'pointer' }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'bookings' && (
              <div>
                {bookings.length === 0 ? <div style={{ textAlign:'center', padding:40, color:'#AAA' }}>No bookings yet.</div> : (
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                      <thead>
                        <tr style={{ borderBottom:'1.5px solid #EBEBEB' }}>
                          {['Customer','Barber','Service','Date','Time','Status'].map(h => (
                            <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:600, color:'#AAA', fontSize:12, textTransform:'uppercase', letterSpacing:0.5 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b._id} style={{ borderBottom:'1px solid #F5F5F5' }}>
                            <td style={{ padding:'12px 14px' }}>
                              <div style={{ fontWeight:600 }}>{b.customerName}</div>
                              <div style={{ fontSize:11, color:'#AAA' }}>{b.customerEmail}</div>
                            </td>
                            <td style={{ padding:'12px 14px', color:'#555' }}>{b.barber?.name || 'N/A'}</td>
                            <td style={{ padding:'12px 14px' }}>
                              <div style={{ fontWeight:500 }}>{b.service?.name}</div>
                              <div style={{ fontSize:11, color:'#AAA' }}>${b.service?.price}</div>
                            </td>
                            <td style={{ padding:'12px 14px', color:'#555', fontFamily:'monospace', fontSize:12 }}>{b.date}</td>
                            <td style={{ padding:'12px 14px', color:'#555', fontFamily:'monospace', fontSize:12 }}>{b.startTime}</td>
                            <td style={{ padding:'12px 14px' }}>
                              <span style={{ padding:'4px 10px', borderRadius:99, fontSize:11, fontWeight:600, background: b.status==='confirmed' ? '#DCFCE7' : b.status==='pending' ? '#FEF3C7' : b.status==='cancelled' ? '#FEE2E2' : '#EEE9FF', color: b.status==='confirmed' ? '#15803D' : b.status==='pending' ? '#92400E' : b.status==='cancelled' ? '#B91C1C' : '#5B2EFF', textTransform:'capitalize' }}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
