import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <nav style={{ background: 'rgba(11,12,30,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(123,97,255,0.15)' }}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7B61FF, #00D4FF)' }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.1rem' }}>
            Cript<span className="gradient-text">oX</span>
          </span>
        </Link>

        {isLanding && (
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Plans', 'How It Works', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                style={{ color: '#A0AEC0', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#A0AEC0'}>
                {item}
              </a>
            ))}
          </div>
        )}

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <button className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Login</button>
          </Link>
          <Link to="/register">
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Get Started</button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div style={{ background: '#11122B', borderTop: '1px solid rgba(123,97,255,0.15)' }} className="md:hidden px-6 py-4 flex flex-col gap-4">
          {['Features', 'Plans', 'How It Works', 'FAQ'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{ color: '#A0AEC0', textDecoration: 'none' }} onClick={() => setOpen(false)}>{item}</a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/login" onClick={() => setOpen(false)}><button className="btn-outline w-full">Login</button></Link>
            <Link to="/register" onClick={() => setOpen(false)}><button className="btn-primary w-full">Get Started</button></Link>
          </div>
        </div>
      )}
    </nav>
  )
}
