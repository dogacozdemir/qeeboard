import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/saved-colors?userId=1 - Get all saved colors for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(req.query.userId as string) : null

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      })
    }

    const savedColors = await prisma.userSavedColor.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        color: true,
        createdAt: true
      }
    })

    res.json({
      success: true,
      data: savedColors.map((sc: { color: string }) => sc.color)
    })
  } catch (error) {
    console.error('Error fetching saved colors:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch saved colors'
    })
  }
})

// POST /api/saved-colors - Save a color for a user
router.post('/', async (req, res) => {
  try {
    const { userId, color } = req.body

    if (!userId || !color) {
      return res.status(400).json({
        success: false,
        message: 'userId and color are required'
      })
    }

    // Validate color format (hex)
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (!colorRegex.test(color)) {
      return res.status(400).json({
        success: false,
        message: 'Color must be a valid hex color (e.g., #FF0000)'
      })
    }

    // Check if color already exists for this user
    const existing = await prisma.userSavedColor.findUnique({
      where: {
        userId_color: {
          userId: parseInt(userId),
          color
        }
      }
    })

    if (existing) {
      return res.json({
        success: true,
        message: 'Color already saved',
        data: { color }
      })
    }

    // Create new saved color
    const savedColor = await prisma.userSavedColor.create({
      data: {
        userId: parseInt(userId),
        color
      },
      select: {
        id: true,
        color: true,
        createdAt: true
      }
    })

    res.status(201).json({
      success: true,
      message: 'Color saved successfully',
      data: { color: savedColor.color }
    })
  } catch (error) {
    console.error('Error saving color:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save color'
    })
  }
})

// DELETE /api/saved-colors - Delete a saved color for a user
router.delete('/', async (req, res) => {
  try {
    const { userId, color } = req.body

    if (!userId || !color) {
      return res.status(400).json({
        success: false,
        message: 'userId and color are required'
      })
    }

    await prisma.userSavedColor.deleteMany({
      where: {
        userId: parseInt(userId),
        color
      }
    })

    res.json({
      success: true,
      message: 'Color deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting color:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete color'
    })
  }
})

export default router

