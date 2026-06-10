import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Users, Wallet, Settings, Bell,
  LogOut, ChevronRight, Copy, Check, Award, Gift, Zap,
} from 'lucide-react'

const MOCK_USER = { name: 'Rahul Sharma', email: 'rahul@example.com', plan: 'Gold', balance: 5280.50, invested: 5000, roi: 15, referrals: 7, rank: 12 }

const TRANSACTIONS = [
  { id: 1, type: 'Deposit', amount: '+$5,000', date: 'Jun 1, 2025', status: 'Completed', hash: '0x4f3b...d91c' },
  { id: 2, type: 'ROI Credit', amount: '+$750', date: 'Jun 10, 2025', status: 'Completed', hash: 'AUTO' },
  { id: 3, type: 'Referral Bonus', amount: '+$50', date: 'Jun 8, 2025', status: 'Completed', hash: 'REF-007' },
]

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: 'Overview', id: 'overview' },
  { icon: <TrendingUp size={18} />, label: 'My Plans', id: 'plans' },
  { icon: <Wallet size={18} />, label: 'Wallet', id: 'wallet' },
  { icon: <Users size={18} />, label: 'Referrals', id: 'referrals' },
  { icon: <Award size={18} />, label: 'Rewards', id: 'rewards' },
  { icon: <Settings size={18} />, label: 'Settings', id: 'settings' },
]

const STAT_CARDS = [
  { label: 'Total Balance', value: `$${MOCK_USER.balance.toFixed(2)}`, sub: '+$280.50 this month', color: '#7B61FF', icon: <Wallet size={20} /> },
  { label: 'Total Invested', value: `$${MOCK_USER.invested.toLocaleString()}`, sub: 'Gold Plan Active', color: '#00D4FF', icon: <TrendingUp size={20} /> },
  { label: 'Monthly ROI', value: `${MOCK_USER.roi}%`, sub: `+$${(MOCK_USER.invested * MOCK_USER.roi / 100).toFixed(0)} earned`, color: '#00FF88', icon: <Award size={20} /> },
  { label: 'Referrals', value: MOCK_USER.referrals, sub: 'Rank #12 on leaderboard', color: '#F6C90E', icon: <Users size={20} /> },
]

export default function Dashboard() {
  const [active, setActive] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const referralCode = 'CRIPTO-RHL07'

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', minHeight: '100vh', background: '#0E0F24',
        borderRight: '1px solid rgba(123,97,255,0.15)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        position: 'fixed', top: 0, left: 0, zIndex: 40,
        transition: 'transform 0.3s',
      }} className="hidden md:flex">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '36px', padding: '0 8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#fff' }}>Cripto<span className="gradient-text">X</span></span>
        </Link>

        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                background: active === item.id ? 'rgba(123,97,255,0.15)' : 'transparent',
                color: active === item.id ? '#fff' : '#718096',
                fontWeight: active === item.id ? 600 : 400, fontSize: '0.9rem',
                marginBottom: '4px', transition: 'all 0.2s', textAlign: 'left',
              }}>
              <span style={{ color: active === item.id ? '#7B61FF' : '#4A5568' }}>{item.icon}</span>
              {item.label}
              {active === item.id && <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#7B61FF' }} />}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid rgba(123,97,255,0.1)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {MOCK_USER.name.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{MOCK_USER.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#4A5568' }}>{MOCK_USER.plan} Plan</div>
            </div>
          </div>
          <Link to="/login">
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#718096', fontSize: '0.9rem' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <LogOut size={16} style={{ color: '#FF3B30' }} /> Logout
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '240px', padding: '0' }} className="md:ml-60">
        {/* Top bar */}
        <header style={{ background: 'rgba(14,15,36,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(123,97,255,0.1)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem' }}>
              Good morning, {MOCK_USER.name.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#4A5568', fontSize: '0.8rem', marginTop: '2px' }}>Your investment dashboard</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ background: 'rgba(123,97,255,0.1)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#7B61FF', display: 'flex' }}>
              <Bell size={18} />
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
              {MOCK_USER.name.charAt(0)}
            </div>
          </div>
        </header>

        <div style={{ padding: '28px' }}>
          {active === 'overview' && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {STAT_CARDS.map(card => (
                  <div key={card.label} style={{
                    background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)',
                    borderRadius: '16px', padding: '20px',
                    transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${card.color}40`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(123,97,255,0.15)'}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 500 }}>{card.label}</span>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                        {card.icon}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#fff', marginBottom: '4px' }}>{card.value}</div>
                    <div style={{ color: '#00FF88', fontSize: '0.78rem', fontWeight: 500 }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Plan Status + Referral */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div style={{ gridColumn: 'span 2', background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>Active Plan — Gold</h2>
                    <span style={{ background: 'rgba(246,201,14,0.15)', color: '#F6C90E', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Invested', value: '$5,000' },
                      { label: 'Monthly ROI', value: '15%' },
                      { label: 'Duration', value: '6 Months' },
                      { label: 'Matures', value: 'Dec 1, 2025' },
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#F6C90E' }}>{item.value}</div>
                        <div style={{ color: '#718096', fontSize: '0.78rem', marginTop: '4px' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', color: '#718096' }}>
                      <span>Progress</span><span style={{ color: '#fff' }}>3 of 6 months</span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '50px', height: '8px', overflow: 'hidden' }}>
                      <div style={{ width: '50%', height: '100%', background: 'linear-gradient(90deg, #7B61FF, #00D4FF)', borderRadius: '50px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Gift size={18} style={{ color: '#7B61FF' }} />
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>Your Referral Link</h2>
                  </div>
                  <div style={{ background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 600 }}>{referralCode}</span>
                    <button onClick={copyReferral} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#00FF88' : '#7B61FF' }}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#7B61FF' }}>{MOCK_USER.referrals}</div>
                      <div style={{ color: '#718096', fontSize: '0.75rem' }}>Referrals</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#00FF88' }}>$350</div>
                      <div style={{ color: '#718096', fontSize: '0.75rem' }}>Earned</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px' }}>Recent Transactions</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Type', 'Amount', 'Date', 'Hash', 'Status'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#4A5568', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(123,97,255,0.1)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TRANSACTIONS.map(tx => (
                        <tr key={tx.id}>
                          <td style={{ padding: '14px 12px', fontSize: '0.9rem', fontWeight: 500 }}>{tx.type}</td>
                          <td style={{ padding: '14px 12px', fontSize: '0.9rem', fontWeight: 600, color: '#00FF88' }}>{tx.amount}</td>
                          <td style={{ padding: '14px 12px', fontSize: '0.85rem', color: '#A0AEC0' }}>{tx.date}</td>
                          <td style={{ padding: '14px 12px', fontSize: '0.8rem', color: '#4A5568', fontFamily: 'monospace' }}>{tx.hash}</td>
                          <td style={{ padding: '14px 12px' }}>
                            <span style={{ background: 'rgba(0,255,136,0.1)', color: '#00FF88', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {active !== 'overview' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(123,97,255,0.1)', border: '1px solid rgba(123,97,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                {NAV_ITEMS.find(n => n.id === active)?.icon}
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.4rem' }}>
                {NAV_ITEMS.find(n => n.id === active)?.label}
              </h2>
              <p style={{ color: '#4A5568', fontSize: '0.9rem' }}>This section is under development</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
