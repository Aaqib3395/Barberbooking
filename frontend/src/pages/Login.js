import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#F8F7FF', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:420 }}>

        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:52, height:52, background:'#5B2EFF', borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:'#fff', fontWeight:800, fontSize:24 }}>S</div>
          <h1 style={{ fontSize:26, fontWeight:800, marginBottom:6 }}>Welcome back</h1>
          <p style={{ color:'#999', fontSize:14 }}>Sign in to your StyleHub account</p>
        </div>

        <div style={{ background:'#fff', borderRadius:20, border:'1.5px solid #EBEBEB', padding:32, boxShadow:'0 4px 24px rgba(91,46,255,0.08)' }}>
          {error && (
            <div style={{ background:'#FFF0F0', border:'1px solid #FECACA', borderRadius:10, padding:'12px 16px', marginBottom:20, color:'#B91C1C', fontSize:13 }}>
              {error}
            </div>
          )}
          <form onSubmit={submit}>
            <div className="form-group">
              <label>Email address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" placeholder="Enter your password" value={form.password} onChange={handle} required />
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:12, border:'none', background:'#5B2EFF', color:'#fff', fontWeight:700, fontSize:15, cursor:'pointer', marginTop:8, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop:24, textAlign:'center', fontSize:13, color:'#999' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#5B2EFF', fontWeight:600 }}>Join as Barber</Link>
          </div>

          <div className="divider" />
          <div style={{ textAlign:'center', fontSize:12, color:'#BBB' }}>
            Demo: admin@stylehub.com / admin123<br />
            Barber: john@stylehub.com / barber123
          </div>
        </div>
      </div>
    </div>
  );
}
