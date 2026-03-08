import { Link } from 'react-router-dom'
import { Leaf, BarChart3, Brain, CloudRain, Shield, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 bg-white shadow-sm">
        <div className="flex items-center gap-2"><Leaf className="text-green-600" size={28} /><span className="font-bold text-xl text-green-800">CropAI</span></div>
        <div className="flex gap-3">
          <Link to="/login"    className="btn-outline text-sm py-2 px-4">Login</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
          <Brain size={16} /> AI-Powered Agricultural Intelligence
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Predict Crop Yields with<br /><span className="text-green-600">Machine Learning</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Make data-driven farming decisions using our RandomForest ML model trained on 2,200 real agricultural records across 22 crop types.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base py-3 px-8">
            Start Predicting <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-outline text-base py-3 px-8">Sign In</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Training Records', value: '2,200' },
            { label: 'Crop Types',       value: '22' },
            { label: 'Model Accuracy',   value: '66.4%' },
            { label: 'MapReduce Jobs',   value: '3' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-5 text-center shadow-sm border border-green-100">
              <div className="text-3xl font-bold text-green-600">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain,      title: 'ML Predictions',   desc: 'RandomForest model with R²=0.664, trained on real agricultural data.' },
            { icon: BarChart3,  title: 'Analytics Dashboard', desc: 'Visualize yield trends, crop distribution, and performance metrics.' },
            { icon: CloudRain,  title: 'Weather Integration', desc: 'Auto-fetch live weather data for your location via OpenWeather API.' },
            { icon: Shield,     title: 'Admin Panel',       desc: 'Manage users, view all predictions, and monitor system health.' },
            { icon: Leaf,       title: 'Hadoop MapReduce',  desc: 'Big data processing across 3 MapReduce jobs for crop and soil analytics.' },
            { icon: ArrowRight, title: 'Actionable Insights', desc: 'Get crop-specific recommendations, risk factors, and farming tips.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Icon className="text-green-600" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center py-8 text-sm text-gray-400 border-t">
        CropAI — Big Data in Agriculture | Sanjay Kanna K J · Sanjay Karthi R P · Samiksha R · Samni T K G · Sandhiya K
      </footer>
    </div>
  )
}
