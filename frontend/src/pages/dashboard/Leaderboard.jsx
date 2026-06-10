import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Trophy, Users, TrendingUp, Crown } from 'lucide-react'
import { leaderboardAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const MOCK_INVESTORS = [
  { _id: '1', name: 'Priya Singh', activePlan: { name: 'Platinum', invested: 85000, roi: 25 } },
  { _id: '2', name: 'Rahul Sharma', activePlan: { name: 'Platinum', invested: 50000, roi: 25 } },
  { _id: '3', name: 'Amit Verma', activePlan: { name: 'Gold', invested: 9500, roi: 15 } },
  { _id: '4', name: 'Sneha Patel', activePlan: { name: 'Gold', invested: 8000, roi: 15 } },
  { _id: '5', name: 'Vikram Nair', activePlan: { name: 'Gold', invested: 5000, roi: 15 } },
  { _id: '6', name: 'Deepa Roy', activePlan: { name: 'Silver', invested: 900, roi: 8 } },
  { _id: '7', name: 'Karan Mehta', activePlan: { name: 'Silver', invested: 750, roi: 8 } },
]

const MOCK_REFERRERS = [
  { _id: '1', name: 'Rahul Sharma', referralCount: 24, referralEarnings: 1200, activePlan: { name: 'Gold' } },
  { _id: '2', name: 'Priya Singh', referralCount: 18, referralEarnings: 4500, activePlan: { name: 'Platinum' } },
  { _id: '3', name: 'Amit Verma', referralCount: 12, referralEarnings: 600, activePlan: { name: 'Gold' } },
  { _id: '4', name: 'Sneha Patel', referralCount: 9, referralEarnings: 270, activePlan: { name: 'Gold' } },
  { _id: '5', name: 'Vikram Nair', referralCount: 7, referralEarnings: 350, activePlan: { name: 'Silver' } },
]

const PLAN_COLOR = { Platinum: '#00D4FF', Gold: '#F6C90E', Silver: '#A0AEC0' }
const RANK_STYLE = {
  1: { bg: 'linear-gradient(135deg,#FFD700,#FFA500)', color: '#000', icon: '🥇' },
  2: { bg: 'linear-gradient(135deg,#C0C0C0,#A0A0A0)', color: '#000', icon: '🥈' },
  3: { bg: 'linear-gradient(135deg,#CD7F32,#8B4513)', color: '#fff', icon: '🥉' },
}

export default function Leaderboard() {
  const [tab, setTab] = useState('investors')
  const [investors, setInvestors] = useState(MOCK_INVESTORS)
  const [referrers, setReferrers] = useState(MOCK_REFERRERS)
  const [myRank, setMyRank] = useState({ investorRank: 12, referralRank: 7 })
  const { user } = useAuth()

  useEffect(() => {
    leaderboardAPI.getTopInvestors().then(r => setInvestors(r.data.data)).catch(() => {})
    leaderboardAPI.getTopReferrals().then(r => setReferrers(r.data.data)).catch(() => {})
    leaderboardAPI.getMyRank().then(r => setMyRank(r.data.data)).catch(() => {})
  }, [])

  const list = tab === 'investors' ? investors : referrers

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', padding: '24px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        <div style={{ marginBottom: '28px' }}>
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#718096', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '16px' }}>
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem' }}>
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p style={{ color: '#A0AEC0', marginTop: '6px', fontSize: '0.9rem' }}>Top investors and referrers on CriptoX</p>
        </div>

        {/* My rank */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'My Investor Rank', value: `#${myRank?.investorRank || '—'}`, icon: <TrendingUp size={18} />, color: '#7B61FF' },
            { label: 'My Referral Rank', value: `#${myRank?.referralRank || '—'}`, icon: <Users size={18} />, color: '#00D4FF' },
          ].map(r => (
            <div key={r.label} style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '14px', padding: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${r.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: r.color, flexShrink: 0 }}>
                {r.icon}
              </div>
              <div>
                <div style={{ color: '#718096', fontSize: '0.78rem' }}>{r.label}</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.5rem', color: r.color }}>{r.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
          {[
            { id: 'investors', label: '💰 Top Investors', icon: <TrendingUp size={15} /> },
            { id: 'referrers', label: '🔗 Top Referrers', icon: <Users size={15} /> },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: tab === t.id ? 'linear-gradient(135deg,#7B61FF,#00D4FF)' : 'transparent', color: tab === t.id ? '#fff' : '#718096', fontWeight: tab === t.id ? 700 : 400, fontSize: '0.9rem', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        {list.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '12px', marginBottom: '24px', padding: '0 20px' }}>
            {[1, 0, 2].map(idx => {
              const entry = list[idx]
              if (!entry) return null
              const rank = idx + 1
              const rs = RANK_STYLE[rank]
              const heights = { 0: '100px', 1: '130px', 2: '80px' }
              return (
                <div key={entry._id} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.name.split(' ')[0]}
                  </div>
                  <div style={{ background: rs.bg, borderRadius: '10px 10px 0 0', height: heights[idx], display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{rs.icon}</span>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1rem', color: rs.color }}>
                      {tab === 'investors'
                        ? `$${(entry.activePlan?.invested || 0).toLocaleString()}`
                        : `${entry.referralCount} refs`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Full list */}
        <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
          {list.map((entry, i) => {
            const rank = i + 1
            const isMe = entry.name === user?.name
            const planColor = PLAN_COLOR[entry.activePlan?.name] || '#718096'
            return (
              <div key={entry._id} style={{
                display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px',
                borderBottom: '1px solid rgba(123,97,255,0.08)',
                background: isMe ? 'rgba(123,97,255,0.08)' : 'transparent',
                transition: 'background 0.2s',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  background: rank <= 3 ? RANK_STYLE[rank].bg : 'rgba(123,97,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '0.85rem',
                  color: rank <= 3 ? RANK_STYLE[rank].color : '#7B61FF',
                }}>
                  {rank <= 3 ? RANK_STYLE[rank].icon : `#${rank}`}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: isMe ? '#7B61FF' : '#fff' }}>{entry.name}</span>
                    {isMe && <span style={{ fontSize: '0.7rem', color: '#7B61FF', fontWeight: 700 }}>(You)</span>}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: planColor, fontWeight: 600 }}>
                    {entry.activePlan?.name || 'No plan'}
                  </span>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
                    {tab === 'investors'
                      ? `$${(entry.activePlan?.invested || 0).toLocaleString()}`
                      : entry.referralCount}
                  </div>
                  <div style={{ color: '#00FF88', fontSize: '0.75rem' }}>
                    {tab === 'investors'
                      ? `${entry.activePlan?.roi || 0}% ROI`
                      : `$${entry.referralEarnings || 0} earned`}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
