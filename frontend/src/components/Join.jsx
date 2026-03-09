import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { submitApplication } from '../api/api'

const INITIAL = { inGameName: '', discordName: '', age: '', reason: '' }

const REQUIREMENTS = [
  'Active on the FiveM server',
  'No history of snitching or betrayal',
  'Respect for the gang hierarchy',
  'Ready to represent black & white',
  '18+ preferred (exceptions can be made)',
  'Complete a trial period as Recruit',
]

export default function Join() {
  const headerRef  = useScrollReveal()
  const introRef   = useScrollReveal(100)
  const reqRef     = useScrollReveal(200)
  const formRef    = useScrollReveal(300)

  const [form,     setForm]     = useState(INITIAL)
  const [status,   setStatus]   = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await submitApplication({ ...form, age: Number(form.age) })
      setStatus('success')
      setForm(INITIAL)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  return (
    <section id="join">
      <div className="container">
        <div className="join-inner">
          <div className="reveal" ref={headerRef}>
            <p className="section-tag">// Recruitment</p>
            <h2 className="section-title">
              Join
              <br />
              GBG
            </h2>
            <div className="section-line" />
          </div>

          <p className="reveal" ref={introRef}>
            Think you&apos;ve got what it takes? GBG doesn&apos;t accept everyone.
            We want the best — loyal, active, and ready to put in work.
            If you&apos;re serious, find us in-game or fill out the application below.
          </p>

          <ul className="requirements reveal" ref={reqRef}>
            {REQUIREMENTS.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          {status === 'success' ? (
            <div className="form-success reveal visible">
              <p>✦ Application submitted. We&apos;ll be in touch.</p>
            </div>
          ) : (
            <form className="join-form reveal" ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="inGameName">In-Game Name</label>
                  <input
                    id="inGameName"
                    name="inGameName"
                    type="text"
                    value={form.inGameName}
                    onChange={handleChange}
                    placeholder="Your FiveM character name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="discordName">Discord</label>
                  <input
                    id="discordName"
                    name="discordName"
                    type="text"
                    value={form.discordName}
                    onChange={handleChange}
                    placeholder="username or @user"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Your age"
                  min="13"
                  max="99"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reason">Why do you want to join GBG?</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Tell us why you deserve a spot in the crew..."
                  rows={5}
                  minLength={20}
                  required
                />
              </div>

              {status === 'error' && (
                <p className="form-error">
                  {errorMsg || 'Something went wrong. Try again.'}
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
