const BASE = '/api'

/**
 * Fetch live gang stats from the backend.
 * Falls back to defaults if the backend is unreachable.
 */
export async function fetchStats() {
  const res = await fetch(`${BASE}/members/stats`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

/**
 * Submit a join application to the backend.
 * @param {{ inGameName: string, discordName: string, age: number, reason: string }} data
 */
export async function submitApplication(data) {
  const res = await fetch(`${BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to submit application')
  }
  return res.json()
}
