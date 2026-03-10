import { useEffect, useState } from 'react'
import TabletLayout from '../components/TabletLayout'
import { useAuth } from '../context/AuthContext'
import { fetchMembers } from '../api/api'

const RANK_BADGE = {
  BOSS: '👑',
  UNDERBOSS: '🔱',
  CAPTAIN: '⚡',
  SOLDIER: '🔫',
  ASSOCIATE: '🤝',
  RECRUIT: '🆕',
}

export default function MembersPage() {
  const { token } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMembers(token)
      .then(setMembers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  return (
    <TabletLayout title="Roster" backTo="/dashboard">
      <div className="ops-page">
        <div className="ops-header">
          <div>
            <h1 className="ops-title">Members</h1>
            <p className="ops-subtitle">Gang roster &amp; rankings</p>
          </div>
          <span className="ops-count-badge">{members.length} ACTIVE</span>
        </div>

        {loading && <p className="app-loading">Loading…</p>}
        {error && <p className="app-error">{error}</p>}

        {!loading && !error && (
          <div className="members-list">
            {members.map((m) => (
              <div key={m.id} className="member-card">
                <span className="member-badge">{RANK_BADGE[m.rank] ?? '•'}</span>
                <div className="member-info">
                  <span className="member-name">{m.inGameName}</span>
                  <span className="member-discord">{m.discordName}</span>
                </div>
                <span className="member-rank">{m.rank}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </TabletLayout>
  )
}
