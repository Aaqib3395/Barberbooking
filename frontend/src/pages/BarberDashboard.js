import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, barbersAPI } from '../services/api';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const STATUS_CONFIG = {
  pending:   { color:'#926A00', bg:'rgba(255,184,0,0.12)',   border:'rgba(255,184,0,0.3)',   label:'Pending' },
  confirmed: { color:'#007A57', bg:'rgba(0,196,140,0.12)',   border:'rgba(0,196,140,0.3)',   label:'Confirmed' },
  cancelled: { color:'#CC1F32', bg:'rgba(255,71,87,0.12)',   border:'rgba(255,71,87,0.3)',   label:'Cancelled' },
  completed: { color:'#5B2EFF', bg:'rgba(91,46,255,0.12)',   border:'rgba(91,46,255,0.2)',   label:'Completed' },
};

function today() { return new Date().toISOString().split('T')[0]; }

export default function BarberDashboard() {
  const { user, updateUser } = useAuth();
  const [tab, setTab]         = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [dateFilter, setDateFilter] = useState(today());
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name:'', bio:'', photo:'', location:'', phone:'', services:[], availability:{} });
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState({ text:'', type:'' });

  useEffect(() => {
    if (user) setProfile({ name:user.name||'', bio:user.bio||'', photo:user.photo||'', location:user.location||'', phone:user.phone||'', services:user.services||[], availability:user.availability||{} });
  }, [user]);

  useEffect(() => {
    setLoading(true);
    bookingsAPI.getMine({ date:dateFilter })
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

  const showMsg = (text, type='success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text:'', type:'' }), 3000); };

  const saveProfile = async () => {
    setSaving(true);
    try { const res = await barbersAPI.updateProfile(profile); updateUser(res.data); showMsg('Profile saved successfully!'); }
    catch { showMsg('Failed to save. Try again.', 'error'); }
    finally { setSaving(false); }
  };

  const addService    = () => setProfile(p => ({ ...p, services:[...p.services, { name:'', price:0, duration:30 }] }));
  const removeService = i  => setProfile(p => ({ ...p, services:p.services.filter((_,idx) => idx !== i) }));
  const updateService = (i, f, v) => setProfile(p => ({ ...p, services:p.services.map((s,idx) => idx===i ? {...s,[f]: f==='name'?v:Number(v)} : s) }));
  const toggleDay     = day => setProfile(p => ({ ...p, availability:{ ...p.availability, [day]:{ ...p.availability[day], isOpen:!p.availability[day]?.isOpen }}}));
  const updateDay     = (day, f, v) => setProfile(p => ({ ...p, availability:{ ...p.availability, [day]:{ ...p.availability[day], [f]:v }}}));

  const revenue = bookings.filter(b => b.status==='completed').reduce((sum,b) => sum+(b.service?.price||0), 0);

  const STATS = [
    { label:'Today\'s Bookings', value:bookings.filter(b=>b.date===today()).length, icon:'📅', color:'#5B2EFF' },
    { label:'Pending',           value:bookings.filter(b=>b.status==='pending').length, icon:'⏳', color:'#926A00' },
    { label:'Confirmed',         value:bookings.filter(b=>b.status==='confirmed').length, icon:'✅', color:'#007A57' },
    { label:'Revenue',           value:`$${revenue}`, icon:'💰', color:'#5B2EFF' },
  ];

  const TABS = [
    { id:'bookings', label:'Bookings', icon:'📅' },
    { id:'profile',  label:'Profile',  icon:'👤' },
    { id:'services', label:'Services', icon:'✂️' },
    { id:'schedule', label:'Schedule', icon:'🕐' },
  ];

  return (
    <div style={{ background:'#FAFAFA', minHeight:'100vh' }}>

      {/* Header banner */}
      <div style={{ background:'linear-gradient(135deg,#0F0A1E,#1A0E3D)', padding:'32px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, marginBottom:6 }}>Dashboard</div>
            <h1 style={{ fontSize:28, fontWeight:800, color:'#fff', letterSpacing:'-0.5px' }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ background:'rgba(91,46,255,0.25)', border:'1.5px solid rgba(91,46,255,0.4)', borderRadius:12, padding:'8px 16px', fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:600 }}>
              🟢 Profile Active
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 24px 60px' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginTop:-24, marginBottom:28 }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ background:'#fff', border:'1.5px solid #E8E4F3', borderRadius:20, padding:'22px 22px', boxShadow:'0 8px 32px rgba(91,46,255,0.08)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-10, right:-10, fontSize:56, opacity:0.06 }}>{s.icon}</div>
              <div style={{ fontSize:28, marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontSize:30, fontWeight:800, color:s.color, letterSpacing:'-1px' }}>{s.value}</div>
              <div style={{ fontSize:12, color:'#9898B0', fontWeight:600, marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ background:'#fff', borderRadius:24, border:'1.5px solid #E8E4F3', overflow:'hidden', boxShadow:'0 4px 20px rgba(91,46,255,0.06)' }}>
          <div style={{ display:'flex', borderBottom:'1.5px solid #E8E4F3', background:'#FAFAFA' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ flex:1, padding:'16px 8px', border:'none', background:'transparent', cursor:'pointer', borderBottom: tab===t.id ? '2px solid #5B2EFF' : '2px solid transparent', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:18 }}>{t.icon}</span>
                <span style={{ fontSize:12, fontWeight:700, color: tab===t.id ? '#5B2EFF' : '#9898B0' }}>{t.label}</span>
              </button>
            ))}
          </div>

          <div style={{ padding:28 }}>
            {msg.text && (
              <div style={{ background: msg.type==='error' ? 'rgba(255,71,87,0.1)' : 'rgba(0,196,140,0.1)', border:'1px solid', borderColor: msg.type==='error' ? 'rgba(255,71,87,0.3)' : 'rgba(0,196,140,0.3)', borderRadius:12, padding:'12px 16px', marginBottom:20, color: msg.type==='error' ? '#CC1F32' : '#007A57', fontSize:13, fontWeight:600 }}>
                {msg.type==='error' ? '⚠️' : '✅'} {msg.text}
              </div>
            )}

            {/* BOOKINGS */}
            {tab==='bookings' && (
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
                  <h2 style={{ fontSize:18, fontWeight:800, color:'#0F0A1E' }}>Appointments</h2>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ width:'auto', padding:'8px 12px', fontSize:13 }}/>
                  </div>
                </div>
                {loading ? (
                  <div style={{ textAlign:'center', padding:48 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #5B2EFF', borderTopColor:'transparent', animation:'spin 0.7s linear infinite', margin:'0 auto 12px' }} />
                    <div style={{ color:'#9898B0', fontSize:13 }}>Loading appointments...</div>
                  </div>
                ) : bookings.length===0 ? (
                  <div style={{ textAlign:'center', padding:'56px 0' }}>
                    <div style={{ fontSize:56, marginBottom:12 }}>📅</div>
                    <div style={{ fontSize:18, fontWeight:700, color:'#0F0A1E', marginBottom:6 }}>No bookings for this date</div>
                    <div style={{ fontSize:14, color:'#9898B0' }}>Try selecting a different date</div>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {bookings.map(b => {
                      const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                      return (
                        <div key={b._id} style={{ background:'#FAFAFA', border:'1.5px solid #E8E4F3', borderRadius:18, padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:14, transition:'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor='#D4C5FF'; e.currentTarget.style.boxShadow='0 4px 16px rgba(91,46,255,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor='#E8E4F3'; e.currentTarget.style.boxShadow='none'; }}>
                          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                            <div style={{ width:46, height:46, borderRadius:14, background:'linear-gradient(135deg,#EEE9FF,#D4C5FF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>✂️</div>
                            <div>
                              <div style={{ fontWeight:700, fontSize:15, color:'#0F0A1E' }}>{b.customerName}</div>
                              <div style={{ fontSize:12, color:'#9898B0', marginTop:2 }}>{b.customerEmail} · {b.customerPhone}</div>
                            </div>
                          </div>
                          <div style={{ textAlign:'center' }}>
                            <div style={{ fontWeight:700, fontSize:14, color:'#0F0A1E' }}>{b.service?.name}</div>
                            <div style={{ fontSize:12, color:'#9898B0', marginTop:2 }}>🕐 {b.startTime} – {b.endTime}</div>
                          </div>
                          <div style={{ fontWeight:800, fontSize:22, color:'#5B2EFF' }}>${b.service?.price}</div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                            <span style={{ padding:'5px 14px', borderRadius:99, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color, border:`1px solid ${sc.border}` }}>{sc.label}</span>
                            {b.status==='pending' && (
                              <div style={{ display:'flex', gap:6 }}>
                                <button onClick={() => updateStatus(b._id,'confirmed')} style={{ padding:'7px 14px', borderRadius:10, border:'none', background:'rgba(0,196,140,0.15)', color:'#007A57', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Plus Jakarta Sans' }}>Confirm</button>
                                <button onClick={() => updateStatus(b._id,'cancelled')} style={{ padding:'7px 14px', borderRadius:10, border:'none', background:'rgba(255,71,87,0.12)', color:'#CC1F32', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Plus Jakarta Sans' }}>Cancel</button>
                              </div>
                            )}
                            {b.status==='confirmed' && (
                              <button onClick={() => updateStatus(b._id,'completed')} style={{ padding:'7px 14px', borderRadius:10, border:'none', background:'rgba(91,46,255,0.12)', color:'#5B2EFF', fontWeight:700, fontSize:12, cursor:'pointer', fontFamily:'Plus Jakarta Sans' }}>Complete</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE */}
            {tab==='profile' && (
              <div style={{ maxWidth:580 }}>
                <h2 style={{ fontSize:18, fontWeight:800, color:'#0F0A1E', marginBottom:20 }}>Edit Profile</h2>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Full Name</label><input value={profile.name} onChange={e => setProfile(p => ({...p, name:e.target.value}))} /></div>
                  <div className="form-group"><label>Phone</label><input value={profile.phone} onChange={e => setProfile(p => ({...p, phone:e.target.value}))} /></div>
                  <div className="form-group"><label>Location</label><input value={profile.location} onChange={e => setProfile(p => ({...p, location:e.target.value}))} /></div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Profile Photo URL</label><input value={profile.photo} onChange={e => setProfile(p => ({...p, photo:e.target.value}))} placeholder="https://..." /></div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}><label>Bio</label><textarea rows={4} value={profile.bio} onChange={e => setProfile(p => ({...p, bio:e.target.value}))} style={{ resize:'vertical' }} /></div>
                </div>
                <button onClick={saveProfile} disabled={saving} style={{ padding:'13px 28px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#5B2EFF,#7B52FF)', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:'0 6px 20px rgba(91,46,255,0.3)', fontFamily:'Plus Jakarta Sans', opacity:saving?0.7:1 }}>
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            )}

            {/* SERVICES */}
            {tab==='services' && (
              <div style={{ maxWidth:600 }}>
                <h2 style={{ fontSize:18, fontWeight:800, color:'#0F0A1E', marginBottom:20 }}>Manage Services</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:18 }}>
                  {profile.services.map((sv, i) => (
                    <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 100px 110px 44px', gap:10, alignItems:'end', background:'#FAFAFA', borderRadius:16, padding:'16px 16px 14px', border:'1.5px solid #E8E4F3' }}>
                      <div className="form-group" style={{ marginBottom:0 }}><label>Service Name</label><input value={sv.name} onChange={e => updateService(i,'name',e.target.value)} placeholder="e.g. Haircut" /></div>
                      <div className="form-group" style={{ marginBottom:0 }}><label>Price ($)</label><input type="number" value={sv.price} onChange={e => updateService(i,'price',e.target.value)} min="0" /></div>
                      <div className="form-group" style={{ marginBottom:0 }}><label>Duration (min)</label><input type="number" value={sv.duration} onChange={e => updateService(i,'duration',e.target.value)} min="10" /></div>
                      <button onClick={() => removeService(i)} style={{ height:46, width:44, borderRadius:12, border:'1.5px solid rgba(255,71,87,0.25)', background:'rgba(255,71,87,0.08)', color:'#CC1F32', fontWeight:700, cursor:'pointer', fontSize:18 }}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={addService} style={{ padding:'11px 20px', borderRadius:12, border:'1.5px solid #5B2EFF', background:'transparent', color:'#5B2EFF', fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Plus Jakarta Sans' }}>+ Add Service</button>
                  <button onClick={saveProfile} disabled={saving} style={{ padding:'11px 24px', borderRadius:12, border:'none', background:'linear-gradient(135deg,#5B2EFF,#7B52FF)', color:'#fff', fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 14px rgba(91,46,255,0.3)', fontFamily:'Plus Jakarta Sans', opacity:saving?0.7:1 }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* SCHEDULE */}
            {tab==='schedule' && (
              <div style={{ maxWidth:580 }}>
                <h2 style={{ fontSize:18, fontWeight:800, color:'#0F0A1E', marginBottom:20 }}>Weekly Schedule</h2>
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:22 }}>
                  {DAYS.map(day => {
                    const av = profile.availability[day] || { isOpen:false, open:'09:00', close:'18:00' };
                    const isToday = new Date().toLocaleDateString('en-US',{weekday:'long'}).toLowerCase()===day;
                    return (
                      <div key={day} style={{ display:'grid', gridTemplateColumns:'140px 90px 1fr 1fr', gap:12, alignItems:'center', padding:'14px 18px', background: av.isOpen ? 'linear-gradient(135deg,#F4F2FF,#EEE9FF)' : '#FAFAFA', borderRadius:16, border:'1.5px solid', borderColor: av.isOpen ? '#D4C5FF' : '#E8E4F3', transition:'all 0.2s' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <span style={{ fontWeight:700, textTransform:'capitalize', fontSize:14, color: av.isOpen ? '#0F0A1E' : '#BBBBCC' }}>{day}</span>
                          {isToday && <span style={{ fontSize:9, background:'#5B2EFF', color:'#fff', borderRadius:99, padding:'2px 6px', fontWeight:700 }}>Today</span>}
                        </div>
                        <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                          <input type="checkbox" checked={av.isOpen} onChange={() => toggleDay(day)} style={{ width:'auto', accentColor:'#5B2EFF', width:16, height:16 }} />
                          <span style={{ fontSize:12, color: av.isOpen ? '#5B2EFF' : '#BBBBCC', fontWeight:700 }}>{av.isOpen ? 'Open' : 'Closed'}</span>
                        </label>
                        <div>
                          <label style={{ fontSize:11, color:'#9898B0', display:'block', marginBottom:4, fontWeight:600 }}>Opens</label>
                          <input type="time" value={av.open} onChange={e => updateDay(day,'open',e.target.value)} disabled={!av.isOpen} style={{ opacity:av.isOpen?1:0.4, padding:'8px 10px', fontSize:13 }} />
                        </div>
                        <div>
                          <label style={{ fontSize:11, color:'#9898B0', display:'block', marginBottom:4, fontWeight:600 }}>Closes</label>
                          <input type="time" value={av.close} onChange={e => updateDay(day,'close',e.target.value)} disabled={!av.isOpen} style={{ opacity:av.isOpen?1:0.4, padding:'8px 10px', fontSize:13 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={saveProfile} disabled={saving} style={{ padding:'13px 28px', borderRadius:14, border:'none', background:'linear-gradient(135deg,#5B2EFF,#7B52FF)', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', boxShadow:'0 6px 20px rgba(91,46,255,0.3)', fontFamily:'Plus Jakarta Sans', opacity:saving?0.7:1 }}>
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
