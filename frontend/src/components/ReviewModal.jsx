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
                color={ratingValue <= currentRating ? "#fbbf24" : "#475569"}
              />
            </label>
          )
        })}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-bg-dark border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up transform transition-all">
        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
          <h2 className="text-xl font-bold text-white tracking-tight">Rate {mechanic.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-700/50 rounded-lg"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
               <span className="text-slate-300 font-bold text-sm">💰 Price Fairness</span>
               {renderStars(priceRating, setPriceRating)}
            </div>
            <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
               <span className="text-slate-300 font-bold text-sm">🚀 Speed of Service</span>
               {renderStars(speedRating, setSpeedRating)}
            </div>
            <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
               <span className="text-slate-300 font-bold text-sm">🛠 Quality of Work</span>
               {renderStars(qualityRating, setQualityRating)}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-bold mb-2">
              Review Comments (optional)
            </label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all resize-none shadow-inner"
              rows={4}
              placeholder="Share details of your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            ></textarea>
            <p className="text-right text-xs text-slate-500 mt-1">{comment.length}/500</p>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 py-2.5 rounded-xl font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-brand-red to-brand-red-light hover:to-orange-400 text-white py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
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
