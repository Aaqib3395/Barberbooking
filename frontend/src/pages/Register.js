import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', bio:'', location:'', phone:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:52, height:52, background:'#5B2EFF', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'#fff', fontWeight:800, fontSize:24 }}>S</div>
          <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Join StyleHub</h1>
          <p style={{ color:'#999', fontSize:14 }}>Create your barber profile and start getting bookings</p>
        </div>

        <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #EBEBEB', padding:32, boxShadow:'0 4px 24px rgba(91,46,255,0.08)' }}>
          {error && <div style={{ background:'#FFF0F0', border:'1px solid #FECACA', borderRadius:10, padding:'12px 16px', marginBottom:20, color:'#B91C1C', fontSize:13 }}>{error}</div>}

          <form onSubmit={submit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                <label>Full Name *</label>
                <input name="name" placeholder="John Fade" value={form.name} onChange={handle} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} required />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handle} required minLength={6} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" placeholder="+1 555-0000" value={form.phone} onChange={handle} />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input name="location" placeholder="New York, USA" value={form.location} onChange={handle} />
              </div>
              <div className="form-group" style={{ gridColumn:'1 / -1' }}>
                <label>Bio</label>
                <textarea name="bio" rows={3} placeholder="Tell customers about your experience..." value={form.bio} onChange={handle} style={{ resize:'vertical' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:15, cursor:'pointer', marginTop:4, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating Account...' : 'Create Barber Account'}
            </button>
          </form>

          <div style={{ marginTop:22, textAlign:'center', fontSize:13, color:'#999' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#5B2EFF', fontWeight:600 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
