import React from 'react';
import { FaMoneyBillWave, FaTools, FaStar, FaArrowUp, FaBullhorn } from 'react-icons/fa';

const MechanicAnalytics = ({ requests, mechanicProfile }) => {
  const completedJobs = requests.filter(r => r.status === 'Completed').length;
  const totalJobs = requests.length;
  const acceptanceRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
  
  // Indian currency simulated revenue (Average ₹1,500 per completed job)
  const estimatedRevenue = completedJobs * 1500;
  
  const rating = mechanicProfile?.rating || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-gray-300 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Completed Jobs</span>
            <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg"><FaTools /></div>
          </div>
          <span className="text-3xl font-extrabold text-gray-900">{completedJobs}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-emerald-500/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Estimated Revenue</span>
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg"><FaMoneyBillWave /></div>
          </div>
          <span className="text-3xl font-extrabold text-emerald-400">₹{estimatedRevenue.toLocaleString('en-IN')}</span>
          <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase">Avg. ₹1,500/job</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-orange-500/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Overall Rating</span>
            <div className="bg-orange-500/10 text-orange-400 p-2 rounded-lg"><FaStar /></div>
          </div>
          <span className="text-3xl font-extrabold text-gray-900">{rating.toFixed(1)} <span className="text-sm text-gray-500">/ 5.0</span></span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-gray-300 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Conversion</span>
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg"><FaArrowUp /></div>
          </div>
          <span className="text-3xl font-extrabold text-gray-900">{acceptanceRate}%</span>
        </div>
      </div>

      {/* Promotion Tool Mock */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-gray-900 font-extrabold text-lg flex items-center gap-2"><FaBullhorn className="text-blue-600"/> Boost Profile Visibility</h3>
          <p className="text-gray-600 text-sm mt-1">Get listed at the top of the directory in your local area to drive 3x more bookings.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md hover:-translate-y-0.5 whitespace-nowrap">
          Promote for ₹299
        </button>
      </div>
      
      {/* Recent History Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-200 bg-white/50">
           <h3 className="text-gray-900 font-bold">Recent Job History</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-gray-600 font-bold text-xs uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-gray-600 font-bold text-xs uppercase tracking-wider">Service Requested By</th>
              <th className="px-6 py-4 text-gray-600 font-bold text-xs uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.filter(r => r.status === 'Completed' || r.status === 'Accepted').slice(0, 5).map(req => (
               <tr key={req._id} className="border-b border-gray-200 hover:bg-gray-100/30 transition-colors">
                  <td className="px-6 py-4 text-gray-700 text-sm font-medium">{new Date(req.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{req.user?.name || 'Unknown User'}</td>
                  <td className="px-6 py-4 text-right">
                     <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${req.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                        {req.status}
                     </span>
                  </td>
               </tr>
            ))}
            {requests.filter(r => r.status === 'Completed' || r.status === 'Accepted').length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-500 text-sm bg-blue-50">No completed jobs found in your history. Accept a request to get started!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MechanicAnalytics;
