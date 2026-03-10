import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useRef } from 'react'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'HOME' },
  { path: '/members',   label: 'ROSTER' },
  { path: '/bank',      label: 'BANK' },
  { path: '/jobs',      label: 'BLACK OPS' },
]

export default function TabletLayout({ children, title, backTo }) {
  const { username, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const gridRef = useRef(null)

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
    <div className="tablet-frame">
      <div className="hero-bg" />
      <div className="hero-grid" ref={gridRef} />
      <div className="tablet-screen">
        <header className="tablet-header">
          <div className="tablet-header-left">
            {backTo && (
              <button className="tablet-back-btn" onClick={() => navigate(backTo)}>
                ◀ Back
              </button>
            )}
            <span className="tablet-brand">GBG</span>
            {title && <span className="tablet-page-title">/ {title}</span>}
          </div>
          <div className="tablet-header-right">
            <span className="tablet-user">👤 {username}</span>
            <button className="tablet-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <nav className="tablet-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`tablet-nav-btn${location.pathname === item.path ? ' tablet-nav-btn--active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <main className="tablet-content">{children}</main>
      </div>
    </div>
  )
}
