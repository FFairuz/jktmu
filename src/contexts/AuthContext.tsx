'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthState, LoginCredentials, RegisterData } from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  })

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuthState({
          user,
          isLoading: false,
          error: null
        })
      } catch (error) {
        localStorage.removeItem('user')
        setAuthState({
          user: null,
          isLoading: false,
          error: null
        })
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock validation
      if (credentials.email === 'admin@kompas.com' && credentials.password === 'admin123') {
        const user: User = {
          id: '1',
          name: 'Administrator',
          email: credentials.email,
          avatar: '/images/avatar-placeholder.jpg',
          role: 'admin',
          preferences: {
            categories: ['nasional', 'internasional', 'ekonomi'],
            notifications: true,
            newsletter: true
          },
          createdAt: new Date('2025-01-01'),
          lastLogin: new Date()
        }

        localStorage.setItem('user', JSON.stringify(user))
        setAuthState({
          user,
          isLoading: false,
          error: null
        })
        return true
      } else if (credentials.email === 'user@example.com' && credentials.password === 'user123') {
        const user: User = {
          id: '2',
          name: 'John Doe',
          email: credentials.email,
          role: 'user',
          preferences: {
            categories: ['teknologi', 'olahraga'],
            notifications: false,
            newsletter: true
          },
          createdAt: new Date('2025-09-15'),
          lastLogin: new Date()
        }

        localStorage.setItem('user', JSON.stringify(user))
        setAuthState({
          user,
          isLoading: false,
          error: null
        })
        return true
      } else {
        throw new Error('Email atau password salah')
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login gagal'
      })
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        throw new Error('Password tidak sama')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error('Format email tidak valid')
      }

      // Validate password strength
      if (data.password.length < 6) {
        throw new Error('Password minimal 6 karakter')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const user: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        role: 'user',
        preferences: {
          categories: [],
          notifications: true,
          newsletter: false
        },
        createdAt: new Date(),
        lastLogin: new Date()
      }

      localStorage.setItem('user', JSON.stringify(user))
      setAuthState({
        user,
        isLoading: false,
        error: null
      })
      return true
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Registrasi gagal'
      })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setAuthState({
      user: null,
      isLoading: false,
      error: null
    })
  }

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }))
    }
  }

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
