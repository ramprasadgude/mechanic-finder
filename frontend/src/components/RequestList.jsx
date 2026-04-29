import { FaCarSide, FaMapMarkerAlt, FaCheck, FaTimes, FaClock, FaExclamationTriangle, FaCalendarAlt, FaTrash, FaStar } from 'react-icons/fa';

const RequestList = ({ requests, type, onUpdateStatus, onDelete, onChat, onReview, onGoToDirectory }) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="bg-white border border-[#E5E7EB] text-center py-16 rounded-[12px] w-full">
        <div className="w-16 h-16 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCarSide className="text-[#6B7280] text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-[#111827] mb-2">No Requests Found</h3>
        <p className="text-[#6B7280] mb-6">
          {type === 'user' ? "You haven't made any service requests yet." : "You have no incoming requests at the moment."}
        </p>
        {type === 'user' && onGoToDirectory && (
           <button onClick={onGoToDirectory} className="bg-[#FF6B35] hover:bg-[#e85b25] text-white px-6 h-[38px] rounded-lg transition-colors font-semibold text-sm">
             Find a Mechanic
           </button>
        )}
      </div>
    );
  }

  const getStatusBadge = (status) => {
    // Flat status badge colors: Yellow = Confirmed (Accepted), Green = In Progress, Gray = Completed
    switch (status) {
      case 'Pending Admin Approval':
        return <span className="bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Auth Required</span>;
      case 'Pending':
        return <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Pending</span>;
      case 'Accepted':
        return <span className="bg-yellow-50 text-yellow-600 border border-yellow-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Confirmed</span>;
      case 'Completed':
        return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Completed</span>;
      case 'Rejected':
        return <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">Rejected</span>;
      default:
        return null;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden">
      <div className="flex flex-col">
        {requests.map((request, index) => {
          const personName = type === 'user' ? (request.mechanic?.name || 'Unknown') : (request.user?.name || 'Unknown');
          const isEmergency = request.isEmergency;
          
          return (
            <div key={request._id} className={`p-4 flex flex-col md:flex-row gap-4 items-start md:items-center ${index !== requests.length - 1 ? 'border-b border-[#E5E7EB]' : ''} hover:bg-[#F9FAFB] transition-colors`}>
              
              {/* Row Left: Avatar + Details */}
              <div className="flex flex-1 items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold text-lg border border-orange-200 shrink-0">
                  {getInitials(personName)}
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[15px] font-bold text-[#111827]">{personName}</h4>
                    {getStatusBadge(request.status)}
                    {isEmergency && <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"><FaExclamationTriangle className="inline mr-1"/>Emergency</span>}
                  </div>
                  <p className="text-sm text-[#6B7280] line-clamp-1 max-w-md mt-0.5">
                    {request.problemDescription}
                  </p>
                  <p className="text-[11px] text-[#6B7280] font-medium mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1"><FaMapMarkerAlt /> {request.location}</span>
                    {request.appointmentDate && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <FaCalendarAlt /> {new Date(request.appointmentDate).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                    {!request.appointmentDate && (
                      <span className="flex items-center gap-1">
                        <FaClock /> {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Row Right: Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0 pl-16 md:pl-0">
                {(type === 'mechanic' || type === 'admin') && request.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => onUpdateStatus(request._id, 'Accepted')}
                      className="bg-[#F9FAFB] hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] h-[34px] px-3 rounded-lg transition-colors font-semibold text-xs flex items-center gap-1"
                    >
                      <FaCheck className="text-green-600" /> Accept
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(request._id, 'Rejected')}
                      className="bg-[#F9FAFB] hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] h-[34px] px-3 rounded-lg transition-colors font-semibold text-xs flex items-center gap-1"
                    >
                      <FaTimes className="text-red-500" /> Reject
                    </button>
                  </>
                )}

                {request.status === 'Accepted' && (
                  <>
                    <button
                      onClick={() => onChat && onChat(request)}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 h-[34px] px-4 rounded-lg transition-colors font-semibold text-xs flex items-center gap-1.5"
                    >
                      Track & Chat
                    </button>
                    {(type === 'mechanic' || type === 'admin') && (
                      <button 
                        onClick={() => onUpdateStatus(request._id, 'Completed')}
                        className="bg-[#FF6B35] hover:bg-[#e85b25] text-white h-[34px] px-4 rounded-lg transition-colors font-semibold text-xs flex items-center gap-1.5"
                      >
                        <FaCheck /> Mark Done
                      </button>
                    )}
                  </>
                )}

                {request.status === 'Completed' && type === 'user' && !request.isReviewed && (
                  <button 
                    onClick={() => onReview(request)}
                    className="bg-[#F9FAFB] hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] h-[34px] px-4 rounded-lg transition-colors font-semibold text-xs"
                  >
                    Leave Review
                  </button>
                )}

                {request.status === 'Completed' && request.isReviewed && (
                  <span className="bg-[#F9FAFB] text-[#6B7280] font-semibold text-xs px-3 h-[34px] flex items-center rounded-lg border border-[#E5E7EB]">
                    Reviewed
                  </span>
                )}

                {['Pending', 'Rejected'].includes(request.status) && (type === 'user' || type === 'admin') && (
                   <button 
                     onClick={() => onDelete(request._id)}
                     className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-[#E5E7EB] hover:border-red-200 h-[34px] w-[34px] flex items-center justify-center rounded-lg transition-colors"
                     title="Delete Request"
                   >
                     <FaTrash size={12} />
                   </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default RequestList;
