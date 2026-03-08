import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api/axios'
import { Users, BarChart2, Trash2, ShieldCheck, User } from 'lucide-react'

export default function AdminPage() {
  const [tab,         setTab]         = useState<'analytics'|'users'|'predictions'>('analytics')
  const [analytics,   setAnalytics]   = useState<any>(null)
  const [users,       setUsers]       = useState<any[]>([])
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/users'),
      api.get('/admin/predictions'),
    ]).then(([a, u, p]) => {
      setAnalytics(a.data); setUsers(u.data); setPredictions(p.data); setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return
    await api.delete(`/admin/users/${id}`)
    setUsers(us => us.filter(u => u.id !== id))
  }

  const toggleRole = async (id: number, role: string) => {
    const newRole = role === 'admin' ? 'user' : 'admin'
    await api.patch(`/admin/users/${id}/role`, { role: newRole })
    setUsers(us => us.map(u => u.id === id ? { ...u, role: newRole } : u))
  }

  const deletePred = async (id: number) => {
    if (!confirm('Delete this prediction?')) return
    await api.delete(`/admin/predictions/${id}`)
    setPredictions(ps => ps.filter(p => p.id !== id))
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div></div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage users, predictions and system analytics.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Users',       value: users.length,                    icon: Users },
          { label: 'Total Predictions', value: predictions.length,              icon: BarChart2 },
          { label: 'Avg Yield (t/ha)',  value: analytics?.overview?.avgYield || '0', icon: BarChart2 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card">
            <Icon className="text-green-500 mb-2" size={20} />
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['analytics','users','predictions'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'analytics' && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Crop Distribution (All Users)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={(analytics?.cropDistribution || []).slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'users' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500 text-xs uppercase">
                {['ID','Name','Email','Role','Location','Joined','Actions'].map(h => <th key={h} className="px-3 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-3 text-gray-400">{u.id}</td>
                  <td className="px-3 py-3 font-medium">{u.name}</td>
                  <td className="px-3 py-3 text-gray-500">{u.email}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-500">{u.location || '—'}</td>
                  <td className="px-3 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleRole(u.id, u.role)} title="Toggle role" className="text-purple-400 hover:text-purple-700 transition-colors">
                        {u.role === 'admin' ? <User size={16} /> : <ShieldCheck size={16} />}
                      </button>
                      <button onClick={() => deleteUser(u.id)} className="text-red-400 hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'predictions' && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500 text-xs uppercase">
                {['ID','User','Location','Crop','Predicted (t/ha)','Category','Date',''].map(h => <th key={h} className="px-3 py-3">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {predictions.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-3 text-gray-400">{p.id}</td>
                  <td className="px-3 py-3">{p.user_id}</td>
                  <td className="px-3 py-3">{p.location}</td>
                  <td className="px-3 py-3 capitalize">{p.crop_type}</td>
                  <td className="px-3 py-3 font-bold text-green-700">{parseFloat(p.predicted_yield).toFixed(3)}</td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${{EXCELLENT:'bg-green-100 text-green-700',GOOD:'bg-blue-100 text-blue-700',AVERAGE:'bg-yellow-100 text-yellow-700',POOR:'bg-red-100 text-red-700'}[p.yield_category] || 'bg-gray-100 text-gray-600'}`}>{p.yield_category}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-400">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-3"><button onClick={() => deletePred(p.id)} className="text-red-400 hover:text-red-700 transition-colors"><Trash2 size={15} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
