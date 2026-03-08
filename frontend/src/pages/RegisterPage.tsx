import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf } from 'lucide-react'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.location)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Leaf className="text-green-600" size={28} />
          <span className="text-2xl font-bold text-green-800">CropAI</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Create account</h2>
        <p className="text-center text-gray-500 text-sm mb-6">Start predicting crop yields today</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'name',     label: 'Full Name', type: 'text',     ph: 'John Farmer',       required: true  },
            { key: 'email',    label: 'Email',     type: 'email',    ph: 'you@example.com',   required: true  },
            { key: 'password', label: 'Password',  type: 'password', ph: '••••••••',           required: true  },
            { key: 'location', label: 'Location',  type: 'text',     ph: 'Chennai, India',    required: false },
          ].map(({ key, label, type, ph, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}{!required && <span className="text-gray-400 ml-1">(optional)</span>}</label>
              <input type={type} className="input-field" placeholder={ph} required={required}
                value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">Already have an account? <Link to="/login" className="text-green-600 font-medium hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}
