import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="text-green-600" size={28} />
          <span className="text-2xl font-bold text-green-800">CropAI</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Welcome back</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Sign in to your account</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required /></div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">Don't have an account? <Link to="/register" className="text-green-600 font-medium hover:underline">Register</Link></p>
      </div>
    </div>
  )
}
