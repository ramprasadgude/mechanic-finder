import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaPaperPlane, FaMapMarkerAlt, FaCircle } from 'react-icons/fa'
import { io } from 'socket.io-client'
import { getMessages } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'

const ChatModal = ({ request, onClose }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [socket, setSocket] = useState(null)
  const messagesEndRef = useRef(null)

  const mechanicCoords = request.mechanic?.geometry?.coordinates;
  const hasMapCoords = mechanicCoords && mechanicCoords[0] !== 0 && mechanicCoords[1] !== 0;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data } = await getMessages(request._id);
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };
    fetchChatHistory();

    const newSocket = io(window.location.origin.replace('5173', '5000').replace('5174', '5000')); 
    
    newSocket.on('connect', () => {
      newSocket.emit('join_request_room', request._id);
    });

    newSocket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // eslint-disable-next-line
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [request._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('send_message', {
      requestId: request._id,
      senderId: user._id,
      text: newMessage
    });

    setNewMessage('');
  };

  const otherPersonName = user.role === 'user' ? (request.mechanic?.name || 'Mechanic') : (request.user?.name || 'User');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-gray-100 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Map / Details */}
        <div className="w-full md:w-[35%] bg-white border-r border-gray-200 flex flex-col h-[35%] md:h-full shrink-0">
          <div className="p-5 border-b border-gray-200 flex justify-between md:justify-center items-center">
             <h3 className="text-gray-900 font-bold tracking-tight">Service Details</h3>
             <button onClick={onClose} className="md:hidden text-gray-600 hover:text-gray-900 p-1.5"><FaTimes /></button>
          </div>
          
          <div className="flex-1 relative z-0 w-full min-h-[150px]">
             {hasMapCoords && isLoaded && import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
                <GoogleMap 
                  mapContainerStyle={{ height: '100%', width: '100%' }} 
                  center={{ lat: mechanicCoords[1], lng: mechanicCoords[0] }} 
                  zoom={14}
                  options={{ disableDefaultUI: true, styles: [
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                  ]}}
                >
                  <Marker position={{ lat: mechanicCoords[1], lng: mechanicCoords[0] }} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' }} />
                </GoogleMap>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-blue-50 p-6 text-center border-y border-gray-200">
                  <FaMapMarkerAlt className="text-4xl mb-3 opacity-20" />
                  <p className="text-xs">Location preview unavailable. Ensure Map API key is set.</p>
                </div>
             )}
          </div>
          
          <div className="p-6 bg-blue-50 space-y-4 hidden md:block overflow-y-auto">
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Issue Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-200">{request.problemDescription}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location Provided</h4>
              <p className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600 shrink-0" />
                {request.location}
              </p>
            </div>
            {request.appointmentDate && (
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Appointment Time</h4>
                <p className="text-sm text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                  {new Date(request.appointmentDate).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="flex flex-col w-full md:w-[65%] h-[65%] md:h-full relative bg-white">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center font-bold text-gray-900 shadow-sm">
                {otherPersonName.charAt(0)}
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 tracking-tight leading-tight">
                  {otherPersonName}
                </h2>
                <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <FaCircle className="text-[6px] animate-pulse" /> Live Support Connection
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hidden md:block text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-xl border border-transparent hover:border-gray-300"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                <div className="w-16 h-16 bg-gray-100/50 rounded-full flex items-center justify-center mb-4">
                  <FaPaperPlane className="text-gray-400 text-xl" />
                </div>
                <p>This is the start of your secure chat history.</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMine = msg.sender?.toString() === user._id || msg.senderId === user._id;
                return (
                  <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm border ${isMine ? 'bg-blue-600 text-white rounded-br-sm border-blue-600' : 'bg-white text-gray-900 rounded-bl-sm border-gray-200'}`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className={`text-[10px] mt-1.5 block text-right font-medium ${isMine ? 'text-gray-900/70' : 'text-gray-600'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-3 max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-gray-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-inner placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-5 rounded-xl transition-all shadow-md flex items-center justify-center"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ChatModal
