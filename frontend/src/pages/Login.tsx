import { useState } from 'react'
import { apiPost, setToken } from '../lib/api'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await apiPost('/api/auth/login', { email, password })
      const token = res?.data?.token
      if (res?.success && token) {
        setToken(token)
        const params = new URLSearchParams(location.search)
        const ret = params.get('return') || '/profile'
        navigate(ret)
      } else {
        setError(res?.message || 'Giriş başarısız')
      }
    } catch (err) {
      setError((err as Error).message || 'Giriş başarısız')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Giriş Yap</h2>
        <div className="auth-sub">Hesabına erişmek için bilgilerini gir.</div>
        <form onSubmit={onSubmit} className="list">
          <div>
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label>Şifre</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          {error && <div className="muted">{error}</div>}
          <div className="auth-actions">
            <button className="btn" type="submit">Giriş</button>
            <div className="muted">Hesabın yok mu? <Link className="link" to="/register">Kayıt ol</Link></div>
          </div>
        </form>
      </div>
    </div>
  )
}


