import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaWrench, FaSignOutAlt, FaUser, FaTachometerAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import NotificationBell from './NotificationBell'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-zinc-800">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-extrabold text-2xl hover:scale-105 transition-transform duration-300">
            <div className="p-2 bg-gradient-to-tr from-brand-red to-brand-red-light rounded-lg">
              <FaWrench className="text-white text-xl" />
            </div>
            <span className="text-white tracking-tight">Mecha<span className="text-brand-red">Find</span></span>
          </Link>



          {/* User/Auth Nav Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
                >
                  <FaTachometerAlt className="text-brand-red text-lg" />
                  Dashboard
                </Link>
                <div className="h-5 w-px bg-zinc-700 rounded-full mx-1"></div>
                
                <NotificationBell user={user} />
                
                <div className="h-5 w-px bg-zinc-700 rounded-full mx-1"></div>
                <span className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                  <div className="p-1.5 bg-zinc-800 rounded-full border border-zinc-700">
                    <FaUser className="text-brand-red text-xs" />
                  </div>
                  {user.name}
                  {user.role === 'admin' && <span className="ml-1 text-xs bg-zinc-700 text-white px-1.5 py-0.5 rounded border border-zinc-600">Admin</span>}
                  {user.role === 'mechanic' && <span className="ml-1 text-xs bg-brand-red text-white px-1.5 py-0.5 rounded">Mechanic</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:border-zinc-500 hover:text-brand-red"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-zinc-300 hover:text-white font-medium transition-colors text-sm tracking-wide px-2 py-1"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all hover:bg-brand-red-light hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(234,0,41,0.39)]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar