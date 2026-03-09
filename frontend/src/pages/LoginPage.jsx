import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginRequest, registerRequest } from '../api/api'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setSuccess('')
    setUsername('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
      setLoading(true)
      try {
        await registerRequest(username, password)
        switchMode('login')
        setSuccess('Account created! You can now log in.')
      } catch (err) {
        setError(err.message || 'Registration failed')
      } finally {
        setLoading(false)
      }
      return
    }

    setLoading(true)
    try {
      const data = await loginRequest(username, password)
      login(data.token, data.username)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const isRegister = mode === 'register'

  return (
    <div className="login-wrapper">
      <div className="tablet-frame">
        <div className="tablet-screen">
          <div className="login-container">
            <div className="login-logo">GBG</div>
            <p className="login-subtitle">GO BROKE GANG — INTERNAL SYSTEM</p>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label htmlFor="username">USERNAME</label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password">PASSWORD</label>
                <input
                  id="password"
                  type="password"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              {isRegister && (
                <div className="login-field">
                  <label htmlFor="confirm-password">CONFIRM PASSWORD</label>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </div>
              )}

              {error && <p className="login-error">{error}</p>}
              {success && <p className="login-success">{success}</p>}

              <button className="login-btn" type="submit" disabled={loading}>
                {loading
                  ? isRegister ? 'CREATING ACCOUNT…' : 'AUTHENTICATING…'
                  : isRegister ? 'CREATE ACCOUNT' : 'LOGIN'}
              </button>
            </form>

            <p className="login-mode-toggle">
              {isRegister ? (
                <>Already have an account?{' '}
                  <button type="button" className="login-mode-link" onClick={() => switchMode('login')}>
                    Sign in
                  </button>
                </>
              ) : (
                <>Don&apos;t have an account?{' '}
                  <button type="button" className="login-mode-link" onClick={() => switchMode('register')}>
                    Create one
                  </button>
                </>
              )}
            </p>

            {import.meta.env.DEV && !isRegister && (
              <p className="login-hint">
                Default credentials — <span>admin</span> / <span>gbg2024</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
