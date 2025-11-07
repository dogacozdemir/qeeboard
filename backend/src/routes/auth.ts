import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/db'
import { hashPassword, verifyPassword } from '../middleware/auth'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'name, email, password required' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' })
    }

    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({ data: { name, email, password: passwordHash } })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

    return res.status(201).json({ success: true, message: 'Registered', data: { token, user: { id: user.id, name: user.name, email: user.email } } })
  } catch (error) {
    console.error('Register error', error)
    return res.status(500).json({ success: false, message: 'Failed to register' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password required' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const valid = await verifyPassword(password, user.password)
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' })

    return res.json({ success: true, message: 'Logged in', data: { token, user: { id: user.id, name: user.name, email: user.email } } })
  } catch (error) {
    console.error('Login error', error)
    return res.status(500).json({ success: false, message: 'Failed to login' })
  }
})

export { router as authRoutes }
