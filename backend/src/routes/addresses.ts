import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/addresses?userId=1
router.get('/', async (req, res) => {
  try {
    const userId = parseInt(String(req.query.userId))
    if (isNaN(userId)) return res.status(400).json({ success: false, message: 'userId required' })
    const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
    res.json({ success: true, data: addresses })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch addresses' })
  }
})

// POST /api/addresses
router.post('/', async (req, res) => {
  try {
    const { userId, kind, fullName, line1, line2, city, state, postalCode, country, phone } = req.body
    if (!userId || !kind || !fullName || !line1 || !city || !postalCode || !country) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }
    const address = await prisma.address.create({
      data: {
        userId: parseInt(userId),
        kind,
        fullName,
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
        phone
      }
    })
    res.status(201).json({ success: true, data: address })
  } catch (error) {
    console.error('Error creating address:', error)
    res.status(500).json({ success: false, message: 'Failed to create address' })
  }
})

// PUT /api/addresses/:id
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' })
    const { kind, fullName, line1, line2, city, state, postalCode, country, phone } = req.body
    const address = await prisma.address.update({
      where: { id },
      data: { kind, fullName, line1, line2, city, state, postalCode, country, phone }
    })
    res.json({ success: true, data: address })
  } catch (error) {
    console.error('Error updating address:', error)
    res.status(500).json({ success: false, message: 'Failed to update address' })
  }
})

// DELETE /api/addresses/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid id' })
    await prisma.address.delete({ where: { id } })
    res.json({ success: true, message: 'Address deleted' })
  } catch (error) {
    console.error('Error deleting address:', error)
    res.status(500).json({ success: false, message: 'Failed to delete address' })
  }
})

export { router as addressRoutes }



