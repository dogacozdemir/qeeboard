import { useState } from 'react'
import { apiPost, setToken } from '../lib/api'
import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await apiPost('/api/auth/register', { name, email, password })
      const token = res?.data?.token
      if (res?.success && token) {
        setToken(token)
        const params = new URLSearchParams(location.search)
        const ret = params.get('return') || '/profile'
        navigate(ret)
      } else {
        setError(res?.message || 'Kayıt başarısız')
      }
    } catch (err) {
      setError((err as Error).message || 'Kayıt başarısız')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Kayıt Ol</h2>
        <div className="auth-sub">Dakikalar içinde hesabını oluştur.</div>
        <form onSubmit={onSubmit} className="list">
          <div>
            <label>Ad Soyad</label>
            <input value={name} onChange={e=>setName(e.target.value)} />
          </div>
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
            <button className="btn" type="submit">Kayıt Ol</button>
            <div className="muted">Hesabın var mı? <Link className="link" to="/login">Giriş yap</Link></div>
          </div>
        </form>
      </div>
    </div>
  )
}


