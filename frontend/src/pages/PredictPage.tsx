import { useState } from 'react'
import api from '../api/axios'
import { Sprout, AlertTriangle, CheckCircle, TrendingUp, Leaf } from 'lucide-react'

const CROPS = ['rice','maize','chickpea','kidneybeans','pigeonpeas','mothbeans','mungbean','blackgram','lentil','pomegranate','banana','mango','grapes','watermelon','muskmelon','apple','orange','papaya','coconut','cotton','jute','coffee']
const SOILS = ['Loamy','Acidic','Alkaline']
const FERTS = ['Urea','DAP','MOP','NPK']

export default function PredictPage() {
  const [form, setForm] = useState({ location: 'Chennai, India', crop_type: 'rice', soil_type: 'Loamy', fertilizer: 'Urea', area: '3', temperature: '', rainfall: '', humidity: '' })
  const [result,  setResult]  = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: any) => {
    e.preventDefault(); setError(''); setLoading(true); setResult(null)
    try {
      const payload: any = { ...form, area: parseFloat(form.area) }
      if (!form.temperature) { delete payload.temperature; delete payload.rainfall; delete payload.humidity }
      else { payload.temperature = parseFloat(form.temperature); payload.rainfall = parseFloat(form.rainfall); payload.humidity = parseFloat(form.humidity) }
      const { data } = await api.post('/predictions/predict', payload)
      setResult(data.result)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Prediction failed. Please try again.')
    } finally { setLoading(false) }
  }

  const catColor = (cat: string) => ({ EXCELLENT: 'text-green-600 bg-green-50', GOOD: 'text-blue-600 bg-blue-50', AVERAGE: 'text-yellow-600 bg-yellow-50', POOR: 'text-red-600 bg-red-50' }[cat] || 'text-gray-600 bg-gray-50')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Predict Crop Yield</h1>
        <p className="text-gray-500 mt-1">Fill in your farm details to get an AI-powered yield prediction.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input className="input-field" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Chennai, India" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <select className="input-field" value={form.crop_type} onChange={e => set('crop_type', e.target.value)}>
                  {CROPS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                <select className="input-field" value={form.soil_type} onChange={e => set('soil_type', e.target.value)}>
                  {SOILS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer</label>
                <select className="input-field" value={form.fertilizer} onChange={e => set('fertilizer', e.target.value)}>
                  {FERTS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area (hectares)</label>
                <input className="input-field" type="number" step="0.1" min="0.1" value={form.area} onChange={e => set('area', e.target.value)} required />
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-3">Weather override (optional — auto-fetched if blank)</p>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-xs text-gray-600 mb-1">Temp (°C)</label>
                  <input className="input-field text-sm" type="number" placeholder="25" value={form.temperature} onChange={e => set('temperature', e.target.value)} /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Rainfall (mm)</label>
                  <input className="input-field text-sm" type="number" placeholder="100" value={form.rainfall} onChange={e => set('rainfall', e.target.value)} /></div>
                <div><label className="block text-xs text-gray-600 mb-1">Humidity (%)</label>
                  <input className="input-field text-sm" type="number" placeholder="70" value={form.humidity} onChange={e => set('humidity', e.target.value)} /></div>
              </div>
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Predicting...</> : <><Sprout size={18} /> Predict Yield</>}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {!result && !loading && (
            <div className="card h-full flex items-center justify-center text-center py-20">
              <div><Sprout className="mx-auto text-green-200 mb-4" size={56} />
                <p className="text-gray-400">Your prediction results will appear here.</p></div>
            </div>
          )}
          {result && (
            <div className="space-y-4">
              <div className="card text-center">
                <div className="text-5xl font-bold text-green-600 mb-1">{result.predicted_yield} <span className="text-2xl text-gray-400">t/ha</span></div>
                <div className="text-gray-500 mb-3">Total: <strong>{result.total_yield} tonnes</strong> on {form.area} ha</div>
                <span className={`inline-block px-4 py-1.5 rounded-full font-bold text-sm ${catColor(result.yield_category)}`}>{result.yield_category} — {result.percentage_of_baseline}% of baseline</span>
              </div>
              {result.insights?.length > 0 && (
                <div className="card">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-blue-500" />Insights</h4>
                  {result.insights.map((i: string, idx: number) => <p key={idx} className="text-sm text-gray-600 mb-1">• {i}</p>)}
                </div>
              )}
              {result.recommendations?.length > 0 && (
                <div className="card">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-green-500" />Recommendations</h4>
                  {result.recommendations.map((r: string, idx: number) => <p key={idx} className="text-sm text-gray-600 mb-1">✓ {r}</p>)}
                </div>
              )}
              {result.risk_factors?.length > 0 && (
                <div className="card border-red-100">
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2"><AlertTriangle size={16} />Risk Factors</h4>
                  {result.risk_factors.map((r: string, idx: number) => <p key={idx} className="text-sm text-red-600 mb-1">⚠ {r}</p>)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
