import { useEffect, useState } from 'react'
import api from '../api/axios'
import { History, Edit2, Check, X } from 'lucide-react'

export default function HistoryPage() {
  const [predictions, setPredictions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editId,  setEditId]  = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')

  useEffect(() => {
    api.get('/predictions').then(r => { setPredictions(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const saveActual = async (id: number) => {
    await api.patch(`/predictions/${id}`, { actual_yield: parseFloat(editVal) })
    setPredictions(ps => ps.map(p => p.id === id ? { ...p, actual_yield: editVal } : p))
    setEditId(null)
  }

  const badgeClass = (cat: string) => ({ EXCELLENT: 'badge-excellent', GOOD: 'badge-good', AVERAGE: 'badge-average', POOR: 'badge-poor' }[cat] || 'bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded-full')

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div></div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Prediction History</h1>
        <p className="text-gray-500 mt-1">All your past crop yield predictions.</p>
      </div>

      {predictions.length === 0 ? (
        <div className="card text-center py-16">
          <History className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400">No predictions yet. Go to Predict Yield to get started.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500 text-xs uppercase tracking-wider">
                {['Date','Location','Crop','Soil','Fertilizer','Area (ha)','Predicted (t/ha)','Category','Actual (t/ha)',''].map(h => (
                  <th key={h} className="px-3 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {predictions.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3 whitespace-nowrap text-gray-500">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-3 py-3">{p.location}</td>
                  <td className="px-3 py-3 capitalize font-medium">{p.crop_type}</td>
                  <td className="px-3 py-3">{p.soil_type}</td>
                  <td className="px-3 py-3">{p.fertilizer}</td>
                  <td className="px-3 py-3">{p.area}</td>
                  <td className="px-3 py-3 font-bold text-green-700">{parseFloat(p.predicted_yield).toFixed(3)}</td>
                  <td className="px-3 py-3"><span className={badgeClass(p.yield_category)}>{p.yield_category}</span></td>
                  <td className="px-3 py-3">
                    {editId === p.id ? (
                      <div className="flex items-center gap-1">
                        <input type="number" step="0.01" className="w-20 border rounded px-2 py-1 text-sm" value={editVal} onChange={e => setEditVal(e.target.value)} autoFocus />
                        <button onClick={() => saveActual(p.id)} className="text-green-600 hover:text-green-800"><Check size={16} /></button>
                        <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                      </div>
                    ) : (
                      <span className={p.actual_yield ? 'text-gray-900 font-medium' : 'text-gray-300'}>
                        {p.actual_yield ? parseFloat(p.actual_yield).toFixed(3) : '—'}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    {editId !== p.id && (
                      <button onClick={() => { setEditId(p.id); setEditVal(p.actual_yield || '') }} className="text-gray-400 hover:text-green-600 transition-colors">
                        <Edit2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
