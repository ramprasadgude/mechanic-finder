import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaWrench, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'
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

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
            <FaWrench className="text-[#FF6B35]" />
            <span className="text-gray-900 tracking-tight">Mechanic<span className="text-[#FF6B35]">Finder</span></span>
          </Link>

          {/* User/Auth Nav Links */}
          <div className="flex items-center justify-end gap-4 ml-auto">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 text-gray-600 hover:text-[#FF6B35] transition-colors text-sm font-medium"
                >
                  <FaTachometerAlt className="text-gray-400" />
                  Dashboard
                </Link>
                <div className="h-4 w-px bg-gray-200 mx-1"></div>
                
                <NotificationBell user={user} />
                
                <div className="h-4 w-px bg-gray-200 mx-1"></div>
                
                <Link to="/profile" title={user.name} className="flex items-center gap-2 text-gray-900 hover:text-[#FF6B35] transition-colors text-sm font-medium cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF6B35] border border-orange-200 flex items-center justify-center font-bold text-xs uppercase">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden sm:inline-block">{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="w-[38px] h-[38px] flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 rounded-lg text-sm transition-colors hover:text-red-500 ml-1"
                >
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm tracking-wide px-3"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FF6B35] text-white px-5 h-[38px] flex items-center justify-center rounded-lg text-sm font-semibold transition-colors hover:bg-[#e85b25]"
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