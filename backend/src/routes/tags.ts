import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/tags - Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            configs: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    res.json({
      success: true,
      data: tags
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags'
    })
  }
})

// POST /api/tags - Create new tag
router.post('/', async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'name is required'
      })
    }

    const tag = await prisma.tag.create({
      data: {
        name
      }
    })

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: tag
    })
  } catch (error) {
    console.error('Error creating tag:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create tag'
    })
  }
})

export { router as tagRoutes }

