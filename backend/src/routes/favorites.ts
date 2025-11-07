import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/favorites - Get user's favorites
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      })
    }

    const favorites = await prisma.configFavorite.findMany({
      where: { userId: parseInt(userId as string) },
      include: {
        config: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            tags: {
              include: {
                tag: true
              }
            },
            _count: {
              select: {
                favorites: true,
                comments: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      data: favorites
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    })
  }
})

// POST /api/favorites - Add to favorites
router.post('/', async (req, res) => {
  try {
    const { userId, configId } = req.body

    if (!userId || !configId) {
      return res.status(400).json({
        success: false,
        message: 'userId and configId are required'
      })
    }

    // Check if already favorited
    const existingFavorite = await prisma.configFavorite.findFirst({
      where: {
        userId: parseInt(userId),
        configId: parseInt(configId)
      }
    })

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Config already in favorites'
      })
    }

    const favorite = await prisma.configFavorite.create({
      data: {
        userId: parseInt(userId),
        configId: parseInt(configId)
      },
      include: {
        config: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Added to favorites successfully',
      data: favorite
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add to favorites'
    })
  }
})

// DELETE /api/favorites - Remove from favorites
router.delete('/', async (req, res) => {
  try {
    const { userId, configId } = req.body

    if (!userId || !configId) {
      return res.status(400).json({
        success: false,
        message: 'userId and configId are required'
      })
    }

    const favorite = await prisma.configFavorite.findFirst({
      where: {
        userId: parseInt(userId),
        configId: parseInt(configId)
      }
    })

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      })
    }

    await prisma.configFavorite.delete({
      where: { id: favorite.id }
    })

    res.json({
      success: true,
      message: 'Removed from favorites successfully'
    })
  } catch (error) {
    console.error('Error removing from favorites:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to remove from favorites'
    })
  }
})

export { router as favoriteRoutes }
