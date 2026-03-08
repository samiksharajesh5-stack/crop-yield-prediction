import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../api/axios'

interface User { id: number; name: string; email: string; role: string; location?: string }
interface AuthCtx { user: User | null; token: string | null; login: (e: string, p: string) => Promise<void>; register: (n: string, e: string, p: string, l?: string) => Promise<void>; logout: () => void; loading: boolean }

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,    setUser]    = useState<User | null>(null)
  const [token,   setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) { setToken(t); setUser(JSON.parse(u)) }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token); setUser(data.user)
  }

  const register = async (name: string, email: string, password: string, location?: string) => {
    const { data } = await api.post('/auth/register', { name, email, password, location })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token); setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user')
    setToken(null); setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
