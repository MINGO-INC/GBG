import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchBalance } from '../api/api'

/* ── SVG icon helpers ── */
function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function IconPeople() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
function IconDollar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

const NAV_ITEMS = [
  { id: 'dashboard', path: '/dashboard', icon: <IconGrid />, label: 'Dashboard' },
  { id: 'members',   path: '/members',   icon: <IconPeople />, label: 'Members'   },
  { id: 'bank',      path: '/bank',      icon: <IconDollar />, label: 'Gang Bank' },
  { id: 'jobs',      path: '/jobs',      icon: <IconShield />, label: 'Black Ops' },
]

export default function AppLayout({ children, pageId }) {
  const { username, token, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    if (token) {
      fetchBalance(token)
        .then((b) => setBalance(b.balance))
        .catch(() => {})
    }
  }, [token])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const fmt = (n) =>
    n != null
      ? '$' + Math.round(n).toLocaleString('en-US')
      : '—'

  const activeId =
    pageId ||
    NAV_ITEMS.slice()
      .reverse()
      .find((i) => location.pathname.startsWith(i.path))?.id

  return (
    <div className="app-wrapper">
      <div className="app-shell">
        {/* ── Top bar ── */}
        <header className="app-topbar">
          <div className="topbar-left">
            <span className="admin-badge">
              <span className="admin-dot" />
              ADMIN ACCESS
            </span>
          </div>
          <div className="topbar-right">
            <span className="topbar-user">{username?.toUpperCase()}</span>
            {balance != null && (
              <span className="topbar-balance">{fmt(balance)}</span>
            )}
            <button className="topbar-logout-btn" onClick={handleLogout}>
              <span className="topbar-logout-icon"><IconLogout /></span>
              Logout
            </button>
          </div>
        </header>

        {/* ── Body: sidebar + main ── */}
        <div className="app-body">
          {/* Sidebar */}
          <div className="app-sidebar" role="navigation">
            <div className="sidebar-nav">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar-btn${activeId === item.id ? ' sidebar-btn--active' : ''}`}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
            <div className="sidebar-bottom">
              <button className="sidebar-btn" title="Settings (coming soon)" disabled>
                <IconSettings />
              </button>
            </div>
          </div>

          {/* Main content */}
          <main className="app-main">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
