import { useEffect, useState } from 'react'
import TabletLayout from '../components/TabletLayout'
import { useAuth } from '../context/AuthContext'
import { fetchJobs, logJob, fetchMembers } from '../api/api'

const JOB_TYPES = [
  'Fleeca Bank Heist',
  'Pacific Standard Heist',
  'Paleto Bay Heist',
  'Drug Run',
  'Car Theft',
  'Truck Robbery',
  'Jewellery Heist',
  'Other',
]

const OUTCOME_LABELS = {
  FULL_SUCCESS: { label: '✅ Full Success', cls: 'outcome-success' },
  PARTIAL: { label: '⚠️ Partial', cls: 'outcome-partial' },
  FAILED: { label: '❌ Failed', cls: 'outcome-failed' },
}

const INITIAL_FORM = {
  jobType: '',
  participants: [],
  outcome: 'FULL_SUCCESS',
  caughtMembers: [],
  dirtyCash: '',
  cleanCash: '',
  notes: '',
  loggedBy: '',
}

export default function JobLoggerPage() {
  const { token, username } = useAuth()
  const [jobs, setJobs] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ ...INITIAL_FORM, loggedBy: username || '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    Promise.all([fetchJobs(token), fetchMembers(token)])
      .then(([jobList, memberList]) => {
        setJobs(jobList)
        setMembers(memberList)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleParticipant = (name) => {
    setForm((prev) => {
      const already = prev.participants.includes(name)
      const participants = already
        ? prev.participants.filter((n) => n !== name)
        : [...prev.participants, name]
      // if a deselected participant was caught, remove them from caught list too
      const caughtMembers = prev.caughtMembers.filter((n) => participants.includes(n))
      return { ...prev, participants, caughtMembers }
    })
  }

  const toggleCaught = (name) => {
    setForm((prev) => {
      const already = prev.caughtMembers.includes(name)
      const caughtMembers = already
        ? prev.caughtMembers.filter((n) => n !== name)
        : [...prev.caughtMembers, name]
      return { ...prev, caughtMembers }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (form.participants.length === 0) {
      setSubmitError('Select at least one crew member')
      return
    }
    setSubmitting(true)
    try {
      const parseCash = (val) => {
        if (val === '') return null
        const n = parseInt(val, 10)
        return isNaN(n) ? null : n
      }
      const payload = {
        ...form,
        dirtyCash: parseCash(form.dirtyCash),
        cleanCash: parseCash(form.cleanCash),
      }
      const saved = await logJob(payload, token)
      setJobs([saved, ...jobs])
      setForm({ ...INITIAL_FORM, loggedBy: username || '' })
      setShowForm(false)
    } catch (err) {
      setSubmitError(err.message || 'Failed to log job')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dt) =>
    new Date(dt).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const formatCash = (amount) => (amount != null ? `$${amount.toLocaleString()}` : null)

  return (
    <TabletLayout title="Job Logger" backTo="/dashboard">
      <div className="section-header">
        <h2 className="section-title">OPERATIONS LOG</h2>
        <button className="tablet-action-btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? '✕ Cancel' : '＋ Log Job'}
        </button>
      </div>

      {showForm && (
        <form className="job-form" onSubmit={handleSubmit}>
          {/* Row 1: Job Type + Outcome */}
          <div className="form-row">
            <div className="form-field">
              <label>JOB TYPE</label>
              <select name="jobType" value={form.jobType} onChange={handleChange} required>
                <option value="">— Select type —</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>OUTCOME</label>
              <select name="outcome" value={form.outcome} onChange={handleChange} required>
                <option value="FULL_SUCCESS">✅ All got out — Full Success</option>
                <option value="PARTIAL">⚠️ Partial — Some got caught</option>
                <option value="FAILED">❌ Failed</option>
              </select>
            </div>
          </div>

          {/* Row 2: Cash earned */}
          <div className="form-row">
            <div className="form-field">
              <label>DIRTY CASH ($)</label>
              <input
                type="number"
                name="dirtyCash"
                min="0"
                value={form.dirtyCash}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div className="form-field">
              <label>CLEAN CASH ($)</label>
              <input
                type="number"
                name="cleanCash"
                min="0"
                value={form.cleanCash}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          {/* Crew selection */}
          <div className="form-field form-field--full">
            <label>CREW — {form.participants.length} selected</label>
            <div className="member-checklist">
              {members.map((m) => (
                <label key={m.id} className="member-check-item">
                  <input
                    type="checkbox"
                    checked={form.participants.includes(m.inGameName)}
                    onChange={() => toggleParticipant(m.inGameName)}
                  />
                  <span>{m.inGameName}</span>
                  <span className="member-check-rank">{m.rank}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Who got caught — only shown when outcome is not Full Success and crew is selected */}
          {form.outcome !== 'FULL_SUCCESS' && form.participants.length > 0 && (
            <div className="form-field form-field--full">
              <label>WHO GOT CAUGHT? — {form.caughtMembers.length} selected</label>
              <div className="member-checklist">
                {form.participants.map((name) => (
                  <label key={name} className="member-check-item">
                    <input
                      type="checkbox"
                      checked={form.caughtMembers.includes(name)}
                      onChange={() => toggleCaught(name)}
                    />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label>LOGGED BY</label>
              <input
                type="text"
                name="loggedBy"
                value={form.loggedBy}
                onChange={handleChange}
                placeholder="Your in-game name"
              />
            </div>
          </div>

          <div className="form-field form-field--full">
            <label>NOTES</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any extra details…"
            />
          </div>

          {submitError && <p className="tablet-error">{submitError}</p>}

          <button className="login-btn" type="submit" disabled={submitting}>
            {submitting ? 'SAVING…' : 'LOG JOB'}
          </button>
        </form>
      )}

      {loading && <p className="tablet-loading">Loading…</p>}
      {error && <p className="tablet-error">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p className="tablet-empty">No jobs logged yet. Log your first operation above.</p>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="jobs-list">
          {jobs.map((job) => {
            const oc = OUTCOME_LABELS[job.outcome] ?? { label: job.outcome, cls: '' }
            return (
              <div key={job.id} className="job-card">
                <div className="job-card-top">
                  <span className="job-type">{job.jobType}</span>
                  <span className={`job-outcome ${oc.cls}`}>{oc.label}</span>
                </div>
                <div className="job-card-meta">
                  {job.participants && job.participants.length > 0 ? (
                    <span>👥 {job.participants.join(', ')}</span>
                  ) : (
                    <span>👥 {job.participantCount} participants</span>
                  )}
                  {job.caughtMembers && job.caughtMembers.length > 0 ? (
                    <span>🚨 Caught: {job.caughtMembers.join(', ')}</span>
                  ) : job.caughtCount > 0 ? (
                    <span>🚨 {job.caughtCount} caught</span>
                  ) : null}
                  {formatCash(job.dirtyCash) && (
                    <span>💰 Dirty: {formatCash(job.dirtyCash)}</span>
                  )}
                  {formatCash(job.cleanCash) && (
                    <span>🏦 Clean: {formatCash(job.cleanCash)}</span>
                  )}
                  {job.loggedBy && <span>📝 {job.loggedBy}</span>}
                  <span className="job-date">{formatDate(job.loggedAt)}</span>
                </div>
                {job.notes && <p className="job-notes">{job.notes}</p>}
              </div>
            )
          })}
        </div>
      )}
    </TabletLayout>
  )
}
