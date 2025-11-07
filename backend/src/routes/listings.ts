import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/listings - list active listings
router.get('/', async (req, res) => {
  try {
    const listings = await prisma.configListing.findMany({
      where: { isActive: true },
      include: {
        config: {
          select: { id: true, name: true, description: true, previewUrl: true, userId: true }
        },
        seller: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ success: true, data: listings })
  } catch (error) {
    console.error('Error fetching listings:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch listings' })
  }
})

// GET /api/listings/:id - listing detail
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' })
    const listing = await prisma.configListing.findUnique({
      where: { id },
      include: {
        config: {
          include: {
            user: { select: { id: true, name: true } },
            versions: { orderBy: { createdAt: 'desc' }, take: 5 },
            _count: { select: { favorites: true, comments: true } },
            tags: { include: { tag: true } }
          }
        },
        seller: { select: { id: true, name: true } }
      }
    })
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' })
    res.json({ success: true, data: listing })
  } catch (error) {
    console.error('Error fetching listing detail:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch listing detail' })
  }
})

// POST /api/listings - create listing
router.post('/', async (req, res) => {
  try {
    const { configId, sellerId, priceCents, currency, stock, isActive } = req.body
    
    if (!configId || !sellerId || typeof priceCents !== 'number') {
      return res.status(400).json({ success: false, message: 'configId, sellerId, priceCents required' })
    }

    const parsedConfigId = parseInt(configId)
    const parsedSellerId = parseInt(sellerId)

    if (isNaN(parsedConfigId) || isNaN(parsedSellerId)) {
      return res.status(400).json({ success: false, message: 'Invalid configId or sellerId' })
    }

    // Verify config exists
    const config = await prisma.keyboardConfig.findUnique({
      where: { id: parsedConfigId }
    })
    if (!config) {
      return res.status(404).json({ success: false, message: 'Config not found' })
    }

    // Verify seller exists
    const seller = await prisma.user.findUnique({
      where: { id: parsedSellerId }
    })
    if (!seller) {
      return res.status(404).json({ success: false, message: 'Seller not found' })
    }

    // Check if listing already exists for this config and seller
    const existingListing = await prisma.configListing.findFirst({
      where: {
        configId: parsedConfigId,
        sellerId: parsedSellerId,
        isActive: true
      }
    })

    if (existingListing) {
      // Return existing listing instead of creating duplicate
      return res.status(200).json({ success: true, data: existingListing })
    }

    const listing = await prisma.configListing.create({
      data: {
        configId: parsedConfigId,
        sellerId: parsedSellerId,
        priceCents,
        currency: currency || 'USD',
        stock,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      }
    })
    res.status(201).json({ success: true, data: listing })
  } catch (error: any) {
    console.error('Error creating listing:', error)
    // Provide more detailed error message
    const errorMessage = error.message || 'Failed to create listing'
    const statusCode = error.code === 'P2002' ? 409 : 500 // 409 for unique constraint violation
    res.status(statusCode).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
})

// PUT /api/listings/:id - update listing
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' })
    const { priceCents, currency, stock, isActive } = req.body
    const listing = await prisma.configListing.update({
      where: { id },
      data: { priceCents, currency, stock, isActive }
    })
    res.json({ success: true, data: listing })
  } catch (error) {
    console.error('Error updating listing:', error)
    res.status(500).json({ success: false, message: 'Failed to update listing' })
  }
})

// DELETE /api/listings/:id - soft deactivate
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' })
    await prisma.configListing.update({ where: { id }, data: { isActive: false } })
    res.json({ success: true, message: 'Listing deactivated' })
  } catch (error) {
    console.error('Error deleting listing:', error)
    res.status(500).json({ success: false, message: 'Failed to delete listing' })
  }
})

export { router as listingRoutes }


