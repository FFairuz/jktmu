export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin' | 'editor'
  preferences: {
    categories: string[]
    notifications: boolean
    newsletter: boolean
  }
  createdAt: Date
  lastLogin: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}
