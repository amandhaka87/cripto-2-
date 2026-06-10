import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Shield, TrendingUp, Users, Award, ChevronRight, Check, Star, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

const STATS = [
  { value: '$2.4M+', label: 'Total Invested' },
  { value: '12,000+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
]

const PLANS = [
  {
    name: 'Silver',
    icon: '🥈',
    min: '$100',
    max: '$999',
    roi: '8%',
    period: 'Monthly',
    duration: '3 Months',
    color: '#A0AEC0',
    features: ['USDT Payments', 'Basic Dashboard', 'Email Support', 'Monthly Reports'],
  },
  {
    name: 'Gold',
    icon: '🥇',
    min: '$1,000',
    max: '$9,999',
    roi: '15%',
    period: 'Monthly',
    duration: '6 Months',
    color: '#F6C90E',
    popular: true,
    features: ['USDT Payments', 'Advanced Dashboard', 'Priority Support', 'Weekly Reports', 'Referral Bonus', '2FA Security'],
  },
  {
    name: 'Platinum',
    icon: '💎',
    min: '$10,000',
    max: '$100,000',
    roi: '25%',
    period: 'Monthly',
    duration: '12 Months',
    color: '#00D4FF',
    features: ['USDT Payments', 'Premium Dashboard', '24/7 VIP Support', 'Daily Reports', 'Max Referral Bonus', '2FA + KYC', 'Certificate'],
  },
]

const FEATURES = [
  { icon: <Shield size={24} />, title: 'Bank-Grade Security', desc: 'AES-256 encryption, 2FA, and KYC verification to protect your funds.' },
  { icon: <TrendingUp size={24} />, title: 'Real-Time Tracking', desc: 'Live portfolio tracking with detailed analytics and performance charts.' },
  { icon: <Users size={24} />, title: 'Referral Rewards', desc: 'Earn passive income by inviting friends. Multi-level referral system.' },
  { icon: <Award size={24} />, title: 'Investment Certificate', desc: 'Receive a verifiable digital certificate upon plan completion.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Account', desc: 'Register with email, complete KYC verification in minutes.' },
  { step: '02', title: 'Choose Your Plan', desc: 'Select Silver, Gold, or Platinum based on your investment goals.' },
  { step: '03', title: 'Send USDT', desc: 'Send USDT to your dedicated wallet address via Trust Wallet.' },
  { step: '04', title: 'Earn Returns', desc: 'Watch your investment grow. Withdraw anytime after lock period.' },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#0B0C1E', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,97,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(123,97,255,0.12)', border: '1px solid rgba(123,97,255,0.3)',
            borderRadius: '50px', padding: '6px 16px', marginBottom: '28px',
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00FF88', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#A0AEC0', fontSize: '0.85rem', fontWeight: 500 }}>Platform Live — Join 12,000+ investors</span>
          </div>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: '24px',
          }}>
            Grow Your Wealth with<br />
            <span className="gradient-text">Crypto Investments</span>
          </h1>

          <p style={{ color: '#A0AEC0', fontSize: 'clamp(1rem, 2vw, 1.2rem)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Earn up to <strong style={{ color: '#00D4FF' }}>25% monthly ROI</strong> with our transparent, secure USDT investment plans.
            Start with as little as $100.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <button className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Start Investing <ArrowRight size={18} />
              </button>
            </Link>
            <a href="#plans">
              <button className="btn-outline" style={{ fontSize: '1rem', padding: '14px 32px' }}>View Plans</button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} style={{
                background: 'rgba(123,97,255,0.06)', border: '1px solid rgba(123,97,255,0.15)',
                borderRadius: '12px', padding: '20px 16px',
              }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.6rem', color: '#fff' }}>{s.value}</div>
                <div style={{ color: '#A0AEC0', fontSize: '0.8rem', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="plans" style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
              Investment <span className="gradient-text">Plans</span>
            </h2>
            <p style={{ color: '#A0AEC0', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
              Choose the plan that fits your goals. All plans include USDT payments and real-time tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} style={{
                background: plan.popular ? 'rgba(123,97,255,0.1)' : 'rgba(22,24,48,0.8)',
                border: plan.popular ? '1px solid rgba(123,97,255,0.5)' : '1px solid rgba(123,97,255,0.15)',
                borderRadius: '20px', padding: '32px 28px',
                position: 'relative', transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: plan.popular ? '0 0 40px rgba(123,97,255,0.2)' : 'none',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(123,97,255,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = plan.popular ? '0 0 40px rgba(123,97,255,0.2)' : 'none' }}>
                {plan.popular && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #7B61FF, #00D4FF)',
                    color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                    padding: '4px 16px', borderRadius: '50px',
                  }}>MOST POPULAR</div>
                )}
                <div className="text-center mb-6">
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{plan.icon}</div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.5rem', color: plan.color }}>{plan.name}</h3>
                  <div style={{ color: '#A0AEC0', fontSize: '0.85rem', marginTop: '4px' }}>{plan.min} – {plan.max}</div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '2.5rem', color: plan.color }}>{plan.roi}</div>
                  <div style={{ color: '#A0AEC0', fontSize: '0.85rem' }}>{plan.period} ROI • {plan.duration}</div>
                </div>

                <ul style={{ listStyle: 'none', marginBottom: '28px' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', color: '#E2E8F0', fontSize: '0.9rem' }}>
                      <Check size={16} style={{ color: plan.color, flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to="/register" style={{ display: 'block' }}>
                  <button style={{
                    width: '100%', padding: '13px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: plan.popular ? 'linear-gradient(135deg, #7B61FF, #00D4FF)' : 'transparent',
                    border: plan.popular ? 'none' : `1px solid ${plan.color}`,
                    color: plan.popular ? '#fff' : plan.color,
                    fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { if (!plan.popular) e.currentTarget.style.background = `${plan.color}15` }}
                    onMouseLeave={e => { if (!plan.popular) e.currentTarget.style.background = 'transparent' }}>
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 0', background: 'rgba(17,18,43,0.5)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
              Why Choose <span className="gradient-text">CriptoX?</span>
            </h2>
            <p style={{ color: '#A0AEC0', maxWidth: '480px', margin: '0 auto' }}>
              Built for security, designed for growth, engineered for transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'rgba(22,24,48,0.8)', border: '1px solid rgba(123,97,255,0.15)',
                borderRadius: '16px', padding: '28px 24px', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(123,97,255,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(123,97,255,0.15)'}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(123,97,255,0.15)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: '16px', color: '#7B61FF',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#A0AEC0', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p style={{ color: '#A0AEC0', maxWidth: '480px', margin: '0 auto' }}>Start investing in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{ textAlign: 'center', position: 'relative' }}>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div style={{
                    display: 'none', position: 'absolute', top: '28px', left: '65%', width: '70%',
                    height: '1px', background: 'linear-gradient(90deg, rgba(123,97,255,0.5), transparent)',
                  }} className="md:block" />
                )}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #7B61FF, #00D4FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.1rem',
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: '#A0AEC0', fontSize: '0.9rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{
            background: 'linear-gradient(135deg, rgba(123,97,255,0.15), rgba(0,212,255,0.08))',
            border: '1px solid rgba(123,97,255,0.3)', borderRadius: '24px',
            padding: 'clamp(40px, 6vw, 72px)', textAlign: 'center',
          }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: '16px' }}>
              Ready to Start <span className="gradient-text">Earning?</span>
            </h2>
            <p style={{ color: '#A0AEC0', fontSize: '1.05rem', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
              Join thousands of investors already growing their wealth on CriptoX.
            </p>
            <Link to="/register">
              <button className="btn-primary" style={{ fontSize: '1.05rem', padding: '14px 36px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Create Free Account <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(123,97,255,0.15)', padding: '40px 24px', textAlign: 'center' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ color: '#4A5568', fontSize: '0.85rem' }}>
            © 2025 CriptoX. All rights reserved. &nbsp;|&nbsp; Powered by USDT on TRC-20
          </div>
        </div>
      </footer>
    </div>
  )
}
