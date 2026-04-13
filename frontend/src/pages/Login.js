import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F0A1E 0%,#1A0E3D 50%,#2D1070 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(91,46,255,0.15)', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: -80, left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(123,82,255,0.1)', filter: 'blur(60px)' }} />

      <div style={{ width: '100%', maxWidth: 440, zIndex: 1 }} className="anim-scaleIn">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 24, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#5B2EFF,#7B52FF)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(91,46,255,0.4)' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>S</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>StyleHub</span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Sign in to your account to continue</p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(24px)', borderRadius: 28, border: '1.5px solid rgba(255,255,255,0.1)', padding: '36px 32px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
          {error && (
            <div style={{ background: 'rgba(255,71,87,0.15)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#FF8E98', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={submit}>
            <div className="form-group">
              <label style={{ color: 'rgba(255,255,255,0.7)' }}>Email address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required
                style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff' }} />
            </div>

            <div className="form-group">
              <label style={{ color: 'rgba(255,255,255,0.7)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={handle} required
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.12)', color: '#fff', paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: 'none', background: loading ? 'rgba(91,46,255,0.5)' : 'linear-gradient(135deg,#5B2EFF,#7B52FF)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, boxShadow: '0 8px 28px rgba(91,46,255,0.35)', transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }}></span>Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div className="divider" style={{ borderColor: 'rgba(255,255,255,0.1)', marginTop: 24, marginBottom: 20 }} />

          <div style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#7B52FF', fontWeight: 700 }}>Join as Barber</Link>
          </div>

          <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Demo Accounts</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8 }}>
              Admin: admin@stylehub.com / admin123<br/>
              Barber: john@stylehub.com / barber123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
