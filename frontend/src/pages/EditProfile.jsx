import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateUserProfile } from '../services/api'
import { toast } from 'react-toastify'
import { FaUserEdit, FaCheck } from 'react-icons/fa'

const EditProfile = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    availability: true,
    password: '',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        specialization: user.specialization || '',
        experience: user.experience || '',
        availability: user.availability !== undefined ? user.availability : true,
        password: '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = { ...formData }
      if (!updateData.password) delete updateData.password

      const { data } = await updateUserProfile(updateData)
      updateUser(data)
      toast.success('Profile updated successfully!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] py-10 px-4 flex justify-center">
      <div className="w-full max-w-3xl flex flex-col pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FaUserEdit className="text-[#FF6B35]" />
              Edit Profile
            </h1>
            <p className="text-[#6B7280] text-xs mt-1">Configure your personal and professional details</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs font-semibold text-[#6B7280] hover:text-[#111827] bg-white border border-[#E5E7EB] px-4 h-[38px] rounded-[8px] flex items-center justify-center transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-[12px] border border-[#E5E7EB] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">Physical Address / Base Location</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm"
              />
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">New Password (Optional)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm placeholder-[#6B7280]"
                placeholder="Leave blank to keep current password"
                minLength="6"
              />
            </div>

            {user?.role === 'mechanic' && (
              <>
                <div className="pt-6 mt-4 border-t border-[#E5E7EB] space-y-5">
                  <h3 className="font-bold text-[#111827] text-lg">Mechanic Details</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1.5">Specialization</label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm"
                    >
                      <option value="">Select Specialization</option>
                      <option value="General Repair">General Repair</option>
                      <option value="Engine Specialist">Engine Specialist</option>
                      <option value="Transmission">Transmission</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Body Work">Body Work</option>
                      <option value="Tires & Wheels">Tires & Wheels</option>
                      <option value="AC & Cooling">AC & Cooling</option>
                      <option value="Brake Specialist">Brake Specialist</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1.5">Experience (Years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      name="availability"
                      id="availability"
                      checked={formData.availability}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-[#E5E7EB] text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                    />
                    <label htmlFor="availability" className="text-xs font-semibold text-[#111827] cursor-pointer">
                      Available for new requests / jobs?
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="pt-6 mt-6 border-t border-[#E5E7EB] flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF6B35] hover:bg-[#e85b25] disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 h-[38px] px-6 rounded-[8px] transition-colors text-sm"
              >
                {loading ? 'Saving...' : 'Save Changes'} <FaCheck />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
