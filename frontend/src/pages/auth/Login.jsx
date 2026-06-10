import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, Lock, Mail, AlertCircle, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'

export default function Login() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 2FA step
  const [twoFARequired, setTwoFARequired] = useState(false)
  const [tempToken, setTempToken] = useState(null)
  const [otp, setOtp] = useState('')

  const { login, completeLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await login(form.email, form.password)
      if (result?.requiresTwoFA) {
        setTempToken(result.tempToken)
        setTwoFARequired(true)
      } else {
        navigate(result.role === 'admin' ? '/admin' : '/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) return setError('Enter a 6-digit code')
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.verify2FALogin(otp, tempToken)
      completeLogin(res.data.token, res.data.user)
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Try again.')
    } finally {
      setLoading(false)
    }
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

          {twoFARequired ? (
            <>
              <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(123,97,255,0.2), rgba(0,212,255,0.15))', border: '1px solid rgba(123,97,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Shield size={28} style={{ color: '#7B61FF' }} />
              </div>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem', marginBottom: '8px' }}>Two-Factor Auth</h1>
              <p style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>Enter the 6-digit code from Google Authenticator</p>
            </>
          ) : (
            <>
              <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h1>
              <p style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>Sign in to your investment account</p>
            </>
          )}
        </div>

        <div style={{ background: 'rgba(22,24,48,0.9)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FF6B6B', fontSize: '0.88rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          {/* ── 2FA OTP Step ─────────────────────────────────── */}
          {twoFARequired ? (
            <form onSubmit={handleVerifyOTP} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Authenticator Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  autoFocus
                  style={{ width: '100%', padding: '14px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '1.6rem', outline: 'none', textAlign: 'center', letterSpacing: '0.5rem', fontFamily: 'Space Grotesk, monospace', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#7B61FF'}
                  onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'}
                />
              </div>

              <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary"
                style={{ fontSize: '1rem', padding: '14px', width: '100%', opacity: loading || otp.length !== 6 ? 0.6 : 1, cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>

              <button type="button" onClick={() => { setTwoFARequired(false); setOtp(''); setError('') }}
                style={{ background: 'none', border: 'none', color: '#7B61FF', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}>
                ← Back to Login
              </button>
            </form>

          ) : (
            /* ── Normal Login Step ──────────────────────────────── */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                  <input type="email" required placeholder="you@example.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    style={{ width: '100%', padding: '12px 12px 12px 42px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#7B61FF'}
                    onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500 }}>Password</label>
                  <Link to="/forgot-password" style={{ color: '#7B61FF', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                  <input type={show ? 'text' : 'password'} required placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ width: '100%', padding: '12px 42px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#7B61FF'}
                    onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                  <button type="button" onClick={() => setShow(!show)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary"
                style={{ marginTop: '4px', fontSize: '1rem', padding: '14px', width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {!twoFARequired && (
            <div style={{ textAlign: 'center', marginTop: '24px', color: '#A0AEC0', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#7B61FF', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#4A5568', fontSize: '0.75rem', marginTop: '20px' }}>
          Protected by 256-bit AES encryption & 2FA
        </p>
      </div>
    </div>
  )
}
