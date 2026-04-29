import { useState } from 'react'
import { FaTimes, FaStar } from 'react-icons/fa'

const ReviewModal = ({ request, mechanic, onSubmit, onClose }) => {
  const [priceRating, setPriceRating] = useState(5)
  const [speedRating, setSpeedRating] = useState(5)
  const [qualityRating, setQualityRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      mechanicId: mechanic._id,
      requestId: request._id,
      priceRating,
      speedRating,
      qualityRating,
      comment
    })
  }

  const renderStars = (currentRating, setRatingState) => {
    return (
      <div className="flex justify-center gap-1">
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1
          return (
            <label key={i} className="cursor-pointer">
              <input
                type="radio"
                className="hidden"
                onClick={() => setRatingState(ratingValue)}
              />
              <FaStar
                className="text-2xl transition-colors duration-200"
                color={ratingValue <= currentRating ? "#F97316" : "#E2E8F0"}
              />
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-gray-100 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up transform transition-all">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Rate {mechanic.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-200 rounded-full"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
               <span className="text-gray-700 font-bold text-sm">💰 Price Fairness</span>
               {renderStars(priceRating, setPriceRating)}
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
               <span className="text-gray-700 font-bold text-sm">🚀 Speed of Service</span>
               {renderStars(speedRating, setSpeedRating)}
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
               <span className="text-gray-700 font-bold text-sm">🛠 Quality of Work</span>
               {renderStars(qualityRating, setQualityRating)}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Review Comments (optional)
            </label>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none shadow-sm"
              rows={4}
              placeholder="Share details of your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            ></textarea>
            <p className="text-right text-xs text-gray-500 mt-1">{comment.length}/500</p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all shadow-md hover:-translate-y-0.5"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewModal
