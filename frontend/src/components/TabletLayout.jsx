import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function TabletLayout({ children, title, backTo }) {
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="tablet-frame">
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
        <main className="tablet-content">{children}</main>
      </div>
    </div>
  )
}
