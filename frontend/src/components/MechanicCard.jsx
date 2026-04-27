import { useState } from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaStar, FaTools, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const MechanicCard = ({ mechanic, onEdit, onDelete, onRequest, currentUser, onApprove }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const handleToggleReviews = async () => {
    if (!showReviews && reviews.length === 0) {
        setLoadingReviews(true);
        try {
            const { getMechanicReviews } = await import('../services/api');
            const { data } = await getMechanicReviews(mechanic._id);
            setReviews(data);
        } catch(e) {
            console.error(e);
        } finally {
            setLoadingReviews(false);
        }
    }
    setShowReviews(!showReviews);
  }

  const canModify =
    currentUser &&
    (currentUser._id === mechanic.user?._id ||
      currentUser._id === mechanic.user ||
      currentUser.role === 'admin')

  return (
    <div className="bg-zinc-900/90 hover:bg-zinc-800/90 rounded-2xl p-6 flex flex-col h-full border border-zinc-800 transition-transform duration-300 hover:-translate-y-1 group">
      {/* Header section */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-extrabold text-xl group-hover:text-brand-red transition-colors flex items-center gap-2">
            {mechanic.name}
            {mechanic.isApproved && (
              <span title="Admin Verified Professional" className="text-blue-400 text-sm flex items-center shadow-blue-500/20 drop-shadow-md">
                <FaCheckCircle />
              </span>
            )}
          </h3>
          <span className="inline-flex items-center gap-1.5 text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-md mt-2 font-medium">
            <FaTools className="text-xs text-brand-red" />
            {mechanic.specialty}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md font-bold ${
            mechanic.available
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {mechanic.available ? <FaCheckCircle /> : <FaTimesCircle />}
            {mechanic.available ? 'Ready' : 'Busy'}
          </span>
          <div className="flex items-center text-brand-red bg-brand-red/10 px-2 py-0.5 rounded border border-brand-red/20 shadow-sm mt-1">
            <FaStar className="flex-shrink-0 text-xs mr-1" />
            <span className="font-bold text-sm">{mechanic.rating || 'New'}</span>
            <span className="text-xs text-brand-red/80 ml-1">({mechanic.numOfReviews || 0})</span>
          </div>
        </div>
      </div>

      {/* Info List */}
      <div className="space-y-2.5 mb-5 p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/50">
        <p className="flex justify-between items-center text-zinc-300 text-sm font-medium">
          <span className="flex items-center text-zinc-500"><FaMapMarkerAlt className="mr-2 text-zinc-600" /> Location</span>
          <span className="text-white text-right max-w-[60%] truncate" title={mechanic.location}>{mechanic.location}</span>
        </p>
        <p className="flex justify-between items-center text-zinc-300 text-sm font-medium">
          <span className="flex items-center text-zinc-500"><FaTools className="mr-2 text-zinc-600" /> Experience</span>
          <span className="text-white text-right">{mechanic.experience} Years</span>
        </p>
        <p className="flex justify-between items-center text-zinc-300 text-sm font-medium break-all">
          <span className="flex items-center text-zinc-500"><FaPhoneAlt className="mr-2 text-zinc-600" /> Phone</span>
          <span className="text-white text-right">{mechanic.phone}</span>
        </p>
      </div>

      {/* Description */}
      {mechanic.description && (
        <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{mechanic.description}</p>
      )}
      {!mechanic.description && <div className="flex-grow mb-6"></div>}

      {/* Action Buttons */}
      <div className="mt-auto space-y-3">
        {currentUser?.role === 'user' && mechanic.available && (
          <div className="flex justify-between gap-3">
            {mechanic.phone && (
              <a 
                href={`tel:${mechanic.phone}`}
                className="flex-[0.8] flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2.5 rounded-lg font-bold text-sm transition-all"
              >
                <FaPhoneAlt className="text-brand-red" /> Call
              </a>
            )}
            {onRequest && (
              <button
                onClick={() => onRequest(mechanic)}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-red text-white hover:bg-brand-red-light border border-transparent px-4 py-2.5 rounded-lg font-bold text-sm transition-all"
              >
                <FaTools /> Request
              </button>
            )}
          </div>
        )}
        
        {canModify && (
          <div className="flex gap-3 pt-3 border-t border-zinc-800">
            <button
              onClick={() => onEdit(mechanic)}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium border border-zinc-700 transition-colors"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => onDelete(mechanic._id)}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-red-900/40 text-red-400 border border-zinc-700 hover:border-red-800/60 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Admin Quick Action */}
      {currentUser?.role === 'admin' && onApprove && (
        <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className={`text-xs font-bold ${mechanic.isApproved ? 'text-green-400' : 'text-orange-400'}`}>
            Status: {mechanic.isApproved ? 'Approved' : 'Pending'}
          </span>
          <button
            onClick={() => onApprove(mechanic._id, !mechanic.isApproved)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              mechanic.isApproved 
                ? 'bg-zinc-900 text-red-400 border-red-500/30 hover:bg-red-500/10' 
                : 'bg-green-600/20 text-green-400 border-green-500/50 hover:bg-green-600/30'
            }`}
          >
            {mechanic.isApproved ? 'Revoke' : 'Approve'}
          </button>
        </div>
      )}

      {/* Reviews Toggle */}
      {mechanic.numOfReviews > 0 && (
         <div className="mt-4 border-t border-zinc-800 pt-3">
           <button onClick={handleToggleReviews} className="text-xs text-zinc-400 hover:text-white font-medium flex items-center justify-center w-full transition-colors">
             {showReviews ? <FaChevronUp className="mr-1"/> : <FaChevronDown className="mr-1"/>}
             {showReviews ? 'Hide Reviews' : `View ${mechanic.numOfReviews} Review${mechanic.numOfReviews > 1 ? 's' : ''}`}
           </button>
           
           {showReviews && (
             <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
               {loadingReviews ? (
                 <div className="text-center text-zinc-500 text-xs py-2 animate-pulse">Loading reviews...</div>
               ) : reviews.length === 0 ? (
                 <div className="text-center text-zinc-500 text-xs py-2">No reviews found.</div>
               ) : (
                 reviews.map(r => (
                   <div key={r._id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800/50">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-bold text-zinc-300">{r.user?.name || 'User'}</span>
                       <div className="flex items-center text-[10px] text-brand-red font-bold bg-brand-red/10 px-1.5 py-0.5 rounded border border-brand-red/20">
                          <FaStar className="mr-0.5"/> {r.rating}
                       </div>
                     </div>

                     {/* Sub-ratings visualizer */}
                     {(r.priceRating || r.speedRating || r.qualityRating) && (
                       <div className="flex gap-2 mt-2 mb-2 border-b border-zinc-800/50 pb-2">
                         {r.priceRating && <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400" title="Price Fairness">💰 {r.priceRating}</span>}
                         {r.speedRating && <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400" title="Speed of Service">🚀 {r.speedRating}</span>}
                         {r.qualityRating && <span className="text-[10px] bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-400" title="Quality of Work">🛠 {r.qualityRating}</span>}
                       </div>
                     )}

                     {r.comment && <p className="text-xs text-zinc-400 mt-1">{r.comment}</p>}
                   </div>
                 ))
               )}
             </div>
           )}
         </div>
      )}
    </div>
  )
}

export default MechanicCard