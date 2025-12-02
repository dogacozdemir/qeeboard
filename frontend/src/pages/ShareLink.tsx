import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGet, getUserIdFromToken } from '../lib/api'
import { Header, Footer } from '../components/Layout'

export default function ShareLinkPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shareData, setShareData] = useState<any>(null)
  const userId = getUserIdFromToken()

  useEffect(() => {
    if (!token) {
      setError('Geçersiz paylaşım linki')
      setLoading(false)
      return
    }

    const checkAccess = async () => {
      try {
        const res = await apiGet(`/api/shares/${token}${userId ? `?userId=${userId}` : ''}`)
        const data = res.data

        if (!data.hasAccess) {
          // User needs to login/register with allowed email
          setShareData(data)
          setLoading(false)
          return
        }

        // User has access, redirect to designer with share token
        const configId = data.config.id
        navigate(`/designer?shareToken=${token}&configId=${configId}`)
      } catch (e: any) {
        console.error('Share link error:', e)
        if (e.message?.includes('404')) {
          setError('Paylaşım linki bulunamadı')
        } else if (e.message?.includes('410')) {
          setError('Paylaşım linkinin süresi dolmuş')
        } else {
          setError('Paylaşım linki yüklenirken bir hata oluştu')
        }
        setLoading(false)
      }
    }

    checkAccess()
  }, [token, userId, navigate])

  const handleLogin = () => {
    const returnTo = `/share/${token}`
    navigate(`/login?return=${encodeURIComponent(returnTo)}`)
  }

  const handleRegister = () => {
    const returnTo = `/share/${token}`
    navigate(`/register?return=${encodeURIComponent(returnTo)}`)
  }

  if (loading) {
    return (
      <section>
        <Header />
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div>Yükleniyor...</div>
        </div>
        <Footer />
      </section>
    )
  }

  if (error) {
    return (
      <section>
        <Header />
        <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '16px' }}>Hata</h1>
          <p className="muted">{error}</p>
          <button className="btn" onClick={() => navigate('/')} style={{ marginTop: '24px' }}>
            Ana Sayfaya Dön
          </button>
        </div>
        <Footer />
      </section>
    )
  }

  if (shareData && !shareData.hasAccess) {
    return (
      <section>
        <Header />
        <div className="container" style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ marginBottom: '16px' }}>Paylaşılan Tasarım</h1>
            {shareData.config && (
              <div>
                <h2 style={{ marginBottom: '8px' }}>{shareData.config.name}</h2>
                {shareData.config.previewUrl && (
                  <img 
                    src={shareData.config.previewUrl.startsWith('http') 
                      ? shareData.config.previewUrl 
                      : `http://localhost:5001${shareData.config.previewUrl}`} 
                    alt={shareData.config.name}
                    style={{ maxWidth: '100%', borderRadius: '8px', marginTop: '16px' }}
                  />
                )}
              </div>
            )}
          </div>

          <div style={{ 
            background: '#f6f7f9', 
            padding: '24px', 
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{ marginBottom: '16px' }}>
              Bu tasarıma erişmek için izin verilen email adreslerinden biriyle giriş yapmanız veya kayıt olmanız gerekiyor.
            </p>
            {shareData.message && (
              <p className="muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
                {shareData.message}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn" onClick={handleLogin}>
              Giriş Yap
            </button>
            <button className="btn" onClick={handleRegister} style={{ background: '#9ca3af' }}>
              Kayıt Ol
            </button>
          </div>
        </div>
        <Footer />
      </section>
    )
  }

  return null
}
