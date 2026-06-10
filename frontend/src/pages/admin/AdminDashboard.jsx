import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users, DollarSign, TrendingUp, AlertCircle, CheckCircle,
  XCircle, Search, Zap, LayoutDashboard, LogOut,
  Shield, Activity, Wallet, ArrowUpRight,
} from 'lucide-react'
import { adminAPI, depositAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const MOCK_STATS = [
  { label: 'Total Users', value: '12,847', change: '+234 this week', color: '#7B61FF', icon: <Users size={20} /> },
  { label: 'Total Invested', value: '$2.4M', change: '+$180K this month', color: '#00D4FF', icon: <DollarSign size={20} /> },
  { label: 'Active Plans', value: '9,203', change: '71.6% of users', color: '#00FF88', icon: <TrendingUp size={20} /> },
  { label: 'KYC Pending', value: '147', change: '12 submitted today', color: '#F6C90E', icon: <AlertCircle size={20} /> },
]

const MOCK_USERS = [
  { _id: '1', name: 'Rahul Sharma', email: 'rahul@example.com', activePlan: { name: 'Gold', invested: 5000 }, kyc: { status: 'verified' }, isActive: true, createdAt: '2025-06-01' },
  { _id: '2', name: 'Priya Singh', email: 'priya@example.com', activePlan: { name: 'Platinum', invested: 25000 }, kyc: { status: 'verified' }, isActive: true, createdAt: '2025-05-28' },
  { _id: '3', name: 'Amit Kumar', email: 'amit@example.com', activePlan: { name: 'Silver', invested: 500 }, kyc: { status: 'submitted' }, isActive: true, createdAt: '2025-06-05' },
  { _id: '4', name: 'Neha Gupta', email: 'neha@example.com', activePlan: null, kyc: { status: 'rejected' }, isActive: false, createdAt: '2025-06-03' },
]

const NAV = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
  { id: 'users', label: 'Users', icon: <Users size={17} /> },
  { id: 'deposits', label: 'Deposits', icon: <Wallet size={17} /> },
  { id: 'kyc', label: 'KYC Queue', icon: <Shield size={17} /> },
  { id: 'withdrawals',  label: 'Withdrawals',  icon: <ArrowUpRight size={17} /> },
  { id: 'transactions', label: 'Transactions', icon: <Activity size={17} /> },
]

const kycColor = { verified: '#00FF88', submitted: '#F6C90E', pending: '#A0AEC0', rejected: '#FF3B30' }

export default function AdminDashboard() {
  const [active, setActive] = useState('overview')
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(MOCK_USERS)
  const [deposits, setDeposits] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [loadingDeposits, setLoadingDeposits] = useState(false)
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false)
  const [actionMsg, setActionMsg] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (active === 'deposits') {
      setLoadingDeposits(true)
      depositAPI.getPending()
        .then(res => setDeposits(res.data.data))
        .catch(() => setDeposits([]))
        .finally(() => setLoadingDeposits(false))
    }
    if (active === 'withdrawals') {
      setLoadingWithdrawals(true)
      adminAPI.getPendingWithdrawals()
        .then(res => setWithdrawals(res.data.data))
        .catch(() => setWithdrawals([]))
        .finally(() => setLoadingWithdrawals(false))
    }
  }, [active])

  const showMsg = (msg) => { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3000) }

  const handleKYC = async (userId, status) => {
    try {
      await adminAPI.updateKYC(userId, { status })
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, kyc: { ...u.kyc, status } } : u))
      showMsg(`KYC ${status} successfully`)
    } catch {
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, kyc: { ...u.kyc, status } } : u))
      showMsg(`KYC ${status}`)
    }
  }

  const handleConfirmDeposit = async (txId) => {
    try {
      await depositAPI.confirm(txId)
      setDeposits(prev => prev.filter(d => d._id !== txId))
      showMsg('Deposit confirmed — plan activated!')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error confirming deposit')
    }
  }

  const handleRejectDeposit = async (txId) => {
    const reason = prompt('Rejection reason (optional):') || 'Rejected by admin'
    try {
      await depositAPI.reject(txId, reason)
      setDeposits(prev => prev.filter(d => d._id !== txId))
      showMsg('Deposit rejected')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error rejecting deposit')
    }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleApproveWithdrawal = async (txId) => {
    const txHash = prompt('Enter blockchain TxHash (optional):') || ''
    try {
      await adminAPI.approveWithdrawal(txId, txHash)
      setWithdrawals(prev => prev.filter(w => w._id !== txId))
      showMsg('Withdrawal approved — user notified!')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error approving withdrawal')
    }
  }

  const handleRejectWithdrawal = async (txId) => {
    const reason = prompt('Rejection reason:') || 'Rejected by admin'
    try {
      await adminAPI.rejectWithdrawal(txId, reason)
      setWithdrawals(prev => prev.filter(w => w._id !== txId))
      showMsg('Withdrawal rejected — balance refunded to user')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error rejecting withdrawal')
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ minHeight: '100vh', background: '#080919', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', minHeight: '100vh', background: '#0A0B1E', borderRight: '1px solid rgba(123,97,255,0.1)', display: 'flex', flexDirection: 'column', padding: '20px 14px', position: 'fixed', top: 0, left: 0, zIndex: 40 }} className="hidden md:flex">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '12px', padding: '0 8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
            CriptoX <span style={{ color: '#FF3B30', fontSize: '0.7rem', background: 'rgba(255,59,48,0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>ADMIN</span>
          </span>
        </Link>

        <nav style={{ flex: 1, marginTop: '16px' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: active === item.id ? 'rgba(123,97,255,0.15)' : 'transparent', color: active === item.id ? '#fff' : '#718096', fontWeight: active === item.id ? 600 : 400, fontSize: '0.88rem', marginBottom: '3px', textAlign: 'left' }}>
              <span style={{ color: active === item.id ? '#7B61FF' : '#4A5568' }}>{item.icon}</span>
              {item.label}
              {item.id === 'deposits' && deposits.length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#FF3B30', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '20px' }}>
                  {deposits.length}
                </span>
              )}
              {item.id === 'withdrawals' && withdrawals.length > 0 && (
                <span style={{ marginLeft: 'auto', background: '#F6C90E', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '20px' }}>
                  {withdrawals.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#718096', fontSize: '0.88rem', marginTop: '16px', borderTop: '1px solid rgba(123,97,255,0.1)', paddingTop: '20px' }}>
          <LogOut size={15} style={{ color: '#FF3B30' }} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '220px' }}>
        <header style={{ background: 'rgba(10,11,30,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(123,97,255,0.1)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>Admin Dashboard</h1>
            <p style={{ color: '#4A5568', fontSize: '0.78rem' }}>Platform management & analytics</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00FF88' }} />
            <span style={{ color: '#A0AEC0', fontSize: '0.8rem' }}>System Online</span>
          </div>
        </header>

        {/* Action message toast */}
        {actionMsg && (
          <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'rgba(0,255,136,0.15)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '10px', padding: '12px 20px', color: '#00FF88', fontWeight: 600, fontSize: '0.88rem', zIndex: 100 }}>
            ✓ {actionMsg}
          </div>
        )}

        <div style={{ padding: '24px' }}>

          {/* OVERVIEW */}
          {active === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {MOCK_STATS.map(s => (
                  <div key={s.label} style={{ background: 'rgba(20,22,44,0.8)', border: '1px solid rgba(123,97,255,0.12)', borderRadius: '14px', padding: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: '#718096', fontSize: '0.78rem', fontWeight: 500 }}>{s.label}</span>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
                    </div>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#fff', marginBottom: '4px' }}>{s.value}</div>
                    <div style={{ color: s.color, fontSize: '0.75rem', fontWeight: 500 }}>{s.change}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(20,22,44,0.8)', border: '1px solid rgba(123,97,255,0.12)', borderRadius: '14px', padding: '20px' }}>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Plan Distribution</h2>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'Silver', count: 4820, pct: 37, color: '#A0AEC0' },
                    { name: 'Gold', count: 5890, pct: 46, color: '#F6C90E' },
                    { name: 'Platinum', count: 2137, pct: 17, color: '#00D4FF' },
                  ].map(p => (
                    <div key={p.name} style={{ textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', padding: '16px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.4rem', color: p.color, fontFamily: 'Space Grotesk, sans-serif' }}>{p.count.toLocaleString()}</div>
                      <div style={{ color: '#718096', fontSize: '0.8rem', marginTop: '4px' }}>{p.name} ({p.pct}%)</div>
                      <div style={{ marginTop: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '50px', height: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: '50px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* DEPOSITS QUEUE */}
          {active === 'deposits' && (
            <div style={{ background: 'rgba(20,22,44,0.8)', border: '1px solid rgba(123,97,255,0.12)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem' }}>Pending Deposits</h2>
                  <p style={{ color: '#4A5568', fontSize: '0.78rem', marginTop: '3px' }}>Review and confirm USDT deposits from users</p>
                </div>
                {deposits.length > 0 && (
                  <span style={{ background: 'rgba(255,59,48,0.1)', color: '#FF3B30', border: '1px solid rgba(255,59,48,0.2)', fontSize: '0.78rem', fontWeight: 700, padding: '5px 12px', borderRadius: '20px' }}>
                    {deposits.length} pending
                  </span>
                )}
              </div>

              {loadingDeposits ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(123,97,255,0.2)', borderTop: '3px solid #7B61FF', animation: 'spin 1s linear infinite' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              ) : deposits.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#4A5568' }}>
                  <CheckCircle size={36} style={{ margin: '0 auto 12px', color: '#00FF88', opacity: 0.5 }} />
                  <p>No pending deposits — all clear!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {deposits.map(dep => (
                    <div key={dep._id} style={{ background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '12px', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '3px' }}>{dep.user?.name || 'User'}</div>
                          <div style={{ color: '#4A5568', fontSize: '0.78rem' }}>{dep.user?.email}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleConfirmDeposit(dep._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: '#00FF88', fontWeight: 600, fontSize: '0.82rem' }}>
                            <CheckCircle size={14} /> Confirm
                          </button>
                          <button onClick={() => handleRejectDeposit(dep._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.25)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: '#FF3B30', fontWeight: 600, fontSize: '0.82rem' }}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-14px" style={{ marginTop: '14px' }}>
                        {[
                          { label: 'Plan', value: dep.plan },
                          { label: 'Amount', value: `$${dep.amount?.toLocaleString()} USDT` },
                          { label: 'Submitted', value: new Date(dep.createdAt).toLocaleDateString() },
                          { label: 'TxHash', value: dep.txHash?.slice(0, 16) + '...' },
                        ].map(r => (
                          <div key={r.label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px 12px' }}>
                            <div style={{ color: '#4A5568', fontSize: '0.72rem', marginBottom: '4px' }}>{r.label}</div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', fontFamily: r.label === 'TxHash' ? 'monospace' : 'inherit' }}>{r.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS / KYC */}
          {(active === 'users' || active === 'kyc') && (
            <div style={{ background: 'rgba(20,22,44,0.8)', border: '1px solid rgba(123,97,255,0.12)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                  {active === 'kyc' ? 'KYC Queue' : 'User Management'}
                </h2>
                <div style={{ position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                    style={{ padding: '9px 12px 9px 34px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '220px' }}
                    onFocus={e => e.target.style.borderColor = '#7B61FF'} onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['User', 'Plan', 'KYC', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#4A5568', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(123,97,255,0.1)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(active === 'kyc' ? filtered.filter(u => u.kyc?.status === 'submitted') : filtered).map(user => (
                      <tr key={user._id} style={{ borderBottom: '1px solid rgba(123,97,255,0.06)' }}>
                        <td style={{ padding: '13px 12px' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{user.name}</div>
                          <div style={{ color: '#4A5568', fontSize: '0.75rem' }}>{user.email}</div>
                        </td>
                        <td style={{ padding: '13px 12px', fontSize: '0.85rem', color: '#A0AEC0' }}>
                          {user.activePlan?.name || '—'}
                          {user.activePlan?.invested && <div style={{ color: '#4A5568', fontSize: '0.75rem' }}>${user.activePlan.invested.toLocaleString()}</div>}
                        </td>
                        <td style={{ padding: '13px 12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: kycColor[user.kyc?.status] || '#A0AEC0', background: `${kycColor[user.kyc?.status] || '#A0AEC0'}18`, padding: '3px 9px', borderRadius: '20px', textTransform: 'capitalize' }}>
                            {user.kyc?.status || 'pending'}
                          </span>
                        </td>
                        <td style={{ padding: '13px 12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: user.isActive ? '#00FF88' : '#FF3B30', background: user.isActive ? 'rgba(0,255,136,0.1)' : 'rgba(255,59,48,0.1)', padding: '3px 9px', borderRadius: '20px' }}>
                            {user.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td style={{ padding: '13px 12px', fontSize: '0.8rem', color: '#718096' }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '13px 12px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button title="Approve KYC" onClick={() => handleKYC(user._id, 'verified')}
                              style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '6px', padding: '5px', cursor: 'pointer', color: '#00FF88' }}>
                              <CheckCircle size={14} />
                            </button>
                            <button title="Reject KYC" onClick={() => handleKYC(user._id, 'rejected')}
                              style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: '6px', padding: '5px', cursor: 'pointer', color: '#FF3B30' }}>
                              <XCircle size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WITHDRAWALS QUEUE */}
          {active === 'withdrawals' && (
            <div style={{ background: 'rgba(20,22,44,0.8)', border: '1px solid rgba(123,97,255,0.12)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem' }}>Pending Withdrawals</h2>
                  <p style={{ color: '#4A5568', fontSize: '0.78rem', marginTop: '3px' }}>Review and process USDT withdrawal requests</p>
                </div>
                {withdrawals.length > 0 && (
                  <span style={{ background: 'rgba(246,201,14,0.1)', color: '#F6C90E', border: '1px solid rgba(246,201,14,0.2)', fontSize: '0.78rem', fontWeight: 700, padding: '5px 12px', borderRadius: '20px' }}>
                    {withdrawals.length} pending
                  </span>
                )}
              </div>

              {loadingWithdrawals ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(123,97,255,0.2)', borderTop: '3px solid #7B61FF', animation: 'spin 1s linear infinite' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              ) : withdrawals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#4A5568' }}>
                  <CheckCircle size={36} style={{ margin: '0 auto 12px', color: '#00FF88', opacity: 0.5 }} />
                  <p>No pending withdrawals — all clear!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {withdrawals.map(w => (
                    <div key={w._id} style={{ background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(246,201,14,0.15)', borderRadius: '12px', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '3px' }}>{w.user?.name || 'User'}</div>
                          <div style={{ color: '#4A5568', fontSize: '0.78rem' }}>{w.user?.email}</div>
                        </div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#F6C90E' }}>
                          ${w.amount?.toLocaleString()} USDT
                        </div>
                      </div>

                      <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px 12px', margin: '14px 0', fontFamily: 'monospace', fontSize: '0.8rem', color: '#A0AEC0', wordBreak: 'break-all' }}>
                        <span style={{ color: '#4A5568', fontSize: '0.72rem', display: 'block', marginBottom: '3px' }}>To Wallet (TRC-20)</span>
                        {w.walletAddress}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ color: '#718096', fontSize: '0.78rem' }}>
                          Requested: {new Date(w.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleApproveWithdrawal(w._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: '#00FF88', fontWeight: 600, fontSize: '0.82rem' }}>
                            <CheckCircle size={14} /> Approve & Send
                          </button>
                          <button onClick={() => handleRejectWithdrawal(w._id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.25)', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', color: '#FF3B30', fontWeight: 600, fontSize: '0.82rem' }}>
                            <XCircle size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {active === 'transactions' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: '12px' }}>
              <Activity size={40} style={{ color: '#7B61FF' }} />
              <p style={{ color: '#718096' }}>Full transaction log — Phase 6</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
