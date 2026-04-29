import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaWrench } from 'react-icons/fa'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await loginUser(formData)
      login(data)
      toast.success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 font-bold text-2xl hover:opacity-80 transition-opacity cursor-pointer">
            <FaWrench className="text-[#FF6B35]" />
            <span className="text-[#111827] tracking-tight">Mechanic<span className="text-[#FF6B35]">Finder</span></span>
          </Link>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-8">
          <h2 className="text-[#111827] font-bold text-xl mb-1 text-center">Welcome Back</h2>
          <p className="text-[#6B7280] text-xs text-center mb-6">Sign in to your account to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#111827] text-xs font-semibold mb-1.5 cursor-pointer">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35] transition-colors placeholder-[#6B7280]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[#111827] text-xs font-semibold mb-1.5 cursor-pointer">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35] transition-colors placeholder-[#6B7280]"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-[#6B7280] text-xs cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#E5E7EB] bg-white accent-[#FF6B35] cursor-pointer" />
                <span className="ml-2 font-medium">Remember me</span>
              </label>
              <Link to="#" className="text-xs text-[#FF6B35] hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-[#e85b25] disabled:opacity-60 text-white rounded-[8px] h-[38px] mt-4 font-semibold text-sm transition-colors flex items-center justify-center"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-[#6B7280] text-xs font-medium">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-[#FF6B35] hover:underline font-semibold ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login