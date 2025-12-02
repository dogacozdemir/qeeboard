import { Router } from 'express'
import { prisma } from '../lib/db'
import crypto from 'crypto'

const router = Router()

// Generate a random token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// POST /api/shares - Create a new share link
router.post('/', async (req, res) => {
  try {
    const { configId, ownerId, allowedEmails, role, expiresInDays, isPublic } = req.body

    if (!configId || !ownerId) {
      return res.status(400).json({
        success: false,
        message: 'configId and ownerId are required'
      })
    }

    // If not public, require allowedEmails
    if (!isPublic && (!Array.isArray(allowedEmails) || allowedEmails.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'allowedEmails array is required when isPublic is false'
      })
    }

    // Verify config exists and belongs to owner
    const config = await prisma.keyboardConfig.findUnique({
      where: { id: parseInt(configId) },
      include: { user: true }
    })

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Config not found'
      })
    }

    if (config.userId !== parseInt(ownerId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not own this config'
      })
    }

    // Generate unique token
    let token: string
    let exists = true
    while (exists) {
      token = generateToken()
      const existing = await prisma.shareLink.findUnique({ where: { token } })
      exists = !!existing
    }

    // Calculate expiry date if provided
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null

    // Create share link
    const shareLink = await prisma.shareLink.create({
      data: {
        token: token!,
        configId: parseInt(configId),
        ownerId: parseInt(ownerId),
        allowedEmails: allowedEmails || [],
        role: role || 'VIEWER',
        isPublic: isPublic || false,
        visitorCount: 0,
        expiresAt
      },
      include: {
        config: {
          select: {
            id: true,
            name: true,
            previewUrl: true
          }
        },
        owner: {
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
      data: shareLink
    })
  } catch (error) {
    console.error('Error creating share link:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create share link'
    })
  }
})

// GET /api/shares/:token - Get share link info and verify access
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params
    const { userId } = req.query

    const shareLink = await prisma.shareLink.findUnique({
      where: { token },
      include: {
        config: {
          select: {
            id: true,
            name: true,
            description: true,
            previewUrl: true,
            layoutData: true
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!shareLink) {
      return res.status(404).json({
        success: false,
        message: 'Share link not found'
      })
    }

    // Check if expired
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'Share link has expired'
      })
    }

    // Increment visitor count (track unique visits)
    await prisma.shareLink.update({
      where: { token },
      data: { visitorCount: { increment: 1 } }
    })

    // If public, anyone can access
    let hasAccess = shareLink.isPublic
    let userRole: 'VIEWER' | 'EDITOR' = shareLink.role

    // If userId provided, verify access
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId as string) }
      })

      if (user) {
        // Owner is always EDITOR
        if (user.id === shareLink.ownerId) {
          hasAccess = true
          userRole = 'EDITOR'
        } else if (!shareLink.isPublic) {
          // If not public, check allowedEmails
          const allowedEmails = shareLink.allowedEmails as string[]
          hasAccess = allowedEmails.includes(user.email)
        }
      }
    } else if (!shareLink.isPublic) {
      // Not public and no userId, no access
      hasAccess = false
    }

    // Return share link info
    // If no access, return limited info
    if (!hasAccess) {
      return res.json({
        success: true,
        data: {
          token: shareLink.token,
          config: {
            id: shareLink.config.id,
            name: shareLink.config.name,
            previewUrl: shareLink.config.previewUrl
          },
          owner: shareLink.owner,
          hasAccess: false,
          message: shareLink.isPublic 
            ? 'You need to login to access this share'
            : 'You need to login with an allowed email to access this share'
        }
      })
    }

    // Get updated visitor count
    const updatedShareLink = await prisma.shareLink.findUnique({
      where: { token },
      select: { visitorCount: true }
    })

    // Full access
    res.json({
      success: true,
      data: {
        ...shareLink,
        visitorCount: updatedShareLink?.visitorCount || shareLink.visitorCount,
        hasAccess: true,
        userRole
      }
    })
  } catch (error) {
    console.error('Error fetching share link:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch share link'
    })
  }
})

// GET /api/shares?configId=X&ownerId=Y - Get all share links for a config
router.get('/', async (req, res) => {
  try {
    const { configId, ownerId } = req.query

    if (!configId || !ownerId) {
      return res.status(400).json({
        success: false,
        message: 'configId and ownerId are required'
      })
    }

    const shareLinks = await prisma.shareLink.findMany({
      where: {
        configId: parseInt(configId as string),
        ownerId: parseInt(ownerId as string)
      },
      include: {
        config: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      data: shareLinks
    })
  } catch (error) {
    console.error('Error fetching share links:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch share links'
    })
  }
})

// PATCH /api/shares/:token - Update share link (toggle isPublic, update allowedEmails, update role)
router.patch('/:token', async (req, res) => {
  try {
    const { token } = req.params
    const { ownerId, isPublic, allowedEmails, role } = req.body

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: 'ownerId is required'
      })
    }

    const shareLink = await prisma.shareLink.findUnique({
      where: { token }
    })

    if (!shareLink) {
      return res.status(404).json({
        success: false,
        message: 'Share link not found'
      })
    }

    if (shareLink.ownerId !== parseInt(ownerId)) {
      return res.status(403).json({
        success: false,
        message: 'You do not own this share link'
      })
    }

    const updateData: any = {}
    if (isPublic !== undefined) updateData.isPublic = isPublic
    if (allowedEmails !== undefined) {
      if (!isPublic && (!Array.isArray(allowedEmails) || allowedEmails.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'allowedEmails array is required when isPublic is false'
        })
      }
      updateData.allowedEmails = allowedEmails
    }
    if (role !== undefined) {
      if (role !== 'VIEWER' && role !== 'EDITOR') {
        return res.status(400).json({
          success: false,
          message: 'role must be either VIEWER or EDITOR'
        })
      }
      updateData.role = role
    }

    const updated = await prisma.shareLink.update({
      where: { token },
      data: updateData,
      include: {
        config: {
          select: {
            id: true,
            name: true,
            previewUrl: true
          }
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: updated
    })
  } catch (error) {
    console.error('Error updating share link:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update share link'
    })
  }
})

// DELETE /api/shares/:token - Delete a share link
router.delete('/:token', async (req, res) => {
  try {
    const { token } = req.params
    const { ownerId } = req.query

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: 'ownerId is required'
      })
    }

    const shareLink = await prisma.shareLink.findUnique({
      where: { token }
    })

    if (!shareLink) {
      return res.status(404).json({
        success: false,
        message: 'Share link not found'
      })
    }

    if (shareLink.ownerId !== parseInt(ownerId as string)) {
      return res.status(403).json({
        success: false,
        message: 'You do not own this share link'
      })
    }

    await prisma.shareLink.delete({
      where: { token }
    })

    res.json({
      success: true,
      message: 'Share link deleted'
    })
  } catch (error) {
    console.error('Error deleting share link:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete share link'
    })
  }
})

export { router as shareRoutes }
