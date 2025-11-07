import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGet, apiPost, getUserIdFromToken, getPreviewUrl } from '../lib/api'
import { Header, Footer } from '../components/Layout'

type Order = {
  id: number
  status: string
  totalCents: number
  currency: string
  createdAt: string
  deliveredAt?: string
  shippingAddr?: { fullName: string; line1: string; line2?: string; city: string; postalCode: string; country: string }
  billingAddr?: { fullName: string; line1: string; line2?: string; city: string; postalCode: string; country: string }
  items: Array<{
    id: number
    quantity: number
    unitPriceCents: number
    subtotalCents: number
    listing: {
      id: number
      config: { id: number; name: string; description?: string; previewUrl?: string }
    }
  }>
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = getUserIdFromToken()
    if (!userId || !id) {
      navigate('/profile')
      return
    }
    apiGet(`/api/orders/${id}`)
      .then((res) => {
        if (res.data?.userId !== userId) {
          navigate('/profile')
          return
        }
        setOrder(res.data)
      })
      .catch(() => navigate('/profile'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleReOrder = async (listingId: number, quantity: number) => {
    const userId = getUserIdFromToken()
    if (!userId) return
    try {
      await apiPost('/api/cart/items', { userId, listingId, quantity })
      alert('Ürün sepete eklendi!')
      navigate('/cart')
    } catch (err) {
      alert('Sepete eklenirken bir hata oluştu.')
    }
  }

  if (loading) {
    return (
      <section className="order-detail-page">
        <Header />
        <div className="container" style={{ padding: '40px 20px' }}>
          <div>Yükleniyor...</div>
        </div>
        <Footer />
      </section>
    )
  }

  if (!order) {
    return (
      <section className="order-detail-page">
        <Header />
        <div className="container" style={{ padding: '40px 20px' }}>
          <div>Sipariş bulunamadı.</div>
        </div>
        <Footer />
      </section>
    )
  }

  const statusText = order.status === 'FULFILLED' ? 'Teslim edildi' : order.status === 'PAID' ? 'Ödendi' : order.status === 'PENDING' ? 'Beklemede' : order.status === 'CANCELLED' ? 'İptal edildi' : order.status
  const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : (order.status === 'FULFILLED' ? (() => {
    const d = new Date(order.createdAt)
    d.setDate(d.getDate() + 1)
    return d
  })() : null)
  const returnDeadline = new Date(order.createdAt)
  returnDeadline.setDate(returnDeadline.getDate() + 32)

  return (
    <section className="order-detail-page">
      <Header />
      <div className="container" style={{ padding: '40px 20px' }}>
        <button onClick={() => navigate('/profile')} style={{ marginBottom: 20, background: '#e5e7eb', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
          ← Siparişlerime Dön
        </button>
        <div className="order-card">
          <div className="order-header">
            <div>
              <strong>Sipariş No:</strong> 402-{String(order.id).padStart(7, '0')}-{order.id}<br/>
              <strong>Sipariş Tarihi:</strong> {new Date(order.createdAt).toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })}<br/>
              <strong>Durum:</strong> {statusText}
              {deliveryDate && <><br/><strong>Teslimat Tarihi:</strong> {deliveryDate.toLocaleDateString('tr-TR', { day:'2-digit', month:'long' })}</>}
            </div>
            <div>
              <strong>Toplam:</strong> {(order.totalCents/100).toLocaleString('tr-TR',{minimumFractionDigits:2})} {order.currency}
            </div>
          </div>
          {order.items.map((item, idx) => {
            const config = item.listing.config
            const fullPreviewUrl = config.previewUrl ? getPreviewUrl(config.previewUrl) : null
            return (
              <div key={item.id} className="order-body" style={idx > 0 ? { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' } : {}}>
                {fullPreviewUrl ? (
                  <img 
                    src={fullPreviewUrl} 
                    alt={config.name}
                    onError={(e) => {
                      console.error('Preview image failed to load:', fullPreviewUrl)
                      e.currentTarget.src = 'https://via.placeholder.com/80'
                    }}
                  />
                ) : (
                  <img src="https://via.placeholder.com/80" alt={config.name} />
                )}
                <div className="order-info">
                  <strong>{config.name}</strong><br/>
                  {config.description && <span style={{ fontSize: '14px', color: '#666' }}>{config.description}</span>}
                  {config.description && <br/>}
                  <span style={{ fontSize: '14px' }}>Adet: {item.quantity} × {(item.unitPriceCents/100).toLocaleString('tr-TR',{minimumFractionDigits:2})} {order.currency} = {(item.subtotalCents/100).toLocaleString('tr-TR',{minimumFractionDigits:2})} {order.currency}</span>
                  <div className="order-actions" style={{ marginTop: 12 }}>
                    <button onClick={() => handleReOrder(item.listing.id, item.quantity)}>Tekrar Satın Alın</button>
                  </div>
                </div>
              </div>
            )
          })}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '2px solid #eee' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {order.shippingAddr && (
                <div>
                  <strong>Teslimat Adresi:</strong><br/>
                  {order.shippingAddr.fullName}<br/>
                  {order.shippingAddr.line1}{order.shippingAddr.line2 ? `, ${order.shippingAddr.line2}` : ''}<br/>
                  {order.shippingAddr.city} {order.shippingAddr.postalCode}<br/>
                  {order.shippingAddr.country}
                </div>
              )}
              {order.billingAddr && (
                <div>
                  <strong>Fatura Adresi:</strong><br/>
                  {order.billingAddr.fullName}<br/>
                  {order.billingAddr.line1}{order.billingAddr.line2 ? `, ${order.billingAddr.line2}` : ''}<br/>
                  {order.billingAddr.city} {order.billingAddr.postalCode}<br/>
                  {order.billingAddr.country}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  )
}

