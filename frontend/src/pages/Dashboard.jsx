import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { FaPlus, FaSearch, FaWrench, FaListAlt, FaUserShield, FaTimes, FaChartBar, FaCar } from 'react-icons/fa'
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
      console.error(err)
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
      console.error(err)
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
      console.error(err)
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
    <div className="min-h-screen bg-[#F9FAFB] pb-16 relative">
      {/* SOS Fixed Button */}
      {user?.role === 'user' && (
        <button
          onClick={handleEmergency}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 h-[48px] rounded-[12px] font-bold transition-all duration-300 shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:scale-105"
        >
          <FaWrench />
          SOS Emergency
        </button>
      )}

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 pt-10">
        {/* Welcome Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[#111827] text-2xl font-bold tracking-tight">
              Welcome back, <span className="text-[#FF6B35]">{user?.name}</span>
            </h1>
            <p className="text-[#6B7280] text-sm mt-1 font-medium">
              You have {mechanics.length} trusted mechanic{mechanics.length !== 1 ? 's' : ''} in your database.
            </p>
          </div>
          {(user?.role === 'mechanic' || user?.role === 'admin') && (
            <button
              onClick={() => setShowForm(true)}
              className="flex-none flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#e85b25] text-white px-6 h-[38px] rounded-[8px] font-semibold transition-colors w-full sm:w-auto text-sm"
            >
              <FaPlus />
              Add Profile
            </button>
          )}
        </div>

        {/* Global Search Bar (Full Width) */}
        <div className="relative mb-8 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="text-[#6B7280]" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mechanics by name, specialty, or location..."
            className="w-full bg-white border border-[#E5E7EB] rounded-[12px] h-[48px] pl-12 pr-4 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35] transition-colors placeholder-[#6B7280]"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto border-b border-[#E5E7EB] bg-white rounded-[8px] border inline-flex p-1">
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-1.5 rounded-[6px] font-semibold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'directory' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
          >
            <FaWrench /> Directory
          </button>
          {user && (
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-1.5 rounded-[6px] font-semibold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'requests' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              <FaListAlt /> {user?.role === 'user' ? 'My Bookings' : 'Requests'}
            </button>
          )}
          {user?.role === 'mechanic' && (
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-1.5 rounded-[6px] font-semibold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
            >
              <FaChartBar /> Performance
            </button>
          )}
          {user?.role === 'admin' && (
            <>
              <button 
                onClick={() => setActiveTab('admin-analytics')}
                className={`px-4 py-1.5 rounded-[6px] font-semibold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'admin-analytics' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                <FaChartBar /> Analytics
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-1.5 rounded-[6px] font-semibold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'users' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
              >
                <FaUserShield /> Users
              </button>
            </>
          )}
        </div>

        {activeTab === 'directory' ? (
          <>
            {/* AI Smart Search (Heuristic System) */}
            <div className="mb-8 p-6 bg-white border border-[#E5E7EB] rounded-[12px]">
              <h3 className="font-bold text-[#111827] text-lg mb-2 flex items-center gap-2">
                 ⚡ Describe what's wrong 
                 <span className="bg-[#FFF5F1] text-[#FF6B35] text-[10px] uppercase font-bold px-2 py-0.5 rounded-[4px] border border-[#FFE4D6]">Beta AI</span>
              </h3>
              <p className="text-sm text-[#6B7280] mb-4">Our match system will analyze your symptoms and suggest a mechanic.</p>
              <form onSubmit={handleAISmartSearch} className="flex gap-2">
                 <input 
                   type="text"
                   value={aiQuery}
                   onChange={e => setAiQuery(e.target.value)}
                   className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[8px] h-[38px] px-3 text-[#111827] text-sm focus:outline-none focus:border-[#FF6B35] transition-colors placeholder-[#6B7280]"
                   placeholder="e.g. 'My brakes are squeaking' or 'Engine overheats'"
                 />
                 <button 
                   type="submit" 
                   disabled={loading || !aiQuery.trim()}
                   className="bg-[#111827] hover:bg-black text-white disabled:opacity-50 px-6 h-[38px] rounded-[8px] font-semibold text-sm transition-colors whitespace-nowrap"
                 >
                   {loading ? 'Analyzing...' : 'Diagnose'}
                 </button>
                 {aiDiagnostics && (
                   <button 
                     type="button" 
                     onClick={clearAISearch}
                     className="bg-white hover:bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB] px-6 h-[38px] rounded-[8px] font-semibold text-sm transition-colors whitespace-nowrap"
                   >
                     Clear
                   </button>
                 )}
              </form>

              {aiDiagnostics && (
                <div className="mt-6 border-t border-[#E5E7EB] pt-4">
                  <h4 className="font-bold text-[#111827] mb-2 text-sm">Diagnostic Match Results</h4>
                  <div className="bg-[#FFF5F1] border border-[#FFE4D6] p-4 rounded-[8px]">
                     <p className="text-[#FF6B35] font-semibold mb-1">Suggested Specialty: <span className="font-bold">{aiDiagnostics.suggestedSpecialty}</span></p>
                     <p className="text-[#6B7280] text-sm">{aiDiagnostics.rawAnalysis || 'Match detected via internal heuristics.'}</p>
                     <p className="text-xs text-[#FF6B35] mt-3 font-bold uppercase tracking-widest">{filtered.length} Local Mechanics Found</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#111827]">
                {aiDiagnostics ? 'Suggested Mechanics' : 'Available Mechanics'}
              </h2>
              
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-1 rounded-[8px] flex">
                <button
                  onClick={() => setDirectoryView('list')}
                  className={`px-4 py-1.5 rounded-[6px] text-xs font-semibold transition-colors ${directoryView === 'list' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
                >
                  List View
                </button>
                <button
                  onClick={() => setDirectoryView('map')}
                  className={`px-4 py-1.5 rounded-[6px] text-xs font-semibold transition-colors ${directoryView === 'map' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] text-[#FF6B35]' : 'text-[#6B7280] hover:text-[#111827]'}`}
                >
                  Map View
                </button>
              </div>
            </div>

            {/* Mechanics Grid or Map */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[12px] p-6 h-48 border border-[#E5E7EB] flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 w-full">
                        <div className="h-4 bg-[#F9FAFB] rounded w-1/2"></div>
                        <div className="h-3 bg-[#F9FAFB] rounded w-1/4"></div>
                        <div className="h-3 bg-[#F9FAFB] rounded w-1/3"></div>
                      </div>
                      <div className="h-6 w-16 bg-[#F9FAFB] rounded"></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <div className="flex-1 h-8 bg-[#F9FAFB] rounded-[8px]"></div>
                      <div className="flex-[2] h-8 bg-[#F9FAFB] rounded-[8px]"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-[12px]">
                <div className="w-16 h-16 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaWrench className="text-[#6B7280] text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-[#111827] mb-1">No Mechanics Found</h3>
                <p className="text-[#6B7280] text-sm mb-6">
                  {search ? 'Try adjusting your search terms.' : 'Your directory is empty. Add a mechanic.'}
                </p>
                {search ? (
                  <button onClick={() => setSearch('')} className="bg-white hover:bg-[#F9FAFB] text-[#111827] px-6 h-[38px] rounded-[8px] transition-colors font-semibold text-sm border border-[#E5E7EB]">Clear Search</button>
                ) : (
                  (user?.role === 'mechanic' || user?.role === 'admin') && (
                    <button onClick={() => setShowForm(true)} className="bg-[#FF6B35] hover:bg-[#e85b25] text-white px-6 h-[38px] rounded-[8px] transition-colors font-semibold text-sm">Add Profile</button>
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
                <div className="rounded-[12px] overflow-hidden border border-[#E5E7EB]">
                  <MapView mechanics={filtered} onRequest={(m) => setRequestModalMechanic(m)} />
                </div>
              )
            )}
          </>
        ) : activeTab === 'requests' ? (
          /* Requests Tab */
          <div>
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FaListAlt className="text-[#FF6B35]" />
              {user?.role === 'user' ? 'Service Bookings' : user?.role === 'mechanic' ? 'Incoming Requests' : 'Global Requests'}
            </h2>
            {requestsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[12px] p-6 h-32 border border-[#E5E7EB]">
                    <div className="h-4 bg-[#F9FAFB] rounded w-1/4 mb-4"></div>
                    <div className="h-3 bg-[#F9FAFB] rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-[#F9FAFB] rounded w-1/3"></div>
                  </div>
                ))}
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
            <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
              <FaUserShield className="text-[#FF6B35]" />
              Manage Users
            </h2>
            {usersLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[12px] h-12 border border-[#E5E7EB]"></div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-6 py-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-[#6B7280] font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u._id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors last:border-0">
                        <td className="px-6 py-4 text-[#111827] font-semibold text-sm">{u.name}</td>
                        <td className="px-6 py-4 text-[#6B7280] text-sm">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                            u.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                            u.role === 'mechanic' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {u.role === 'mechanic' && (() => {
                              const mechanicProfile = mechanics.find(m => m.user?._id === u._id || m.user === u._id);
                              if (mechanicProfile) {
                                return (
                                  <button
                                    onClick={() => handleApproveMechanic(mechanicProfile._id, !mechanicProfile.isApproved)}
                                    className={`h-[30px] px-3 rounded-[8px] text-xs font-semibold transition-colors border ${
                                      mechanicProfile.isApproved 
                                        ? 'bg-white text-red-500 border-[#E5E7EB] hover:border-red-200 hover:bg-red-50' 
                                        : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                    }`}
                                    title={mechanicProfile.isApproved ? "Revoke Approval" : "Approve Mechanic"}
                                  >
                                    {mechanicProfile.isApproved ? 'Revoke' : 'Approve'}
                                  </button>
                                );
                              }
                              return null;
                            })()}
                            {u._id !== user._id && (
                              <button
                                onClick={() => handleDeleteUser(u._id)}
                                className="text-red-500 hover:text-red-600 h-[30px] w-[30px] flex items-center justify-center rounded-[8px] hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
                                title="Delete User"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {usersList.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-[#6B7280] text-sm">No users found.</td>
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