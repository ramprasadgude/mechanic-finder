import { useState } from 'react';
import { FaTimes, FaMapMarkerAlt, FaCarCrash, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';

const RequestModal = ({ mechanic, onClose, onSubmit }) => {
  const [problemDescription, setProblemDescription] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [isEmergency, setIsEmergency] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!problemDescription.trim() || !location.trim()) return;
    if (!isEmergency && !appointmentDate) return;

    setLoading(true);
    await onSubmit({ mechanicId: mechanic._id, problemDescription, location, appointmentDate: isEmergency ? null : appointmentDate, isEmergency });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-zinc-900 w-full max-w-lg rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-zinc-800 p-6 sm:p-8 animate-slide-up overflow-hidden">


        <div className="relative z-10 flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Book Service
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 bg-zinc-800/50 rounded-lg"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="relative z-10 mb-6 flex items-center gap-4 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
          <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xl font-bold border border-zinc-600 shadow-inner">
            {mechanic.name.charAt(0)}
          </div>

          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Booking with</p>
            <p className="text-lg font-extrabold text-white">{mechanic.name}</p>
          </div>
        </div>

        <div className="flex bg-zinc-950/50 rounded-xl p-1.5 border border-zinc-800 mb-6 z-10 relative">
          <button
            type="button"
            onClick={() => setIsEmergency(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all ${isEmergency ? 'bg-red-500/10 text-red-500 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'text-zinc-600 hover:text-zinc-300 border border-transparent'}`}
          >
            <FaExclamationTriangle />
            Emergency (ASAP)
          </button>
          <button
            type="button"
            onClick={() => setIsEmergency(false)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all ${!isEmergency ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'text-zinc-600 hover:text-zinc-300 border border-transparent'}`}
          >
            <FaCalendarAlt />
            Schedule Routine
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Issue Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FaCarCrash className="text-zinc-600" />
              </div>
              <textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                placeholder="Describe your vehicle's problem (e.g., Oil change, Flat tire...)"
                rows="3"
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all shadow-inner"
                required
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Your Current Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-zinc-600" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter complete address or landmark"
                className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-white focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all shadow-inner"
                required
              />
            </div>
          </div>

          {!isEmergency && (
            <div className="animate-fade-in border border-blue-500/20 bg-blue-500/5 p-4 rounded-xl">
              <label className="block text-sm font-medium text-blue-400 mb-2 flex items-center gap-2"><FaCalendarAlt/> Select Appointment Time</label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required={!isEmergency}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 mt-2 border-t border-zinc-800/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-zinc-400 bg-transparent hover:bg-zinc-800 hover:text-white transition-colors border border-zinc-700"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-white transition-all flex justify-center items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed ${isEmergency ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEmergency ? (
                'Send SOS Request'
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestModal;
