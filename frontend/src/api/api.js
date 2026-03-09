const BASE = '/api'

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginRequest(username, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Login failed')
  }
  return res.json()
}

export async function registerRequest(username, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Registration failed')
  }
  return res.json()
}

// ── Members ───────────────────────────────────────────────────────────────────

export async function fetchMembers(token) {
  const res = await fetch(`${BASE}/members`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error('Failed to fetch members')
  return res.json()
}

export async function fetchStats(token) {
  const res = await fetch(`${BASE}/members/stats`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export async function fetchJobs(token) {
  const res = await fetch(`${BASE}/jobs`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error('Failed to fetch jobs')
  return res.json()
}

export async function logJob(data, token) {
  const res = await fetch(`${BASE}/jobs`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to log job')
  }
  return res.json()
}

// ── Bank ──────────────────────────────────────────────────────────────────────

export async function fetchBalance(token) {
  const res = await fetch(`${BASE}/bank/balance`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error('Failed to fetch balance')
  return res.json()
}

export async function fetchTransactions(token) {
  const res = await fetch(`${BASE}/bank/transactions`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error('Failed to fetch transactions')
  return res.json()
}

export async function addTransaction(data, token) {
  const res = await fetch(`${BASE}/bank/transactions`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Failed to add transaction')
  }
  return res.json()
}

// ── Applications (public) ─────────────────────────────────────────────────────

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
