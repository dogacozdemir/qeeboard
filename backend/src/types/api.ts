export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface CreateUserRequest {
  email: string
  username: string
  name?: string
  avatar?: string
}

export interface UpdateUserRequest {
  name?: string
  avatar?: string
}

export interface CreateKeyboardConfigRequest {
  title: string
  description?: string
  layoutData: any
  isPublic?: boolean
  isPreset?: boolean
  price?: number
  tags?: string[]
}

export interface UpdateKeyboardConfigRequest {
  title?: string
  description?: string
  layoutData?: any
  isPublic?: boolean
  isPreset?: boolean
  price?: number
  tags?: string[]
}

export interface CreateCommentRequest {
  content: string
  rating?: number
}

export interface CreateTagRequest {
  name: string
  description?: string
  color?: string
}

export interface AnalyticsEventRequest {
  eventType: string
  eventData?: any
}

