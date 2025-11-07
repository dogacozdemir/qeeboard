import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/comments - Get comments for a config
router.get('/', async (req, res) => {
  try {
    const { configId } = req.query

    if (!configId) {
      return res.status(400).json({
        success: false,
        message: 'Config ID is required'
      })
    }

    const comments = await prisma.configComment.findMany({
      where: { configId: parseInt(configId as string) },
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
      }
    })

    res.json({
      success: true,
      data: comments
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch comments'
    })
  }
})

// POST /api/comments - Add comment
router.post('/', async (req, res) => {
  try {
    const { userId, configId, content, rating } = req.body

    if (!userId || !configId || !content) {
      return res.status(400).json({
        success: false,
        message: 'userId, configId, and content are required'
      })
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    const comment = await prisma.configComment.create({
      data: {
        userId: parseInt(userId),
        configId: parseInt(configId),
        content,
        rating: rating ? parseInt(rating) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        config: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    })
  }
})

// PUT /api/comments/:id - Update comment
router.put('/:id', async (req, res) => {
  try {
    const commentId = parseInt(req.params.id)
    const { content, rating } = req.body

    if (isNaN(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID must be a number'
      })
    }

    const comment = await prisma.configComment.update({
      where: { id: commentId },
      data: {
        content,
        rating
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

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update comment'
    })
  }
})

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', async (req, res) => {
  try {
    const commentId = parseInt(req.params.id)

    if (isNaN(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Comment ID must be a number'
      })
    }

    await prisma.configComment.delete({
      where: { id: commentId }
    })

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    })
  }
})

export { router as commentRoutes }

