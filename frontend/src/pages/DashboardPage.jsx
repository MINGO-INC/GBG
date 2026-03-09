import { useNavigate } from 'react-router-dom'
import TabletLayout from '../components/TabletLayout'

const TILES = [
  {
    id: 'members',
    label: 'Members',
    icon: '👥',
    desc: 'View roster & ranks',
    path: '/members',
    color: '#ffffff',
  },
  {
    id: 'bank',
    label: 'Gang Bank',
    icon: '💰',
    desc: 'Balance & transactions',
    path: '/bank',
    color: '#ffffff',
  },
  {
    id: 'jobs',
    label: 'Job Logger',
    icon: '📋',
    desc: 'Log & review operations',
    path: '/jobs',
    color: '#ffffff',
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <TabletLayout title="Dashboard">
      <div className="dashboard-grid">
        {TILES.map((tile) => (
          <button
            key={tile.id}
            className="dashboard-tile"
            onClick={() => navigate(tile.path)}
          >
            <span className="tile-icon">{tile.icon}</span>
            <span className="tile-label">{tile.label}</span>
            <span className="tile-desc">{tile.desc}</span>
          </button>
        ))}
      </div>
    </TabletLayout>
  )
}
