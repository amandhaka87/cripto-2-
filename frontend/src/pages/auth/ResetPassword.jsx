import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Zap, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { authAPI } from '../../services/api'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [showCf, setShowCf]       = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [done, setDone]           = useState(false)

  useEffect(() => {
    if (!token) setError('Invalid or missing reset token. Please request a new link.')
  }, [token])

  const strength = (() => {
    if (password.length === 0) return null
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (score <= 1) return { label: 'Weak', color: '#FF3B30', w: '25%' }
    if (score === 2) return { label: 'Fair', color: '#F6C90E', w: '50%' }
    if (score === 3) return { label: 'Good', color: '#00D4FF', w: '75%' }
    return { label: 'Strong', color: '#00FF88', w: '100%' }
  })()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    setLoading(true)
    try {
      await authAPI.resetPassword(token, password)
      setDone(true)
      setTimeout(() => navigate('/login'), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
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
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Set New Password</h1>
          <p style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>Choose a strong password for your account</p>
        </div>

        <div style={{ background: 'rgba(22,24,48,0.9)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

          {done ? (
            /* ── Success ──────────────────────────────────── */
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={30} style={{ color: '#00FF88' }} />
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '12px' }}>Password Reset!</h2>
              <p style={{ color: '#A0AEC0', fontSize: '0.88rem', lineHeight: '1.7', marginBottom: '20px' }}>
                Your password has been changed successfully. Redirecting to login...
              </p>
              <div style={{ width: '100%', height: '4px', background: 'rgba(123,97,255,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', borderRadius: '4px', animation: 'fill 4s linear forwards' }} />
              </div>
              <style>{`@keyframes fill { from { width: 0% } to { width: 100% } }`}</style>
            </div>
          ) : (
            /* ── Form ─────────────────────────────────────── */
            <>
              {error && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FF6B6B', fontSize: '0.88rem' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* New password */}
                <div>
                  <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                    <input
                      type={showPw ? 'text' : 'password'}
                      required
                      placeholder="Min 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoFocus
                      style={{ width: '100%', padding: '13px 42px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#7B61FF'}
                      onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {strength && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: strength.w, background: strength.color, borderRadius: '4px', transition: 'width 0.3s, background 0.3s' }} />
                      </div>
                      <div style={{ color: strength.color, fontSize: '0.75rem', fontWeight: 600, marginTop: '4px' }}>{strength.label}</div>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                    <input
                      type={showCf ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                      style={{ width: '100%', padding: '13px 42px', background: 'rgba(11,12,30,0.8)', border: `1px solid ${confirm && confirm !== password ? 'rgba(255,59,48,0.4)' : confirm && confirm === password ? 'rgba(0,255,136,0.3)' : 'rgba(123,97,255,0.2)'}`, borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = '#7B61FF'}
                      onBlur={e => e.target.style.borderColor = confirm && confirm !== password ? 'rgba(255,59,48,0.4)' : confirm && confirm === password ? 'rgba(0,255,136,0.3)' : 'rgba(123,97,255,0.2)'}
                    />
                    <button type="button" onClick={() => setShowCf(!showCf)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }}>
                      {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <div style={{ color: '#FF6B6B', fontSize: '0.75rem', marginTop: '4px' }}>Passwords do not match</div>
                  )}
                  {confirm && confirm === password && (
                    <div style={{ color: '#00FF88', fontSize: '0.75rem', marginTop: '4px' }}>✓ Passwords match</div>
                  )}
                </div>

                <button type="submit" disabled={loading || !token} className="btn-primary"
                  style={{ marginTop: '4px', fontSize: '1rem', padding: '14px', width: '100%', opacity: loading || !token ? 0.7 : 1, cursor: loading || !token ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/forgot-password" style={{ color: '#7B61FF', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }}>
                  Request new link
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
