import { useEffect, useState } from 'react'
import { apiGet, apiPost, apiPut, apiDelete, clearToken, getUserIdFromToken, getPreviewUrl } from '../lib/api'
import { Header, Footer } from '../components/Layout'
import { useNavigate, useSearchParams } from 'react-router-dom'

type User = { id: number; name: string; email: string; phone?: string }
type Address = { id: number; kind: 'SHIPPING' | 'BILLING'; fullName: string; line1: string; line2?: string; city: string; postalCode: string; country: string }
type Config = { id: number; name: string; description?: string; previewUrl?: string; createdAt: string; layoutData?: any }
type Order = {
  id: number
  status: string
  totalCents: number
  currency: string
  createdAt: string
  deliveredAt?: string
  shippingAddr?: { fullName: string; line1: string; city: string; postalCode: string; country: string }
  items: Array<{
    id: number
    quantity: number
    unitPriceCents: number
    listing: {
      id: number
      config: { id: number; name: string; description?: string; previewUrl?: string }
    }
  }>
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab') as 'profil' | 'tasarimlar' | 'siparisler' | 'ayarlar' | 'cikis' | null
  const [active, setActive] = useState<'profil' | 'tasarimlar' | 'siparisler' | 'ayarlar' | 'cikis'>(tabParam || 'profil')
  const [user, setUser] = useState<User | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [configs, setConfigs] = useState<Config[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [editingAddrId, setEditingAddrId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<{ fullName: string; line1: string; line2?: string; city: string; postalCode: string; country: string }>({ fullName: '', line1: '', line2: '', city: '', postalCode: '', country: '' })
  const [addingNewAddress, setAddingNewAddress] = useState<boolean>(false)
  const [newAddressKind, setNewAddressKind] = useState<'SHIPPING' | 'BILLING'>('SHIPPING')
  const [newAddressForm, setNewAddressForm] = useState<{ fullName: string; line1: string; line2?: string; city: string; postalCode: string; country: string; phone?: string }>({ fullName: '', line1: '', line2: '', city: '', postalCode: '', country: 'Türkiye', phone: '' })

  const handleReOrder = async (listingId: number, quantity: number = 1) => {
    const userId = getUserIdFromToken()
    if (!userId) return
    try {
      await apiPost('/api/cart/items', { userId, listingId, quantity })
      alert('Ürün sepete eklendi!')
    } catch (err) {
      alert('Sepete eklenirken bir hata oluştu.')
    }
  }

  useEffect(() => {
    if (tabParam) {
      setActive(tabParam)
    }
  }, [tabParam])

  useEffect(() => {
    const userId = getUserIdFromToken()
    if (!userId) return
    // Load user & configs from /api/users/:id
    apiGet(`/api/users/${userId}`).then((res) => {
      const u = res.data
      setUser({ id: u.id, name: u.name, email: u.email, phone: u.phone })
      setConfigs(u.configs ?? [])
    }).catch(console.error)
    // Addresses
    apiGet(`/api/addresses?userId=${userId}`).then((res) => setAddresses(res.data ?? [])).catch(console.error)
    // Orders
    apiGet(`/api/orders?userId=${userId}`).then((res) => setOrders(res.data ?? [])).catch(console.error)
  }, [])

  const renderConfigPreview = (c: Config) => {
    const fullPreviewUrl = c.previewUrl ? getPreviewUrl(c.previewUrl) : null
    if (fullPreviewUrl) {
      return (
        <img
          src={fullPreviewUrl}
          alt={c.name}
          style={{ width: '120px', height: '80px', objectFit: 'contain', background: '#f6f7f9', borderRadius: 6 }}
          onError={(e) => {
            console.error('Preview image failed to load:', fullPreviewUrl)
            e.currentTarget.style.display = 'none'
          }}
        />
      )
    }
    const layout = (c.layoutData && (c.layoutData.layout || c.layoutData)) as any
    const hasLayout = layout && Array.isArray(layout?.keys)
    if (!hasLayout) return null
    const UNIT = 8
    const BASE_SCALE = 1.1
    const pad = 4
    const maxW = Math.max(0, ...layout.keys.map((k:any)=>k.x + k.width))
    const maxH = Math.max(0, ...layout.keys.map((k:any)=>k.y + k.height))
    const svgW = Math.round(maxW * UNIT * BASE_SCALE + pad*2)
    const svgH = Math.round(maxH * UNIT * BASE_SCALE + pad*2)
    return (
      <div style={{ width: 120, height: 80, background: '#0b0d10', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: '100%', maxHeight: '100%' }}>
          <rect x={0} y={0} width={svgW} height={svgH} rx={8} ry={8} fill="#0b0d10" stroke="#1f2937" />
          {layout.keys.map((k:any, idx:number)=>{
            const x = Math.round(pad + k.x * UNIT * BASE_SCALE)
            const y = Math.round(pad + k.y * UNIT * BASE_SCALE)
            const w = Math.round(k.width * UNIT * BASE_SCALE)
            const h = Math.round(k.height * UNIT * BASE_SCALE)
            const fill = k.color || '#2D3748'
            const text = k.textColor || '#FFFFFF'
            return (
              <g key={idx}>
                <rect x={x} y={y} width={w} height={h} rx={3} ry={3} fill={fill} stroke="#111827" />
                <circle cx={x + w - 3} cy={y + 3} r={1.5} fill={text} opacity={0.6} />
              </g>
            )
          })}
        </svg>
      </div>
    )
  }

  return (
    <section className="profile-page">
      <Header />
      <div className="container account-container">
        <aside className="sidebar">
          <h2>Hesabım</h2>
          <button className={active==='profil'?'menu-item active':'menu-item'} onClick={()=>setActive('profil')}>Profil</button>
          <button className={active==='tasarimlar'?'menu-item active':'menu-item'} onClick={()=>setActive('tasarimlar')}>Tasarımlarım</button>
          <button className={active==='siparisler'?'menu-item active':'menu-item'} onClick={()=>setActive('siparisler')}>Siparişlerim</button>
          <button className={active==='ayarlar'?'menu-item active':'menu-item'} onClick={()=>setActive('ayarlar')}>Ayarlar ve Güvenlik</button>
          <button className={active==='cikis'?'menu-item active':'menu-item'} onClick={()=>setActive('cikis')}>Çıkış</button>
        </aside>
        <main className="content">
          {active === 'profil' && (
            <div className="card">
              <h2>Profil</h2>
              <div className="grid2">
                <div>
                  <label>İsim</label>
                  <input value={(user?.name ?? '').split(' ').slice(0, -1).join(' ') || (user?.name ?? '')} readOnly />
                </div>
                <div>
                  <label>Soyisim</label>
                  <input value={(user?.name ?? '').split(' ').slice(-1).join(' ')} readOnly />
                </div>
                <div>
                  <label>Email</label>
                  <input value={user?.email ?? ''} readOnly />
                </div>
                <div>
                  <label>Telefon</label>
                  <input value={user?.phone || ''} readOnly placeholder={user?.phone ? '' : 'Telefon bilgisi yok'} />
                </div>
                <div className="full-span">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label>Adresler</label>
                    {!addingNewAddress && (
                      <button 
                        className="btn" 
                        onClick={() => {
                          setAddingNewAddress(true)
                          setNewAddressForm({ fullName: '', line1: '', line2: '', city: '', postalCode: '', country: 'Türkiye', phone: '' })
                          setNewAddressKind('SHIPPING')
                        }}
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        + Adres Ekle
                      </button>
                    )}
                  </div>
                  
                  {addingNewAddress && (
                    <div className="list-item" style={{ marginBottom: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div className="title" style={{ marginBottom: '16px' }}>Yeni Adres Ekle</div>
                        <div className="grid2">
                          <div>
                            <label>Adres Tipi <span style={{ color: '#ef4444' }}>*</span></label>
                            <select 
                              value={newAddressKind} 
                              onChange={e => setNewAddressKind(e.target.value as 'SHIPPING' | 'BILLING')}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                            >
                              <option value="SHIPPING">Teslimat Adresi</option>
                              <option value="BILLING">Fatura Adresi</option>
                            </select>
                          </div>
                          <div>
                            <label>Telefon</label>
                            <input 
                              value={newAddressForm.phone || ''} 
                              onChange={e => setNewAddressForm({ ...newAddressForm, phone: e.target.value })} 
                              placeholder="Telefon (opsiyonel)"
                            />
                          </div>
                          <div>
                            <label>Ad Soyad <span style={{ color: '#ef4444' }}>*</span></label>
                            <input 
                              value={newAddressForm.fullName} 
                              onChange={e => setNewAddressForm({ ...newAddressForm, fullName: e.target.value })} 
                              placeholder="Ad Soyad"
                            />
                          </div>
                          <div>
                            <label>Adres Satırı <span style={{ color: '#ef4444' }}>*</span></label>
                            <input 
                              value={newAddressForm.line1} 
                              onChange={e => setNewAddressForm({ ...newAddressForm, line1: e.target.value })} 
                              placeholder="Adres Satırı"
                            />
                          </div>
                          <div>
                            <label>Adres Satırı 2</label>
                            <input 
                              value={newAddressForm.line2 || ''} 
                              onChange={e => setNewAddressForm({ ...newAddressForm, line2: e.target.value })} 
                              placeholder="Adres Satırı 2 (opsiyonel)"
                            />
                          </div>
                          <div>
                            <label>Şehir <span style={{ color: '#ef4444' }}>*</span></label>
                            <input 
                              value={newAddressForm.city} 
                              onChange={e => setNewAddressForm({ ...newAddressForm, city: e.target.value })} 
                              placeholder="Şehir"
                            />
                          </div>
                          <div>
                            <label>Posta Kodu <span style={{ color: '#ef4444' }}>*</span></label>
                            <input 
                              value={newAddressForm.postalCode} 
                              onChange={e => setNewAddressForm({ ...newAddressForm, postalCode: e.target.value })} 
                              placeholder="Posta Kodu"
                            />
                          </div>
                          <div>
                            <label>Ülke <span style={{ color: '#ef4444' }}>*</span></label>
                            <input 
                              value={newAddressForm.country} 
                              onChange={e => setNewAddressForm({ ...newAddressForm, country: e.target.value })} 
                              placeholder="Ülke"
                            />
                          </div>
                          <div className="full-span" style={{ display: 'flex', gap: 8, marginTop: '8px' }}>
                            <button 
                              className="btn" 
                              onClick={async () => {
                                const userId = getUserIdFromToken()
                                if (!userId) return
                                
                                if (!newAddressForm.fullName || !newAddressForm.line1 || !newAddressForm.city || !newAddressForm.postalCode || !newAddressForm.country) {
                                  alert('Lütfen tüm zorunlu alanları doldurun.')
                                  return
                                }
                                
                                try {
                                  await apiPost('/api/addresses', {
                                    userId,
                                    kind: newAddressKind,
                                    fullName: newAddressForm.fullName,
                                    line1: newAddressForm.line1,
                                    line2: newAddressForm.line2 || null,
                                    city: newAddressForm.city,
                                    postalCode: newAddressForm.postalCode,
                                    country: newAddressForm.country,
                                    phone: newAddressForm.phone || null
                                  })
                                  const res = await apiGet(`/api/addresses?userId=${userId}`)
                                  setAddresses(res.data ?? [])
                                  setAddingNewAddress(false)
                                  setNewAddressForm({ fullName: '', line1: '', line2: '', city: '', postalCode: '', country: 'Türkiye', phone: '' })
                                } catch (e) { 
                                  alert('Adres ekleme başarısız') 
                                }
                              }}
                            >
                              Kaydet
                            </button>
                            <button 
                              className="btn" 
                              onClick={() => {
                                setAddingNewAddress(false)
                                setNewAddressForm({ fullName: '', line1: '', line2: '', city: '', postalCode: '', country: 'Türkiye', phone: '' })
                              }} 
                              style={{ background: '#9ca3af' }}
                            >
                              Vazgeç
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {addresses.length > 0 && (
                    <div className="list">
                      {addresses.map((addr) => (
                        <div key={addr.id} className="list-item">
                          <div style={{ flex: 1 }}>
                            <div className="title">{addr.kind === 'SHIPPING' ? 'Teslimat Adresi' : 'Fatura Adresi'} - {addr.fullName}</div>
                            {editingAddrId === addr.id ? (
                              <div className="grid2">
                                <div>
                                  <label>Ad Soyad</label>
                                  <input value={editForm.fullName} onChange={e=>setEditForm({ ...editForm, fullName: e.target.value })} />
                                </div>
                                <div>
                                  <label>Adres Satırı</label>
                                  <input value={editForm.line1} onChange={e=>setEditForm({ ...editForm, line1: e.target.value })} />
                                </div>
                                <div>
                                  <label>Adres Satırı 2</label>
                                  <input value={editForm.line2 || ''} onChange={e=>setEditForm({ ...editForm, line2: e.target.value })} />
                                </div>
                                <div>
                                  <label>Şehir</label>
                                  <input value={editForm.city} onChange={e=>setEditForm({ ...editForm, city: e.target.value })} />
                                </div>
                                <div>
                                  <label>Posta Kodu</label>
                                  <input value={editForm.postalCode} onChange={e=>setEditForm({ ...editForm, postalCode: e.target.value })} />
                                </div>
                                <div>
                                  <label>Ülke</label>
                                  <input value={editForm.country} onChange={e=>setEditForm({ ...editForm, country: e.target.value })} />
                                </div>
                                <div className="full-span" style={{ display: 'flex', gap: 8 }}>
                                  <button className="btn" onClick={async ()=>{
                                    try {
                                      await apiPut(`/api/addresses/${addr.id}`, editForm)
                                      const userId = getUserIdFromToken(); if (!userId) return
                                      const res = await apiGet(`/api/addresses?userId=${userId}`)
                                      setAddresses(res.data ?? [])
                                      setEditingAddrId(null)
                                    } catch (e) { alert('Güncelleme başarısız') }
                                  }}>Kaydet</button>
                                  <button className="btn" onClick={()=> setEditingAddrId(null)} style={{ background: '#9ca3af' }}>Vazgeç</button>
                                </div>
                              </div>
                            ) : (
                              <div className="muted">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city} {addr.postalCode}, {addr.country}</div>
                            )}
                          </div>
                          <div className="addr-actions">
                            <button className="icon-btn small" aria-label="Düzenle" onClick={()=>{
                              setEditingAddrId(addr.id)
                              setEditForm({ fullName: addr.fullName, line1: addr.line1, line2: addr.line2, city: addr.city, postalCode: addr.postalCode, country: addr.country })
                            }}>
                              <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M4 21h4l11-11-4-4L4 17v4Z" stroke="currentColor" strokeWidth="2"/></svg>
                            </button>
                            <button className="icon-btn small" aria-label="Sil" onClick={async()=>{
                              if (!confirm('Adresi silmek istiyor musunuz?')) return
                              try {
                                await apiDelete(`/api/addresses/${addr.id}`)
                                const userId = getUserIdFromToken(); if (!userId) return
                                const res = await apiGet(`/api/addresses?userId=${userId}`)
                                setAddresses(res.data ?? [])
                              } catch (e) { alert('Silme başarısız') }
                            }}>
                              <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M3 6h18M9 6V4h6v2m-7 4v10m4-10v10m4-10v10M5 6l1 16h12l1-16" stroke="currentColor" strokeWidth="2"/></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {addresses.length === 0 && !addingNewAddress && (
                    <div className="muted" style={{ padding: '16px', textAlign: 'center', border: '1px dashed #e5e7eb', borderRadius: '8px' }}>
                      Henüz adres eklenmemiş. Yeni adres eklemek için yukarıdaki butona tıklayın.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {active === 'tasarimlar' && (
            <div className="card">
              <h2>Tasarımlarım</h2>
              <div className="list">
                {configs.map(c => (
                  <div key={c.id} className="list-item">
                    {renderConfigPreview(c)}
                    <div style={{ flex: 1 }}>
                      <div className="title">{c.name}</div>
                      <div className="muted">{c.description ?? 'Açıklama yok'}</div>
                      <div className="muted" style={{ fontSize: '12px', marginTop: '4px' }}>Oluşturulma: {new Date(c.createdAt).toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })}</div>
                    </div>
                    <div className="addr-actions">
                      <button 
                        className="icon-btn small" 
                        aria-label="Düzenle" 
                        onClick={() => {
                          navigate(`/designer?configId=${c.id}`)
                        }}
                        title="Düzenle"
                      >
                        <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                          <path d="M4 21h4l11-11-4-4L4 17v4Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                      <button 
                        className="icon-btn small" 
                        aria-label="Sil" 
                        onClick={async () => {
                          if (!confirm(`${c.name} tasarımını silmek istediğinize emin misiniz?`)) return
                          try {
                            await apiDelete(`/api/configs/${c.id}`)
                            const userId = getUserIdFromToken()
                            if (!userId) return
                            const res = await apiGet(`/api/users/${userId}`)
                            const u = res.data
                            setConfigs(u.configs ?? [])
                          } catch (e) { 
                            alert('Tasarım silinirken bir hata oluştu.') 
                          }
                        }}
                        title="Sil"
                      >
                        <svg className="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                          <path d="M3 6h18M9 6V4h6v2m-7 4v10m4-10v10m4-10v10M5 6l1 16h12l1-16" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {configs.length===0 && <div className="muted">Kayıtlı tasarım bulunamadı.</div>}
              </div>
            </div>
          )}

          {active === 'siparisler' && (
            <div>
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <strong>Sipariş Tarihi:</strong> {new Date(order.createdAt).toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })} &nbsp; | &nbsp;
                      <strong>Toplam:</strong> {(order.totalCents/100).toLocaleString('tr-TR',{minimumFractionDigits:2})} {order.currency} &nbsp; | &nbsp;
                      <strong>Teslimat Adresi:</strong> {order.shippingAddr?.fullName || 'Adres bulunamadı'}
                    </div>
                    <div><strong>Sipariş No:</strong> 402-{String(order.id).padStart(7, '0')}-{order.id}</div>
                  </div>
                  {order.items.map((item, idx) => {
                    const config = item.listing.config
                    const fullPreviewUrl = config.previewUrl ? getPreviewUrl(config.previewUrl) : null
                    const deliveryDate = order.deliveredAt ? new Date(order.deliveredAt) : (order.status === 'FULFILLED' ? (() => {
                      const d = new Date(order.createdAt)
                      d.setDate(d.getDate() + 1)
                      return d
                    })() : null)
                    const returnDeadline = new Date(order.createdAt)
                    returnDeadline.setDate(returnDeadline.getDate() + 32)
                    const statusText = order.status === 'FULFILLED' ? 'Teslim edildi' : order.status === 'PAID' ? 'Ödendi' : order.status === 'PENDING' ? 'Beklemede' : order.status === 'CANCELLED' ? 'İptal edildi' : order.status
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
                          <strong>{statusText}: {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString('tr-TR', { day:'2-digit', month:'long' }) : deliveryDate?.toLocaleDateString('tr-TR', { day:'2-digit', month:'long' }) || ''}</strong><br/>
                          {order.status === 'FULFILLED' ? 'Paket doğrudan müşteriye teslim edildi.' : order.status === 'PAID' ? 'Sipariş hazırlanıyor.' : order.status === 'PENDING' ? 'Sipariş onay bekliyor.' : ''}<br/>
                          <a href={`/orders/${order.id}`} style={{ textDecoration: 'underline', color: '#0f0f17' }}>{config.name}</a><br/>
                          {config.description && <span style={{ fontSize: '14px', color: '#666' }}>{config.description}</span>}<br/>
                          <small>Ürünleri iade et: {returnDeadline.toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })} tarihine kadar</small>
                          <div className="order-actions">
                            <button onClick={() => handleReOrder(item.listing.id, item.quantity)}>Tekrar Satın Alın</button>
                            <button onClick={() => navigate(`/orders/${order.id}`)}>Sipariş Detayı</button>
                          </div>
                        </div>
                        <div className="order-right-actions">
                          <button>Kargo takibi</button>
                          <button>Ürünleri iade et</button>
                          <button>Hediye makbuzu paylaş</button>
                          <button>Ürün yorumu yazın</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
              {orders.length===0 && <div className="muted">Sipariş bulunamadı.</div>}
            </div>
          )}

          {active === 'ayarlar' && (
            <div className="card">
              <h2>Ayarlar ve Güvenlik</h2>
              <div className="grid2">
                <div>
                  <label>Şifre Değişikliği</label>
                  <input placeholder="Yeni şifre (placeholder)" readOnly />
                </div>
                <div>
                  <label>Hesap Kapatma</label>
                  <button className="btn" disabled>Hesabı Kapat (yakında)</button>
                </div>
              </div>
            </div>
          )}

          {active === 'cikis' && (
            <div className="card">
              <h2>Çıkış</h2>
              <p className="muted">Hesabından çıkış yapmak için aşağıdaki butona tıklayın.</p>
              <button className="btn" onClick={() => { clearToken(); navigate('/'); }}>Çıkış Yap</button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </section>
  )
}


