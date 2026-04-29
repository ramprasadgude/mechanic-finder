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

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }))
  }

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
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 md:py-12">
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 font-bold text-2xl hover:opacity-80 transition-opacity cursor-pointer">
            <FaWrench className="text-[#FF6B35]" />
            <span className="text-[#111827] tracking-tight">Mechanic<span className="text-[#FF6B35]">Finder</span></span>
          </Link>
          <p className="text-[#6B7280] text-xs mt-1">Create your secure account</p>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-8">
          <h2 className="text-[#111827] font-bold text-xl mb-6 text-center">Join the Network</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Toggle */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-1 rounded-[8px] flex font-semibold text-xs mb-6">
              <button
                type="button"
                onClick={() => handleRoleSelect('user')}
                className={`flex-1 flex items-center justify-center py-2 rounded-[6px] transition-colors ${formData.role === 'user' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('mechanic')}
                className={`flex-1 flex items-center justify-center py-2 rounded-[6px] transition-colors ${formData.role === 'mechanic' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                Mechanic
              </button>
            </div>

            <div>
              <label className="block text-[#111827] text-xs font-semibold mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35] transition-colors placeholder-[#6B7280]"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-[#111827] text-xs font-semibold mb-1.5">Email Address</label>
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
              <label className="block text-[#111827] text-xs font-semibold mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35] transition-colors placeholder-[#6B7280]"
                placeholder="Min. 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-[#e85b25] disabled:opacity-60 text-white rounded-[8px] h-[38px] mt-4 font-semibold text-sm transition-colors flex items-center justify-center"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
            
          </form>
          
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-[#6B7280] text-xs font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF6B35] hover:underline font-semibold ml-1">
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