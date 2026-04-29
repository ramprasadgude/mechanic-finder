import { useState } from 'react'
import { FaMapMarkerAlt, FaStar, FaTools, FaCheckCircle, FaTimesCircle, FaChevronDown, FaChevronUp, FaPhoneAlt, FaTrash, FaEdit } from 'react-icons/fa'

const MechanicCard = ({ mechanic, onEdit, onDelete, onRequest, currentUser, onApprove, isPopular }) => {
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

  const getInitials = (name) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <div className={`bg-white rounded-[12px] p-6 flex flex-col h-full border ${isPopular ? 'border-blue-500' : 'border-[#E5E7EB]'} relative`}>
      
      {isPopular && (
        <span className="absolute -top-3 left-6 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}

      {/* Header section */}
      <div className="flex items-start gap-4 mb-5">
        
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold text-xl border border-orange-200 shrink-0">
          {getInitials(mechanic.name)}
        </div>

        <div className="flex-1">
          <h3 className="text-[#111827] font-bold text-lg leading-tight flex items-center gap-1.5 break-all">
            {mechanic.name}
            {mechanic.isApproved && (
              <span title="Admin Verified" className="text-blue-500 text-sm">
                <FaCheckCircle />
              </span>
            )}
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              mechanic.available
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {mechanic.available ? '● Open' : '● Closed'}
            </span>
            <div className="flex items-center text-[#111827] text-sm font-semibold">
              <FaStar className="text-yellow-400 mr-1 text-sm" />
              {mechanic.rating || 'New'}
              <span className="text-[#6B7280] font-normal ml-1">({mechanic.numOfReviews || 0})</span>
            </div>
          </div>
        </div>
        
        <div className="text-right shrink-0 flex flex-col items-end justify-start h-full">
          {/* Price Layout Mockup */}
          <span className="text-[#111827] font-bold text-lg">₹{mechanic.pricePerHour || "499"}</span>
          <span className="text-[#6B7280] text-[10px] uppercase font-semibold">/ hour</span>
        </div>

      </div>

      {/* Info List */}
      <div className="space-y-3 mb-5">
        
        <div className="flex items-start justify-between text-sm">
           <span className="text-[#6B7280] flex items-center gap-2"><FaMapMarkerAlt /> Location:</span>
           <span className="text-[#111827] font-medium text-right ml-2 break-words max-w-[60%]">{mechanic.location}</span>
        </div>
        <div className="flex items-start justify-between text-sm">
           <span className="text-[#6B7280] flex items-center gap-2"><FaTools /> Specializes in:</span>
           <span className="flex flex-wrap justify-end gap-1 ml-2">
             <span className="bg-[#F9FAFB] text-[#111827] text-[10px] font-semibold border border-[#E5E7EB] px-2 py-1 rounded-md">{mechanic.specialty}</span>
             {mechanic.experience && <span className="bg-[#F9FAFB] text-[#111827] text-[10px] font-semibold border border-[#E5E7EB] px-2 py-1 rounded-md">{mechanic.experience} Yrs</span>}
           </span>
        </div>

      </div>

      {/* Description */}
      {mechanic.description && (
        <p className="text-[#6B7280] text-sm mb-6 line-clamp-2 leading-relaxed flex-grow border-t border-[#E5E7EB] pt-4">{mechanic.description}</p>
      )}
      {!mechanic.description && <div className="flex-grow mb-6 border-t border-[#E5E7EB] pt-4"></div>}

      {/* Action Buttons */}
      <div className="mt-auto space-y-3">
        {currentUser?.role === 'user' && mechanic.available && (
          <div className="flex justify-between gap-3">
            {mechanic.phone && (
              <a 
                href={`tel:${mechanic.phone}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F9FAFB] hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] h-[38px] rounded-[8px] font-semibold text-sm transition-colors"
              >
                <FaPhoneAlt className="text-[#FF6B35]" /> Call
              </a>
            )}
            {onRequest && (
              <button
                onClick={() => onRequest(mechanic)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 h-[38px] rounded-[8px] font-semibold text-sm transition-colors"
              >
                Book
              </button>
            )}
          </div>
        )}
        
        {canModify && (
          <div className="flex gap-3">
            <button
              onClick={() => onEdit(mechanic)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#F9FAFB] hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] h-[38px] rounded-[8px] font-semibold text-sm transition-colors"
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => onDelete(mechanic._id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 h-[38px] rounded-[8px] font-semibold text-sm transition-colors"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Admin Quick Action */}
      {currentUser?.role === 'admin' && onApprove && (
        <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <span className={`text-xs font-bold ${mechanic.isApproved ? 'text-green-600' : 'text-orange-500'}`}>
            Status: {mechanic.isApproved ? 'Approved' : 'Pending'}
          </span>
          <button
            onClick={() => onApprove(mechanic._id, !mechanic.isApproved)}
            className={`h-[32px] px-3 rounded-lg text-xs font-bold transition-all border ${
              mechanic.isApproved 
                ? 'bg-white text-red-600 border-red-200 hover:bg-red-50' 
                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
            }`}
          >
            {mechanic.isApproved ? 'Revoke' : 'Approve'}
          </button>
        </div>
      )}

      {/* Reviews Toggle */}
      {mechanic.numOfReviews > 0 && (
         <div className="mt-4 border-t border-[#E5E7EB] pt-3">
           <button onClick={handleToggleReviews} className="text-xs text-[#6B7280] hover:text-[#111827] font-medium flex items-center justify-center w-full transition-colors">
             {showReviews ? <FaChevronUp className="mr-1"/> : <FaChevronDown className="mr-1"/>}
             {showReviews ? 'Hide Reviews' : `View ${mechanic.numOfReviews} Review${mechanic.numOfReviews > 1 ? 's' : ''}`}
           </button>
           
           {showReviews && (
             <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
               {loadingReviews ? (
                 <div className="text-center text-[#6B7280] text-xs py-2">Loading reviews...</div>
               ) : reviews.length === 0 ? (
                 <div className="text-center text-[#6B7280] text-xs py-2">No reviews found.</div>
               ) : (
                 reviews.map(r => (
                   <div key={r._id} className="bg-[#F9FAFB] p-3 rounded-[8px] border border-[#E5E7EB]">
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-xs font-bold text-[#111827]">{r.user?.name || 'User'}</span>
                       <div className="flex items-center text-[10px] text-yellow-500 font-bold bg-white px-1.5 py-0.5 rounded border border-[#E5E7EB]">
                          <FaStar className="mr-0.5"/> {r.rating}
                       </div>
                     </div>
                     {r.comment && <p className="text-xs text-[#6B7280] mt-1">{r.comment}</p>}
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