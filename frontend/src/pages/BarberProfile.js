import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { barbersAPI, bookingsAPI } from '../services/api';
import TimeSlotPicker from '../components/TimeSlotPicker';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function BarberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [barber, setBarber] = useState(null);
  const [step, setStep]     = useState(1); // 1=service, 2=date/time, 3=details
  const [selected, setSelected] = useState({ service:null, date:today(), time:'' });
  const [slots, setSlots]   = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm]     = useState({ name:'', email:'', phone:'', notes:'' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]   = useState('');

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
      await bookingsAPI.create({
        barberId: id,
        customerName: form.name,
        customerEmail: form.email,
        customerPhone: form.phone,
        service: selected.service,
        date: selected.date,
        startTime: selected.time,
        notes: form.notes
      });
      navigate('/booking/success', { state: { barber: barber.name, service: selected.service.name, date: selected.date, time: selected.time }});
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (!barber) return <div style={{ textAlign:'center', padding:80, color:'#AAA' }}>Loading...</div>;

  const openDays = DAYS.filter(d => barber.availability?.[d]?.isOpen).map(d => d.charAt(0).toUpperCase() + d.slice(1));

  const pill = (label) => ({ background:'#F0EEFF', color:'#5B2EFF', borderRadius:99, padding:'5px 14px', fontSize:12, fontWeight:500, display:'inline-block' });

  return (
    <div style={{ background:'#F8F7FF', minHeight:'100vh' }}>
      {/* Header image */}
      <div style={{ position:'relative', height:300, overflow:'hidden' }}>
        <img src={barber.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(barber.name)}&background=EEE9FF&color=5B2EFF&size=600`}
          alt={barber.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))' }}/>

        <div style={{ position:'absolute', top:16, left:16 }}>
          <button onClick={() => navigate('/')} style={{ width:40, height:40, borderRadius:12, background:'rgba(255,255,255,0.9)', border:'none', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        </div>
        <div style={{ position:'absolute', top:16, right:16 }}>
          <button style={{ width:40, height:40, borderRadius:12, background:'rgba(255,255,255,0.9)', border:'none', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>🤍</button>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'-30px auto 40px', padding:'0 20px', position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:24, alignItems:'start' }}>

          {/* LEFT: Profile info */}
          <div>
            <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #EBEBEB', padding:28, marginBottom:16, boxShadow:'0 4px 20px rgba(91,46,255,0.08)' }}>
              <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>{barber.name}</h1>
              {barber.location && <div style={{ fontSize:14, color:'#888', marginBottom:12 }}>📍 {barber.location}</div>}
              {barber.bio && <p style={{ fontSize:14, color:'#555', lineHeight:1.7, marginBottom:16 }}>{barber.bio}</p>}

              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:16 }}>
                {barber.phone && <div style={{ ...pill(), background:'#F0F9FF', color:'#0369A1' }}>📞 {barber.phone}</div>}
                <div style={{ ...pill() }}>💈 {barber.services?.length || 0} services</div>
              </div>

              <div style={{ fontSize:13, color:'#999', fontWeight:500 }}>Open: {openDays.join(', ')}</div>
            </div>

            {/* Services */}
            <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #EBEBEB', padding:28, marginBottom:16, boxShadow:'0 4px 20px rgba(91,46,255,0.08)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, marginBottom:16 }}>Services</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {barber.services?.map((sv, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'#F8F7FF', borderRadius:12, border:'1.5px solid #EBEBEB' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:'#5B2EFF' }}/>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{sv.name}</div>
                        <div style={{ fontSize:12, color:'#AAA' }}>{sv.duration} min</div>
                      </div>
                    </div>
                    <div style={{ fontWeight:700, color:'#5B2EFF', fontSize:16 }}>${sv.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Working hours */}
            <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #EBEBEB', padding:28, boxShadow:'0 4px 20px rgba(91,46,255,0.08)' }}>
              <h2 style={{ fontSize:18, fontWeight:700, marginBottom:16 }}>Working Hours</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {DAYS.map(day => {
                  const av = barber.availability?.[day];
                  return (
                    <div key={day} style={{ display:'flex', justifyContent:'space-between', fontSize:13, padding:'6px 0', borderBottom:'1px solid #F5F5F5' }}>
                      <span style={{ fontWeight:500, textTransform:'capitalize', color: av?.isOpen ? '#1A1A1A' : '#CCC' }}>{day}</span>
                      <span style={{ color: av?.isOpen ? '#5B2EFF' : '#CCC', fontWeight: av?.isOpen ? 600 : 400 }}>
                        {av?.isOpen ? `${av.open} – ${av.close}` : 'Closed'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Booking panel */}
          <div style={{ position:'sticky', top:84 }}>
            <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #EBEBEB', overflow:'hidden', boxShadow:'0 4px 24px rgba(91,46,255,0.1)' }}>
              <div style={{ background:'linear-gradient(135deg,#5B2EFF,#7B52FF)', padding:'18px 24px' }}>
                <div style={{ color:'rgba(255,255,255,0.8)', fontSize:12, fontWeight:600 }}>BOOKING</div>
                <div style={{ color:'#fff', fontSize:18, fontWeight:700 }}>Reserve Your Spot</div>
              </div>

              {/* Step indicators */}
              <div style={{ display:'flex', borderBottom:'1.5px solid #EBEBEB' }}>
                {[1,2,3].map(n => (
                  <button key={n} onClick={() => n < step && setStep(n)} style={{ flex:1, padding:'12px 8px', border:'none', background: step === n ? '#F0EEFF' : '#fff', color: step === n ? '#5B2EFF' : '#AAA', fontWeight: step === n ? 700 : 400, fontSize:12, cursor: n < step ? 'pointer' : 'default', borderRight: n < 3 ? '1px solid #EBEBEB' : 'none' }}>
                    {n === 1 ? '1. Service' : n === 2 ? '2. Date & Time' : '3. Details'}
                  </button>
                ))}
              </div>

              <div style={{ padding:20 }}>
                {error && <div style={{ background:'#FFF0F0', border:'1px solid #FECACA', borderRadius:10, padding:'10px 14px', marginBottom:16, color:'#B91C1C', fontSize:12 }}>{error}</div>}

                {/* Step 1: Service */}
                {step === 1 && (
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, marginBottom:14, color:'#555' }}>Select a service</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {barber.services?.map((sv, i) => (
                        <div key={i} onClick={() => { setSelected(s => ({...s, service:sv})); }} style={{ padding:'12px 14px', borderRadius:12, border: selected.service?.name === sv.name ? '2px solid #5B2EFF' : '1.5px solid #EBEBEB', background: selected.service?.name === sv.name ? '#F0EEFF' : '#fff', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all 0.15s' }}>
                          <div>
                            <div style={{ fontWeight:600, fontSize:14 }}>{sv.name}</div>
                            <div style={{ fontSize:12, color:'#AAA', marginTop:2 }}>{sv.duration} min</div>
                          </div>
                          <div style={{ fontWeight:700, fontSize:16, color:'#5B2EFF' }}>${sv.price}</div>
                        </div>
                      ))}
                    </div>
                    <button disabled={!selected.service} onClick={() => setStep(2)} style={{ width:'100%', marginTop:16, padding:'12px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:14, cursor: selected.service ? 'pointer' : 'not-allowed', opacity: selected.service ? 1 : 0.5 }}>
                      Continue →
                    </button>
                  </div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                  <div>
                    <div style={{ marginBottom:14 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#555', marginBottom:8 }}>Select date</div>
                      <input type="date" value={selected.date} min={today()} onChange={e => setSelected(s => ({...s, date:e.target.value, time:''}))} />
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#555', marginBottom:10 }}>Available slots</div>
                      {slotsLoading ? <div style={{ textAlign:'center', padding:'20px', color:'#AAA', fontSize:13 }}>Loading slots...</div> : <TimeSlotPicker slots={slots} selected={selected.time} onSelect={t => setSelected(s => ({...s, time:t}))} />}
                    </div>
                    <div style={{ display:'flex', gap:10, marginTop:16 }}>
                      <button onClick={() => setStep(1)} style={{ flex:1, padding:'11px', borderRadius:12, border:'1.5px solid #EBEBEB', background:'#fff', color:'#555', fontWeight:600, fontSize:13, cursor:'pointer' }}>← Back</button>
                      <button disabled={!selected.time} onClick={() => setStep(3)} style={{ flex:2, padding:'11px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:13, cursor: selected.time ? 'pointer' : 'not-allowed', opacity: selected.time ? 1 : 0.5 }}>Continue →</button>
                    </div>
                  </div>
                )}

                {/* Step 3: Customer details */}
                {step === 3 && (
                  <div>
                    <div style={{ background:'#F0EEFF', borderRadius:12, padding:'12px 14px', marginBottom:16, fontSize:13 }}>
                      <div style={{ fontWeight:600, color:'#5B2EFF' }}>{selected.service?.name}</div>
                      <div style={{ color:'#777', marginTop:2 }}>{selected.date} at {selected.time} · {selected.service?.duration} min · ${selected.service?.price}</div>
                    </div>
                    <div className="form-group"><label>Your Name *</label><input value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} placeholder="Full name" /></div>
                    <div className="form-group"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} placeholder="your@email.com" /></div>
                    <div className="form-group"><label>Phone *</label><input value={form.phone} onChange={e => setForm(f => ({...f, phone:e.target.value}))} placeholder="+1 555-0000" /></div>
                    <div className="form-group"><label>Notes (optional)</label><textarea rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes:e.target.value}))} placeholder="Any special requests..." /></div>
                    <div style={{ display:'flex', gap:10 }}>
                      <button onClick={() => setStep(2)} style={{ flex:1, padding:'11px', borderRadius:12, border:'1.5px solid #EBEBEB', background:'#fff', color:'#555', fontWeight:600, fontSize:13, cursor:'pointer' }}>← Back</button>
                      <button disabled={submitting} onClick={submitBooking} style={{ flex:2, padding:'12px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', opacity: submitting ? 0.7 : 1 }}>
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
