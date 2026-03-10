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
  FULL_SUCCESS: { label: 'Full Success', cls: 'outcome-success' },
  PARTIAL: { label: 'Partial', cls: 'outcome-partial' },
  FAILED: { label: 'Failed', cls: 'outcome-failed' },
}

const TABS = ['Heists', 'Jobs', 'Locations']

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
function InfoCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
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
  const [activeTab, setActiveTab] = useState('Heists')
  const [selectedJob, setSelectedJob] = useState(null)

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
    <TabletLayout title="Black Ops" backTo="/dashboard">
      <div className="ops-page">
        {/* ── Page header ── */}
        <div className="ops-header">
          <div>
            <h1 className="ops-title">Black Ops</h1>
            <p className="ops-subtitle">High-risk operations and intelligence</p>
          </div>
          <button className="ops-add-btn" onClick={() => setShowForm((s) => !s)}>
            <span className="ops-add-plus">+</span>
            {showForm ? 'Cancel' : 'Add heist'}
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="ops-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`ops-tab${activeTab === tab ? ' ops-tab--active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Heists' && <span className="ops-tab-icon"><ShieldIcon /></span>}
              {tab}
            </button>
          ))}
        </div>

        {/* ── Log form ── */}
        {showForm && (
          <form className="ops-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>JOB TYPE</label>
                <select name="jobType" value={form.jobType} onChange={handleChange} required>
                  <option value="">— Select type —</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>OUTCOME</label>
                <select name="outcome" value={form.outcome} onChange={handleChange} required>
                  <option value="FULL_SUCCESS">All got out — Full Success</option>
                  <option value="PARTIAL">Partial — Some got caught</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>DIRTY CASH ($)</label>
                <input type="number" name="dirtyCash" min="0" value={form.dirtyCash} onChange={handleChange} placeholder="0" />
              </div>
              <div className="form-field">
                <label>CLEAN CASH ($)</label>
                <input type="number" name="cleanCash" min="0" value={form.cleanCash} onChange={handleChange} placeholder="0" />
              </div>
            </div>

            <div className="form-field form-field--full">
              <label>CREW — {form.participants.length} selected</label>
              <div className="member-checklist">
                {members.map((m) => (
                  <label key={m.id} className="member-check-item">
                    <input type="checkbox" checked={form.participants.includes(m.inGameName)} onChange={() => toggleParticipant(m.inGameName)} />
                    <span>{m.inGameName}</span>
                    <span className="member-check-rank">{m.rank}</span>
                  </label>
                ))}
              </div>
            </div>

            {form.outcome !== 'FULL_SUCCESS' && form.participants.length > 0 && (
              <div className="form-field form-field--full">
                <label>WHO GOT CAUGHT? — {form.caughtMembers.length} selected</label>
                <div className="member-checklist">
                  {form.participants.map((name) => (
                    <label key={name} className="member-check-item">
                      <input type="checkbox" checked={form.caughtMembers.includes(name)} onChange={() => toggleCaught(name)} />
                      <span>{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-field">
                <label>LOGGED BY</label>
                <input type="text" name="loggedBy" value={form.loggedBy} onChange={handleChange} placeholder="Your in-game name" />
              </div>
            </div>

            <div className="form-field form-field--full">
              <label>NOTES</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any extra details…" />
            </div>

            {submitError && <p className="app-error">{submitError}</p>}

            <button className="ops-submit-btn" type="submit" disabled={submitting}>
              {submitting ? 'SAVING…' : 'LOG OPERATION'}
            </button>
          </form>
        )}

        {/* ── Content ── */}
        {loading && <p className="app-loading">Loading…</p>}
        {error && <p className="app-error">{error}</p>}

        {!loading && !error && activeTab === 'Heists' && (
          <>
            {jobs.length === 0 && (
              <p className="app-empty">No operations logged yet. Add your first heist above.</p>
            )}
            <div className="heist-grid">
              {jobs.map((job) => {
                const oc = OUTCOME_LABELS[job.outcome] ?? { label: job.outcome, cls: '' }
                return (
                  <div key={job.id} className="heist-card">
                    <div className="heist-card-icon">
                      <ShieldIcon />
                    </div>
                    <div className="heist-card-body">
                      <h3 className="heist-card-name">{job.jobType}</h3>
                      <div className="heist-card-meta-row">
                        <span className="heist-card-type">TACTICAL OPERATION</span>
                        <span className={`heist-outcome-dot ${oc.cls}`}>{oc.label}</span>
                      </div>
                    </div>
                    <div className="heist-card-actions">
                      <button className="heist-action-btn" title="Edit" disabled>
                        <PencilIcon />
                      </button>
                      <button className="heist-action-btn" title="Delete" disabled>
                        <TrashIcon />
                      </button>
                      <button className="heist-info-btn" onClick={() => setSelectedJob(job)}>
                        <span className="heist-info-icon"><InfoCircleIcon /></span>
                        Info
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {!loading && !error && activeTab !== 'Heists' && (
          <p className="app-empty">No {activeTab.toLowerCase()} data yet.</p>
        )}
      </div>

      {/* ── Info modal ── */}
      {selectedJob && (
        <div className="heist-modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="heist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="heist-modal-header">
              <div className="heist-modal-icon"><ShieldIcon /></div>
              <div>
                <h2 className="heist-modal-title">{selectedJob.jobType}</h2>
                <span className="heist-card-type">TACTICAL OPERATION</span>
              </div>
              <button className="heist-modal-close" onClick={() => setSelectedJob(null)}>
                <CloseIcon />
              </button>
            </div>
            <div className="heist-modal-body">
              <div className="heist-modal-row">
                <span className="heist-modal-label">OUTCOME</span>
                <span className={`heist-outcome-dot ${(OUTCOME_LABELS[selectedJob.outcome] ?? {}).cls}`}>
                  {(OUTCOME_LABELS[selectedJob.outcome] ?? { label: selectedJob.outcome }).label}
                </span>
              </div>
              {selectedJob.participants && selectedJob.participants.length > 0 && (
                <div className="heist-modal-row">
                  <span className="heist-modal-label">CREW</span>
                  <span className="heist-modal-value">{selectedJob.participants.join(', ')}</span>
                </div>
              )}
              {selectedJob.caughtMembers && selectedJob.caughtMembers.length > 0 && (
                <div className="heist-modal-row">
                  <span className="heist-modal-label">ARRESTED</span>
                  <span className="heist-modal-value heist-modal-caught">{selectedJob.caughtMembers.join(', ')}</span>
                </div>
              )}
              {selectedJob.dirtyCash != null && (
                <div className="heist-modal-row">
                  <span className="heist-modal-label">DIRTY CASH</span>
                  <span className="heist-modal-value">{formatCash(selectedJob.dirtyCash)}</span>
                </div>
              )}
              {selectedJob.cleanCash != null && (
                <div className="heist-modal-row">
                  <span className="heist-modal-label">CLEAN CASH</span>
                  <span className="heist-modal-value">{formatCash(selectedJob.cleanCash)}</span>
                </div>
              )}
              {selectedJob.loggedBy && (
                <div className="heist-modal-row">
                  <span className="heist-modal-label">LOGGED BY</span>
                  <span className="heist-modal-value">{selectedJob.loggedBy}</span>
                </div>
              )}
              <div className="heist-modal-row">
                <span className="heist-modal-label">DATE</span>
                <span className="heist-modal-value">{formatDate(selectedJob.loggedAt)}</span>
              </div>
              {selectedJob.notes && (
                <div className="heist-modal-notes">{selectedJob.notes}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </TabletLayout>
  )
}
