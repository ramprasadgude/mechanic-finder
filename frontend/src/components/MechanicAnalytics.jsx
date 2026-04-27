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
      <h2 className="text-2xl font-bold text-white mb-6">Performance Analytics</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Completed Jobs</span>
            <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg"><FaTools /></div>
          </div>
          <span className="text-3xl font-extrabold text-white">{completedJobs}</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-emerald-500/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Estimated Revenue</span>
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg"><FaMoneyBillWave /></div>
          </div>
          <span className="text-3xl font-extrabold text-emerald-400">₹{estimatedRevenue.toLocaleString('en-IN')}</span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">Avg. ₹1,500/job</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-orange-500/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Overall Rating</span>
            <div className="bg-orange-500/10 text-orange-400 p-2 rounded-lg"><FaStar /></div>
          </div>
          <span className="text-3xl font-extrabold text-white">{rating.toFixed(1)} <span className="text-sm text-zinc-500">/ 5.0</span></span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm hover:border-zinc-700 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-zinc-500 font-bold text-xs uppercase tracking-wider">Conversion</span>
            <div className="bg-brand-red/10 text-brand-red p-2 rounded-lg"><FaArrowUp /></div>
          </div>
          <span className="text-3xl font-extrabold text-white">{acceptanceRate}%</span>
        </div>
      </div>

      {/* Promotion Tool Mock */}
      <div className="bg-gradient-to-r from-brand-red/20 to-orange-500/20 border border-brand-red/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-extrabold text-lg flex items-center gap-2"><FaBullhorn className="text-brand-red"/> Boost Profile Visibility</h3>
          <p className="text-zinc-400 text-sm mt-1">Get listed at the top of the directory in your local area to drive 3x more bookings.</p>
        </div>
        <button className="bg-brand-red hover:bg-brand-red-light text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(234,0,41,0.3)] whitespace-nowrap border border-brand-red">
          Promote for ₹299
        </button>
      </div>
      
      {/* Recent History Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mt-6">
        <div className="p-5 border-b border-zinc-800 bg-zinc-950/50">
           <h3 className="text-white font-bold">Recent Job History</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-zinc-950 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 text-zinc-400 font-bold text-xs uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-zinc-400 font-bold text-xs uppercase tracking-wider">Service Requested By</th>
              <th className="px-6 py-4 text-zinc-400 font-bold text-xs uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.filter(r => r.status === 'Completed' || r.status === 'Accepted').slice(0, 5).map(req => (
               <tr key={req._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 text-zinc-300 text-sm font-medium">{new Date(req.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">{req.user?.name || 'Unknown User'}</td>
                  <td className="px-6 py-4 text-right">
                     <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${req.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        {req.status}
                     </span>
                  </td>
               </tr>
            ))}
            {requests.filter(r => r.status === 'Completed' || r.status === 'Accepted').length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-zinc-500 text-sm bg-zinc-900/50">No completed jobs found in your history. Accept a request to get started!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MechanicAnalytics;
