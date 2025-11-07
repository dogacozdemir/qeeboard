import React, { useEffect, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { apiGet, getUserIdFromToken, getPreviewUrl } from '@/lib/api'

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

export default function CartDropdown() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  const itemCount = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items])
  const totalCents = useMemo(() => items.reduce((sum, it) => sum + (it.listing.priceCents * it.quantity), 0), [items])

  const loadCart = () => {
    const userId = getUserIdFromToken()
    if (!userId) return
    apiGet(`/api/cart?userId=${userId}`)
      .then((res: any) => {
        const cartItems = res?.data?.items ?? []
        // Debug: Log cart items to see previewUrl
        console.log('Cart items:', cartItems.map((item: any) => ({
          id: item.id,
          configId: item.listing?.config?.id,
          configName: item.listing?.config?.name,
          previewUrl: item.listing?.config?.previewUrl
        })))
        setItems(cartItems)
      })
      .catch((err) => {
        console.error('Error loading cart:', err)
      })
  }

  useEffect(() => {
    if (open) loadCart()
  }, [open])

  useEffect(() => {
    loadCart()
    const onFocus = () => loadCart()
    const onCartUpdated = () => loadCart()
    window.addEventListener('focus', onFocus)
    window.addEventListener('cartUpdated', onCartUpdated)
    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('cartUpdated', onCartUpdated)
    }
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted"
          aria-label="Sepet"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] leading-none h-5 min-w-5 px-1">
              {itemCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b">
          <div className="font-medium">Sepetim ({itemCount})</div>
        </div>
        {items.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">Sepetiniz boş</div>
        ) : (
          <div className="max-h-80 overflow-auto">
            {items.map((item) => {
              const previewUrl = item.listing?.config?.previewUrl
              const fullPreviewUrl = previewUrl ? getPreviewUrl(previewUrl) : null
              
              return (
              <div key={item.id} className="flex items-center gap-3 p-3 border-b last:border-b-0">
                {fullPreviewUrl ? (
                  <img
                    src={fullPreviewUrl}
                    alt={item.listing.config.name}
                    className="h-12 w-12 rounded object-contain bg-muted"
                    onError={(e) => {
                      console.error('Preview image failed to load:', fullPreviewUrl)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No preview</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{item.listing?.config?.name || 'Unknown'}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.quantity} x {(item.listing.priceCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {item.listing.currency}
                  </div>
                </div>
              </div>
            )
            })}
          </div>
        )}
        <div className="p-3 flex items-center justify-between gap-2 border-t">
          <div className="text-sm">
            <span className="font-semibold">Toplam: {(totalCents / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL</span>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setOpen(false)
              try {
                // Navigate to main site's cart if embedded/different origin
                const host = (()=>{ try { return localStorage.getItem('qb_host_origin') } catch { return null } })()
                const defaultHost = (location.port === '8080') ? 'http://localhost:5173' : location.origin
                const base = host || defaultHost
                const target = `${base.replace(/\/$/, '')}/cart`
                if (window.top && window.top !== window) window.top.location.assign(target)
                else window.location.assign(target)
              } catch {
                const fallback = (location.port === '8080') ? 'http://localhost:5173/cart' : '/cart'
                window.location.assign(fallback)
              }
            }}
          >
            Sepete Git
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}



