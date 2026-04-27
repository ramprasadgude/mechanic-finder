import { FaCarSide, FaMapMarkerAlt, FaCheck, FaTimes, FaClock, FaStar, FaTrash, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';

const RequestList = ({ requests, type, onUpdateStatus, onDelete, onChat, onReview, onGoToDirectory }) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="glass-panel text-center py-16 rounded-3xl w-full">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCarSide className="text-slate-500 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Requests Found</h3>
        <p className="text-slate-400 mb-6">
          {type === 'user' ? "You haven't made any service requests yet." : "You have no incoming requests at the moment."}
        </p>
        {type === 'user' && onGoToDirectory && (
           <button onClick={onGoToDirectory} className="bg-brand-red hover:bg-brand-red-light text-white px-6 py-2.5 rounded-xl transition-all font-bold shadow-[0_0_15px_rgba(234,0,41,0.3)] hover:-translate-y-0.5">
             Find a Mechanic
           </button>
        )}
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"><FaClock className="inline mr-1"/> Pending</span>;
      case 'Accepted':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Accepted</span>;
      case 'Completed':
        return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Completed</span>;
      case 'Rejected':
        return <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request._id} className="bg-zinc-900 p-6 rounded-2xl flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden transition-all hover:bg-zinc-800/80 border border-zinc-800">
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start w-full">
              <h4 className="text-lg font-bold text-white">
                {type === 'user' ? (
                   <span>Sent to: <span className="text-brand-red">{request.mechanic?.name || 'Unknown'}</span></span>
                ) : (
                   <span>From: <span className="text-brand-red">{request.user?.name || 'Unknown'}</span></span>
                )}
              </h4>
              <div className="md:hidden">
                {getStatusBadge(request.status)}
              </div>
            </div>

            <p className="text-zinc-300 text-sm">
              <strong className="text-zinc-500">Issue:</strong> {request.problemDescription}
            </p>

            {request.isEmergency ? (
              <p className="flex items-center text-red-500 text-sm font-bold mt-1 bg-red-500/10 w-fit px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
                <FaExclamationTriangle className="mr-2" /> EMERGENCY (ASAP)
              </p>
            ) : request.appointmentDate ? (
              <p className="flex items-center text-blue-400 text-sm font-bold mt-1 bg-blue-500/10 w-fit px-2 py-0.5 rounded border border-blue-500/20">
                <FaCalendarAlt className="mr-2" />
                Scheduled: {new Date(request.appointmentDate).toLocaleString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            ) : null}

            <p className="flex items-center text-zinc-300 text-sm">
              <FaMapMarkerAlt className="mr-2 text-brand-red" />
              {request.location}
            </p>
            {type === 'user' && request.mechanic?.phone && (
              <p className="text-zinc-300 text-sm">
                <strong className="text-zinc-500">Contact:</strong> {request.mechanic.phone}
              </p>
            )}
            {type === 'mechanic' && request.user?.phone && (
              <p className="text-zinc-300 text-sm">
                <strong className="text-zinc-500">Contact:</strong> {request.user.phone}
              </p>
            )}
            <p className="text-xs text-zinc-600">Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="hidden md:block mr-2">
              {getStatusBadge(request.status)}
            </div>
            
            {type === 'mechanic' && request.status === 'Pending' && (
              <div className="flex gap-2 w-full">
                <button 
                  onClick={() => onUpdateStatus(request._id, 'Accepted')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-green-900/40 hover:bg-green-800/60 text-green-400 border border-green-800/50 px-4 py-2 rounded-xl transition-colors font-semibold text-sm"
                >
                  <FaCheck /> Accept
                </button>
                <button 
                  onClick={() => onUpdateStatus(request._id, 'Rejected')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1 bg-red-900/40 hover:bg-red-800/60 text-red-500 border border-red-800/50 px-4 py-2 rounded-xl transition-colors font-semibold text-sm"
                >
                  <FaTimes /> Reject
                </button>
              </div>
            )}

            {request.status === 'Accepted' && (
              <>
                <button
                  onClick={() => onChat && onChat(request)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-xl transition-all font-semibold text-sm border border-zinc-700 hover:border-zinc-500"
                >
                  <FaCarSide className="inline text-brand-red text-lg" /> Track & Chat
                </button>
                {type === 'mechanic' && (
                  <button 
                    onClick={() => onUpdateStatus(request._id, 'Completed')}
                    className="w-full md:w-auto flex items-center justify-center gap-1 bg-gradient-to-r from-brand-red to-brand-red-light text-white px-4 py-2 rounded-xl transition-all font-semibold text-sm"
                  >
                    Mark Complete
                  </button>
                )}
              </>
            )}

            {type === 'user' && request.status === 'Completed' && (
               <button 
                onClick={() => onReview && onReview(request)}
                className="w-full md:w-auto flex items-center justify-center gap-1 bg-yellow-900/40 hover:bg-yellow-800/60 text-yellow-500 border border-yellow-800/50 px-4 py-2 rounded-xl transition-colors font-semibold text-sm"
               >
                 <FaStar className="inline" /> Rate Mechanic
               </button>
            )}

            {onDelete && (
               <button 
                onClick={() => onDelete(request._id)}
                className="w-full md:w-auto flex items-center justify-center gap-1 bg-zinc-800 hover:bg-red-900/30 text-red-400 border border-zinc-700 hover:border-red-800/50 p-2 rounded-xl transition-colors font-semibold tooltip-trigger group relative"
                title="Delete Request"
               >
                 <FaTrash />
                 <span className="md:hidden ml-1">Delete</span>
               </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestList;
