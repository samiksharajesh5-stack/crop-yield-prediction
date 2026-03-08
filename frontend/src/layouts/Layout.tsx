import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, Sprout, History, ShieldCheck, LogOut, Menu, X, Leaf } from 'lucide-react'

const nav = [
  { to: '/dashboard', label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/predict',   label: 'Predict Yield',  icon: Sprout },
  { to: '/history',   label: 'History',        icon: History },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const links = user?.role === 'admin' ? [...nav, { to: '/admin', label: 'Admin Panel', icon: ShieldCheck }] : nav

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-green-700">
        <Leaf className="text-white" size={28} />
        <span className="text-white font-bold text-xl">CropAI</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === to ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700 hover:text-white'}`}>
            <Icon size={18} />{label}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-green-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-green-900 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-green-300 text-xs truncate">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-green-200 hover:text-white hover:bg-green-700 rounded-lg text-sm transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-green-800 flex-col flex-shrink-0">
        <Sidebar />
      </aside>
      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 bg-green-800 flex flex-col"><Sidebar /></div>
          <div className="flex-1 bg-black bg-opacity-50" onClick={() => setOpen(false)} />
        </div>
      )}
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
          <div className="flex items-center gap-2"><Leaf className="text-green-600" size={22} /><span className="font-bold text-green-800">CropAI</span></div>
          <button onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
