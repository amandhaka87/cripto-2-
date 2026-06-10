import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Zap, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { authAPI } from '../../services/api'

export default function ForgotPassword() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      {/* bg glow */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '25%', left: '35%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '28px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>
              Cripto<span style={{ background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>X</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Forgot Password?</h1>
          <p style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>Enter your email and we'll send you a reset link</p>
        </div>

        <div style={{ background: 'rgba(22,24,48,0.9)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

          {sent ? (
            /* ── Success State ─────────────────────────────── */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={30} style={{ color: '#00FF88' }} />
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '12px' }}>Check Your Email</h2>
              <p style={{ color: '#A0AEC0', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '8px' }}>
                If <strong style={{ color: '#fff' }}>{email}</strong> is registered, a password reset link has been sent.
              </p>
              <p style={{ color: '#4A5568', fontSize: '0.8rem', marginBottom: '24px' }}>
                The link expires in <strong style={{ color: '#F6C90E' }}>10 minutes</strong>. Check your spam folder if you don't see it.
              </p>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#7B61FF', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────────── */
            <>
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FF6B6B', fontSize: '0.88rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoFocus
                      style={{ width: '100%', padding: '13px 13px 13px 42px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#7B61FF'}
                      onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary"
                  style={{ fontSize: '1rem', padding: '14px', width: '100%', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#718096', textDecoration: 'none', fontSize: '0.88rem' }}>
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
