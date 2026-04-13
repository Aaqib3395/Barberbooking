import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { barbersAPI, bookingsAPI } from '../services/api';
import TimeSlotPicker from '../components/TimeSlotPicker';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
function today() { return new Date().toISOString().split('T')[0]; }

function Stars({ rating = 4.8 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.floor(rating) ? '#FFB800' : '#E8E4F3', fontSize:16 }}>★</span>)}
      <span style={{ fontSize:14, fontWeight:700, color:'#4A4A6A', marginLeft:4 }}>{rating}</span>
    </div>
  );
}

export default function BarberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [barber, setBarber]   = useState(null);
  const [step, setStep]       = useState(1);
  const [selected, setSelected] = useState({ service:null, date:today(), time:'' });
  const [slots, setSlots]     = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm]       = useState({ name:'', email:'', phone:'', notes:'' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    barbersAPI.getOne(id).then(r => setBarber(r.data)).catch(() => navigate('/'));
  }, [id, navigate]);

  useEffect(() => {
    if (selected.service && selected.date) {
      setSlotsLoading(true);
      barbersAPI.getSlots(id, selected.date, selected.service.duration)
        .then(r => setSlots(r.data.slots || []))
        .catch(() => setSlots([]))
        .finally(() => setSlotsLoading(false));
    }
  }, [id, selected.service, selected.date]);

  const submitBooking = async () => {
    if (!form.name || !form.email || !form.phone) { setError('Please fill in all required fields.'); return; }
    setSubmitting(true); setError('');
    try {
      await bookingsAPI.create({ barberId:id, customerName:form.name, customerEmail:form.email, customerPhone:form.phone, service:selected.service, date:selected.date, startTime:selected.time, notes:form.notes });
      navigate('/booking/success', { state:{ barber:barber.name, service:selected.service.name, date:selected.date, time:selected.time }});
    } catch (err) { setError(err.response?.data?.message || 'Booking failed. Try again.'); }
    finally { setSubmitting(false); }
  };

  if (!barber) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:16 }}>
      <div style={{ width:48, height:48, borderRadius:'50%', border:'3px solid #5B2EFF', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }} />
      <div style={{ color:'#9898B0', fontSize:14 }}>Loading barber profile...</div>
    </div>
  );

  const rating = (4.5 + Math.random() * 0.5).toFixed(1);
  const reviews = Math.floor(40 + Math.random() * 120);

  const STEP_LABELS = ['Select Service', 'Date & Time', 'Your Details'];

  return (
    <div style={{ background:'#FAFAFA', minHeight:'100vh' }}>

      {/* Hero image */}
      <div style={{ position:'relative', height:360, overflow:'hidden' }}>
        <img
          src={barber.photo || `https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&h=400&fit=crop`}
          alt={barber.name}
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(15,10,30,0.2) 0%, rgba(15,10,30,0.7) 100%)' }} />

        <button onClick={() => navigate('/')} style={{ position:'absolute', top:20, left:24, width:42, height:42, borderRadius:14, background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.3)', color:'#fff', fontSize:18, cursor:'pointer', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>

        <button style={{ position:'absolute', top:20, right:24, width:42, height:42, borderRadius:14, background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.3)', color:'#fff', fontSize:18, cursor:'pointer', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center' }}>🤍</button>

        <div style={{ position:'absolute', bottom:28, left:32 }}>
          <h1 style={{ fontSize:36, fontWeight:800, color:'#fff', letterSpacing:'-0.5px', marginBottom:6 }}>{barber.name}</h1>
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <Stars rating={parseFloat(rating)} />
            <span style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>{reviews} reviews</span>
            {barber.location && <span style={{ color:'rgba(255,255,255,0.7)', fontSize:13 }}>📍 {barber.location}</span>}
            <span style={{ background:'rgba(0,196,140,0.9)', borderRadius:99, padding:'4px 12px', fontSize:11, fontWeight:700, color:'#fff' }}>● Available Today</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'-20px auto 60px', padding:'0 24px', position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 400px', gap:24, alignItems:'start' }}>

          {/* LEFT */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* About */}
            <div style={{ background:'#fff', border:'1.5px solid #E8E4F3', borderRadius:24, padding:28, boxShadow:'0 4px 20px rgba(91,46,255,0.06)' }}>
              <h2 style={{ fontSize:18, fontWeight:800, marginBottom:14, color:'#0F0A1E' }}>About</h2>
              <p style={{ fontSize:14, color:'#6E6E8A', lineHeight:1.8 }}>{barber.bio || 'Professional barber dedicated to delivering the best haircuts and styles.'}</p>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:16 }}>
                {barber.phone && <div style={{ background:'#F4F2FF', color:'#5B2EFF', borderRadius:99, padding:'6px 14px', fontSize:12, fontWeight:600 }}>📞 {barber.phone}</div>}
                <div style={{ background:'#F4F2FF', color:'#5B2EFF', borderRadius:99, padding:'6px 14px', fontSize:12, fontWeight:600 }}>💈 {barber.services?.length || 0} Services</div>
              </div>
            </div>

            {/* Services */}
            <div style={{ background:'#fff', border:'1.5px solid #E8E4F3', borderRadius:24, padding:28, boxShadow:'0 4px 20px rgba(91,46,255,0.06)' }}>
              <h2 style={{ fontSize:18, fontWeight:800, marginBottom:16, color:'#0F0A1E' }}>Services</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {barber.services?.map((sv, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', background:'#FAFAFA', borderRadius:14, border:'1.5px solid #E8E4F3', transition:'all 0.2s', cursor:'default' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='#5B2EFF'; e.currentTarget.style.background='#F4F2FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='#E8E4F3'; e.currentTarget.style.background='#FAFAFA'; }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:38, height:38, background:'#F4F2FF', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>✂️</div>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:'#0F0A1E' }}>{sv.name}</div>
                        <div style={{ fontSize:12, color:'#9898B0', marginTop:2 }}>{sv.duration} minutes</div>
                      </div>
                    </div>
                    <div style={{ fontWeight:800, fontSize:20, color:'#5B2EFF' }}>${sv.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Working Hours */}
            <div style={{ background:'#fff', border:'1.5px solid #E8E4F3', borderRadius:24, padding:28, boxShadow:'0 4px 20px rgba(91,46,255,0.06)' }}>
              <h2 style={{ fontSize:18, fontWeight:800, marginBottom:16, color:'#0F0A1E' }}>Working Hours</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {DAYS.map(day => {
                  const av = barber.availability?.[day];
                  const isToday = new Date().toLocaleDateString('en-US',{weekday:'long'}).toLowerCase() === day;
                  return (
                    <div key={day} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, background: isToday ? '#F4F2FF' : 'transparent', border: isToday ? '1.5px solid #D4C5FF' : '1.5px solid transparent' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        {isToday && <span style={{ width:7, height:7, borderRadius:'50%', background:'#5B2EFF', display:'inline-block' }}></span>}
                        <span style={{ fontWeight: isToday ? 700 : 500, textTransform:'capitalize', fontSize:14, color: av?.isOpen ? '#0F0A1E' : '#BBBBCC' }}>{day}</span>
                        {isToday && <span style={{ fontSize:10, background:'#5B2EFF', color:'#fff', borderRadius:99, padding:'2px 7px', fontWeight:700 }}>Today</span>}
                      </div>
                      <span style={{ fontSize:13, fontWeight:600, color: av?.isOpen ? '#5B2EFF' : '#BBBBCC' }}>
                        {av?.isOpen ? `${av.open} – ${av.close}` : 'Closed'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Booking panel */}
          <div style={{ position:'sticky', top:88 }}>
            <div style={{ background:'#fff', border:'1.5px solid #E8E4F3', borderRadius:28, overflow:'hidden', boxShadow:'0 12px 48px rgba(91,46,255,0.12)' }}>

              {/* Header */}
              <div style={{ background:'linear-gradient(135deg,#5B2EFF,#7B52FF)', padding:'22px 26px' }}>
                <div style={{ color:'rgba(255,255,255,0.7)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1.5 }}>Book Appointment</div>
                <div style={{ color:'#fff', fontSize:20, fontWeight:800, marginTop:2 }}>Reserve Your Spot</div>
              </div>

              {/* Progress bar */}
              <div style={{ display:'flex', background:'#FAFAFA', borderBottom:'1.5px solid #E8E4F3' }}>
                {STEP_LABELS.map((label, i) => {
                  const n = i + 1;
                  const isActive = step === n;
                  const isDone = step > n;
                  return (
                    <button key={n} onClick={() => n < step && setStep(n)}
                      style={{ flex:1, padding:'13px 8px', border:'none', background:'transparent', cursor: n < step ? 'pointer' : 'default', borderBottom: isActive ? '2px solid #5B2EFF' : '2px solid transparent', transition:'all 0.2s' }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                        <div style={{ width:22, height:22, borderRadius:'50%', background: isDone ? '#5B2EFF' : isActive ? '#5B2EFF' : '#E8E4F3', color: isDone||isActive ? '#fff' : '#9898B0', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {isDone ? '✓' : n}
                        </div>
                        <div style={{ fontSize:10, fontWeight:700, color: isActive ? '#5B2EFF' : '#9898B0' }}>{label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ padding:'22px 24px' }}>
                {error && <div style={{ background:'#FFF0F2', border:'1px solid #FECDD3', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#CC1F32', fontSize:12, fontWeight:500 }}>⚠️ {error}</div>}

                {/* Step 1: Service */}
                {step === 1 && (
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#6E6E8A', marginBottom:14 }}>Choose a service</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {barber.services?.map((sv, i) => {
                        const isSelected = selected.service?.name === sv.name;
                        return (
                          <div key={i} onClick={() => setSelected(s => ({...s, service:sv}))}
                            style={{ padding:'14px 16px', borderRadius:14, border:'2px solid', borderColor: isSelected ? '#5B2EFF' : '#E8E4F3', background: isSelected ? '#F4F2FF' : '#fff', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.18s' }}>
                            <div>
                              <div style={{ fontWeight:700, fontSize:14, color:'#0F0A1E' }}>{sv.name}</div>
                              <div style={{ fontSize:12, color:'#9898B0', marginTop:2 }}>⏱ {sv.duration} min</div>
                            </div>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <div style={{ fontWeight:800, fontSize:18, color:'#5B2EFF' }}>${sv.price}</div>
                              <div style={{ width:20, height:20, borderRadius:'50%', border:'2px solid', borderColor: isSelected ? '#5B2EFF' : '#E8E4F3', background: isSelected ? '#5B2EFF' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {isSelected && <span style={{ color:'#fff', fontSize:10 }}>✓</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button disabled={!selected.service} onClick={() => setStep(2)}
                      style={{ width:'100%', marginTop:18, padding:'13px', borderRadius:14, border:'none', background: selected.service ? 'linear-gradient(135deg,#5B2EFF,#7B52FF)' : '#E8E4F3', color: selected.service ? '#fff' : '#9898B0', fontWeight:700, fontSize:14, cursor: selected.service ? 'pointer' : 'not-allowed', boxShadow: selected.service ? '0 6px 20px rgba(91,46,255,0.3)' : 'none', fontFamily:'Plus Jakarta Sans', transition:'all 0.2s' }}>
                      Continue →
                    </button>
                  </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                  <div>
                    <div style={{ marginBottom:18 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:'#6E6E8A', marginBottom:8 }}>Select date</div>
                      <input type="date" value={selected.date} min={today()}
                        onChange={e => setSelected(s => ({...s, date:e.target.value, time:''}))} />
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'#6E6E8A', marginBottom:10 }}>Available time slots</div>
                      {slotsLoading ? (
                        <div style={{ textAlign:'center', padding:'24px', color:'#9898B0', fontSize:13 }}>
                          <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid #5B2EFF', borderTopColor:'transparent', animation:'spin 0.7s linear infinite', margin:'0 auto 8px' }} />
                          Loading slots...
                        </div>
                      ) : <TimeSlotPicker slots={slots} selected={selected.time} onSelect={t => setSelected(s => ({...s, time:t}))} />}
                    </div>
                    <div style={{ display:'flex', gap:10, marginTop:18 }}>
                      <button onClick={() => setStep(1)} style={{ flex:1, padding:'12px', borderRadius:14, border:'1.5px solid #E8E4F3', background:'#fff', color:'#4A4A6A', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'Plus Jakarta Sans' }}>← Back</button>
                      <button disabled={!selected.time} onClick={() => setStep(3)}
                        style={{ flex:2, padding:'12px', borderRadius:14, border:'none', background: selected.time ? 'linear-gradient(135deg,#5B2EFF,#7B52FF)' : '#E8E4F3', color: selected.time ? '#fff' : '#9898B0', fontWeight:700, fontSize:13, cursor: selected.time ? 'pointer' : 'not-allowed', fontFamily:'Plus Jakarta Sans' }}>
                        Continue →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                  <div>
                    <div style={{ background:'linear-gradient(135deg,#F4F2FF,#EEE9FF)', borderRadius:14, padding:'14px 16px', marginBottom:18, border:'1.5px solid #D4C5FF' }}>
                      <div style={{ fontWeight:700, color:'#5B2EFF', fontSize:14 }}>{selected.service?.name}</div>
                      <div style={{ color:'#7B52FF', fontSize:12, marginTop:3 }}>{selected.date} at {selected.time} · {selected.service?.duration} min · <strong>${selected.service?.price}</strong></div>
                    </div>
                    <div className="form-group"><label>Full Name *</label><input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Your full name" /></div>
                    <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} placeholder="your@email.com" /></div>
                    <div className="form-group"><label>Phone *</label><input value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))} placeholder="+1 555-0000" /></div>
                    <div className="form-group"><label>Notes (optional)</label><textarea rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes:e.target.value}))} placeholder="Any special requests..." style={{ resize:'vertical' }} /></div>
                    <div style={{ display:'flex', gap:10 }}>
                      <button onClick={() => setStep(2)} style={{ flex:1, padding:'12px', borderRadius:14, border:'1.5px solid #E8E4F3', background:'#fff', color:'#4A4A6A', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'Plus Jakarta Sans' }}>← Back</button>
                      <button disabled={submitting} onClick={submitBooking}
                        style={{ flex:2, padding:'13px', borderRadius:14, border:'none', background: submitting ? 'rgba(91,46,255,0.5)' : 'linear-gradient(135deg,#5B2EFF,#7B52FF)', color:'#fff', fontWeight:700, fontSize:14, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow:'0 6px 24px rgba(91,46,255,0.3)', fontFamily:'Plus Jakarta Sans' }}>
                        {submitting ? 'Booking...' : 'Confirm Booking ✓'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
