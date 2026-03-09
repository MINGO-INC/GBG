import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/AppLayout'

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <AppLayout pageId="dashboard">
      <div className="dash-page">
        <div className="dash-welcome">
          <h1 className="ops-title">Dashboard</h1>
          <p className="ops-subtitle">Welcome back, Commander</p>
        </div>
        <div className="dash-cards">
          <button className="dash-nav-card" onClick={() => navigate('/members')}>
            <span className="dash-nav-card-icon">👥</span>
            <span className="dash-nav-card-label">Members</span>
            <span className="dash-nav-card-sub">Gang Roster</span>
          </button>
          <button className="dash-nav-card" onClick={() => navigate('/bank')}>
            <span className="dash-nav-card-icon">💰</span>
            <span className="dash-nav-card-label">Gang Bank</span>
            <span className="dash-nav-card-sub">Funds &amp; Transactions</span>
          </button>
          <button className="dash-nav-card" onClick={() => navigate('/jobs')}>
            <span className="dash-nav-card-icon">🛡️</span>
            <span className="dash-nav-card-label">Black Ops</span>
            <span className="dash-nav-card-sub">Operations Log</span>
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
