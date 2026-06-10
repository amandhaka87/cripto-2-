import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Wallet, ArrowUpRight, Clock, CheckCircle,
  XCircle, AlertCircle, Zap, Copy, Check,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { userAPI } from '../../services/api'

const STATUS_STYLE = {
  pending:   { bg: 'rgba(246,201,14,0.1)',  color: '#F6C90E',  icon: <Clock size={12} /> },
  completed: { bg: 'rgba(0,255,136,0.1)',   color: '#00FF88',  icon: <CheckCircle size={12} /> },
  rejected:  { bg: 'rgba(255,59,48,0.1)',   color: '#FF3B30',  icon: <XCircle size={12} /> },
}

export default function Withdraw() {
  const { user, setUser } = useAuth()
  const [amount, setAmount]     = useState('')
  const [wallet, setWallet]     = useState('')
  const [history, setHistory]   = useState([])
  const [balance, setBalance]   = useState(0)
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(true)
  const [msg, setMsg]           = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)

  useEffect(() => {
    Promise.all([userAPI.getWithdrawals(), userAPI.getDashboard()])
      .then(([wRes, dRes]) => {
        setHistory(wRes.data.data)
        setBalance(dRes.data.data.user.wallet.balance)
      })
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [])

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 4000)
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (!wallet.trim()) return showMsg('Please enter your USDT wallet address', 'error')
    if (!amt || amt < 10) return showMsg('Minimum withdrawal is $10 USDT', 'error')
    if (amt > balance) return showMsg('Insufficient balance', 'error')

    setLoading(true)
    try {
      await userAPI.requestWithdrawal({ amount: amt, walletAddress: wallet.trim() })
      setBalance(prev => prev - amt)
      setHistory(prev => [
        { _id: Date.now(), amount: amt, walletAddress: wallet.trim(), status: 'pending', createdAt: new Date() },
        ...prev,
      ])
      setAmount('')
      setWallet('')
      showMsg(`Withdrawal request of $${amt} submitted! Admin will process within 24–48h.`)
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error submitting request', 'error')
    } finally {
      setLoading(false)
    }
  }

  const copyAddr = (addr, idx) => {
    navigator.clipboard.writeText(addr)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', fontFamily: 'Inter, sans-serif', color: '#fff' }}>
      {/* Header */}
      <header style={{ background: 'rgba(14,15,36,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(123,97,255,0.1)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 30 }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', color: '#718096', textDecoration: 'none', padding: '6px' }}>
          <ArrowLeft size={18} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={14} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}>
            Cripto<span style={{ background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>X</span>
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ color: '#A0AEC0', fontSize: '0.9rem', fontWeight: 600 }}>Withdraw USDT</span>
      </header>

      {/* Toast */}
      {msg && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', background: msg.type === 'error' ? 'rgba(255,59,48,0.15)' : 'rgba(0,255,136,0.12)', border: `1px solid ${msg.type === 'error' ? 'rgba(255,59,48,0.3)' : 'rgba(0,255,136,0.25)'}`, borderRadius: '10px', padding: '12px 18px', color: msg.type === 'error' ? '#FF6B6B' : '#00FF88', fontWeight: 600, fontSize: '0.85rem', zIndex: 100, maxWidth: '340px' }}>
          {msg.type === 'error' ? <XCircle size={14} style={{ display: 'inline', marginRight: '6px' }} /> : <CheckCircle size={14} style={{ display: 'inline', marginRight: '6px' }} />}
          {msg.text}
        </div>
      )}

      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Balance card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(123,97,255,0.15), rgba(0,212,255,0.1))', border: '1px solid rgba(123,97,255,0.25)', borderRadius: '20px', padding: '28px 32px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Wallet size={18} style={{ color: '#7B61FF' }} />
              <span style={{ color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500 }}>Available Balance</span>
            </div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '2.2rem', color: '#fff' }}>
              ${balance.toFixed(2)} <span style={{ fontSize: '1rem', color: '#00D4FF', fontWeight: 600 }}>USDT</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#4A5568', fontSize: '0.78rem', marginBottom: '4px' }}>Minimum withdrawal</div>
            <div style={{ color: '#F6C90E', fontWeight: 700, fontSize: '0.95rem' }}>$10.00 USDT</div>
            <div style={{ color: '#4A5568', fontSize: '0.78rem', marginTop: '4px' }}>Network: TRC-20</div>
          </div>
        </div>

        {/* Withdrawal form */}
        <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpRight size={20} style={{ color: '#7B61FF' }} />
            New Withdrawal
          </h2>

          <form onSubmit={handleWithdraw}>
            {/* Amount */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Amount (USDT)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#7B61FF', fontWeight: 700 }}>$</span>
                <input
                  type="number"
                  min="10"
                  step="0.01"
                  max={balance}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  style={{ width: '100%', padding: '14px 14px 14px 28px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#7B61FF'}
                  onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'}
                />
              </div>
              {/* Quick fill buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                {[25, 50, 75, 100].map(pct => (
                  <button key={pct} type="button"
                    onClick={() => setAmount(((balance * pct) / 100).toFixed(2))}
                    style={{ flex: 1, padding: '6px', background: 'rgba(123,97,255,0.08)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '8px', color: '#A0AEC0', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                    onMouseEnter={e => { e.target.style.background = 'rgba(123,97,255,0.18)'; e.target.style.color = '#fff' }}
                    onMouseLeave={e => { e.target.style.background = 'rgba(123,97,255,0.08)'; e.target.style.color = '#A0AEC0' }}>
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet Address */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Your USDT Wallet (TRC-20)
              </label>
              <input
                type="text"
                value={wallet}
                onChange={e => setWallet(e.target.value)}
                placeholder="TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                required
                style={{ width: '100%', padding: '14px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#7B61FF'}
                onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'}
              />
              <p style={{ color: '#4A5568', fontSize: '0.75rem', marginTop: '6px' }}>
                ⚠️ Double-check your TRC-20 address. Wrong address = permanent loss of funds.
              </p>
            </div>

            {/* Info box */}
            <div style={{ background: 'rgba(246,201,14,0.06)', border: '1px solid rgba(246,201,14,0.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px', display: 'flex', gap: '10px' }}>
              <AlertCircle size={16} style={{ color: '#F6C90E', flexShrink: 0, marginTop: '1px' }} />
              <div style={{ fontSize: '0.8rem', color: '#A0AEC0', lineHeight: '1.6' }}>
                Withdrawals are processed <strong style={{ color: '#fff' }}>manually</strong> within 24–48 hours. Funds are reserved immediately from your balance.
              </div>
            </div>

            <button type="submit" disabled={loading || balance < 10}
              style={{ width: '100%', padding: '14px', background: loading || balance < 10 ? 'rgba(123,97,255,0.3)' : 'linear-gradient(135deg, #7B61FF, #00D4FF)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: loading || balance < 10 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.8s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpRight size={18} />
                  Request Withdrawal
                </>
              )}
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </form>
        </div>

        {/* History */}
        <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '24px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '20px' }}>Withdrawal History</h2>

          {fetching ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(123,97,255,0.2)', borderTop: '3px solid #7B61FF', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#4A5568' }}>
              <Wallet size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>No withdrawals yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {history.map((w, i) => {
                const s = STATUS_STYLE[w.status] || STATUS_STYLE.pending
                return (
                  <div key={w._id} style={{ background: 'rgba(11,12,30,0.6)', border: '1px solid rgba(123,97,255,0.1)', borderRadius: '12px', padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#FF3B30' }}>
                        -${w.amount.toFixed(2)} USDT
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: s.bg, color: s.color, fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', textTransform: 'capitalize' }}>
                        {s.icon} {w.status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#4A5568', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {w.walletAddress}
                      </div>
                      <button onClick={() => copyAddr(w.walletAddress, i)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: copiedIdx === i ? '#00FF88' : '#4A5568', flexShrink: 0 }}>
                        {copiedIdx === i ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    {w.txHash && (
                      <div style={{ marginTop: '6px', fontFamily: 'monospace', fontSize: '0.75rem', color: '#7B61FF' }}>
                        TxHash: {w.txHash}
                      </div>
                    )}
                    <div style={{ color: '#4A5568', fontSize: '0.75rem', marginTop: '6px' }}>
                      {new Date(w.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
