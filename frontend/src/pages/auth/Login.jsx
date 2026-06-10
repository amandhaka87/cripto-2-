import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Zap, Lock, Mail } from 'lucide-react'

export default function Login() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: connect to API
    alert('Login coming soon — backend integration pending')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '25%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        <div className="text-center mb-8">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '32px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>Cripto<span className="gradient-text">X</span></span>
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>Sign in to your investment account</p>
        </div>

        <div style={{
          background: 'rgba(22,24,48,0.9)', border: '1px solid rgba(123,97,255,0.2)',
          borderRadius: '20px', padding: '36px 32px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                <input
                  type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 12px 12px 42px',
                    background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)',
                    borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7B61FF'}
                  onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500 }}>Password</label>
                <a href="#" style={{ color: '#7B61FF', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                <input
                  type={show ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 42px 12px 42px',
                    background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)',
                    borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#7B61FF'}
                  onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'}
                />
                <button type="button" onClick={() => setShow(!show)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '4px', fontSize: '1rem', padding: '14px', width: '100%' }}>
              Sign In
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', color: '#A0AEC0', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#7B61FF', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#4A5568', fontSize: '0.75rem', marginTop: '20px' }}>
          Protected by 256-bit AES encryption & 2FA
        </p>
      </div>
    </div>
  )
}
