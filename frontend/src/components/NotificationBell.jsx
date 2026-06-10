import { useState, useEffect, useRef } from 'react'
import { Bell, Check, CheckCheck, X } from 'lucide-react'
import { notificationAPI } from '../services/api'

const TYPE_COLORS = {
  deposit:    '#00D4FF',
  withdrawal: '#F6C90E',
  referral:   '#7B61FF',
  roi:        '#00FF88',
  kyc:        '#FF9500',
  spin:       '#FF3B30',
  system:     '#A0AEC0',
}

const TYPE_ICONS = {
  deposit:    '💰',
  withdrawal: '💸',
  referral:   '🎁',
  roi:        '📈',
  kyc:        '🪪',
  spin:       '🎡',
  system:     '🔔',
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await notificationAPI.getAll()
      setNotifications(res.data.data)
      setUnreadCount(res.data.unreadCount)
    } catch {
      // fail silently
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleOpen = () => {
    setOpen(prev => !prev)
    if (!open && unreadCount > 0) fetchNotifications()
  }

  const handleMarkRead = async (id, e) => {
    e.stopPropagation()
    await notificationAPI.markRead(id)
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAll = async () => {
    await notificationAPI.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={handleOpen}
        style={{
          background: open ? 'rgba(123,97,255,0.2)' : 'rgba(123,97,255,0.1)',
          border: '1px solid rgba(123,97,255,0.2)',
          borderRadius: '10px',
          padding: '8px',
          cursor: 'pointer',
          color: '#7B61FF',
          display: 'flex',
          position: 'relative',
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            background: '#FF3B30',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700,
            minWidth: '18px',
            height: '18px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            lineHeight: 1,
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          right: 0,
          width: '360px',
          maxHeight: '480px',
          background: '#11122B',
          border: '1px solid rgba(123,97,255,0.2)',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 18px',
            borderBottom: '1px solid rgba(123,97,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={16} style={{ color: '#7B61FF' }} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{ background: 'rgba(123,97,255,0.15)', color: '#7B61FF', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  title="Mark all as read"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7B61FF', display: 'flex', padding: '2px' }}
                >
                  <CheckCheck size={16} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568', display: 'flex', padding: '2px' }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading && notifications.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#4A5568', fontSize: '0.85rem' }}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔔</div>
                <div style={{ color: '#4A5568', fontSize: '0.88rem' }}>No notifications yet</div>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n._id}
                  style={{
                    padding: '14px 18px',
                    borderBottom: '1px solid rgba(123,97,255,0.06)',
                    background: n.isRead ? 'transparent' : 'rgba(123,97,255,0.05)',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    transition: 'background 0.15s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(123,97,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(123,97,255,0.05)'}
                >
                  {/* Icon */}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: `${TYPE_COLORS[n.type] || TYPE_COLORS.system}18`,
                    border: `1px solid ${TYPE_COLORS[n.type] || TYPE_COLORS.system}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}>
                    {TYPE_ICONS[n.type] || TYPE_ICONS.system}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: n.isRead ? 500 : 700, fontSize: '0.85rem', color: n.isRead ? '#A0AEC0' : '#fff' }}>
                        {n.title}
                      </span>
                      {!n.isRead && (
                        <button
                          onClick={(e) => handleMarkRead(n._id, e)}
                          title="Mark as read"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7B61FF', display: 'flex', flexShrink: 0, padding: 0 }}
                        >
                          <Check size={13} />
                        </button>
                      )}
                    </div>
                    <p style={{ color: '#718096', fontSize: '0.78rem', lineHeight: '1.45', margin: 0, marginBottom: '5px' }}>
                      {n.message}
                    </p>
                    <span style={{ color: '#4A5568', fontSize: '0.72rem' }}>{timeAgo(n.createdAt)}</span>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#7B61FF', flexShrink: 0, marginTop: '5px' }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
