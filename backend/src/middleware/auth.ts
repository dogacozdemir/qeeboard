import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash)
}

export interface AuthedRequest extends Request {
  userId?: number
}

export const authGuard = (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const token = header.split(' ')[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number }
    req.userId = payload.userId
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}
