import { useEffect, useState } from 'react'
import TabletLayout from '../components/TabletLayout'
import { useAuth } from '../context/AuthContext'
import { fetchJobs, logJob } from '../api/api'

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
  participantCount: '',
  outcome: 'FULL_SUCCESS',
  caughtCount: '0',
  notes: '',
  loggedBy: '',
}

export default function JobLoggerPage() {
  const { token, username } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ ...INITIAL_FORM, loggedBy: username || '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchJobs(token)
      .then(setJobs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      const participantCount = parseInt(form.participantCount, 10)
      const caughtCount = parseInt(form.caughtCount, 10) || 0
      if (isNaN(participantCount) || participantCount < 1) {
        setSubmitError('Participant count must be at least 1')
        setSubmitting(false)
        return
      }
      const payload = { ...form, participantCount, caughtCount }
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
              <label>PARTICIPANTS</label>
              <input
                type="number"
                name="participantCount"
                min="1"
                max="30"
                value={form.participantCount}
                onChange={handleChange}
                placeholder="How many?"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>OUTCOME</label>
              <select name="outcome" value={form.outcome} onChange={handleChange} required>
                <option value="FULL_SUCCESS">✅ All got out — Full Success</option>
                <option value="PARTIAL">⚠️ Partial — Some got caught</option>
                <option value="FAILED">❌ Failed</option>
              </select>
            </div>
            <div className="form-field">
              <label>CAUGHT COUNT</label>
              <input
                type="number"
                name="caughtCount"
                min="0"
                max="30"
                value={form.caughtCount}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

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
                  <span>👥 {job.participantCount} participants</span>
                  {job.caughtCount > 0 && <span>🚨 {job.caughtCount} caught</span>}
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
