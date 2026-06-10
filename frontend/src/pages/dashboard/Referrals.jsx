import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, Users, Gift, TrendingUp, ArrowLeft, Share2 } from 'lucide-react'
import { userAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const PLAN_BONUS = { Silver: '3%', Gold: '5%', Platinum: '7%' }

const MOCK_REFERRALS = [
  { _id: '1', name: 'Priya Singh', email: 'priya@example.com', activePlan: { name: 'Gold' }, createdAt: '2025-06-01' },
  { _id: '2', name: 'Amit Kumar', email: 'amit@example.com', activePlan: { name: 'Silver' }, createdAt: '2025-06-03' },
  { _id: '3', name: 'Vikram Patel', email: 'vikram@example.com', activePlan: null, createdAt: '2025-06-07' },
]

export default function Referrals() {
  const [copied, setCopied] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    userAPI.getReferrals()
      .then(res => setData(res.data.data))
      .catch(() => setData({ code: user?.referralCode, count: user?.referralCount || 0, earnings: user?.referralEarnings || 0, referrals: MOCK_REFERRALS }))
      .finally(() => setLoading(false))
  }, [])

  const code = data?.code || user?.referralCode || '—'
  const referralLink = `${window.location.origin}/register?ref=${code}`

  const copy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const referrals = data?.referrals || []

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', padding: '24px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#718096', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '16px' }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem' }}>
            Referral <span className="gradient-text">Program</span>
          </h1>
          <p style={{ color: '#A0AEC0', marginTop: '6px', fontSize: '0.9rem' }}>Invite friends and earn bonus on their deposits</p>
        </div>

        {/* Bonus structure */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(PLAN_BONUS).map(([plan, pct]) => (
            <div key={plan} style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '14px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
                {plan === 'Silver' ? '🥈' : plan === 'Gold' ? '🥇' : '💎'}
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.4rem', color: plan === 'Silver' ? '#A0AEC0' : plan === 'Gold' ? '#F6C90E' : '#00D4FF' }}>{pct}</div>
              <div style={{ color: '#718096', fontSize: '0.8rem', marginTop: '2px' }}>{plan} bonus</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Referrals', value: data?.count || 0, icon: <Users size={20} />, color: '#7B61FF' },
            { label: 'Total Earned', value: `$${data?.earnings || 0}`, icon: <Gift size={20} />, color: '#00FF88' },
            { label: 'Pending Earnings', value: '$0', icon: <TrendingUp size={20} />, color: '#00D4FF' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ color: '#718096', fontSize: '0.8rem' }}>{s.label}</span>
                <div style={{ color: s.color, background: `${s.color}18`, padding: '6px', borderRadius: '8px' }}>{s.icon}</div>
              </div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Referral code & link */}
        <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} style={{ color: '#7B61FF' }} /> Your Referral Details
          </h2>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.8rem', fontWeight: 500, marginBottom: '6px' }}>Referral Code</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
              <span style={{ flex: 1, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#7B61FF', fontSize: '1rem', letterSpacing: '1px' }}>{code}</span>
              <button onClick={() => copy(code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#00FF88' : '#7B61FF' }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.8rem', fontWeight: 500, marginBottom: '6px' }}>Referral Link</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
              <span style={{ flex: 1, color: '#A0AEC0', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{referralLink}</span>
              <button onClick={() => copy(referralLink)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7B61FF', flexShrink: 0 }}>
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            {[
              { label: 'Share on WhatsApp', color: '#25D366', href: `https://wa.me/?text=Join CriptoX and earn up to 25% monthly ROI! Use my code: ${code} → ${referralLink}` },
              { label: 'Share on Telegram', color: '#0088cc', href: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join CriptoX — earn 25% monthly ROI!` },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, padding: '10px', borderRadius: '8px', background: `${s.color}18`, border: `1px solid ${s.color}40`, color: s.color, fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none', textAlign: 'center', transition: 'all 0.2s' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Referred users table */}
        <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', marginBottom: '16px' }}>
            People You've Referred ({referrals.length})
          </h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#4A5568' }}>Loading...</div>
          ) : referrals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#4A5568' }}>
              <Users size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
              <p>No referrals yet — share your code to start earning!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Name', 'Plan', 'Joined', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#4A5568', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid rgba(123,97,255,0.1)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(r => (
                    <tr key={r._id} style={{ borderBottom: '1px solid rgba(123,97,255,0.06)' }}>
                      <td style={{ padding: '13px 12px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{r.name}</div>
                        <div style={{ color: '#4A5568', fontSize: '0.75rem' }}>{r.email}</div>
                      </td>
                      <td style={{ padding: '13px 12px', fontSize: '0.85rem', color: '#A0AEC0' }}>
                        {r.activePlan?.name || <span style={{ color: '#4A5568' }}>No plan</span>}
                      </td>
                      <td style={{ padding: '13px 12px', fontSize: '0.82rem', color: '#718096' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '13px 12px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: r.activePlan ? '#00FF88' : '#F6C90E', background: r.activePlan ? 'rgba(0,255,136,0.1)' : 'rgba(246,201,14,0.1)', padding: '3px 10px', borderRadius: '20px' }}>
                          {r.activePlan ? 'Invested' : 'Registered'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
