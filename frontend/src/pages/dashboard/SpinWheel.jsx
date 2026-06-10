import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Gift, Clock, Zap } from 'lucide-react'
import { leaderboardAPI } from '../../services/api'

const SEGMENTS = [
  { label: 'Try Again', color: '#2D2F4A', textColor: '#718096', amount: 0 },
  { label: '$1',        color: '#1a1f3e', textColor: '#7B61FF',  amount: 1 },
  { label: 'Try Again', color: '#2D2F4A', textColor: '#718096', amount: 0 },
  { label: '$5',        color: '#0d1933', textColor: '#00D4FF',  amount: 5 },
  { label: 'Try Again', color: '#2D2F4A', textColor: '#718096', amount: 0 },
  { label: '$10',       color: '#1a1f3e', textColor: '#F6C90E',  amount: 10 },
  { label: 'Try Again', color: '#2D2F4A', textColor: '#718096', amount: 0 },
  { label: '$25',       color: '#0d1933', textColor: '#00FF88',  amount: 25 },
  { label: 'Try Again', color: '#2D2F4A', textColor: '#718096', amount: 0 },
  { label: '$50',       color: '#1a1f3e', textColor: '#FF9500',  amount: 50 },
  { label: 'Try Again', color: '#2D2F4A', textColor: '#718096', amount: 0 },
  { label: '$100',      color: '#0d1933', textColor: '#FF3B30',  amount: 100 },
]

const NUM = SEGMENTS.length
const ARC = (2 * Math.PI) / NUM

export default function SpinWheel() {
  const canvasRef = useRef(null)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [alreadySpun, setAlreadySpun] = useState(false)
  const angleRef = useRef(0)
  const rafRef = useRef(null)

  const drawWheel = (angle) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const r = cx - 8

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    SEGMENTS.forEach((seg, i) => {
      const start = angle + i * ARC
      const end = start + ARC

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, r, start, end)
      ctx.closePath()
      ctx.fillStyle = seg.color
      ctx.fill()
      ctx.strokeStyle = 'rgba(123,97,255,0.3)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(start + ARC / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = seg.textColor
      ctx.font = `bold ${seg.amount > 0 ? '14' : '11'}px Space Grotesk, sans-serif`
      ctx.fillText(seg.label, r - 12, 5)
      ctx.restore()
    })

    // Center circle
    ctx.beginPath()
    ctx.arc(cx, cy, 26, 0, 2 * Math.PI)
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26)
    grad.addColorStop(0, '#9B85FF')
    grad.addColorStop(1, '#7B61FF')
    ctx.fillStyle = grad
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,212,255,0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Zap icon in center
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('⚡', cx, cy)
  }

  useEffect(() => {
    drawWheel(0)
  }, [])

  const spin = async () => {
    if (spinning || alreadySpun) return
    setResult(null)
    setError('')
    setSpinning(true)

    try {
      const res = await leaderboardAPI.spin()
      const reward = res.data.reward

      // Find the segment index matching the reward
      let targetIdx = 0
      if (reward.amount === 0) {
        const tryAgains = SEGMENTS.map((s, i) => s.amount === 0 ? i : -1).filter(i => i >= 0)
        targetIdx = tryAgains[Math.floor(Math.random() * tryAgains.length)]
      } else {
        targetIdx = SEGMENTS.findIndex(s => s.amount === reward.amount)
        if (targetIdx === -1) targetIdx = 0
      }

      // Spin animation
      const targetAngle = -(targetIdx * ARC + ARC / 2) + (Math.PI * 2 * 5)
      const duration = 4000
      const start = performance.now()
      const startAngle = angleRef.current

      const animate = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 4)
        const current = startAngle + (targetAngle - startAngle) * ease

        angleRef.current = current
        drawWheel(current)

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate)
        } else {
          setSpinning(false)
          setResult(reward)
          if (reward.amount === 0) setAlreadySpun(false)
          else setAlreadySpun(true)
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    } catch (err) {
      setSpinning(false)
      const msg = err.response?.data?.message || 'Spin failed'
      if (msg.includes('Already spun')) setAlreadySpun(true)
      setError(msg)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0C1E', padding: '24px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        <div style={{ marginBottom: '24px' }}>
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#718096', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '16px' }}>
            <ArrowLeft size={15} /> Back
          </Link>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.8rem' }}>
            Daily <span className="gradient-text">Spin Wheel</span>
          </h1>
          <p style={{ color: '#A0AEC0', marginTop: '6px', fontSize: '0.9rem' }}>Spin once per day to win bonus USDT!</p>
        </div>

        {/* Wheel container */}
        <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.2)', borderRadius: '24px', padding: '32px 24px', textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
            {/* Pointer */}
            <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '22px solid #7B61FF', filter: 'drop-shadow(0 0 8px rgba(123,97,255,0.8))' }} />
            <canvas ref={canvasRef} width={300} height={300} style={{ borderRadius: '50%', boxShadow: spinning ? '0 0 50px rgba(123,97,255,0.4)' : '0 0 20px rgba(123,97,255,0.15)', transition: 'box-shadow 0.3s' }} />
          </div>

          {/* Result */}
          {result && (
            <div style={{ marginBottom: '16px', padding: '16px', background: result.amount > 0 ? 'rgba(0,255,136,0.08)' : 'rgba(123,97,255,0.06)', border: `1px solid ${result.amount > 0 ? 'rgba(0,255,136,0.25)' : 'rgba(123,97,255,0.2)'}`, borderRadius: '12px' }}>
              {result.amount > 0 ? (
                <>
                  <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🎉</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.6rem', color: '#00FF88' }}>+${result.amount} USDT</div>
                  <div style={{ color: '#A0AEC0', fontSize: '0.85rem', marginTop: '4px' }}>Credited to your wallet!</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>😅</div>
                  <div style={{ fontWeight: 700, color: '#718096' }}>Try Again Tomorrow</div>
                  <div style={{ color: '#4A5568', fontSize: '0.82rem', marginTop: '4px' }}>Better luck next time!</div>
                </>
              )}
            </div>
          )}

          {error && (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(255,59,48,0.08)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: '10px', color: '#FF6B6B', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <Clock size={15} /> {error}
            </div>
          )}

          <button onClick={spin} disabled={spinning || alreadySpun}
            className="btn-primary"
            style={{ padding: '14px 40px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: (spinning || alreadySpun) ? 0.5 : 1, cursor: (spinning || alreadySpun) ? 'not-allowed' : 'pointer' }}>
            <Zap size={18} fill="white" />
            {spinning ? 'Spinning...' : alreadySpun ? 'Come Back Tomorrow' : 'Spin Now!'}
          </button>
        </div>

        {/* Prizes table */}
        <div style={{ background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)', borderRadius: '16px', padding: '20px' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gift size={16} style={{ color: '#7B61FF' }} /> Possible Rewards
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { prize: '$1 USDT', chance: '25%', color: '#7B61FF' },
              { prize: '$5 USDT', chance: '18%', color: '#00D4FF' },
              { prize: '$10 USDT', chance: '12%', color: '#F6C90E' },
              { prize: '$25 USDT', chance: '7%', color: '#00FF88' },
              { prize: '$50 USDT', chance: '2.5%', color: '#FF9500' },
              { prize: '$100 USDT', chance: '0.5%', color: '#FF3B30' },
            ].map(p => (
              <div key={p.prize} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px 12px' }}>
                <span style={{ fontWeight: 700, color: p.color, fontSize: '0.9rem' }}>{p.prize}</span>
                <span style={{ color: '#4A5568', fontSize: '0.78rem' }}>{p.chance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
