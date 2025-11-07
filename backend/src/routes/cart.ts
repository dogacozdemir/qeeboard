import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// Helper to ensure a cart exists for a user
async function getOrCreateCart(userId: number) {
  const existing = await prisma.cart.findUnique({ where: { userId }, include: { items: true } })
  if (existing) return existing
  const created = await prisma.cart.create({ data: { userId } })
  const withItems = await prisma.cart.findUnique({ where: { id: created.id }, include: { items: true } })
  // withItems cannot be null here because we query by created id
  return withItems as NonNullable<typeof withItems>
}

// GET /api/cart?userId=1 - get cart
router.get('/', async (req, res) => {
  try {
    const userId = parseInt(String(req.query.userId))
    if (isNaN(userId)) return res.status(400).json({ success: false, message: 'userId required' })

    const cart = await getOrCreateCart(userId)
    const full = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            listing: { 
              include: { 
                config: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    previewUrl: true,
                    userId: true
                  }
                }, 
                seller: { select: { id: true, name: true } } 
              } 
            }
          }
        }
      }
    })
    res.json({ success: true, data: full })
  } catch (error) {
    console.error('Error fetching cart:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch cart' })
  }
})

// POST /api/cart/items - add item { userId, listingId, quantity }
router.post('/items', async (req, res) => {
  try {
    const { userId, listingId, quantity } = req.body
    if (!userId || !listingId) return res.status(400).json({ success: false, message: 'userId, listingId required' })
    const qty = Math.max(1, parseInt(quantity ?? 1))
    const cart = await getOrCreateCart(parseInt(userId))
    const item = await prisma.cartItem.upsert({
      where: { cartId_listingId: { cartId: cart.id, listingId: parseInt(listingId) } },
      update: { quantity: { increment: qty } },
      create: { cartId: cart.id, listingId: parseInt(listingId), quantity: qty }
    })
    res.status(201).json({ success: true, data: item })
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ success: false, message: 'Failed to add to cart' })
  }
})

// PUT /api/cart/items/:itemId - update quantity { quantity }
router.put('/items/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId)
    const quantity = parseInt(req.body.quantity)
    if (isNaN(itemId) || isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Valid quantity required' })
    }
    const item = await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } })
    res.json({ success: true, data: item })
  } catch (error) {
    console.error('Error updating cart item:', error)
    res.status(500).json({ success: false, message: 'Failed to update cart item' })
  }
})

// DELETE /api/cart/items/:itemId - remove item
router.delete('/items/:itemId', async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId)
    if (isNaN(itemId)) return res.status(400).json({ success: false, message: 'Invalid item id' })
    await prisma.cartItem.delete({ where: { id: itemId } })
    res.json({ success: true, message: 'Item removed' })
  } catch (error) {
    console.error('Error removing cart item:', error)
    res.status(500).json({ success: false, message: 'Failed to remove cart item' })
  }
})

export { router as cartRoutes }


