import { useState } from 'react';
import { FaTimes, FaMapMarkerAlt, FaCar, FaTools, FaCalendarCheck, FaExclamationTriangle, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';

const RequestModal = ({ mechanic, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [vehicle, setVehicle] = useState('');
  const [issue, setIssue] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [isEmergency, setIsEmergency] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue.trim() || !location.trim()) return;
    if (!isEmergency && !appointmentDate) return;

    setLoading(true);
    const finalProblemDescription = `[Vehicle: ${vehicle || 'Unspecified'}] ${issue}`;
    await onSubmit({ mechanicId: mechanic._id, problemDescription: finalProblemDescription, location, appointmentDate: isEmergency ? null : appointmentDate, isEmergency });
    setLoading(false);
  };

  const getInitials = (name) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-sm">
      <div className="absolute inset-0 bg-transparent" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-[12px] border border-[#E5E7EB] shadow-2xl flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F9FAFB] rounded-t-[12px]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FF6B35] flex items-center justify-center font-bold border border-orange-200 shrink-0">
              {getInitials(mechanic.name)}
            </div>
            <div>
              <p className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold">Booking Request</p>
              <h2 className="text-lg font-bold text-[#111827] leading-none mt-0.5">{mechanic.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#111827] bg-white border border-[#E5E7EB] w-8 h-8 rounded-lg flex items-center justify-center transition-colors">
            <FaTimes />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[#E5E7EB]">
          <div className="h-full bg-[#FF6B35] transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-orange-50 text-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCar className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Vehicle Details</h3>
                <p className="text-[#6B7280] text-sm">What car needs servicing?</p>
              </div>
              <div>
                <label className="block text-[#111827] text-sm font-semibold mb-2">Vehicle Make/Model/Year</label>
                <input
                  type="text"
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder="e.g. 2018 Toyota Camry"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-orange-50 text-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaTools className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Describe the Issue</h3>
                <p className="text-[#6B7280] text-sm">Tell the mechanic what's wrong.</p>
              </div>
              <div>
                <label className="block text-[#111827] text-sm font-semibold mb-2">Issue Description</label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Describe your vehicle's problem in detail..."
                  rows="4"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] p-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35] resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-orange-50 text-[#FF6B35] rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCalendarCheck className="text-xl" />
                </div>
                <h3 className="text-xl font-bold text-[#111827]">Location & Time</h3>
                <p className="text-[#6B7280] text-sm">Where and when do you need service?</p>
              </div>
              
              <div>
                <label className="block text-[#111827] text-sm font-semibold mb-2">Service Location</label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-2.5 text-[#6B7280]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter full address"
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] pl-9 pr-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[#111827] text-sm font-semibold mb-2">Urgency</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEmergency(true)}
                    className={`flex-1 flex flex-col items-center justify-center p-3 rounded-[8px] border ${isEmergency ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'}`}
                  >
                    <FaExclamationTriangle className="mb-1" />
                    <span className="text-xs font-bold uppercase tracking-wider">Emergency</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEmergency(false)}
                    className={`flex-1 flex flex-col items-center justify-center p-3 rounded-[8px] border ${!isEmergency ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : 'bg-white border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]'}`}
                  >
                    <FaCalendarCheck className="mb-1" />
                    <span className="text-xs font-bold uppercase tracking-wider">Schedule</span>
                  </button>
                </div>
              </div>

              {!isEmergency && (
                <div>
                   <label className="block text-[#111827] text-sm font-semibold mb-2">Select Time</label>
                   <input
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35]"
                  />
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <h3 className="text-xl font-bold text-[#111827] mb-4">Confirm Booking</h3>
                
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] p-4 text-sm space-y-3">
                  <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                    <span className="text-[#6B7280]">Vehicle</span>
                    <span className="font-semibold text-[#111827]">{vehicle || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E5E7EB] pb-2">
                    <span className="text-[#6B7280]">Urgency</span>
                    <span className={`font-semibold ${isEmergency ? 'text-red-500' : 'text-blue-500'}`}>{isEmergency ? 'ASAP / Emergency' : 'Scheduled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Location</span>
                    <span className="font-semibold text-[#111827] text-right max-w-[60%]">{location || 'Not provided'}</span>
                  </div>
                </div>

                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] p-4 text-sm mt-4">
                   <span className="block text-[#6B7280] mb-1">Issue Details:</span>
                   <p className="font-medium text-[#111827] break-words">{issue || 'No details provided'}</p>
                </div>
              </div>

              <div className="w-full md:w-[200px] shrink-0 bg-orange-50 border border-orange-200 rounded-[12px] p-4 flex flex-col justify-center items-center text-center pb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-500 text-xl border border-green-200 mb-3">
                   <FaCheck />
                </div>
                <h4 className="font-bold text-[#111827] text-lg leading-tight mb-2">Ready to Send</h4>
                <p className="text-xs text-[#6B7280]">The mechanic will be notified instantly and can chat with you.</p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB] rounded-b-[12px] flex justify-between items-center">
          {step > 1 ? (
            <button 
              type="button" 
              onClick={handlePrev}
              className="px-4 h-[38px] bg-white border border-[#E5E7EB] text-[#111827] font-semibold text-sm rounded-[8px] flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>
          ) : (
            <div></div> // Spacer
          )}

          {step < 4 ? (
            <button 
              type="button" 
              onClick={handleNext}
              disabled={step === 2 && !issue.trim()}
              className="px-6 h-[38px] bg-[#FF6B35] disabled:bg-[#ffb499] text-white font-semibold text-sm rounded-[8px] flex items-center gap-2"
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={loading || !issue.trim() || !location.trim() || (!isEmergency && !appointmentDate)}
              className="px-6 h-[38px] bg-[#FF6B35] disabled:bg-[#ffb499] text-white font-semibold text-sm rounded-[8px] flex items-center gap-2"
            >
              {loading ? 'Confirming...' : 'Confirm Book'} <FaCheck />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default RequestModal;
