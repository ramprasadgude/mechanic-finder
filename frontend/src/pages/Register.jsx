import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaWrench } from 'react-icons/fa'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await registerUser(formData)
      login(data)
      toast.success(`Welcome to MechaFind, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-dark px-4 md:py-12">
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center gap-3 font-extrabold text-4xl hover:scale-105 transition-transform duration-300 mb-4 cursor-pointer">
            <div className="p-2.5 bg-gradient-to-tr from-brand-red to-brand-red-light rounded-xl">
              <FaWrench className="text-white text-2xl" />
            </div>
            <span className="text-white tracking-tight">Mecha<span className="text-brand-red">Find</span></span>
          </Link>
          <p className="text-zinc-500 text-base font-medium">Create your secure account</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-lg">
          <h2 className="text-white font-bold text-2xl mb-8 text-center tracking-tight">Join the Network</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-300 text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all shadow-sm placeholder-zinc-600"
                placeholder="John Doe"
              />
            </div>
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
                minLength={6}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all shadow-sm placeholder-zinc-600"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="block text-zinc-300 text-sm font-semibold mb-2">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all shadow-sm appearance-none"
              >
                <option value="user" className="bg-bg-dark text-white">Regular User</option>
                <option value="mechanic" className="bg-bg-dark text-white">Mechanic</option>
                <option value="admin" className="bg-bg-dark text-white">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-brand-red to-brand-red-light hover:to-orange-400 disabled:opacity-60 text-white rounded-xl py-3.5 mt-6 font-bold text-base transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-zinc-400 text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-red hover:text-orange-300 transition-colors font-bold ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register