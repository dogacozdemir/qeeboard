import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { configRoutes } from './routes/configs'
import { userRoutes } from './routes/users'
import { tagRoutes } from './routes/tags'
import { favoriteRoutes } from './routes/favorites'
import { commentRoutes } from './routes/comments'
import { analyticsRoutes } from './routes/analytics'
import { authRoutes } from './routes/auth'
import { listingRoutes } from './routes/listings'
import { cartRoutes } from './routes/cart'
import { orderRoutes } from './routes/orders'
import { addressRoutes } from './routes/addresses'
import savedColorsRoutes from './routes/saved-colors'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
// Allow multiple origins (5173 frontend, 8080 designer, plus any provided in env)
const defaultOrigins = ['http://localhost:5173', 'http://localhost:8080']
const extraOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...extraOrigins]))

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
// Increase JSON payload limit to 50MB for large image data
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Serve preview images
const previewDir = path.join(process.cwd(), 'uploads', 'previews')
app.use('/api/previews', express.static(previewDir))

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'QeeBoard Backend API is running',
    timestamp: new Date().toISOString()
  })
})

// API Routes
app.use('/api/configs', configRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/listings', listingRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/saved-colors', savedColorsRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🔗 API base: http://localhost:${PORT}/api`)
})
