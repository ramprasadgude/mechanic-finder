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
    <div className="min-h-screen flex items-center justify-center bg-bg-dark px-4">
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center gap-3 font-extrabold text-4xl hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="p-2.5 bg-gradient-to-tr from-brand-red to-brand-red-light rounded-xl">
              <FaWrench className="text-white text-2xl" />
            </div>
            <span className="text-white tracking-tight">Mecha<span className="text-brand-red">Find</span></span>
          </Link>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <h2 className="text-white font-bold text-2xl mb-2 text-center tracking-tight">Welcome Back</h2>
          <p className="text-zinc-400 text-sm text-center mb-8 font-medium">Access your mechanic dashboard and manage your services</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-zinc-300 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all shadow-sm placeholder-zinc-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-zinc-300 text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] focus:shadow-[0_0_15px_rgba(234,0,41,0.2)] placeholder-zinc-600"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-1 pb-2">
              <label className="flex items-center text-zinc-400 text-sm cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-brand-red focus:ring-brand-red focus:ring-offset-bg-panel transition-all accent-brand-red cursor-pointer" />
                <span className="ml-2 font-medium group-hover:text-zinc-300 transition-colors">Remember me</span>
              </label>
              <Link to="#" className="text-sm text-brand-red hover:text-brand-red-light font-bold transition-colors">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-red to-brand-red-light hover:to-orange-400 disabled:opacity-60 text-white rounded-xl py-3.5 mt-4 font-bold text-base transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-zinc-400 text-sm font-medium">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-brand-red hover:text-orange-300 transition-colors font-bold ml-1">
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