import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PERKS = ['Free to join', 'Your own booking page', 'Manage availability', '24/7 support'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', bio:'', location:'', phone:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F0A1E 0%,#1A0E3D 50%,#2D1070 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(91,46,255,0.12)', filter: 'blur(80px)' }} />

      <div style={{ width: '100%', maxWidth: 900, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, zIndex: 1 }} className="anim-scaleIn">

        {/* Left panel */}
        <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 36, textDecoration: 'none' }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>S</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>StyleHub</span>
          </Link>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 16, letterSpacing: '-1px' }}>
            Start accepting<br /><span style={{ color: '#7B52FF' }}>bookings today.</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36 }}>
            Join hundreds of barbers using StyleHub to manage their schedule and grow their business.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PERKS.map((perk, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(91,46,255,0.3)', border: '1.5px solid #5B2EFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#7B52FF', fontWeight: 800, flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{perk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', borderRadius: 28, border: '1.5px solid rgba(255,255,255,0.1)', padding: '36px 32px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Create your account</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>Fill in your details to get started</p>

          {error && (
            <div style={{ background: 'rgba(255,71,87,0.15)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#FF8E98', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)' }}>Full Name *</label>
                <input name="name" placeholder="John Fade" value={form.name} onChange={handle} required style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff' }} />
              </div>
              <div className="form-group">
                <label style={{ color: 'rgba(255,255,255,0.6)' }}>Email *</label>
                <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handle} required style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff' }} />
              </div>
              <div className="form-group">
                <label style={{ color: 'rgba(255,255,255,0.6)' }}>Password *</label>
                <input name="password" type="password" placeholder="Min 6 chars" value={form.password} onChange={handle} required minLength={6} style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff' }} />
              </div>
              <div className="form-group">
                <label style={{ color: 'rgba(255,255,255,0.6)' }}>Phone</label>
                <input name="phone" placeholder="+1 555-0000" value={form.phone} onChange={handle} style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff' }} />
              </div>
              <div className="form-group">
                <label style={{ color: 'rgba(255,255,255,0.6)' }}>Location</label>
                <input name="location" placeholder="New York, USA" value={form.location} onChange={handle} style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff' }} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label style={{ color: 'rgba(255,255,255,0.6)' }}>Short Bio</label>
                <textarea name="bio" rows={2} placeholder="Describe your experience..." value={form.bio} onChange={handle} style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', resize: 'vertical' }} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: loading ? 'rgba(91,46,255,0.5)' : 'linear-gradient(135deg,#5B2EFF,#7B52FF)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 28px rgba(91,46,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'Plus Jakarta Sans' }}>
              {loading ? 'Creating Account...' : 'Create Barber Account ✦'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#7B52FF', fontWeight: 700 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
