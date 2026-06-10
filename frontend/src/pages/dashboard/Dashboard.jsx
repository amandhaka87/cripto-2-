import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Users, Wallet, Settings, Bell,
  LogOut, ChevronRight, Copy, Check, Award, Gift, Zap, Trophy,
  Shield, ShieldCheck, ShieldOff, QrCode, KeyRound,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { userAPI, twoFAAPI } from '../../services/api'

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: 'Overview',    id: 'overview',     to: null },
  { icon: <TrendingUp size={18} />,      label: 'My Plans',    id: 'plans',         to: '/plans' },
  { icon: <Wallet size={18} />,          label: 'Withdraw',    id: 'withdraw',      to: '/withdraw' },
  { icon: <Users size={18} />,           label: 'Referrals',   id: 'referrals',     to: '/referrals' },
  { icon: <Trophy size={18} />,          label: 'Leaderboard', id: 'leaderboard',   to: '/leaderboard' },
  { icon: <Gift size={18} />,            label: 'Spin Wheel',  id: 'spin',          to: '/spin' },
  { icon: <Settings size={18} />,        label: 'Settings',    id: 'settings',      to: null },
]

export default function Dashboard() {
  const [active, setActive] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [dashData, setDashData] = useState(null)
  const [loadingData, setLoadingData] = useState(true)
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  // 2FA state
  const [twoFAStep, setTwoFAStep] = useState('idle') // idle | setup | confirm | disable
  const [qrData, setQrData]     = useState(null)
  const [twoFAOtp, setTwoFAOtp] = useState('')
  const [twoFAMsg, setTwoFAMsg] = useState(null)
  const [twoFALoading, setTwoFALoading] = useState(false)

  useEffect(() => {
    userAPI.getDashboard()
      .then(res => setDashData(res.data.data))
      .catch(console.error)
      .finally(() => setLoadingData(false))
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const copyReferral = () => {
    navigator.clipboard.writeText(user?.referralCode || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const show2FAMsg = (text, type = 'success') => {
    setTwoFAMsg({ text, type })
    setTimeout(() => setTwoFAMsg(null), 4000)
  }

  const handleGenerate2FA = async () => {
    setTwoFALoading(true)
    try {
      const res = await twoFAAPI.generate()
      setQrData(res.data)
      setTwoFAStep('confirm')
    } catch (err) {
      show2FAMsg(err.response?.data?.message || 'Error generating QR', 'error')
    } finally {
      setTwoFALoading(false)
    }
  }

  const handleEnable2FA = async (e) => {
    e.preventDefault()
    setTwoFALoading(true)
    try {
      await twoFAAPI.enable(twoFAOtp)
      setUser(prev => ({ ...prev, twoFA: { ...prev.twoFA, enabled: true } }))
      setTwoFAStep('idle')
      setTwoFAOtp('')
      setQrData(null)
      show2FAMsg('2FA enabled! Your account is now more secure.')
    } catch (err) {
      show2FAMsg(err.response?.data?.message || 'Invalid OTP', 'error')
    } finally {
      setTwoFALoading(false)
    }
  }

  const handleDisable2FA = async (e) => {
    e.preventDefault()
    setTwoFALoading(true)
    try {
      await twoFAAPI.disable(twoFAOtp)
      setUser(prev => ({ ...prev, twoFA: { ...prev.twoFA, enabled: false } }))
      setTwoFAStep('idle')
      setTwoFAOtp('')
      show2FAMsg('2FA disabled.')
    } catch (err) {
      show2FAMsg(err.response?.data?.message || 'Invalid OTP', 'error')
    } finally {
      setTwoFALoading(false)
    }
  }

  const plan = dashData?.user?.activePlan
  const wallet = dashData?.user?.wallet || {}
  const transactions = dashData?.transactions || []

  const STAT_CARDS = [
    { label: 'Total Balance', value: `$${(wallet.balance || 0).toFixed(2)}`, sub: 'Available to withdraw', color: '#7B61FF', icon: <Wallet size={20} /> },
    { label: 'Total Invested', value: `$${(plan?.invested || 0).toLocaleString()}`, sub: plan?.name ? `${plan.name} Plan Active` : 'No active plan', color: '#00D4FF', icon: <TrendingUp size={20} /> },
    { label: 'Monthly ROI', value: plan ? `${plan.roi}%` : '—', sub: plan ? `+$${((plan.invested * plan.roi) / 100).toFixed(0)} / month` : 'Choose a plan', color: '#00FF88', icon: <Award size={20} /> },
    { label: 'Referrals', value: user?.referralCount || 0, sub: `$${user?.referralEarnings || 0} earned`, color: '#F6C90E', icon: <Users size={20} /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', minHeight: '100vh', background: '#0E0F24', borderRight: '1px solid rgba(123,97,255,0.15)', display: 'flex', flexDirection: 'column', padding: '24px 16px', position: 'fixed', top: 0, left: 0, zIndex: 40 }} className="hidden md:flex">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '36px', padding: '0 8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#fff' }}>Cripto<span className="gradient-text">X</span></span>
        </Link>

        <nav style={{ flex: 1 }}>
          {NAV_ITEMS.map(item => {
            const isActive = active === item.id
            const inner = (
              <>
                <span style={{ color: isActive ? '#7B61FF' : '#4A5568' }}>{item.icon}</span>
                {item.label}
                {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#7B61FF' }} />}
              </>
            )
            const style = { width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: isActive ? 'rgba(123,97,255,0.15)' : 'transparent', color: isActive ? '#fff' : '#718096', fontWeight: isActive ? 600 : 400, fontSize: '0.9rem', marginBottom: '4px', textAlign: 'left', textDecoration: 'none' }
            return item.to
              ? <Link key={item.id} to={item.to} style={style}>{inner}</Link>
              : <button key={item.id} onClick={() => setActive(item.id)} style={style}>{inner}</button>
          })}
        </nav>

        <div style={{ borderTop: '1px solid rgba(123,97,255,0.1)', paddingTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {user?.name?.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#4A5568' }}>{plan?.name || 'No plan'}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#718096', fontSize: '0.9rem' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,59,48,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut size={16} style={{ color: '#FF3B30' }} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '240px' }} className="md:ml-60">
        <header style={{ background: 'rgba(14,15,36,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(123,97,255,0.1)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.3rem' }}>
              Good morning, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#4A5568', fontSize: '0.8rem', marginTop: '2px' }}>Your investment dashboard</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{ background: 'rgba(123,97,255,0.1)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#7B61FF', display: 'flex' }}>
              <Bell size={18} />
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <div style={{ padding: '28px' }}>
          {loadingData ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(123,97,255,0.2)', borderTop: '3px solid #7B61FF', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          ) : active === 'overview' ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {STAT_CARDS.map(card => (
                  <div key={card.label} style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '20px', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${card.color}40`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(123,97,255,0.15)'}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ color: '#718096', fontSize: '0.8rem', fontWeight: 500 }}>{card.label}</span>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>{card.icon}</div>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#fff', marginBottom: '4px' }}>{card.value}</div>
                    <div style={{ color: '#00FF88', fontSize: '0.78rem', fontWeight: 500 }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* Plan + Referral */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <div style={{ gridColumn: 'span 2', background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
                      {plan ? `Active Plan — ${plan.name}` : 'No Active Plan'}
                    </h2>
                    {plan ? (
                      <span style={{ background: 'rgba(0,255,136,0.1)', color: '#00FF88', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>ACTIVE</span>
                    ) : (
                      <Link to="/plans"><button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Choose Plan</button></Link>
                    )}
                  </div>
                  {plan ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { label: 'Invested', value: `$${plan.invested?.toLocaleString()}` },
                          { label: 'Monthly ROI', value: `${plan.roi}%` },
                          { label: 'Duration', value: plan.duration || '—' },
                          { label: 'Status', value: plan.status || 'Active' },
                        ].map(item => (
                          <div key={item.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', color: '#F6C90E' }}>{item.value}</div>
                            <div style={{ color: '#718096', fontSize: '0.78rem', marginTop: '4px' }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p style={{ color: '#4A5568', fontSize: '0.9rem' }}>Start growing your wealth by selecting an investment plan.</p>
                  )}
                </div>

                <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Gift size={18} style={{ color: '#7B61FF' }} />
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem' }}>Your Referral Code</h2>
                  </div>
                  <div style={{ background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 600 }}>{user?.referralCode || '—'}</span>
                    <button onClick={copyReferral} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#00FF88' : '#7B61FF' }}>
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#7B61FF' }}>{user?.referralCount || 0}</div>
                      <div style={{ color: '#718096', fontSize: '0.75rem' }}>Referrals</div>
                    </div>
                    <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#00FF88' }}>${user?.referralEarnings || 0}</div>
                      <div style={{ color: '#718096', fontSize: '0.75rem' }}>Earned</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions */}
              <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px' }}>Recent Transactions</h2>
                {transactions.length === 0 ? (
                  <p style={{ color: '#4A5568', textAlign: 'center', padding: '32px', fontSize: '0.9rem' }}>No transactions yet</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          {['Type', 'Amount', 'Date', 'Status'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#4A5568', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid rgba(123,97,255,0.1)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(tx => (
                          <tr key={tx._id}>
                            <td style={{ padding: '13px 12px', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>{tx.type.replace('_', ' ')}</td>
                            <td style={{ padding: '13px 12px', fontSize: '0.9rem', fontWeight: 600, color: '#00FF88' }}>+${tx.amount}</td>
                            <td style={{ padding: '13px 12px', fontSize: '0.85rem', color: '#A0AEC0' }}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '13px 12px' }}>
                              <span style={{ background: tx.status === 'completed' ? 'rgba(0,255,136,0.1)' : 'rgba(246,201,14,0.1)', color: tx.status === 'completed' ? '#00FF88' : '#F6C90E', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : active === 'settings' ? (
            <div style={{ maxWidth: '600px' }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem', marginBottom: '24px' }}>Security Settings</h2>

              {/* Toast */}
              {twoFAMsg && (
                <div style={{ background: twoFAMsg.type === 'error' ? 'rgba(255,59,48,0.1)' : 'rgba(0,255,136,0.1)', border: `1px solid ${twoFAMsg.type === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(0,255,136,0.25)'}`, borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: twoFAMsg.type === 'error' ? '#FF6B6B' : '#00FF88', fontSize: '0.88rem', fontWeight: 600 }}>
                  {twoFAMsg.text}
                </div>
              )}

              {/* 2FA Card */}
              <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: user?.twoFA?.enabled ? 'rgba(0,255,136,0.1)' : 'rgba(123,97,255,0.1)', border: `1px solid ${user?.twoFA?.enabled ? 'rgba(0,255,136,0.2)' : 'rgba(123,97,255,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {user?.twoFA?.enabled ? <ShieldCheck size={22} style={{ color: '#00FF88' }} /> : <Shield size={22} style={{ color: '#7B61FF' }} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Two-Factor Authentication</div>
                      <div style={{ color: '#4A5568', fontSize: '0.78rem', marginTop: '2px' }}>Google Authenticator (TOTP)</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: user?.twoFA?.enabled ? 'rgba(0,255,136,0.1)' : 'rgba(123,97,255,0.08)', color: user?.twoFA?.enabled ? '#00FF88' : '#7B61FF', border: `1px solid ${user?.twoFA?.enabled ? 'rgba(0,255,136,0.2)' : 'rgba(123,97,255,0.15)'}` }}>
                    {user?.twoFA?.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <p style={{ color: '#A0AEC0', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  {user?.twoFA?.enabled
                    ? 'Your account is protected with two-factor authentication. Every login requires a 6-digit code from your authenticator app.'
                    : 'Add an extra layer of security. After enabling, you\'ll need a 6-digit code from Google Authenticator on every login.'}
                </p>

                {/* idle — show enable or disable button */}
                {twoFAStep === 'idle' && (
                  user?.twoFA?.enabled ? (
                    <button onClick={() => setTwoFAStep('disable')}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.25)', borderRadius: '10px', padding: '11px 20px', cursor: 'pointer', color: '#FF6B6B', fontWeight: 600, fontSize: '0.88rem' }}>
                      <ShieldOff size={16} /> Disable 2FA
                    </button>
                  ) : (
                    <button onClick={() => setTwoFAStep('setup')}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', border: 'none', borderRadius: '10px', padding: '11px 20px', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>
                      <QrCode size={16} /> Enable 2FA
                    </button>
                  )
                )}

                {/* setup — explain steps, generate QR */}
                {twoFAStep === 'setup' && (
                  <div>
                    <div style={{ background: 'rgba(123,97,255,0.06)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', fontSize: '0.83rem', color: '#A0AEC0', lineHeight: '1.7' }}>
                      <strong style={{ color: '#fff' }}>How to set up:</strong><br />
                      1. Install <strong style={{ color: '#7B61FF' }}>Google Authenticator</strong> on your phone<br />
                      2. Click "Show QR Code" below and scan it<br />
                      3. Enter the 6-digit code shown in the app
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button onClick={handleGenerate2FA} disabled={twoFALoading}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', border: 'none', borderRadius: '10px', padding: '11px 20px', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: '0.88rem', opacity: twoFALoading ? 0.7 : 1 }}>
                        <QrCode size={16} /> {twoFALoading ? 'Generating...' : 'Show QR Code'}
                      </button>
                      <button onClick={() => setTwoFAStep('idle')}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 20px', cursor: 'pointer', color: '#718096', fontSize: '0.88rem' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* confirm — show QR + OTP input */}
                {twoFAStep === 'confirm' && qrData && (
                  <form onSubmit={handleEnable2FA}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <p style={{ color: '#A0AEC0', fontSize: '0.82rem', marginBottom: '14px' }}>Scan this QR code with Google Authenticator:</p>
                      <img src={qrData.qr} alt="2FA QR Code" style={{ width: '180px', height: '180px', borderRadius: '12px', border: '4px solid rgba(123,97,255,0.2)', background: '#fff', padding: '8px' }} />
                      <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '8px 12px', display: 'inline-block' }}>
                        <div style={{ color: '#4A5568', fontSize: '0.7rem', marginBottom: '3px' }}>Manual key</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#A0AEC0', letterSpacing: '0.1em' }}>{qrData.secret}</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <KeyRound size={13} style={{ display: 'inline', marginRight: '6px' }} />
                        Enter 6-digit Code
                      </label>
                      <input type="text" inputMode="numeric" maxLength={6} value={twoFAOtp} onChange={e => setTwoFAOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" autoFocus
                        style={{ width: '100%', padding: '13px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '1.4rem', outline: 'none', textAlign: 'center', letterSpacing: '0.4rem', fontFamily: 'Space Grotesk, monospace', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#7B61FF'}
                        onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" disabled={twoFALoading || twoFAOtp.length !== 6}
                        style={{ flex: 1, background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', border: 'none', borderRadius: '10px', padding: '12px', cursor: twoFALoading || twoFAOtp.length !== 6 ? 'not-allowed' : 'pointer', color: '#fff', fontWeight: 700, fontSize: '0.9rem', opacity: twoFALoading || twoFAOtp.length !== 6 ? 0.6 : 1 }}>
                        {twoFALoading ? 'Activating...' : 'Activate 2FA'}
                      </button>
                      <button type="button" onClick={() => { setTwoFAStep('idle'); setTwoFAOtp(''); setQrData(null) }}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', color: '#718096', fontSize: '0.88rem' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* disable — OTP confirmation */}
                {twoFAStep === 'disable' && (
                  <form onSubmit={handleDisable2FA}>
                    <p style={{ color: '#A0AEC0', fontSize: '0.85rem', marginBottom: '16px' }}>
                      Enter your current Google Authenticator code to disable 2FA:
                    </p>
                    <div style={{ marginBottom: '16px' }}>
                      <input type="text" inputMode="numeric" maxLength={6} value={twoFAOtp} onChange={e => setTwoFAOtp(e.target.value.replace(/\D/g, ''))} placeholder="000000" autoFocus
                        style={{ width: '100%', padding: '13px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: '10px', color: '#fff', fontSize: '1.4rem', outline: 'none', textAlign: 'center', letterSpacing: '0.4rem', fontFamily: 'Space Grotesk, monospace', boxSizing: 'border-box' }}
                        onFocus={e => e.target.style.borderColor = '#FF3B30'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,59,48,0.2)'} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" disabled={twoFALoading || twoFAOtp.length !== 6}
                        style={{ flex: 1, background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '10px', padding: '12px', cursor: twoFALoading || twoFAOtp.length !== 6 ? 'not-allowed' : 'pointer', color: '#FF6B6B', fontWeight: 700, fontSize: '0.9rem', opacity: twoFALoading || twoFAOtp.length !== 6 ? 0.6 : 1 }}>
                        {twoFALoading ? 'Disabling...' : 'Confirm Disable'}
                      </button>
                      <button type="button" onClick={() => { setTwoFAStep('idle'); setTwoFAOtp('') }}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 20px', cursor: 'pointer', color: '#718096', fontSize: '0.88rem' }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(123,97,255,0.1)', border: '1px solid rgba(123,97,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                {NAV_ITEMS.find(n => n.id === active)?.icon}
              </div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.4rem' }}>
                {NAV_ITEMS.find(n => n.id === active)?.label}
              </h2>
              <p style={{ color: '#4A5568', fontSize: '0.9rem' }}>Coming in next phase</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
