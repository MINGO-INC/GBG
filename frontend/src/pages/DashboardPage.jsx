import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const APPS = [
  {
    id: 'members',
    label: 'Members',
    icon: '👥',
    path: '/members',
  },
  {
    id: 'bank',
    label: 'Gang Bank',
    icon: '💰',
    path: '/bank',
  },
  {
    id: 'jobs',
    label: 'Job Logger',
    icon: '📋',
    path: '/jobs',
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { username, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="tablet-frame">
      <div className="tablet-screen home-screen">
        {/* Status bar */}
        <div className="home-status-bar">
          <span className="home-brand">GBG</span>
          <div className="home-status-right">
            <span className="home-user">👤 {username}</span>
            <button className="home-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* App icon grid */}
        <div className="home-app-grid">
          {APPS.map((app) => (
            <button
              key={app.id}
              className="app-icon-btn"
              onClick={() => navigate(app.path)}
            >
              <span className="app-icon-img">{app.icon}</span>
              <span className="app-icon-label">{app.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
