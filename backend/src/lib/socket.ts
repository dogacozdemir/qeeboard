import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer, Socket } from 'socket.io'
import { prisma } from './db'

// Store active sessions: token -> Set of socket IDs
const activeSessions = new Map<string, Set<string>>()
// Store socket info: socketId -> { token, userId, role }
const socketInfo = new Map<string, { token: string; userId: number | null; role: 'VIEWER' | 'EDITOR' }>()

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:8080'],
      credentials: true,
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  })

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`)

    // Join a share session
    socket.on('share:join', async (data: { token: string; userId?: number }) => {
      try {
        const { token, userId } = data

        // Verify share link exists and is valid
        const shareLink = await prisma.shareLink.findUnique({
          where: { token },
          include: { config: true, owner: true }
        })

        if (!shareLink) {
          socket.emit('share:error', { message: 'Invalid share link' })
          return
        }

        // Check if expired
        if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
          socket.emit('share:error', { message: 'Share link has expired' })
          return
        }

        // Check access: if public, anyone can join; if not, check email access
        if (!shareLink.isPublic) {
          // Not public, require email access
          if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } })
            if (!user) {
              socket.emit('share:error', { message: 'User not found' })
              return
            }

            // Owner always has access
            if (user.id !== shareLink.ownerId) {
              const allowedEmails = shareLink.allowedEmails as string[]
              if (!allowedEmails.includes(user.email)) {
                socket.emit('share:error', { message: 'You do not have access to this share link' })
                return
              }
            }
          } else {
            // Not public and no userId, deny access
            socket.emit('share:error', { message: 'You need to login to access this share link' })
            return
          }
        }
        // If public, anyone can join (no checks needed)

        // Determine role: owner is always EDITOR, others use shareLink.role
        const isOwner = userId === shareLink.ownerId
        const role = isOwner ? 'EDITOR' : shareLink.role

        // Join room
        socket.join(`share:${token}`)
        
        // Store socket info
        socketInfo.set(socket.id, { token, userId: userId || null, role })
        
        // Add to active sessions
        if (!activeSessions.has(token)) {
          activeSessions.set(token, new Set())
        }
        activeSessions.get(token)!.add(socket.id)

        // Send current config state
        const config = shareLink.config
        socket.emit('share:sync', {
          configId: config.id,
          layoutData: config.layoutData,
          role
        })

        // Notify others in the room
        socket.to(`share:${token}`).emit('share:user-joined', {
          socketId: socket.id,
          userId,
          role
        })

        console.log(`[Socket] ${socket.id} joined share:${token} as ${role}`)
      } catch (error) {
        console.error('[Socket] Error in share:join:', error)
        socket.emit('share:error', { message: 'Failed to join share session' })
      }
    })

    // Handle config updates (only from EDITORs)
    socket.on('share:update', async (data: { token: string; layoutData: any }) => {
      try {
        const info = socketInfo.get(socket.id)
        if (!info || info.token !== data.token) {
          socket.emit('share:error', { message: 'Invalid session' })
          return
        }

        if (info.role !== 'EDITOR') {
          socket.emit('share:error', { message: 'You do not have permission to edit' })
          return
        }

        // Verify share link
        const shareLink = await prisma.shareLink.findUnique({
          where: { token: data.token },
          include: { config: true }
        })

        if (!shareLink) {
          socket.emit('share:error', { message: 'Invalid share link' })
          return
        }

        // Update config in database (last write wins)
        // Note: This is already saved by the client's auto-save, but we update here too
        // to ensure consistency in case auto-save fails
        await prisma.keyboardConfig.update({
          where: { id: shareLink.configId },
          data: { layoutData: data.layoutData }
        })

        // Broadcast to all other clients in the room (not including sender to avoid loops)
        socket.to(`share:${data.token}`).emit('share:update', {
          layoutData: data.layoutData,
          updatedBy: info.userId
        })

        console.log(`[Socket] ${socket.id} updated config ${shareLink.configId}`)
      } catch (error) {
        console.error('[Socket] Error in share:update:', error)
        socket.emit('share:error', { message: 'Failed to update config' })
      }
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      const info = socketInfo.get(socket.id)
      if (info) {
        const token = info.token
        const sessions = activeSessions.get(token)
        if (sessions) {
          sessions.delete(socket.id)
          if (sessions.size === 0) {
            activeSessions.delete(token)
          }
        }

        // Notify others
        socket.to(`share:${token}`).emit('share:user-left', {
          socketId: socket.id
        })

        socketInfo.delete(socket.id)
        console.log(`[Socket] ${socket.id} disconnected from share:${token}`)
      } else {
        console.log(`[Socket] ${socket.id} disconnected`)
      }
    })
  })

  return io
}
