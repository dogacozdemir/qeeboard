import { Router } from 'express'
import { prisma } from '../lib/db'
import { generatePreview, deletePreview } from '../lib/preview'

const router = Router()

// GET /api/configs - Get all configs (optionally filtered by userId)
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId ? parseInt(String(req.query.userId)) : undefined

    const configs = await prisma.keyboardConfig.findMany({
      where: userId ? { userId } : undefined,
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
        versions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            favorites: true,
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      data: configs
    })
  } catch (error) {
    console.error('Error fetching configs:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configs'
    })
  }
})

// POST /api/configs - Create new config
router.post('/', async (req, res) => {
  try {
    const { userId, name, description, layoutData, previewUrl, tagIds } = req.body

    if (!userId || !name || !layoutData) {
      return res.status(400).json({
        success: false,
        message: 'userId, name, and layoutData are required'
      })
    }

    const config = await prisma.keyboardConfig.create({
      data: {
        userId: parseInt(userId),
        name,
        description,
        layoutData,
        previewUrl,
        tags: tagIds ? {
          create: tagIds.map((tagId: number) => ({
            tagId
          }))
        } : undefined
      },
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
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Config created successfully',
      data: config
    })
  } catch (error: any) {
    console.error('Error creating config:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      meta: error?.meta
    })
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to create config',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    })
  }
})

// GET /api/configs/:id - Get single config
router.get('/:id', async (req, res) => {
  try {
    const configId = parseInt(req.params.id)

    if (isNaN(configId)) {
      return res.status(400).json({
        success: false,
        message: 'Config ID must be a number'
      })
    }

    const config = await prisma.keyboardConfig.findUnique({
      where: { id: configId },
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
        versions: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        favorites: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            favorites: true,
            comments: true
          }
        }
      }
    })

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Config not found'
      })
    }

    res.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Error fetching config:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch config'
    })
  }
})

// PUT /api/configs/:id - Update config
router.put('/:id', async (req, res) => {
  try {
    const configId = parseInt(req.params.id)
    const { name, description, layoutData, previewUrl, tagIds } = req.body

    if (isNaN(configId)) {
      return res.status(400).json({
        success: false,
        message: 'Config ID must be a number'
      })
    }

    // Sadece gönderilen field'ları güncelle
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (layoutData !== undefined) updateData.layoutData = layoutData
    if (previewUrl !== undefined) updateData.previewUrl = previewUrl
    if (tagIds !== undefined) {
      updateData.tags = {
        deleteMany: {},
        create: tagIds.map((tagId: number) => ({
          tagId
        }))
      }
    }

    const config = await prisma.keyboardConfig.update({
      where: { id: configId },
      data: updateData,
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
        }
      }
    })

    res.json({
      success: true,
      message: 'Config updated successfully',
      data: config
    })
  } catch (error: any) {
    console.error('Error updating config:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      meta: error?.meta
    })
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to update config',
      error: process.env.NODE_ENV === 'development' ? error?.message : undefined
    })
  }
})

// DELETE /api/configs/:id - Delete config
router.delete('/:id', async (req, res) => {
  try {
    const configId = parseInt(req.params.id)

    if (isNaN(configId)) {
      return res.status(400).json({
        success: false,
        message: 'Config ID must be a number'
      })
    }

    // Delete preview file if exists
    const config = await prisma.keyboardConfig.findUnique({
      where: { id: configId },
      select: { previewUrl: true }
    })
    if (config?.previewUrl) {
      await deletePreview(config.previewUrl)
    }

    await prisma.keyboardConfig.delete({
      where: { id: configId }
    })

    res.json({
      success: true,
      message: 'Config deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting config:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete config'
    })
  }
})

// POST /api/configs/:id/preview - Generate preview for config
router.post('/:id/preview', async (req, res) => {
  try {
    const configId = parseInt(req.params.id)

    if (isNaN(configId)) {
      return res.status(400).json({
        success: false,
        message: 'Config ID must be a number'
      })
    }

    const config = await prisma.keyboardConfig.findUnique({
      where: { id: configId },
      select: { layoutData: true, previewUrl: true }
    })

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'Config not found'
      })
    }

    // Delete old preview if exists
    if (config.previewUrl) {
      await deletePreview(config.previewUrl)
    }

    // Generate new preview
    const previewUrl = await generatePreview(configId, config.layoutData)

    if (!previewUrl) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate preview'
      })
    }

    // Update config with new preview URL
    await prisma.keyboardConfig.update({
      where: { id: configId },
      data: { previewUrl }
    })
    
    console.log(`Preview URL saved to database for config ${configId}: ${previewUrl}`)

    res.json({
      success: true,
      message: 'Preview generated successfully',
      data: { previewUrl }
    })
  } catch (error) {
    console.error('Error generating preview:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to generate preview'
    })
  }
})

export { router as configRoutes }

