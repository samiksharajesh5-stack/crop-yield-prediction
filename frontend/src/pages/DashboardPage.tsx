import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { Sprout, TrendingUp, Star, BarChart2 } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData]     = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/analytics').then(r => { setData(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div></div>

  const summary = data?.summary || { total: 0, avgYield: '0', excellent: 0, good: 0 }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-gray-500 mt-1">Here's your crop yield prediction overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Predictions', value: summary.total,              icon: Sprout,   color: 'green' },
          { label: 'Avg Yield (t/ha)',  value: summary.avgYield,           icon: TrendingUp,color: 'blue'  },
          { label: 'Excellent Yields',  value: summary.excellent,          icon: Star,     color: 'yellow'},
          { label: 'Good Yields',       value: summary.good,               icon: BarChart2, color: 'purple'},
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center mb-3`}>
              <Icon className={`text-${color}-600`} size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {summary.total === 0 ? (
        <div className="card text-center py-16">
          <Sprout className="mx-auto text-green-300 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No predictions yet</h3>
          <p className="text-gray-400 mb-4">Make your first crop yield prediction to see analytics here.</p>
          <a href="/predict" className="btn-primary inline-block">Predict Now</a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Monthly Predictions</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.monthlyTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Crop Distribution */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Crop Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={(data?.cropDistribution || []).slice(0, 8)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="crop" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scatter */}
          {data?.scatterData?.filter((d: any) => d.actual)?.length > 0 && (
            <div className="card md:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-4">Predicted vs Actual Yield</h3>
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="predicted" name="Predicted" tick={{ fontSize: 12 }} label={{ value: 'Predicted (t/ha)', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="actual" name="Actual" tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={data.scatterData.filter((d: any) => d.actual)} fill="#16a34a" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
