import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, DollarSign, TrendingUp, AlertCircle, CheckCircle,
  XCircle, Search, Filter, Zap, LayoutDashboard, LogOut,
  Shield, Activity,
} from 'lucide-react'

const STATS = [
  { label: 'Total Users', value: '12,847', change: '+234 this week', color: '#7B61FF', icon: <Users size={20} /> },
  { label: 'Total Invested', value: '$2.4M', change: '+$180K this month', color: '#00D4FF', icon: <DollarSign size={20} /> },
  { label: 'Active Plans', value: '9,203', change: '71.6% of users', color: '#00FF88', icon: <TrendingUp size={20} /> },
  { label: 'KYC Pending', value: '147', change: '12 submitted today', color: '#F6C90E', icon: <AlertCircle size={20} /> },
]

const USERS = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', plan: 'Gold', invested: '$5,000', kyc: 'Verified', status: 'Active', joined: 'Jun 1, 2025' },
  { id: 2, name: 'Priya Singh', email: 'priya@example.com', plan: 'Platinum', invested: '$25,000', kyc: 'Verified', status: 'Active', joined: 'May 28, 2025' },
  { id: 3, name: 'Amit Kumar', email: 'amit@example.com', plan: 'Silver', invested: '$500', kyc: 'Pending', status: 'Active', joined: 'Jun 5, 2025' },
  { id: 4, name: 'Neha Gupta', email: 'neha@example.com', plan: 'Gold', invested: '$3,000', kyc: 'Rejected', status: 'Suspended', joined: 'Jun 3, 2025' },
  { id: 5, name: 'Vikram Patel', email: 'vikram@example.com', plan: 'Silver', invested: '$200', kyc: 'Pending', status: 'Active', joined: 'Jun 7, 2025' },
]

const NAV = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
  { id: 'users', label: 'Users', icon: <Users size={17} /> },
  { id: 'kyc', label: 'KYC Queue', icon: <Shield size={17} /> },
  { id: 'transactions', label: 'Transactions', icon: <Activity size={17} /> },
]

const kycColor = { Verified: '#00FF88', Pending: '#F6C90E', Rejected: '#FF3B30' }
const statusColor = { Active: '#00FF88', Suspended: '#FF3B30' }

export default function AdminDashboard() {
  const [active, setActive] = useState('overview')
  const [search, setSearch] = useState('')

  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#080919', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', minHeight: '100vh', background: '#0A0B1E', borderRight: '1px solid rgba(123,97,255,0.1)', display: 'flex', flexDirection: 'column', padding: '20px 14px', position: 'fixed', top: 0, left: 0, zIndex: 40 }} className="hidden md:flex">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', marginBottom: '12px', padding: '0 8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>CriptoX <span style={{ color: '#FF3B30', fontSize: '0.7rem', background: 'rgba(255,59,48,0.15)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>ADMIN</span></span>
        </Link>

        <nav style={{ flex: 1, marginTop: '16px' }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: active === item.id ? 'rgba(123,97,255,0.15)' : 'transparent',
                color: active === item.id ? '#fff' : '#718096',
                fontWeight: active === item.id ? 600 : 400, fontSize: '0.88rem',
                marginBottom: '3px', textAlign: 'left',
              }}>
              <span style={{ color: active === item.id ? '#7B61FF' : '#4A5568' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <Link to="/login">
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#718096', fontSize: '0.88rem', marginTop: '16px', borderTop: '1px solid rgba(123,97,255,0.1)', paddingTop: '20px' }}>
            <LogOut size={15} style={{ color: '#FF3B30' }} /> Logout
          </button>
        </Link>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: '220px', padding: '0' }}>
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

        <div style={{ padding: '24px' }}>
          {active === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {STATS.map(s => (
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

          {(active === 'users' || active === 'kyc') && (
            <div style={{ background: 'rgba(20,22,44,0.8)', border: '1px solid rgba(123,97,255,0.12)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem' }}>
                  {active === 'kyc' ? 'KYC Queue' : 'User Management'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                      style={{ padding: '9px 12px 9px 34px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '220px' }}
                      onFocus={e => e.target.style.borderColor = '#7B61FF'} onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                  </div>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['User', 'Plan', 'Invested', 'KYC', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#4A5568', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(123,97,255,0.1)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(active === 'kyc' ? filtered.filter(u => u.kyc === 'Pending') : filtered).map(user => (
                      <tr key={user.id} style={{ borderBottom: '1px solid rgba(123,97,255,0.06)' }}>
                        <td style={{ padding: '13px 12px' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{user.name}</div>
                          <div style={{ color: '#4A5568', fontSize: '0.75rem' }}>{user.email}</div>
                        </td>
                        <td style={{ padding: '13px 12px', fontSize: '0.85rem', color: '#A0AEC0' }}>{user.plan}</td>
                        <td style={{ padding: '13px 12px', fontSize: '0.85rem', fontWeight: 600 }}>{user.invested}</td>
                        <td style={{ padding: '13px 12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: kycColor[user.kyc], background: `${kycColor[user.kyc]}18`, padding: '3px 9px', borderRadius: '20px' }}>
                            {user.kyc}
                          </span>
                        </td>
                        <td style={{ padding: '13px 12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor[user.status], background: `${statusColor[user.status]}18`, padding: '3px 9px', borderRadius: '20px' }}>
                            {user.status}
                          </span>
                        </td>
                        <td style={{ padding: '13px 12px', fontSize: '0.8rem', color: '#718096' }}>{user.joined}</td>
                        <td style={{ padding: '13px 12px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button title="Approve" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '6px', padding: '5px', cursor: 'pointer', color: '#00FF88' }}><CheckCircle size={14} /></button>
                            <button title="Reject" style={{ background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: '6px', padding: '5px', cursor: 'pointer', color: '#FF3B30' }}><XCircle size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {active === 'transactions' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', flexDirection: 'column', gap: '12px' }}>
              <Activity size={40} style={{ color: '#7B61FF' }} />
              <p style={{ color: '#718096' }}>Transactions module — under development</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
