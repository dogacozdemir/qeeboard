import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/orders?userId=1 - list user orders
router.get('/', async (req, res) => {
  try {
    const userId = parseInt(String(req.query.userId))
    if (isNaN(userId)) return res.status(400).json({ success: false, message: 'userId required' })
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { listing: { include: { config: true } } } }, shippingAddr: true, billingAddr: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: orders })
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch orders' })
  }
})

// GET /api/orders/:id - get single order
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' })
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { listing: { include: { config: true } } } }, shippingAddr: true, billingAddr: true }
    })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, data: order })
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch order' })
  }
})

// POST /api/orders/checkout - create order from cart (no payment)
// body: { userId, shippingAddressId?, billingAddressId? }
router.post('/checkout', async (req, res) => {
  try {
    const { userId, shippingAddressId, billingAddressId } = req.body
    if (!userId) return res.status(400).json({ success: false, message: 'userId required' })

    const cart = await prisma.cart.findUnique({
      where: { userId: parseInt(userId) },
      include: { items: { include: { listing: true } } }
    })
    if (!cart || cart.items.length === 0) return res.status(400).json({ success: false, message: 'Cart is empty' })

    // compute totals
    let totalCents = 0
    const itemsData = cart.items.map((ci) => {
      const subtotal = ci.quantity * ci.listing.priceCents
      totalCents += subtotal
      return {
        listingId: ci.listingId,
        quantity: ci.quantity,
        unitPriceCents: ci.listing.priceCents,
        subtotalCents: subtotal
      }
    })

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: parseInt(userId),
          totalCents,
          currency: cart.items[0]?.listing.currency || 'USD',
          shippingAddressId: shippingAddressId ? parseInt(shippingAddressId) : null,
          billingAddressId: billingAddressId ? parseInt(billingAddressId) : null,
          items: { createMany: { data: itemsData } }
        },
        include: { items: true }
      })
      // clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
      return created
    })

    res.status(201).json({ success: true, data: order })
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ success: false, message: 'Failed to create order' })
  }
})

export { router as orderRoutes }



