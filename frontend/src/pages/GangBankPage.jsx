import { useEffect, useState, useCallback } from 'react'
import TabletLayout from '../components/TabletLayout'
import { useAuth } from '../context/AuthContext'
import { fetchBalance, fetchTransactions, addTransaction } from '../api/api'

const INITIAL_FORM = {
  type: 'DEPOSIT',
  amount: '',
  description: '',
  performedBy: '',
}

export default function GangBankPage() {
  const { token, username } = useAuth()
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ ...INITIAL_FORM, performedBy: username || '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [bal, txns] = await Promise.all([fetchBalance(token), fetchTransactions(token)])
      setBalance(bal.balance)
      setTransactions(txns)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSubmitting(true)
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      const saved = await addTransaction(payload, token)
      // Reload balance from server to avoid floating-point precision issues
      const bal = await fetchBalance(token)
      setBalance(bal.balance)
      setTransactions([saved, ...transactions])
      setForm({ ...INITIAL_FORM, performedBy: username || '' })
      setShowForm(false)
    } catch (err) {
      setSubmitError(err.message || 'Failed to add transaction')
    } finally {
      setSubmitting(false)
    }
  }

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  const formatDate = (dt) =>
    new Date(dt).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <TabletLayout title="Gang Bank" backTo="/dashboard">
      {loading && <p className="tablet-loading">Loading…</p>}
      {error && <p className="tablet-error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="bank-balance-card">
            <span className="balance-label">GANG BALANCE</span>
            <span className={`balance-amount ${balance < 0 ? 'balance-negative' : ''}`}>
              {fmt(balance ?? 0)}
            </span>
          </div>

          <div className="section-header">
            <h2 className="section-title">TRANSACTIONS</h2>
            <button className="tablet-action-btn" onClick={() => setShowForm((s) => !s)}>
              {showForm ? '✕ Cancel' : '＋ Add'}
            </button>
          </div>

          {showForm && (
            <form className="job-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label>TYPE</label>
                  <select name="type" value={form.type} onChange={handleChange} required>
                    <option value="DEPOSIT">💵 Deposit</option>
                    <option value="WITHDRAWAL">💸 Withdrawal</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>AMOUNT ($)</label>
                  <input
                    type="number"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>DESCRIPTION</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="What is this for?"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>PERFORMED BY</label>
                  <input
                    type="text"
                    name="performedBy"
                    value={form.performedBy}
                    onChange={handleChange}
                    placeholder="Your in-game name"
                  />
                </div>
              </div>

              {submitError && <p className="tablet-error">{submitError}</p>}

              <button className="login-btn" type="submit" disabled={submitting}>
                {submitting ? 'SAVING…' : 'ADD TRANSACTION'}
              </button>
            </form>
          )}

          {transactions.length === 0 && (
            <p className="tablet-empty">No transactions yet.</p>
          )}

          <div className="transactions-list">
            {transactions.map((t) => (
              <div key={t.id} className={`txn-card ${t.type === 'DEPOSIT' ? 'txn-deposit' : 'txn-withdrawal'}`}>
                <div className="txn-left">
                  <span className="txn-icon">{t.type === 'DEPOSIT' ? '↑' : '↓'}</span>
                  <div className="txn-info">
                    <span className="txn-desc">{t.description}</span>
                    {t.performedBy && <span className="txn-by">{t.performedBy}</span>}
                  </div>
                </div>
                <div className="txn-right">
                  <span className={`txn-amount ${t.type === 'DEPOSIT' ? 'amount-pos' : 'amount-neg'}`}>
                    {t.type === 'DEPOSIT' ? '+' : '-'}{fmt(t.amount)}
                  </span>
                  <span className="txn-date">{formatDate(t.transactionDate)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </TabletLayout>
  )
}
