import React from 'react';
import { FaChartLine, FaUsers, FaExclamationTriangle, FaCheckCircle, FaMoneyBillWave, FaClock } from 'react-icons/fa';

const AdminAnalytics = ({ usersList, mechanics, requests }) => {
  const totalUsers = usersList.length;
  const approvedMechanics = mechanics.filter(m => m.isApproved).length;
  const pendingMechanics = mechanics.filter(m => !m.isApproved).length;
  
  const completedRequests = requests.filter(r => r.status === 'Completed').length;
  const activeRequests = requests.filter(r => r.status === 'Pending' || r.status === 'Accepted').length;

  // Mock Revenue: ₹1500 per job, 10% platform commission
  const totalPlatformRevenue = completedRequests * 1500 * 0.10;

  // Fraud & Quality Flags
  const lowRatedMechanics = mechanics.filter(m => m.rating > 0 && m.rating < 2.5);
  
  // Predict Spam Users
  const userRequestCounts = {};
  requests.forEach(r => {
    // Some endpoints populate user as object, some as ID string. Handle safely.
    const uid = typeof r.user === 'object' ? r.user?._id : r.user;
    const uname = typeof r.user === 'object' ? r.user?.name : 'Unknown User';
    
    if (uid) {
       if (!userRequestCounts[uid]) {
           userRequestCounts[uid] = { name: uname, total: 0, completed: 0 };
       }
       userRequestCounts[uid].total += 1;
       if (r.status === 'Completed') userRequestCounts[uid].completed += 1;
    }
  });

  const spamFlags = Object.keys(userRequestCounts)
    .map(key => userRequestCounts[key])
    .filter(u => u.total > 5 && u.completed === 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <FaChartLine className="text-blue-600" />
        Platform Overview
      </h2>
      
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <span className="text-emerald-500 font-bold text-xs uppercase tracking-wider">Platform Cut (10%)</span>
            <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg"><FaMoneyBillWave /></div>
          </div>
          <span className="text-3xl font-extrabold text-gray-900">₹{totalPlatformRevenue.toLocaleString('en-IN')}</span>
          <p className="text-[10px] text-emerald-500/80 mt-1 uppercase font-bold">Estimated Earnings</p>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Total Registered Accounts</span>
            <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg"><FaUsers /></div>
          </div>
          <span className="text-3xl font-extrabold text-gray-900">{totalUsers}</span>
        </div>

        {/* Requests Health */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Active System Requests</span>
            <div className="bg-orange-500/10 text-orange-400 p-2 rounded-lg"><FaClock /></div>
          </div>
          <span className="text-3xl font-extrabold text-gray-900">{activeRequests}</span>
          <span className="text-xs text-gray-500 ml-2 font-medium">({completedRequests} All-time)</span>
        </div>

        {/* Mechanic Health */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-gray-500 font-bold text-xs uppercase tracking-wider">Approved Mechanics</span>
            <div className="bg-purple-500/10 text-purple-400 p-2 rounded-lg"><FaCheckCircle /></div>
          </div>
          <span className="text-3xl font-extrabold text-gray-900">{approvedMechanics}</span>
          {pendingMechanics > 0 && (
             <p className="text-[10px] text-blue-600 font-bold mt-1 uppercase">{pendingMechanics} Pending Approval</p>
          )}
        </div>
      </div>

      {/* Security & Fraud Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
         
         {/* Low Quality Mechanics */}
         <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
               <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                 <FaExclamationTriangle className="text-yellow-500" />
                 Low Quality Provider Flags
               </h3>
               <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded font-bold">RATING &lt; 2.5</span>
            </div>
            <div className="p-4 space-y-3">
               {lowRatedMechanics.length === 0 ? (
                  <p className="text-gray-500 text-sm font-medium text-center py-4">All active mechanics meet platform standards.</p>
               ) : (
                  lowRatedMechanics.map(m => (
                     <div key={m._id} className="flex justify-between items-center bg-white/50 p-3 rounded-lg border border-red-500/20">
                        <div>
                           <p className="text-gray-900 text-sm font-bold">{m.name}</p>
                           <p className="text-gray-500 text-xs">{m.specialty}</p>
                        </div>
                        <div className="bg-red-500/10 text-red-500 font-bold px-2 py-1 rounded text-sm">
                           ⭐ {m.rating}
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

         {/* Spam User Flags */}
         <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
               <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                 <FaExclamationTriangle className="text-blue-600" />
                 Suspicious Activity
               </h3>
               <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded font-bold">HIGH VOL, NO CONVERSION</span>
            </div>
            <div className="p-4 space-y-3">
               {spamFlags.length === 0 ? (
                  <p className="text-gray-500 text-sm font-medium text-center py-4">No suspicious request volumes detected.</p>
               ) : (
                  spamFlags.map((u, i) => (
                     <div key={i} className="flex justify-between items-center bg-white/50 p-3 rounded-lg border border-red-500/20">
                        <div>
                           <p className="text-gray-900 text-sm font-bold">{u.name}</p>
                           <p className="text-gray-500 text-xs">Flagged for API abuse or spam requests</p>
                        </div>
                        <div className="text-right">
                           <span className="block text-blue-600 font-bold text-sm">{u.total} Requests</span>
                           <span className="block text-gray-500 text-[10px] uppercase">0 Completions</span>
                        </div>
                     </div>
                  ))
               )}
            </div>
         </div>

      </div>
    </div>
  );
}

export default AdminAnalytics;
