import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, Lock, Mail, User, Phone, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const PLANS = [
  { label: 'Silver ($100–$999)', value: 'Silver' },
  { label: 'Gold ($1,000–$9,999)', value: 'Gold' },
  { label: 'Platinum ($10,000–$100,000)', value: 'Platinum' },
]

export default function Register() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', plan: '', referralCode: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  const nextStep = () => {
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError('Please fill in all fields')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.plan) { setError('Please select a plan'); return }
    setError('')
    setLoading(true)
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        plan: form.plan,
        referralCode: form.referralCode || undefined,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', right: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '15%', left: '20%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
        <div className="text-center mb-8">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '32px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>Cripto<span className="gradient-text">X</span></span>
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>Join 12,000+ investors on CriptoX</p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= s ? 'linear-gradient(135deg, #7B61FF, #00D4FF)' : 'rgba(123,97,255,0.15)', border: step >= s ? 'none' : '1px solid rgba(123,97,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                {step > s ? <CheckCircle size={14} /> : s}
              </div>
              <span style={{ fontSize: '0.8rem', color: step >= s ? '#fff' : '#4A5568', fontWeight: step === s ? 600 : 400 }}>
                {s === 1 ? 'Personal Info' : 'Choose Plan'}
              </span>
              {s < 2 && <div style={{ width: '40px', height: '1px', background: step > s ? 'linear-gradient(90deg, #7B61FF, #00D4FF)' : 'rgba(123,97,255,0.2)', marginLeft: '8px' }} />}
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(22,24,48,0.9)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FF6B6B', fontSize: '0.88rem' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { field: 'name', label: 'Full Name', type: 'text', icon: <User size={16} />, placeholder: 'John Doe' },
                  { field: 'email', label: 'Email Address', type: 'email', icon: <Mail size={16} />, placeholder: 'you@example.com' },
                  { field: 'phone', label: 'Phone Number', type: 'tel', icon: <Phone size={16} />, placeholder: '+1 234 567 8900' },
                ].map(({ field, label, type, icon, placeholder }) => (
                  <div key={field}>
                    <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }}>{icon}</span>
                      <input type={type} required placeholder={placeholder} value={form[field]} onChange={e => update(field, e.target.value)}
                        style={{ width: '100%', padding: '12px 12px 12px 42px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = '#7B61FF'} onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                    </div>
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                    <input type={show ? 'text' : 'password'} required placeholder="Min. 8 characters" value={form.password} onChange={e => update('password', e.target.value)}
                      style={{ width: '100%', padding: '12px 42px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#7B61FF'} onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                    <button type="button" onClick={() => setShow(!show)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }}>
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="button" className="btn-primary" style={{ marginTop: '4px', fontSize: '1rem', padding: '14px', width: '100%' }} onClick={nextStep}>
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '12px' }}>Select Investment Plan</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {PLANS.map(p => (
                      <label key={p.value} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: form.plan === p.value ? 'rgba(123,97,255,0.15)' : 'rgba(11,12,30,0.8)', border: form.plan === p.value ? '1px solid #7B61FF' : '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                        <input type="radio" name="plan" value={p.value} checked={form.plan === p.value} onChange={e => update('plan', e.target.value)} style={{ accentColor: '#7B61FF' }} />
                        <span style={{ color: form.plan === p.value ? '#fff' : '#A0AEC0', fontWeight: form.plan === p.value ? 600 : 400, fontSize: '0.9rem' }}>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Referral Code (Optional)</label>
                  <input type="text" placeholder="Enter referral code e.g. CX-JOHN1234" value={form.referralCode} onChange={e => update('referralCode', e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#7B61FF'} onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" className="btn-outline" style={{ flex: 1, padding: '13px' }} onClick={() => { setStep(1); setError('') }}>Back</button>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2, padding: '13px', fontSize: '1rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', color: '#A0AEC0', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#7B61FF', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#4A5568', fontSize: '0.75rem', marginTop: '20px' }}>
          By registering, you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  )
}
