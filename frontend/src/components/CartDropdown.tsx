import { useEffect, useState, useRef } from 'react'
import { apiGet, getUserIdFromToken, getPreviewUrl } from '../lib/api'
import { useNavigate } from 'react-router-dom'

type CartItem = {
  id: number
  quantity: number
  listing: {
    id: number
    priceCents: number
    currency: string
    config: {
      id: number
      name: string
      previewUrl?: string
    }
  }
}

export function CartDropdown() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const loadCart = () => {
    const userId = getUserIdFromToken()
    if (!userId) return
    apiGet(`/api/cart?userId=${userId}`).then((res) => {
      const cartItems = res.data?.items ?? []
      setItems(cartItems)
      const totalCents = cartItems.reduce((sum: number, item: CartItem) => sum + (item.listing.priceCents * item.quantity), 0)
      setTotal(totalCents)
    }).catch(console.error)
  }

  // Load cart initially and whenever dropdown opens
  useEffect(() => {
    if (isOpen) {
      loadCart()
    }
  }, [isOpen])

  // Load cart on mount and on window focus so badge stays fresh
  useEffect(() => {
    loadCart()
    const handleFocus = () => loadCart()
    const handleCartUpdated = () => loadCart()
    window.addEventListener('focus', handleFocus)
    window.addEventListener('cartUpdated', handleCartUpdated)
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('cartUpdated', handleCartUpdated)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="cart-dropdown-wrapper" ref={dropdownRef}>
      <button type="button" className="icon-btn cart-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Sepet">
        <svg className="icon" viewBox="0 0 24 24" width="24" height="24" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M7 7h14l-2 9H9L7 7Z" fill="#0f0f17"/>
          <path d="M7 7 6 3H3" stroke="#0f0f17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="10" cy="18" r="2" fill="#0f0f17"/>
          <circle cx="18" cy="18" r="2" fill="#0f0f17"/>
        </svg>
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
      </button>
      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-dropdown-header">
            <h3>Sepetim ({itemCount})</h3>
          </div>
          {items.length === 0 ? (
            <div className="cart-empty">Sepetiniz boş</div>
          ) : (
            <>
              <div className="cart-items">
                {items.map(item => {
                  const previewUrl = item.listing.config.previewUrl
                  const fullPreviewUrl = previewUrl ? getPreviewUrl(previewUrl) : null
                  return (
                  <div key={item.id} className="cart-item">
                    {fullPreviewUrl ? (
                      <img 
                        src={fullPreviewUrl} 
                        alt={item.listing.config.name}
                        onError={(e) => {
                          console.error('Preview image failed to load:', fullPreviewUrl)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div style={{ width: '48px', height: '48px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#6b7280' }}>No preview</span>
                      </div>
                    )}
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.listing.config.name}</div>
                      <div className="cart-item-price">{item.quantity} x {(item.listing.priceCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {item.listing.currency}</div>
                    </div>
                  </div>
                )})}
              </div>
              <div className="cart-dropdown-footer">
                <div className="cart-total">
                  <strong>Toplam: {(total / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</strong>
                </div>
                <button className="btn" onClick={() => { setIsOpen(false); navigate('/cart'); }}>Sepete Git</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

