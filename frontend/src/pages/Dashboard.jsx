import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPlus, FaSearch, FaWrench, FaListAlt, FaUserShield, FaTimes } from 'react-icons/fa'
import {
  getMechanics,
  createMechanic,
  updateMechanic,
  deleteMechanic,
  createRequest,
  getUserRequests,
  getMechanicRequests,
  getAllRequests,
  updateRequestStatus,
  deleteRequest,
  createReview,
  createEmergencyRequest,
  suggestMechanic,
  approveMechanic,
  getUsers,
  deleteUser
} from '../services/api'
import { useAuth } from '../context/AuthContext'
import MechanicCard from '../components/MechanicCard'
import MechanicForm from '../components/MechanicForm'
import RequestList from '../components/RequestList'
import RequestModal from '../components/RequestModal'
import ReviewModal from '../components/ReviewModal'
import ChatModal from '../components/ChatModal'
import MapView from '../components/MapView'
import MechanicAnalytics from '../components/MechanicAnalytics'
import AdminAnalytics from '../components/AdminAnalytics'

const Dashboard = () => {
  const { user } = useAuth()
  const [mechanics, setMechanics] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMechanic, setEditingMechanic] = useState(null)
  const [search, setSearch] = useState('')
  const [aiQuery, setAiQuery] = useState('')
  const [aiDiagnostics, setAiDiagnostics] = useState(null)
  const [directoryView, setDirectoryView] = useState('list')
  
  // Requests State
  const [activeTab, setActiveTab] = useState('directory')
  const [requests, setRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(false)
  const [requestModalMechanic, setRequestModalMechanic] = useState(null)
  const [reviewModalRequest, setReviewModalRequest] = useState(null)
  const [chatModalRequest, setChatModalRequest] = useState(null)

  // Users State (Admin)
  const [usersList, setUsersList] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)

  const fetchMechanics = async () => {
    try {
      const { data } = await getMechanics()
      setMechanics(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load mechanics')
    } finally {
      setLoading(false)
    }
  }

  const fetchRequests = async () => {
    setRequestsLoading(true)
    try {
      let data;
      if (user?.role === 'admin') {
        const res = await getAllRequests();
        data = res.data;
      } else if (user?.role === 'mechanic') {
        const res = await getMechanicRequests();
        data = res.data;
      } else {
        const res = await getUserRequests();
        data = res.data;
      }
      setRequests(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load requests')
    } finally {
      setRequestsLoading(false)
    }
  }

  const fetchUsersList = async () => {
    if (user?.role !== 'admin') return;
    setUsersLoading(true)
    try {
      const { data } = await getUsers()
      setUsersList(data)
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    fetchMechanics()
  }, [])

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests()
    } else if (activeTab === 'users' || activeTab === 'admin-analytics') {
      fetchUsersList()
      fetchRequests() // Admin analytics needs requests too
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const handleCreate = async (formData) => {
    try {
      await createMechanic(formData)
      toast.success('Mechanic added successfully!')
      setShowForm(false)
      fetchMechanics()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add mechanic'
      toast.error(msg)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      await updateMechanic(editingMechanic._id, formData)
      toast.success('Mechanic updated successfully!')
      setEditingMechanic(null)
      fetchMechanics()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update mechanic'
      toast.error(msg)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mechanic?')) return
    try {
      await deleteMechanic(id)
      toast.success('Mechanic deleted successfully!')
      fetchMechanics()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete mechanic'
      toast.error(msg)
    }
  }

  const handleEdit = (mechanic) => {
    setEditingMechanic(mechanic)
  }

  const handleApproveMechanic = async (id, isApproved) => {
    try {
      await approveMechanic(id, { isApproved })
      toast.success(isApproved ? 'Mechanic approved successfully!' : 'Mechanic approval revoked!')
      fetchMechanics()
    } catch (err) {
      toast.error('Failed to update mechanic approval status')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUser(id)
      toast.success('User deleted successfully!')
      fetchUsersList()
    } catch (err) {
      toast.error('Failed to delete user')
    }
  }

  const handleSendRequest = async (formData) => {
    try {
      await createRequest(formData)
      toast.success('Request sent successfully!')
      setRequestModalMechanic(null)
      // Auto-navigate to requests tab
      setActiveTab('requests')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send request'
      toast.error(msg)
    }
  }

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      await updateRequestStatus(id, status)
      toast.success(`Request marked as ${status}!`)
      fetchRequests()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update request status')
    }
  }

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return
    try {
      await deleteRequest(id)
      toast.success('Request deleted successfully!')
      fetchRequests()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete request'
      toast.error(msg)
    }
  }

  const handleCreateReview = async (reviewData) => {
    try {
      await createReview(reviewData)
      toast.success('Review submitted successfully! Thank you.')
      setReviewModalRequest(null)
      fetchMechanics() // to update ratings
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit review'
      toast.error(msg)
    }
  }

  const handleEmergency = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return;
    }

    toast.info('Detecting your location for emergency dispatch...', { autoClose: 2000 })
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // coordinates array format must be [longitude, latitude] for GeoJSON
        const payload = {
           location: "Current Location (Auto-detected)",
           coordinates: [longitude, latitude],
           problemDescription: "EMERGENCY: Immediate assistance required."
        };
        const { data } = await createEmergencyRequest(payload);
        toast.success(data.message || 'Emergency request dispatched!');
        
        // Refresh requests if watching Requests tab
        if (activeTab === 'requests') fetchRequests();
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to dispatch emergency request'
        toast.error(msg)
      }
    }, () => {
      toast.error('Location access denied. Cannot dispatch emergency automatically.');
    });
  }

  const handleAISmartSearch = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setLoading(true);
    try {
      const { data } = await suggestMechanic({ problemDescription: aiQuery });
      setMechanics(data.mechanics);
      setAiDiagnostics(data.diagnostics);
      toast.success(`AI determined you need: ${data.suggestedSpecialty}`);
    } catch (err) {
      console.error(err)
      toast.error('Smart Search failed');
      fetchMechanics();
      setAiDiagnostics(null);
    } finally {
      setLoading(false);
    }
  }

  const clearAISearch = () => {
    setAiQuery('');
    setAiDiagnostics(null);
    fetchMechanics();
  }

  const filtered = mechanics.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.specialty.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-bg-dark pb-16 relative">
      {/* SOS Fixed Button */}
      {user?.role === 'user' && (
        <button
          onClick={handleEmergency}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-4 rounded-2xl font-bold shadow-2xl hover:-translate-y-1 transition-all animate-pulse hover:animate-none border border-red-500"
        >
          <FaWrench className="animate-bounce" />
          SOS Emergency
        </button>
      )}

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pt-10 animate-fade-in">
        {/* Welcome Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-white text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-brand-red">{user?.name}</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-2 font-medium">
              You have {mechanics.length} trusted mechanic{mechanics.length !== 1 ? 's' : ''} in your database.
            </p>
          </div>
          {(user?.role === 'mechanic' || user?.role === 'admin') && (
            <button
              onClick={() => setShowForm(true)}
              className="flex-none flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-light text-white px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto hover:-translate-y-0.5 shadow-[0_4px_14px_0_rgba(234,0,41,0.39)]"
            >
              <FaPlus />
              Add Profile
            </button>
          )}
        </div>

        {/* Global Search Bar (Full Width) */}
        <div className="relative mb-8 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-zinc-500 text-lg" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mechanics by name, specialty, or location..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-white text-base focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all shadow-sm placeholder-zinc-600"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 pb-4 overflow-x-auto border-b border-zinc-800">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-8 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'directory' ? 'border-brand-red text-brand-red bg-zinc-900/50' : 'border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
          >
            Directory
          </button>
          {(user?.role === 'user' || user?.role === 'mechanic' || user?.role === 'admin') && (
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-8 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'requests' ? 'border-brand-red text-brand-red bg-zinc-900/50' : 'border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
            >
              {user?.role === 'user' ? 'My Requests' : user?.role === 'mechanic' ? 'Incoming Requests' : 'All System Requests'}
            </button>
          )}
          {user?.role === 'mechanic' && (
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-8 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'analytics' ? 'border-brand-red text-brand-red bg-zinc-900/50' : 'border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
            >
              My Analytics
            </button>
          )}
          {user?.role === 'admin' && (
            <>
              <button 
                onClick={() => setActiveTab('admin-analytics')}
                className={`px-8 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'admin-analytics' ? 'border-brand-red text-brand-red bg-zinc-900/50' : 'border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
              >
                Platform Overview
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-8 py-3 rounded-t-lg font-bold transition-all whitespace-nowrap border-b-2 ${activeTab === 'users' ? 'border-brand-red text-brand-red bg-zinc-900/50' : 'border-transparent text-zinc-500 hover:text-white hover:bg-zinc-900'}`}
              >
                Manage Users
              </button>
            </>
          )}
        </div>

        {activeTab === 'directory' ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800 w-full sm:w-auto">
                <button
                  onClick={() => setDirectoryView('list')}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-bold text-sm transition-all ${directoryView === 'list' ? 'bg-brand-red text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setDirectoryView('map')}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-md font-bold text-sm transition-all ${directoryView === 'map' ? 'bg-brand-red text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Map View
                </button>
              </div>
              <form onSubmit={handleAISmartSearch} className="flex relative w-full sm:w-auto">
                <input 
                  type="text" 
                  value={aiQuery} 
                  onChange={(e) => setAiQuery(e.target.value)} 
                  placeholder="Ask AI: 'My car won't start...'" 
                  className="bg-zinc-900 border border-zinc-800 rounded-xl rounded-r-none px-4 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-red flex-grow sm:w-64"
                />
                <button 
                  type="submit"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 border-l-0 px-4 py-2 rounded-xl rounded-l-none transition-all font-bold flex items-center text-sm shadow-sm"
                >
                  ✨ Search
                </button>
              </form>
            </div>

            {/* AI Diagnostics Card */}
            {aiDiagnostics && (
              <div className="mb-8 bg-zinc-900 border border-brand-red/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(234,0,41,0.1)] relative overflow-hidden animate-fade-in group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="bg-brand-red/10 text-brand-red p-2.5 rounded-xl border border-brand-red/20 shadow-sm">
                      <FaWrench className="text-xl" />
                    </div>
                    <div>
                      <h2 className="text-white font-extrabold text-xl tracking-tight">AI Predictive Diagnosis</h2>
                      <p className="text-zinc-400 text-sm font-medium mt-0.5">Automated heuristic analysis based on your symptoms</p>
                    </div>
                  </div>
                  <button onClick={clearAISearch} className="text-zinc-500 hover:text-white transition-colors">
                     <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 mb-4">
                   <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800/80">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Possible Issues</span>
                      <ul className="list-disc pl-4 text-zinc-300 text-sm space-y-1">
                        {aiDiagnostics.possibleIssues.map((iss, idx) => (
                           <li key={idx} className="font-medium text-white">{iss}</li>
                        ))}
                      </ul>
                   </div>
                   <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800/80 flex flex-col justify-center">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Estimated Cost</span>
                      <span className="text-3xl font-extrabold text-green-400">{aiDiagnostics.estimatedCost}</span>
                   </div>
                   <div className="bg-zinc-950/60 rounded-xl p-4 border border-zinc-800/80 flex flex-col justify-center">
                      <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1 block">Urgency Level</span>
                      <span className={`text-2xl font-extrabold ${
                        aiDiagnostics.urgency === 'Critical' ? 'text-red-500' :
                        aiDiagnostics.urgency === 'High' ? 'text-orange-400' :
                        aiDiagnostics.urgency === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
                      }`}>{aiDiagnostics.urgency}</span>
                   </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 relative z-10">
                   <p className="text-blue-100 text-sm font-medium"><strong className="text-blue-400">💡 Advice:</strong> {aiDiagnostics.advice}</p>
                </div>
              </div>
            )}

            {/* Mechanics Grid or Map */}
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-red"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24 border border-dashed border-zinc-800 rounded-2xl">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaWrench className="text-zinc-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Mechanics Found</h3>
                <p className="text-zinc-500 text-sm mb-6">
                  {search ? 'Try adjusting your search terms.' : 'Your directory is empty. Add a mechanic to get started.'}
                </p>
                {search ? (
                  <button onClick={() => setSearch('')} className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-xl transition-all font-bold border border-zinc-700">Clear Search</button>
                ) : (
                  (user?.role === 'mechanic' || user?.role === 'admin') && (
                    <button onClick={() => setShowForm(true)} className="bg-brand-red hover:bg-brand-red-light shadow-[0_0_15px_rgba(234,0,41,0.3)] hover:-translate-y-0.5 text-white px-6 py-2 rounded-xl transition-all font-bold">Add Profile</button>
                  )
                )}
              </div>
            ) : (
              directoryView === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((mechanic) => (
                    <MechanicCard
                      key={mechanic._id}
                      mechanic={mechanic}
                      currentUser={user}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onApprove={handleApproveMechanic}
                      onRequest={(m) => setRequestModalMechanic(m)}
                    />
                  ))}
                </div>
              ) : (
                <MapView mechanics={filtered} onRequest={(m) => setRequestModalMechanic(m)} />
              )
            )}
          </>
        ) : activeTab === 'requests' ? (
          /* Requests Tab */
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {user?.role === 'user' ? 'Service Requests' : user?.role === 'mechanic' ? 'Incoming Service Requests' : 'Global Admin Requests'}
            </h2>
            {requestsLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-red"></div>
              </div>
            ) : (
              <RequestList 
                requests={requests} 
                type={user?.role} 
                onUpdateStatus={handleUpdateRequestStatus}
                onDelete={handleDeleteRequest}
                onReview={(req) => setReviewModalRequest(req)}
                onChat={(req) => setChatModalRequest(req)}
                onGoToDirectory={() => setActiveTab('directory')}
              />
            )}
          </div>
        ) : activeTab === 'analytics' && user?.role === 'mechanic' ? (
          <MechanicAnalytics 
            requests={requests} 
            mechanicProfile={mechanics.find(m => m.user._id === user._id || m.user === user._id)}
          />
        ) : activeTab === 'admin-analytics' && user?.role === 'admin' ? (
          <AdminAnalytics
             usersList={usersList}
             mechanics={mechanics}
             requests={requests}
          />
        ) : (
          /* Users Tab */
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaUserShield className="text-brand-red" />
              Manage Users
            </h2>
            {usersLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-red"></div>
              </div>
            ) : (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-950 border-b border-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-zinc-400 font-bold text-sm">Name</th>
                      <th className="px-6 py-4 text-zinc-400 font-bold text-sm">Email</th>
                      <th className="px-6 py-4 text-zinc-400 font-bold text-sm">Role</th>
                      <th className="px-6 py-4 text-zinc-400 font-bold text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                        <td className="px-6 py-4 text-zinc-400 text-sm">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            u.role === 'mechanic' ? 'bg-brand-red/10 text-brand-red border border-brand-red/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {u._id !== user._id && (
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-colors border border-transparent hover:border-red-400/20"
                              title="Delete User"
                            >
                              <FaTimes />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <MechanicForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Edit Form Modal */}
      {editingMechanic && (
        <MechanicForm
          initialData={editingMechanic}
          onSubmit={handleUpdate}
          onClose={() => setEditingMechanic(null)}
        />
      )}

      {/* Request Service Modal */}
      {requestModalMechanic && (
        <RequestModal
          mechanic={requestModalMechanic}
          onSubmit={handleSendRequest}
          onClose={() => setRequestModalMechanic(null)}
        />
      )}

      {/* Review Modal */}
      {reviewModalRequest && (
        <ReviewModal
          request={reviewModalRequest}
          mechanic={reviewModalRequest.mechanic}
          onSubmit={handleCreateReview}
          onClose={() => setReviewModalRequest(null)}
        />
      )}

      {/* Chat Modal */}
      {chatModalRequest && (
        <ChatModal
          request={chatModalRequest}
          onClose={() => setChatModalRequest(null)}
        />
      )}
    </div>
  )
}

export default Dashboard