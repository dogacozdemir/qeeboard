import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiGet, apiPut, apiDelete, apiPost, getUserIdFromToken, getPreviewUrl } from '../lib/api'
import { Header, Footer } from '../components/Layout'

type CartItem = {
  id: number
  quantity: number
  listing: {
    id: number
    priceCents: number
    currency: string
    config: { id: number; name: string; previewUrl?: string }
  }
}

export default function CartPage() {
  const [page, setPage] = useState<1 | 2>(1) // 1: Cart page, 2: Checkout page
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [addresses, setAddresses] = useState<Array<{ id:number; kind:'SHIPPING'|'BILLING'; fullName:string; line1:string; line2?:string; city:string; postalCode:string; country:string; phone?:string }>>([])
  const [shippingAddressId, setShippingAddressId] = useState<number | null>(null)
  const [billingAddressId, setBillingAddressId] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<number>(0)
  const [shippingCost, setShippingCost] = useState<number>(0) // Kargo fiyatı
  const [editingShippingAddrId, setEditingShippingAddrId] = useState<number | null>(null)
  const [editingBillingAddrId, setEditingBillingAddrId] = useState<number | null>(null)
  const [useSameAddress, setUseSameAddress] = useState<boolean>(true)
  const navigate = useNavigate()

  const userId = getUserIdFromToken()

  // Group items by listing ID (each listing = different product)
  const groupedItems = items.reduce((acc, item) => {
    const listingId = item.listing.id
    if (!acc[listingId]) {
      acc[listingId] = []
    }
    acc[listingId].push(item)
    return acc
  }, {} as Record<number, CartItem[]>)

  const uniqueListings = Object.keys(groupedItems).map(Number)
  const showTabs = uniqueListings.length > 1
  const currentListingId = showTabs ? uniqueListings[activeTab] : uniqueListings[0]
  const currentItems = currentListingId ? groupedItems[currentListingId] || [] : []

  const loadCart = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await apiGet(`/api/cart?userId=${userId}`)
      setItems(res.data?.items ?? [])
    } finally {
      setLoading(false)
    }
  }

  const loadAddresses = useCallback(async () => {
    if (!userId) return
    try {
      const res = await apiGet(`/api/addresses?userId=${userId}`)
      const list = Array.isArray(res.data) ? res.data as any[] : []
      setAddresses(list)
      const ship = list.find(a => a.kind === 'SHIPPING')
      const bill = list.find(a => a.kind === 'BILLING')
      setShippingAddressId(prev => prev ?? ship?.id ?? null)
      setBillingAddressId(prev => prev ?? bill?.id ?? null)
    } catch {}
  }, [userId])

  const loadUser = async () => {
    if (!userId) return
    try {
      const res = await apiGet(`/api/users/${userId}`)
      const user = res.data
      if (user) {
        // Parse name into firstName and lastName
        const nameParts = (user.name || '').trim().split(/\s+/)
        const fName = nameParts[0] || ''
        const lName = nameParts.slice(1).join(' ') || ''
        setFirstName(fName)
        setLastName(lName)
        setEmail(user.email || '')
        setPhone(user.phone || '')
      }
    } catch {}
  }

  useEffect(() => { loadCart(); loadAddresses(); loadUser() }, [])
  
  // İkinci sayfada adresleri otomatik olarak yükle ve form alanlarına doldur
  useEffect(() => {
    if (page === 2 && userId) {
      // User bilgilerini yükle
      loadUser()
      
      // Address bilgilerini yükle ve form alanlarına doldur
      if (addresses.length > 0) {
        const shippingAddrs = addresses.filter(a => a.kind === 'SHIPPING')
        const billingAddrs = addresses.filter(a => a.kind === 'BILLING')
        
        // İlk teslimat adresini form alanlarına doldur
        const firstShipping = shippingAddrs[0]
        if (firstShipping) {
          const nameParts = (firstShipping.fullName || '').trim().split(/\s+/)
          const fName = nameParts[0] || ''
          const lName = nameParts.slice(1).join(' ') || ''
          setFirstName(fName)
          setLastName(lName)
          setAddress(firstShipping.line1 || '')
          setCompany(firstShipping.line2 || '')
          setPostalCode(firstShipping.postalCode || '')
          setCity(firstShipping.city || '')
          setCountry(firstShipping.country || 'Türkiye')
          setState(firstShipping.state || '')
          if (firstShipping.phone) setPhone(firstShipping.phone)
          setShippingAddressId(firstShipping.id)
        }
        
        // Fatura adresini form alanlarına doldur
        if (!useSameAddress) {
          const firstBilling = billingAddrs[0]
          if (firstBilling) {
            const nameParts = (firstBilling.fullName || '').trim().split(/\s+/)
            const fName = nameParts[0] || ''
            const lName = nameParts.slice(1).join(' ') || ''
            setBillingFirstName(fName)
            setBillingLastName(lName)
            setBillingAddress(firstBilling.line1 || '')
            setBillingCompany(firstBilling.line2 || '')
            setBillingPostalCode(firstBilling.postalCode || '')
            setBillingCity(firstBilling.city || '')
            setBillingCountry(firstBilling.country || 'Türkiye')
            setBillingState(firstBilling.state || '')
            setBillingAddressId(firstBilling.id)
          }
        }
      }
    }
  }, [page, addresses.length, userId, useSameAddress])
  
  // Reset active tab when items change
  useEffect(() => {
    if (activeTab >= uniqueListings.length) {
      setActiveTab(0)
    }
  }, [items.length, uniqueListings.length])

  // Update billing address when "use same address" is checked
  useEffect(() => {
    if (useSameAddress && shippingAddressId) {
      setBillingAddressId(shippingAddressId)
    }
  }, [useSameAddress, shippingAddressId])

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.listing.priceCents, 0)
  const shipping = shippingCost // Kargo fiyatı (sayfa 2'de güncellenecek)
  const taxes = 0 // tahmini vergi (yakında)

  // Removed unused inc and dec functions - using setQuantity instead
  const setQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1) return
    await apiPut(`/api/cart/items/${item.id}`, { quantity })
    await loadCart()
  }
  const removeItem = async (item: CartItem) => {
    await apiDelete(`/api/cart/items/${item.id}`)
    await loadCart()
  }

  // Removed unused address save/update functions - addresses are managed inline in the form

  const checkout = async () => {
    if (!userId) return
    
    // Ensure all data is saved before checkout
    await saveUserInfo()
    await saveShippingAddress()
    if (!useSameAddress) {
      await saveBillingAddress()
    }
    
    // Wait a bit for addresses to be created/updated
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Reload addresses to get latest IDs
    await loadAddresses()
    
    // Get the final address IDs
    const finalShippingId = shippingAddressId
    const finalBillingId = useSameAddress ? finalShippingId : (billingAddressId || finalShippingId)
    
    if (!finalShippingId) { 
      alert('Lütfen teslimat adresi bilgilerini doldurun.'); 
      return 
    }
    
    try {
      const res = await apiPost('/api/orders/checkout', {
        userId,
        shippingAddressId: finalShippingId,
        billingAddressId: finalBillingId,
      })
      if (res?.success !== false) {
        alert('Siparişiniz oluşturuldu!')
        await loadCart()
        navigate('/profile?tab=siparisler')
      }
    } catch (e) {
      alert('Sipariş oluşturulurken bir hata oluştu.')
    }
  }

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [company, setCompany] = useState<string>('')
  const [postalCode, setPostalCode] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [country, setCountry] = useState<string>('Türkiye')
  const [state, setState] = useState<string>('')
  // Billing address fields (separate from shipping)
  const [billingFirstName, setBillingFirstName] = useState<string>('')
  const [billingLastName, setBillingLastName] = useState<string>('')
  const [billingAddress, setBillingAddress] = useState<string>('')
  const [billingCompany, setBillingCompany] = useState<string>('')
  const [billingPostalCode, setBillingPostalCode] = useState<string>('')
  const [billingCity, setBillingCity] = useState<string>('')
  const [billingCountry, setBillingCountry] = useState<string>('Türkiye')
  const [billingState, setBillingState] = useState<string>('')

  // Debounce timers for auto-saving
  const userUpdateTimer = useRef<NodeJS.Timeout | null>(null)
  const shippingAddressUpdateTimer = useRef<NodeJS.Timeout | null>(null)
  const billingAddressUpdateTimer = useRef<NodeJS.Timeout | null>(null)

  // Auto-save user information when name, email, or phone changes
  const saveUserInfo = useCallback(async () => {
    if (!userId) return
    try {
      const fullName = `${firstName} ${lastName}`.trim()
      await apiPut(`/api/users/${userId}`, {
        name: fullName,
        email: email,
        phone: phone || null
      })
    } catch (error) {
      console.error('Error saving user info:', error)
    }
  }, [userId, firstName, lastName, email, phone])

  // Auto-save shipping address
  const saveShippingAddress = useCallback(async () => {
    if (!userId) return
    try {
      const fullName = `${firstName} ${lastName}`.trim()
      if (!fullName || !address || !city || !postalCode || !country) return

      const addressData = {
        userId,
        kind: 'SHIPPING' as const,
        fullName,
        line1: address,
        line2: company || null,
        city,
        state: state || null,
        postalCode,
        country,
        phone: phone || null
      }

      if (shippingAddressId) {
        // Update existing address
        await apiPut(`/api/addresses/${shippingAddressId}`, addressData)
      } else {
        // Create new address
        const res = await apiPost('/api/addresses', addressData)
        if (res?.data?.id) {
          setShippingAddressId(res.data.id)
          await loadAddresses()
        }
      }
    } catch (error) {
      console.error('Error saving shipping address:', error)
    }
  }, [userId, firstName, lastName, address, company, city, postalCode, country, state, phone, shippingAddressId, loadAddresses])

  // Auto-save billing address
  const saveBillingAddress = useCallback(async () => {
    if (!userId || useSameAddress) return
    try {
      const fullName = `${billingFirstName} ${billingLastName}`.trim()
      if (!fullName || !billingAddress || !billingCity || !billingPostalCode || !billingCountry) return

      const addressData = {
        userId,
        kind: 'BILLING' as const,
        fullName,
        line1: billingAddress,
        line2: billingCompany || null,
        city: billingCity,
        state: billingState || null,
        postalCode: billingPostalCode,
        country: billingCountry,
        phone: phone || null
      }

      if (billingAddressId) {
        // Update existing address
        await apiPut(`/api/addresses/${billingAddressId}`, addressData)
      } else {
        // Create new address
        const res = await apiPost('/api/addresses', addressData)
        if (res?.data?.id) {
          setBillingAddressId(res.data.id)
          await loadAddresses()
        }
      }
    } catch (error) {
      console.error('Error saving billing address:', error)
    }
  }, [userId, useSameAddress, billingFirstName, billingLastName, billingAddress, billingCompany, billingCity, billingPostalCode, billingCountry, billingState, billingAddressId, phone, loadAddresses])

  // Debounced user update
  useEffect(() => {
    if (page !== 2 || !userId) return
    if (userUpdateTimer.current) {
      clearTimeout(userUpdateTimer.current)
    }
    userUpdateTimer.current = setTimeout(() => {
      saveUserInfo()
    }, 1000) // 1 second debounce
    return () => {
      if (userUpdateTimer.current) {
        clearTimeout(userUpdateTimer.current)
      }
    }
  }, [saveUserInfo, page, userId])

  // Debounced shipping address update
  useEffect(() => {
    if (page !== 2 || !userId) return
    if (shippingAddressUpdateTimer.current) {
      clearTimeout(shippingAddressUpdateTimer.current)
    }
    shippingAddressUpdateTimer.current = setTimeout(() => {
      saveShippingAddress()
    }, 1000) // 1 second debounce
    return () => {
      if (shippingAddressUpdateTimer.current) {
        clearTimeout(shippingAddressUpdateTimer.current)
      }
    }
  }, [saveShippingAddress, page, userId])

  // Debounced billing address update
  useEffect(() => {
    if (page !== 2 || !userId || useSameAddress) return
    if (billingAddressUpdateTimer.current) {
      clearTimeout(billingAddressUpdateTimer.current)
    }
    billingAddressUpdateTimer.current = setTimeout(() => {
      saveBillingAddress()
    }, 1000) // 1 second debounce
    return () => {
      if (billingAddressUpdateTimer.current) {
        clearTimeout(billingAddressUpdateTimer.current)
      }
    }
  }, [saveBillingAddress, useSameAddress, page, userId])

  // Removed unused shippingAddresses - addresses are accessed directly when needed

  // Kargo fiyatını hesapla (örnek: seçilen kargo yöntemine göre)
  useEffect(() => {
    if (selectedShippingMethod) {
      // Kargo yöntemine göre fiyat hesapla (örnek)
      const shippingMethods: Record<string, number> = {
        'standard': 5000, // 50 TL
        'express': 10000, // 100 TL
        'overnight': 15000 // 150 TL
      }
      setShippingCost(shippingMethods[selectedShippingMethod] || 0)
    } else {
      setShippingCost(0)
    }
  }, [selectedShippingMethod])

  return (
    <section className="cart-page">
      <Header />
      <div className="container cart-container">
        {page === 1 ? (
          <>
        <h1>Sepet</h1>
        {loading ? (
          <div className="cart-empty">Yükleniyor...</div>
        ) : items.length === 0 ? (
          <div className="cart-empty">Sepetiniz boş.</div>
        ) : (
              <div>
                {showTabs && (
                  <div className="cart-tabs" style={{ marginBottom: '16px' }}>
                    {uniqueListings.map((listingId, index) => {
                      const listingItems = groupedItems[listingId]
                      const totalQty = listingItems.reduce((sum, it) => sum + it.quantity, 0)
                      return (
                        <button
                          key={listingId}
                          className={`cart-tab ${activeTab === index ? 'active' : ''}`}
                          onClick={() => setActiveTab(index)}
                        >
                          {index + 1}. Ürün {totalQty > 1 && `(${totalQty} adet)`}
                        </button>
                      )
                    })}
                  </div>
                )}
          <div className="cart-grid">
            <div className="cart-list">
                    {currentItems.map((item) => {
                const previewUrl = item.listing.config.previewUrl
                const fullPreviewUrl = previewUrl ? getPreviewUrl(previewUrl) : null
                return (
                <div key={item.id} className="cart-row">
                  <div className="qty-dropdown">
                    <select 
                      id={`qty-${item.id}`}
                      value={item.quantity} 
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value)
                        setQuantity(item, newQty)
                      }}
                      className="qty-select"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  {fullPreviewUrl && (
                    <div className="cart-preview-wrapper">
                      <img 
                        src={fullPreviewUrl} 
                        alt={item.listing.config.name}
                        onError={(e) => {
                          console.error('Preview image failed to load:', fullPreviewUrl)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div className="info">
                    <div className="name">{item.listing.config.name}</div>
                  </div>
                  <div className="row-actions">
                    <button className="icon-delete" title="Kaldır" onClick={() => removeItem(item)}>
                      <svg viewBox="0 0 24 24" className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" style={{ width: '20px', height: '20px' }}>
                        <path d="M3 6h18M9 6V4h6v2m-7 4v10m4-10v10m4-10v10M5 6l1 16h12l1-16" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )})}
            </div>
            <aside className="cart-summary">
              <div className="summary-card">
                <div className="line"><span>Ara Toplam</span><span>{(subtotal/100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                <div className="line small" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Kargo</span>
                  <div className="info-tooltip">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#6b7280', cursor: 'help' }}>
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    <span className="tooltip-text">Kargo ücreti, bir sonraki adımda seçeceğiniz seçeneğe göre toplam ücrete eklenecektir</span>
                  </div>
                </div>
                <div className="divider" />
                <div className="line total"><span>Toplam</span><span>{((subtotal+shipping+taxes)/100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                <div className="coupon">
                  <input placeholder="Kupon kodu" />
                  <button className="apply" disabled>Uygula</button>
                </div>
                <button 
                  className="btn cta" 
                  style={{ width: '100%', marginTop: 12 }} 
                  onClick={() => setPage(2)}
                  disabled={items.length === 0}
                >
                  Ödemeye Geç
                </button>
                  </div>
                </aside>
              </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <button 
                className="btn secondary" 
                onClick={() => setPage(1)}
                style={{ background: '#e5e7eb', color: '#0f0f17', padding: '8px 16px' }}
              >
                ← Geri
              </button>
              <h1>Ödeme</h1>
            </div>
            {loading ? (
              <div className="cart-empty">Yükleniyor...</div>
            ) : items.length === 0 ? (
              <div className="cart-empty">Sepetiniz boş.</div>
            ) : (
              <div className="cart-grid">
                <div className="cart-list" style={{ maxWidth: '100%' }}>
                  <div className="summary-card">
                    <h2 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 600 }}>Address</h2>
                    <div className="addr-select">
                      {/* First name | Last name */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            First name <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input 
                            type="text" 
                            placeholder="First name" 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            Last name <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input 
                            type="text" 
                            placeholder="Last name" 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                      </div>
                      {/* Address | Company */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            Address <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input 
                            type="text" 
                            placeholder="Address" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            Company
                          </label>
                          <input 
                            type="text" 
                            placeholder="Company" 
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                      </div>
                      {/* Postal code | City */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            Postal code <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input 
                            type="text" 
                            placeholder="Postal code" 
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            City <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input 
                            type="text" 
                            placeholder="City" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                      </div>
                      {/* Country | State/Province */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            Country
                          </label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%230f0f17\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
                          >
                            <option value="Türkiye">Türkiye</option>
                          </select>
                        </div>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            State/Province
                          </label>
                          <input 
                            type="text" 
                            placeholder="State/Province" 
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                      </div>
                      {/* Billing address same as shipping address checkbox */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={useSameAddress}
                            onChange={(e) => {
                              setUseSameAddress(e.target.checked)
                              if (e.target.checked && shippingAddressId) {
                                setBillingAddressId(shippingAddressId)
                              }
                            }}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#3b82f6' }}
                          />
                          <span style={{ fontSize: '14px', color: '#0f0f17' }}>Fatura adresim, teslimat adresim ile aynı</span>
                        </label>
                      </div>
                      {/* Email | Phone */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            Email <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                        <div className="addr-field">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                            Phone <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input 
                            type="tel" 
                            placeholder="Phone" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                          />
                        </div>
                      </div>
                      {/* Footer text */}
                      <div style={{ marginTop: '8px', fontSize: '14px', color: '#6b7280' }}>
                        A valid phone number is required due to international shipment.
                      </div>
                      {/* Billing Address Form (shown when checkbox is unchecked) */}
                      {!useSameAddress && (
                        <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e5e7eb' }}>
                          <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: 600, color: '#0f0f17' }}>Fatura Adresi</h3>
                          {/* First name | Last name */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="addr-field">
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                First name <span style={{ color: '#ef4444' }}>*</span>
                              </label>
                              <input 
                                type="text" 
                                placeholder="First name" 
                                value={billingFirstName}
                                onChange={(e) => setBillingFirstName(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                              />
                            </div>
                            <div className="addr-field">
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                Last name <span style={{ color: '#ef4444' }}>*</span>
                              </label>
                              <input 
                                type="text" 
                                placeholder="Last name" 
                                value={billingLastName}
                                onChange={(e) => setBillingLastName(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                              />
                            </div>
                          </div>
                          {/* Address | Company */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="addr-field">
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                Address <span style={{ color: '#ef4444' }}>*</span>
                              </label>
                              <input 
                                type="text" 
                                placeholder="Address" 
                                value={billingAddress}
                                onChange={(e) => setBillingAddress(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                              />
                            </div>
                            <div className="addr-field">
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                Company
                              </label>
                              <input 
                                type="text" 
                                placeholder="Company" 
                                value={billingCompany}
                                onChange={(e) => setBillingCompany(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                              />
                            </div>
                          </div>
                          {/* Postal code | City */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="addr-field">
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                Postal code <span style={{ color: '#ef4444' }}>*</span>
                              </label>
                              <input 
                                type="text" 
                                placeholder="Postal code" 
                                value={billingPostalCode}
                                onChange={(e) => setBillingPostalCode(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                              />
                            </div>
                            <div className="addr-field">
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                City <span style={{ color: '#ef4444' }}>*</span>
                              </label>
                              <input 
                                type="text" 
                                placeholder="City" 
                                value={billingCity}
                                onChange={(e) => setBillingCity(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                              />
                            </div>
                          </div>
                          {/* Country | State/Province */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div className="addr-field">
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                Country
                              </label>
                              <select
                                value={billingCountry}
                                onChange={(e) => setBillingCountry(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%230f0f17\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
                              >
                                <option value="Türkiye">Türkiye</option>
                              </select>
                            </div>
                            <div className="addr-field">
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>
                                State/Province
                              </label>
                              <input 
                                type="text" 
                                placeholder="State/Province" 
                                value={billingState}
                                onChange={(e) => setBillingState(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#0f0f17' }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Kargo Yöntemi */}
                      <div className="addr-field" style={{ marginTop: '24px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#6b7280' }}>Kargo Yöntemi</label>
                        <div className="addr-list" style={{ marginTop: '8px' }}>
                          <div 
                            className={`addr-item ${selectedShippingMethod === 'standard' ? 'selected' : ''}`}
                            onClick={() => {
                              if (selectedShippingMethod === 'standard') {
                                setSelectedShippingMethod('')
                              } else {
                                setSelectedShippingMethod('standard')
                              }
                            }}
                          >
                            <div className="addr-text">
                              <div className="addr-name">Standart Kargo</div>
                              <div className="addr-details">30 Gün İçinde Teslimat</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <aside className="cart-summary">
                  <div className="summary-card">
                    <h2 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Sipariş Özeti</h2>
                    <div style={{ marginBottom: '16px' }}>
                      {items.map((item) => {
                        const previewUrl = item.listing.config.previewUrl
                        const fullPreviewUrl = previewUrl ? getPreviewUrl(previewUrl) : null
                        return (
                          <div key={item.id} style={{ display: 'flex', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
                            {fullPreviewUrl && (
                              <img 
                                src={fullPreviewUrl} 
                                alt={item.listing.config.name}
                                style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '8px', background: '#fff' }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.listing.config.name}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>Adet: {item.quantity}</div>
                              <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px' }}>
                                {((item.quantity * item.listing.priceCents) / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="line"><span>Ara Toplam</span><span>{(subtotal/100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                    <div className="line small" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Kargo</span>
                      <div className="info-tooltip">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#6b7280', cursor: 'help' }}>
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 16v-4M12 8h.01"/>
                        </svg>
                        <span className="tooltip-text">Kargo ücreti, bir sonraki adımda seçeceğiniz seçeneğe göre toplam ücrete eklenecektir</span>
                      </div>
                    </div>
                    <div className="divider" />
                    <div className="line total"><span>Toplam</span><span>{((subtotal+shipping+taxes)/100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span></div>
                    <div className="divider" />
                    <button 
                      className="btn cta" 
                      style={{ width: '100%', marginTop: 12 }} 
                      onClick={checkout} 
                      disabled={!shippingAddressId || items.length===0 || !email || !phone || !selectedShippingMethod || !firstName || !lastName}
                    >
                      Siparişi Tamamla
                    </button>
              </div>
            </aside>
          </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </section>
  )
}


