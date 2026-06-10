import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, ArrowLeft, Wallet, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react'
import { depositAPI } from '../../services/api'

const PLANS = {
  Silver:   { roi: 8,  duration: '3 Months', min: 100,   max: 999,   color: '#A0AEC0', icon: '🥈' },
  Gold:     { roi: 15, duration: '6 Months', min: 1000,  max: 9999,  color: '#F6C90E', icon: '🥇' },
  Platinum: { roi: 25, duration: '12 Months', min: 10000, max: 100000, color: '#00D4FF', icon: '💎' },
}

const STEPS = ['Select Plan', 'Send USDT', 'Submit Proof', 'Confirmation']

export default function Payment() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || '')
  const [amount, setAmount] = useState('')
  const [walletInfo, setWalletInfo] = useState({ wallet: '...loading', network: 'TRC-20' })
  const [txHash, setTxHash] = useState('')
  const [senderWallet, setSenderWallet] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [txId, setTxId] = useState(null)

  useEffect(() => {
    depositAPI.getWalletInfo()
      .then(res => setWalletInfo(res.data))
      .catch(() => {})
  }, [])

  const plan = PLANS[selectedPlan]
  const monthly = plan && amount ? ((parseFloat(amount) * plan.roi) / 100).toFixed(2) : '0.00'

  const copyAddress = () => {
    navigator.clipboard.writeText(walletInfo.wallet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const goStep2 = () => {
    if (!selectedPlan) { setError('Please select a plan'); return }
    const amt = parseFloat(amount)
    if (!amt || amt < plan.min || amt > plan.max) {
      setError(`Amount must be $${plan.min.toLocaleString()}–$${plan.max.toLocaleString()}`)
      return
    }
    setError('')
    setStep(2)
  }

  const goStep3 = () => setStep(3)

  const submitDeposit = async () => {
    if (!txHash.trim()) { setError('Please enter the transaction hash'); return }
    if (txHash.trim().length < 20) { setError('Transaction hash looks too short'); return }
    setError('')
    setLoading(true)
    try {
      const res = await depositAPI.submit({
        planName: selectedPlan,
        amount: parseFloat(amount),
        txHash: txHash.trim(),
        walletAddress: senderWallet.trim(),
      })
      setTxId(res.data.transactionId)
      setStep(4)
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', padding: '24px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <Link to="/plans" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#718096', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '16px' }}>
            <ArrowLeft size={15} /> Back to Plans
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem' }}>
            USDT <span className="gradient-text">Payment</span>
          </h1>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          {STEPS.map((label, i) => {
            const s = i + 1
            const done = step > s
            const active = step === s
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < STEPS.length ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? 'linear-gradient(135deg,#7B61FF,#00D4FF)' : active ? 'linear-gradient(135deg,#7B61FF,#00D4FF)' : 'rgba(123,97,255,0.1)',
                    border: (!done && !active) ? '1px solid rgba(123,97,255,0.3)' : 'none',
                    fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                  }}>
                    {done ? <CheckCircle size={16} /> : s}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: active ? '#fff' : done ? '#7B61FF' : '#4A5568', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{label}</span>
                </div>
                {s < STEPS.length && (
                  <div style={{ flex: 1, height: '2px', background: done ? 'linear-gradient(90deg,#7B61FF,#00D4FF)' : 'rgba(123,97,255,0.15)', margin: '0 8px', marginBottom: '22px', borderRadius: '2px' }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '20px', color: '#FF6B6B', fontSize: '0.88rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
          </div>
        )}

        {/* STEP 1 — Select Plan & Amount */}
        {step === 1 && (
          <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.15rem', marginBottom: '20px' }}>Select Plan & Amount</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {Object.entries(PLANS).map(([name, p]) => (
                <label key={name} onClick={() => { setSelectedPlan(name); setAmount(''); setError('') }}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: selectedPlan === name ? 'rgba(123,97,255,0.12)' : 'rgba(11,12,30,0.6)', border: selectedPlan === name ? `1px solid ${p.color}60` : '1px solid rgba(123,97,255,0.15)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '1.6rem' }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: p.color }}>{name}</div>
                    <div style={{ color: '#718096', fontSize: '0.8rem' }}>${p.min.toLocaleString()} – ${p.max.toLocaleString()} • {p.roi}% / month</div>
                  </div>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedPlan === name ? p.color : '#4A5568'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedPlan === name && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: p.color }} />}
                  </div>
                </label>
              ))}
            </div>

            {selectedPlan && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Investment Amount (USDT)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4A5568', fontWeight: 600 }}>$</span>
                    <input type="number" min={plan.min} max={plan.max}
                      placeholder={`${plan.min} – ${plan.max}`}
                      value={amount} onChange={e => { setAmount(e.target.value); setError('') }}
                      style={{ width: '100%', padding: '13px 12px 13px 28px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                      onFocus={e => e.target.style.borderColor = '#7B61FF'}
                      onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
                  </div>
                </div>

                {amount && parseFloat(amount) >= plan.min && (
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#718096', fontSize: '0.85rem' }}>Monthly earnings</span>
                      <span style={{ color: '#00FF88', fontWeight: 700 }}>+${monthly}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#718096', fontSize: '0.85rem' }}>Lock period</span>
                      <span style={{ color: plan.color, fontWeight: 600 }}>{plan.duration}</span>
                    </div>
                  </div>
                )}
              </>
            )}

            <button onClick={goStep2} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2 — Send USDT */}
        {step === 2 && (
          <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.15rem', marginBottom: '6px' }}>Send USDT to Company Wallet</h2>
            <p style={{ color: '#718096', fontSize: '0.88rem', marginBottom: '24px' }}>
              Send exactly <strong style={{ color: '#fff' }}>${parseFloat(amount).toLocaleString()} USDT</strong> via <strong style={{ color: '#00D4FF' }}>TRC-20</strong> network only.
            </p>

            {/* QR Code */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px' }}>
                <QRCodeSVG value={walletInfo.wallet} size={160} />
              </div>
            </div>

            {/* Wallet address */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.82rem', fontWeight: 500, marginBottom: '8px' }}>Company USDT Wallet Address (TRC-20)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', padding: '12px 14px' }}>
                <span style={{ flex: 1, fontFamily: 'monospace', fontSize: '0.82rem', color: '#E2E8F0', wordBreak: 'break-all' }}>{walletInfo.wallet}</span>
                <button onClick={copyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#00FF88' : '#7B61FF', flexShrink: 0 }}>
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Warning */}
            <div style={{ background: 'rgba(246,201,14,0.08)', border: '1px solid rgba(246,201,14,0.25)', borderRadius: '10px', padding: '14px', marginBottom: '24px' }}>
              <div style={{ color: '#F6C90E', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>⚠️ Important</div>
              <ul style={{ color: '#A0AEC0', fontSize: '0.82rem', paddingLeft: '16px', lineHeight: 1.8 }}>
                <li>Use <strong>TRC-20 network only</strong> — other networks will result in loss of funds</li>
                <li>Send exactly <strong>${parseFloat(amount).toLocaleString()} USDT</strong></li>
                <li>Copy the transaction hash after sending</li>
                <li>Confirmation takes up to <strong>24 hours</strong></li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} className="btn-outline" style={{ flex: 1, padding: '13px' }}>Back</button>
              <button onClick={goStep3} className="btn-primary" style={{ flex: 2, padding: '13px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                I've Sent the USDT <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Submit TxHash */}
        {step === 3 && (
          <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '20px', padding: '28px' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.15rem', marginBottom: '6px' }}>Submit Payment Proof</h2>
            <p style={{ color: '#718096', fontSize: '0.88rem', marginBottom: '24px' }}>Enter the transaction hash from your Trust Wallet to confirm your payment.</p>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Transaction Hash (TxID) *</label>
              <input type="text" placeholder="e.g. a1b2c3d4e5f6..." value={txHash}
                onChange={e => { setTxHash(e.target.value); setError('') }}
                style={{ width: '100%', padding: '13px 14px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', fontFamily: 'monospace', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#7B61FF'}
                onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
              <p style={{ color: '#4A5568', fontSize: '0.78rem', marginTop: '6px' }}>Find it in Trust Wallet → Transaction History → Copy TxHash</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500, marginBottom: '8px' }}>Your Sending Wallet Address (Optional)</label>
              <input type="text" placeholder="The wallet you sent from"
                value={senderWallet} onChange={e => setSenderWallet(e.target.value)}
                style={{ width: '100%', padding: '13px 14px', background: 'rgba(11,12,30,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '0.9rem', fontFamily: 'monospace', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#7B61FF'}
                onBlur={e => e.target.style.borderColor = 'rgba(123,97,255,0.2)'} />
            </div>

            {/* Summary */}
            <div style={{ background: 'rgba(123,97,255,0.06)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '10px', color: '#A0AEC0' }}>Payment Summary</div>
              {[
                { label: 'Plan', value: `${plan.icon} ${selectedPlan}` },
                { label: 'Amount', value: `$${parseFloat(amount).toLocaleString()} USDT` },
                { label: 'Monthly ROI', value: `${plan.roi}% (+$${monthly})` },
                { label: 'Duration', value: plan.duration },
                { label: 'Network', value: 'TRC-20' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: '0.87rem', borderBottom: '1px solid rgba(123,97,255,0.08)' }}>
                  <span style={{ color: '#718096' }}>{r.label}</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} className="btn-outline" style={{ flex: 1, padding: '13px' }}>Back</button>
              <button onClick={submitDeposit} disabled={loading} className="btn-primary"
                style={{ flex: 2, padding: '13px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Submitting...' : <><Wallet size={18} /> Submit Deposit</>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Confirmation */}
        {step === 4 && (
          <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(0,255,136,0.25)', borderRadius: '20px', padding: '40px 28px', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '2px solid rgba(0,255,136,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Clock size={32} style={{ color: '#00FF88' }} />
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.4rem', marginBottom: '10px' }}>Deposit Submitted!</h2>
            <p style={{ color: '#A0AEC0', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px' }}>
              Your payment proof has been submitted. Our team will verify your transaction within <strong style={{ color: '#fff' }}>24 hours</strong> and activate your <strong style={{ color: plan.color }}>{selectedPlan} Plan</strong>.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '28px', textAlign: 'left' }}>
              {[
                { label: 'Plan', value: `${plan.icon} ${selectedPlan}` },
                { label: 'Amount', value: `$${parseFloat(amount).toLocaleString()} USDT` },
                { label: 'TxHash', value: txHash.slice(0, 20) + '...' },
                { label: 'Status', value: '🕐 Pending Confirmation' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', fontSize: '0.87rem', borderBottom: '1px solid rgba(123,97,255,0.08)' }}>
                  <span style={{ color: '#718096' }}>{r.label}</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>

            <Link to="/dashboard">
              <button className="btn-primary" style={{ padding: '13px 32px', fontSize: '1rem' }}>
                Go to Dashboard
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
