import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, barbersAPI } from '../services/api';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const STATUS_COLORS = { pending:'#F59E0B', confirmed:'#22C55E', cancelled:'#EF4444', completed:'#5B2EFF' };

function today() { return new Date().toISOString().split('T')[0]; }

export default function BarberDashboard() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [dateFilter, setDateFilter] = useState(today());
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name:'', bio:'', photo:'', location:'', phone:'', services:[], availability:{} });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) setProfile({ name: user.name, bio: user.bio||'', photo: user.photo||'', location: user.location||'', phone: user.phone||'', services: user.services||[], availability: user.availability||{} });
  }, [user]);

  useEffect(() => {
    setLoading(true);
    bookingsAPI.getMine({ date: dateFilter })
      .then(r => setBookings(r.data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [dateFilter]);

  const updateStatus = async (id, status) => {
    try {
      const res = await bookingsAPI.updateStatus(id, status);
      setBookings(b => b.map(bk => bk._id === id ? res.data : bk));
    } catch {}
  };

  const saveProfile = async () => {
    setSaving(true); setMsg('');
    try {
      const res = await barbersAPI.updateProfile(profile);
      updateUser(res.data);
      setMsg('Profile saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch { setMsg('Failed to save. Try again.'); }
    finally { setSaving(false); }
  };

  const addService = () => setProfile(p => ({ ...p, services: [...p.services, { name:'', price:0, duration:30 }] }));
  const removeService = (i) => setProfile(p => ({ ...p, services: p.services.filter((_,idx) => idx !== i) }));
  const updateService = (i, field, val) => setProfile(p => ({ ...p, services: p.services.map((s,idx) => idx === i ? {...s, [field]: field === 'price' || field === 'duration' ? Number(val) : val} : s) }));
  const toggleDay = (day) => setProfile(p => ({ ...p, availability: { ...p.availability, [day]: { ...p.availability[day], isOpen: !p.availability[day]?.isOpen }}}));
  const updateDay = (day, field, val) => setProfile(p => ({ ...p, availability: { ...p.availability, [day]: { ...p.availability[day], [field]: val }}}));

  const tabStyle = (t) => ({ padding:'10px 20px', border:'none', background: tab === t ? '#F0EEFF' : 'transparent', color: tab === t ? '#5B2EFF' : '#666', fontWeight: tab === t ? 700 : 500, fontSize:14, cursor:'pointer', borderBottom: tab === t ? '2px solid #5B2EFF' : '2px solid transparent', transition:'all 0.15s' });

  const stats = [
    { label:'Today', value: bookings.filter(b => b.date === today()).length },
    { label:'Pending', value: bookings.filter(b => b.status === 'pending').length },
    { label:'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length },
    { label:'Revenue', value: `$${bookings.filter(b => b.status === 'completed').reduce((sum,b) => sum + (b.service?.price||0), 0)}` }
  ];

  return (
    <div style={{ background:'#F8F7FF', minHeight:'100vh' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 20px' }}>

        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontSize:26, fontWeight:800 }}>Dashboard</h1>
          <p style={{ color:'#999', fontSize:14 }}>Welcome back, {user?.name}</p>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background:'#fff', border:'1.5px solid #EBEBEB', borderRadius:16, padding:'18px 20px', boxShadow:'0 2px 10px rgba(91,46,255,0.06)' }}>
              <div style={{ fontSize:12, color:'#AAA', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>{s.label}</div>
              <div style={{ fontSize:28, fontWeight:800, color:'#5B2EFF', marginTop:4 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ background:'#fff', borderRadius:16, border:'1.5px solid #EBEBEB', overflow:'hidden', boxShadow:'0 2px 10px rgba(91,46,255,0.06)' }}>
          <div style={{ display:'flex', borderBottom:'1.5px solid #EBEBEB' }}>
            <button style={tabStyle('bookings')} onClick={() => setTab('bookings')}>📅 Bookings</button>
            <button style={tabStyle('profile')}  onClick={() => setTab('profile')}>👤 Profile</button>
            <button style={tabStyle('services')} onClick={() => setTab('services')}>✂️ Services</button>
            <button style={tabStyle('schedule')} onClick={() => setTab('schedule')}>🕐 Schedule</button>
          </div>

          <div style={{ padding:24 }}>
            {/* BOOKINGS TAB */}
            {tab === 'bookings' && (
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                  <div style={{ fontWeight:600, fontSize:15 }}>Appointments</div>
                  <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width:'auto', padding:'8px 12px' }}/>
                </div>
                {loading ? <div style={{ textAlign:'center', padding:40, color:'#AAA' }}>Loading...</div> :
                 bookings.length === 0 ? <div style={{ textAlign:'center', padding:40, color:'#AAA' }}>No bookings for this date.</div> : (
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {bookings.map(b => (
                      <div key={b._id} style={{ background:'#F8F7FF', border:'1.5px solid #EBEBEB', borderRadius:14, padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                          <div style={{ width:42, height:42, borderRadius:12, background:'#EEE9FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>✂️</div>
                          <div>
                            <div style={{ fontWeight:700, fontSize:15 }}>{b.customerName}</div>
                            <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{b.customerEmail} · {b.customerPhone}</div>
                          </div>
                        </div>
                        <div style={{ textAlign:'center' }}>
                          <div style={{ fontWeight:600, fontSize:14 }}>{b.service?.name}</div>
                          <div style={{ fontSize:12, color:'#AAA' }}>{b.startTime} – {b.endTime}</div>
                        </div>
                        <div style={{ fontWeight:700, color:'#5B2EFF', fontSize:16 }}>${b.service?.price}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ padding:'4px 12px', borderRadius:99, fontSize:11, fontWeight:700, background: `${STATUS_COLORS[b.status]}20`, color: STATUS_COLORS[b.status], textTransform:'capitalize' }}>{b.status}</span>
                          {b.status === 'pending' && (
                            <div style={{ display:'flex', gap:6 }}>
                              <button onClick={() => updateStatus(b._id,'confirmed')} style={{ padding:'6px 12px', borderRadius:8, border:'none', background:'#DCFCE7', color:'#15803D', fontWeight:600, fontSize:12, cursor:'pointer' }}>Confirm</button>
                              <button onClick={() => updateStatus(b._id,'cancelled')} style={{ padding:'6px 12px', borderRadius:8, border:'none', background:'#FEE2E2', color:'#B91C1C', fontWeight:600, fontSize:12, cursor:'pointer' }}>Cancel</button>
                            </div>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => updateStatus(b._id,'completed')} style={{ padding:'6px 12px', borderRadius:8, border:'none', background:'#EEE9FF', color:'#5B2EFF', fontWeight:600, fontSize:12, cursor:'pointer' }}>Complete</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {tab === 'profile' && (
              <div style={{ maxWidth:600 }}>
                {msg && <div style={{ padding:'10px 16px', borderRadius:10, background: msg.includes('success') ? '#DCFCE7' : '#FEE2E2', color: msg.includes('success') ? '#15803D' : '#B91C1C', marginBottom:18, fontSize:13, fontWeight:500 }}>{msg}</div>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Full Name</label><input value={profile.name} onChange={e => setProfile(p => ({...p, name:e.target.value}))} /></div>
                  <div className="form-group"><label>Phone</label><input value={profile.phone} onChange={e => setProfile(p => ({...p, phone:e.target.value}))} /></div>
                  <div className="form-group"><label>Location</label><input value={profile.location} onChange={e => setProfile(p => ({...p, location:e.target.value}))} /></div>
                  <div className="form-group"><label>Profile Photo URL</label><input value={profile.photo} onChange={e => setProfile(p => ({...p, photo:e.target.value}))} placeholder="https://..." /></div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Bio</label><textarea rows={4} value={profile.bio} onChange={e => setProfile(p => ({...p, bio:e.target.value}))} style={{ resize:'vertical' }} /></div>
                </div>
                <button onClick={saveProfile} disabled={saving} style={{ padding:'12px 28px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            )}

            {/* SERVICES TAB */}
            {tab === 'services' && (
              <div style={{ maxWidth:600 }}>
                {msg && <div style={{ padding:'10px 16px', borderRadius:10, background: msg.includes('success') ? '#DCFCE7' : '#FEE2E2', color: msg.includes('success') ? '#15803D' : '#B91C1C', marginBottom:18, fontSize:13 }}>{msg}</div>}
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
                  {profile.services.map((sv, i) => (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 100px 100px 40px', gap:10, alignItems:'end' }}>
                      <div className="form-group" style={{ marginBottom:0 }}><label>Service Name</label><input value={sv.name} onChange={e => updateService(i,'name',e.target.value)} placeholder="Haircut" /></div>
                      <div className="form-group" style={{ marginBottom:0 }}><label>Price ($)</label><input type="number" value={sv.price} onChange={e => updateService(i,'price',e.target.value)} /></div>
                      <div className="form-group" style={{ marginBottom:0 }}><label>Duration (min)</label><input type="number" value={sv.duration} onChange={e => updateService(i,'duration',e.target.value)} /></div>
                      <button onClick={() => removeService(i)} style={{ height:44, width:40, borderRadius:10, border:'1.5px solid #FECACA', background:'#FFF0F0', color:'#EF4444', fontWeight:700, cursor:'pointer', fontSize:16 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={addService} style={{ padding:'10px 20px', borderRadius:12, border:'1.5px solid #5B2EFF', background:'transparent', color:'#5B2EFF', fontWeight:600, fontSize:13, cursor:'pointer' }}>+ Add Service</button>
                  <button onClick={saveProfile} disabled={saving} style={{ padding:'10px 24px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* SCHEDULE TAB */}
            {tab === 'schedule' && (
              <div style={{ maxWidth:600 }}>
                {msg && <div style={{ padding:'10px 16px', borderRadius:10, background: msg.includes('success') ? '#DCFCE7' : '#FEE2E2', color: msg.includes('success') ? '#15803D' : '#B91C1C', marginBottom:18, fontSize:13 }}>{msg}</div>}
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:20 }}>
                  {DAYS.map(day => {
                    const av = profile.availability[day] || { isOpen:false, open:'09:00', close:'18:00' };
                    return (
                      <div key={day} style={{ display:'grid', gridTemplateColumns:'130px 80px 1fr 1fr', gap:12, alignItems:'center', padding:'12px 16px', background: av.isOpen ? '#F0EEFF' : '#F8F8F8', borderRadius:12, border:'1.5px solid', borderColor: av.isOpen ? '#D0C0FF' : '#EBEBEB' }}>
                        <span style={{ fontWeight:600, textTransform:'capitalize', fontSize:14, color: av.isOpen ? '#1A1A1A' : '#AAA' }}>{day}</span>
                        <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                          <input type="checkbox" checked={av.isOpen} onChange={() => toggleDay(day)} style={{ width:'auto', accentColor:'#5B2EFF' }} />
                          <span style={{ fontSize:12, color: av.isOpen ? '#5B2EFF' : '#AAA', fontWeight:500 }}>Open</span>
                        </label>
                        <div><label style={{ fontSize:11, color:'#AAA', display:'block', marginBottom:3 }}>Opens</label><input type="time" value={av.open} onChange={e => updateDay(day,'open',e.target.value)} disabled={!av.isOpen} style={{ opacity: av.isOpen ? 1 : 0.4 }} /></div>
                        <div><label style={{ fontSize:11, color:'#AAA', display:'block', marginBottom:3 }}>Closes</label><input type="time" value={av.close} onChange={e => updateDay(day,'close',e.target.value)} disabled={!av.isOpen} style={{ opacity: av.isOpen ? 1 : 0.4 }} /></div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={saveProfile} disabled={saving} style={{ padding:'12px 28px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer' }}>
                  {saving ? 'Saving...' : 'Save Schedule'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
