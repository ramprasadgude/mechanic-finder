/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'

const SPECIALTIES = [
  'General Repair',
  'Engine Specialist',
  'Transmission',
  'Electrical',
  'Body Work',
  'Tires & Wheels',
  'AC & Cooling',
  'Brake Specialist',
]

const MechanicForm = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'General Repair',
    location: '',
    phone: '',
    experience: '',
    rating: '',
    available: true,
    description: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        specialty: initialData.specialty || 'General Repair',
        location: initialData.location || '',
        phone: initialData.phone || '',
        experience: initialData.experience || '',
        rating: initialData.rating || '',
        available: initialData.available ?? true,
        description: initialData.description || '',
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-gray-900 font-extrabold text-xl">
            {initialData ? 'Edit Mechanic' : 'Add New Mechanic'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5">Specialty *</label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              placeholder="Chennai, Tamil Nadu"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5">Phone *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              placeholder="+91 9876543210"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">Experience (years) *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-1.5">Rating (0–5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                placeholder="4.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none"
              placeholder="Brief description about the mechanic..."
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="available"
              id="available"
              checked={formData.available}
              onChange={handleChange}
              className="accent-blue-600 w-4 h-4 rounded border-gray-300"
            />
            <label htmlFor="available" className="text-gray-700 text-sm font-semibold">Currently Available</label>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-3.5 text-sm font-bold transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 text-sm font-bold transition-all shadow-md hover:-translate-y-0.5"
            >
              {initialData ? 'Update Mechanic' : 'Add Mechanic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MechanicForm