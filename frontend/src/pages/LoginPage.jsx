import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginRequest } from '../api/api'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && <p className="login-error">{error}</p>}

              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'AUTHENTICATING…' : 'LOGIN'}
              </button>
            </form>

            <p className="login-hint">
              Default credentials — <span>admin</span> / <span>gbg2024</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
