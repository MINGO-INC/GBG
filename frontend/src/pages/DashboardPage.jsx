import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const APPS = [
  {
    id: 'members',
    path: '/members',
    icon: '👥',
    label: 'ROSTER',
    sub: 'Gang Members',
    color: '#f97316',
    locked: false,
  },
  {
    id: 'bank',
    path: '/bank',
    icon: '💰',
    label: 'BANK',
    sub: 'Gang Funds',
    color: '#22c55e',
    locked: false,
  },
  {
    id: 'jobs',
    path: '/jobs',
    icon: '🛡️',
    label: 'BLACK OPS',
    sub: 'Operations',
    color: '#ef4444',
    locked: false,
  },
  {
    id: 'heat',
    path: null,
    icon: '🔥',
    label: 'HEAT LEVEL',
    sub: 'Coming Soon',
    color: '#f59e0b',
    locked: true,
  },
  {
    id: 'armory',
    path: null,
    icon: '🔫',
    label: 'ARMORY',
    sub: 'Coming Soon',
    color: '#6366f1',
    locked: true,
  },
  {
    id: 'territory',
    path: null,
    icon: '🗺️',
    label: 'TERRITORY',
    sub: 'Coming Soon',
    color: '#06b6d4',
    locked: true,
  },
]

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function useTime() {
  const [time, setTime] = useState(formatTime)
  useEffect(() => {
    const tick = () => {
      setTime(formatTime())
      const now = new Date()
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
      setTimeout(tick, msUntilNextMinute)
    }
    const now = new Date()
    const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    const id = setTimeout(tick, msUntilNextMinute)
    return () => clearTimeout(id)
  }, [])
  return time
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { username, logout } = useAuth()
  const gridRef = useRef(null)
  const time = useTime()

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    let rafId = null
    const handleMove = (e) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20
        const y = (e.clientY / window.innerHeight - 0.5) * 20
        grid.style.transform = `translate(${x}px, ${y}px)`
        rafId = null
      })
    }
    window.addEventListener('mousemove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="home-screen">
      <div className="hero-bg" />
      <div className="hero-grid" ref={gridRef} />

      <div className="tablet-device">
        {/* Status bar */}
        <div className="tablet-status-bar">
          <span className="tablet-time">{time}</span>
          <span className="tablet-brand">GBG // LOS SANTOS</span>
          <span className="tablet-signal">
            <span className="tablet-signal-dot" />
            <span className="tablet-signal-dot" />
            <span className="tablet-signal-dot" />
          </span>
        </div>

        {/* Header */}
        <div className="tablet-header">
          <div className="tablet-welcome">
            <div className="tablet-admin-badge">
              <span className="tablet-admin-dot" />
              ADMIN ACCESS
            </div>
            <div className="tablet-user">{username?.toUpperCase()}</div>
            <div className="tablet-tagline">// COMMAND TERMINAL</div>
          </div>
          <button className="tablet-logout-btn" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>

        {/* App grid */}
        <div className="tablet-apps">
          {APPS.map((app) => (
            <button
              key={app.id}
              className={`tablet-app${app.locked ? ' tablet-app--locked' : ''}`}
              onClick={() => !app.locked && app.path && navigate(app.path)}
              disabled={app.locked}
              style={{ '--app-color': app.color }}
            >
              <div className="tablet-app-icon">
                <span className="tablet-app-emoji">{app.icon}</span>
                {app.locked && <span className="tablet-app-lock">🔒</span>}
              </div>
              <span className="tablet-app-label">{app.label}</span>
              <span className="tablet-app-sub">{app.sub}</span>
            </button>
          ))}
        </div>

        {/* Dock */}
        <div className="tablet-dock">
          <div className="tablet-home-indicator" />
        </div>
      </div>
    </div>
  )
}
