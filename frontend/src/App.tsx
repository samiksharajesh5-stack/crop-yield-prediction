import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './layouts/Layout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import PredictPage from './pages/PredictPage'
import HistoryPage from './pages/HistoryPage'
import AdminPage from './pages/AdminPage'

const PrivateRoute = ({ children }: { children: any }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>
  return user ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }: { children: any }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
          <Route path="/predict"   element={<PrivateRoute><Layout><PredictPage /></Layout></PrivateRoute>} />
          <Route path="/history"   element={<PrivateRoute><Layout><HistoryPage /></Layout></PrivateRoute>} />
          <Route path="/admin"     element={<PrivateRoute><AdminRoute><Layout><AdminPage /></Layout></AdminRoute></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
