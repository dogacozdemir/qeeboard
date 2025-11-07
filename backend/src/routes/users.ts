import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            configs: true,
            favorites: true,
            comments: true
          }
        }
      }
    })

    res.json({
      success: true,
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    })
  }
})

// POST /api/users - Create new user
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'name, email, and password are required'
      })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    })

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    })
  }
})

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id)

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User ID must be a number'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        configs: {
          select: {
            id: true,
            name: true,
            description: true,
            previewUrl: true,
            layoutData: true,
            createdAt: true
          }
        },
        favorites: {
          include: {
            config: {
              select: {
                id: true,
                name: true,
                description: true
              }
            }
          }
        },
        comments: {
          include: {
            config: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            configs: true,
            favorites: true,
            comments: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    })
  }
})

// PUT /api/users/:id - Update user
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id)
    const { name, email } = req.body

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User ID must be a number'
      })
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email
      }
    })

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    })
  }
})

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id)

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User ID must be a number'
      })
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    })
  }
})

export { router as userRoutes }

