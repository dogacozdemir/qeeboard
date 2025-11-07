import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/analytics - Get analytics data
router.get('/', async (req, res) => {
  try {
    const { type } = req.query

    if (type === 'color-usage') {
      const colorUsage = await prisma.analyticsColorUsage.findMany({
        orderBy: {
          count: 'desc'
        }
      })

      res.json({
        success: true,
        data: colorUsage
      })
      return
    }

    if (type === 'event-logs') {
      const eventLogs = await prisma.analyticsEventLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 100
      })

      res.json({
        success: true,
        data: eventLogs
      })
      return
    }

    // Default: get general stats
    const [totalConfigs, totalUsers, totalComments, totalFavorites] = await Promise.all([
      prisma.keyboardConfig.count(),
      prisma.user.count(),
      prisma.configComment.count(),
      prisma.configFavorite.count()
    ])

    res.json({
      success: true,
      data: {
        totalConfigs,
        totalUsers,
        totalComments,
        totalFavorites
      }
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    })
  }
})

// POST /api/analytics/color - Update color usage
router.post('/color', async (req, res) => {
  try {
    const { userId, color } = req.body

    if (!color) {
      return res.status(400).json({
        success: false,
        message: 'Color is required'
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

    // Check if color usage already exists for this user
    const existingColorUsage = await prisma.analyticsColorUsage.findFirst({
      where: {
        userId: userId ? parseInt(userId) : null,
        color
      }
    })

    if (existingColorUsage) {
      // Update existing record
      const updatedUsage = await prisma.analyticsColorUsage.update({
        where: { id: existingColorUsage.id },
        data: {
          count: {
            increment: 1
          }
        }
      })

      res.json({
        success: true,
        message: 'Color usage updated successfully',
        data: updatedUsage
      })
    } else {
      // Create new record
      const newUsage = await prisma.analyticsColorUsage.create({
        data: {
          userId: userId ? parseInt(userId) : null,
          color,
          count: 1
        }
      })

      res.status(201).json({
        success: true,
        message: 'Color usage recorded successfully',
        data: newUsage
      })
    }
  } catch (error) {
    console.error('Error updating color usage:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update color usage'
    })
  }
})

// POST /api/analytics/event - Log analytics event
router.post('/event', async (req, res) => {
  try {
    const { userId, event, metadata } = req.body

    if (!event) {
      return res.status(400).json({
        success: false,
        message: 'Event is required'
      })
    }

    // Validate event types
    const validEvents = [
      'config_created',
      'config_updated',
      'config_deleted',
      'config_viewed',
      'config_favorited',
      'config_unfavorited',
      'comment_added',
      'color_used',
      'user_registered',
      'user_logged_in'
    ]

    if (!validEvents.includes(event)) {
      return res.status(400).json({
        success: false,
        message: `Invalid event type. Valid events: ${validEvents.join(', ')}`
      })
    }

    const eventLog = await prisma.analyticsEventLog.create({
      data: {
        userId: userId ? parseInt(userId) : null,
        event,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Event logged successfully',
      data: eventLog
    })
  } catch (error) {
    console.error('Error logging event:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to log event'
    })
  }
})

export { router as analyticsRoutes }











