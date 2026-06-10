import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowLeft, Wallet } from 'lucide-react'

const PLANS = [
  {
    name: 'Silver',
    icon: '🥈',
    min: 100,
    max: 999,
    roi: 8,
    duration: '3 Months',
    color: '#A0AEC0',
    features: ['USDT Payments', 'Basic Dashboard', 'Email Support', 'Monthly Reports'],
  },
  {
    name: 'Gold',
    icon: '🥇',
    min: 1000,
    max: 9999,
    roi: 15,
    duration: '6 Months',
    color: '#F6C90E',
    popular: true,
    features: ['USDT Payments', 'Advanced Dashboard', 'Priority Support', 'Weekly Reports', 'Referral Bonus', '2FA Security'],
  },
  {
    name: 'Platinum',
    icon: '💎',
    min: 10000,
    max: 100000,
    roi: 25,
    duration: '12 Months',
    color: '#00D4FF',
    features: ['USDT Payments', 'Premium Dashboard', '24/7 VIP Support', 'Daily Reports', 'Max Referral Bonus', '2FA + KYC', 'Certificate'],
  },
]

export default function Plans() {
  const [amount, setAmount] = useState('')
  const [selected, setSelected] = useState(null)

  const plan = selected !== null ? PLANS[selected] : null
  const monthly = plan && amount ? (parseFloat(amount) * plan.roi / 100).toFixed(2) : 0
  const total = plan && amount ? (parseFloat(amount) * (1 + (plan.roi / 100) * parseInt(plan.duration))).toFixed(2) : 0

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-5xl mx-auto">
        <div style={{ marginBottom: '32px' }}>
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#718096', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '16px' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '2rem' }}>
            Investment <span className="gradient-text">Plans</span>
          </h1>
          <p style={{ color: '#A0AEC0', marginTop: '8px' }}>Select a plan and enter your investment amount to see projected returns.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {PLANS.map((p, i) => (
            <div key={p.name}
              onClick={() => setSelected(i)}
              style={{
                background: selected === i ? 'rgba(123,97,255,0.12)' : 'rgba(22,24,48,0.8)',
                border: selected === i ? `1px solid ${p.color}60` : '1px solid rgba(123,97,255,0.15)',
                borderRadius: '18px', padding: '28px 24px', cursor: 'pointer',
                position: 'relative', transition: 'all 0.2s',
                boxShadow: selected === i ? `0 0 30px ${p.color}20` : 'none',
              }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 14px', borderRadius: '50px' }}>POPULAR</div>
              )}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '6px' }}>{p.icon}</div>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem', color: p.color }}>{p.name}</h3>
                <div style={{ color: '#718096', fontSize: '0.82rem' }}>${p.min.toLocaleString()} – ${p.max.toLocaleString()}</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '2rem', color: p.color }}>{p.roi}%</div>
                <div style={{ color: '#718096', fontSize: '0.8rem' }}>Monthly ROI • {p.duration}</div>
              </div>
              <ul style={{ listStyle: 'none' }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0', color: '#A0AEC0', fontSize: '0.85rem' }}>
                    <Check size={14} style={{ color: p.color, flexShrink: 0 }} />{f}
                  </li>
                ))}
              </ul>
              {selected === i && (
                <div style={{ marginTop: '16px', textAlign: 'center', color: p.color, fontSize: '0.8rem', fontWeight: 700 }}>✓ Selected</div>
              )}
            </div>
          ))}
        </div>

        {selected !== null && (
          <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '18px', padding: '28px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '20px' }}>
              Calculate Returns — <span style={{ color: plan.color }}>{plan.name} Plan</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>
                  Investment Amount (USDT)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568', fontWeight: 600 }}>$</span>
                  <input type="number" min={plan.min} max={plan.max} placeholder={`${plan.min} – ${plan.max}`}
                    value={amount} onChange={e => setAmount(e.target.value)}
                    style={{ width: '100%', padding: '13px 12px 13px 28px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#7B61FF'} onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                </div>
                {amount && (parseFloat(amount) < plan.min || parseFloat(amount) > plan.max) && (
                  <p style={{ color: '#FF3B30', fontSize: '0.8rem', marginTop: '6px' }}>
                    Amount must be between ${plan.min.toLocaleString()} and ${plan.max.toLocaleString()}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Monthly Earnings', value: `$${monthly}`, color: '#00FF88' },
                  { label: `Total at Maturity (${plan.duration})`, value: `$${total}`, color: plan.color },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '14px 16px' }}>
                    <span style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>{r.label}</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: r.color }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Wallet size={18} /> Proceed to USDT Payment
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
