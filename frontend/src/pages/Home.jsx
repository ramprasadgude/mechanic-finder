import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaCar, FaSearch, FaWrench, FaCheckCircle, FaCalendarCheck, FaChartLine, FaStar, FaUsers } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans pb-20">
      
      {/* Container max-w-[1200px] and centered */}
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        
        {/* Hero Section */}
        <div className="pt-16 pb-12 md:pt-24 md:pb-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-left w-full">

            <h1 className="text-4xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.1] mb-6">
              Find reliable auto repair <span className="text-[#FF6B35]">near you.</span>
            </h1>
            
            <p className="text-[#6B7280] text-lg max-w-[500px] mb-8 font-normal leading-relaxed">
              Compare local mechanics, read trusted reviews, and book vehicle maintenance or emergency repairs instantly.
            </p>

            <div className="flex flex-col w-full max-w-xl">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center bg-[#FF6B35] hover:bg-[#e85b25] text-white h-[44px] px-8 rounded-lg font-semibold transition-colors w-max"
                >
                  Go to your Dashboard
                </Link>
              ) : (
                <div className="w-full relative z-20">
                  {/* Flat Search Bar Component */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full bg-white border border-[#E5E7EB] rounded-2xl p-2 z-20">
                    
                    {/* Location Input */}
                    <div className="flex-1 flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-[38px]">
                      <FaMapMarkerAlt className="text-[#6B7280] mr-2 text-sm" />
                      <input 
                        type="text" 
                        placeholder="Zip code or City" 
                        className="w-full bg-transparent text-[#111827] text-sm focus:outline-none placeholder:text-[#6B7280]" 
                      />
                    </div>
                    
                    {/* Vehicle Dropdown */}
                    <div className="flex-1 flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 h-[38px]">
                      <FaCar className="text-[#6B7280] mr-2 text-sm" />
                      <select className="w-full bg-transparent text-[#111827] text-sm focus:outline-none appearance-none outline-none">
                        <option value="">Vehicle Type</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV / Truck</option>
                        <option value="motorcycle">Motorcycle</option>
                      </select>
                    </div>

                    <Link 
                      to="/register" 
                      className="bg-[#FF6B35] hover:bg-[#e85b25] text-white px-6 h-[38px] rounded-lg font-semibold text-sm flex items-center justify-center transition-colors sm:w-auto w-full"
                    >
                      <FaSearch className="mr-2 text-sm" /> Search
                    </Link>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-sm ml-1">
                    <span className="text-[#6B7280]">Are you a mechanic?</span>
                    <Link to="/login" className="text-[#FF6B35] hover:text-[#e85b25] transition-colors font-medium">
                      Join as a professional
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto relative px-4 sm:px-0">
            {/* Cinematic Car Image (Flat style, no shadow) */}
            <div className="relative rounded-[12px] overflow-hidden border border-[#E5E7EB] aspect-[4/3] lg:aspect-auto">
              <img 
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200" 
                alt="Mechanic working in garage" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-24">
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 text-center">
            <div className="w-10 h-10 mx-auto bg-orange-50 text-[#FF6B35] flex items-center justify-center rounded-lg mb-3">
              <FaUsers className="text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827]">5,000+</h3>
            <p className="text-[#6B7280] text-sm mt-1">Verified Mechanics</p>
          </div>
          
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 text-center">
            <div className="w-10 h-10 mx-auto bg-orange-50 text-[#FF6B35] flex items-center justify-center rounded-lg mb-3">
              <FaStar className="text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827]">4.8/5</h3>
            <p className="text-[#6B7280] text-sm mt-1">Average Rating</p>
          </div>
          
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-6 text-center">
            <div className="w-10 h-10 mx-auto bg-orange-50 text-[#FF6B35] flex items-center justify-center rounded-lg mb-3">
              <FaChartLine className="text-xl" />
            </div>
            <h3 className="text-2xl font-bold text-[#111827]">50k+</h3>
            <p className="text-[#6B7280] text-sm mt-1">Jobs Completed</p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#111827] mb-4">How It Works</h2>
          <p className="text-[#6B7280] max-w-[600px] mx-auto">Get your vehicle fixed in three simple steps without the usual hassle.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mb-6">
              <FaSearch className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">1. Search</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">Enter your location and vehicle type to discover top-rated local mechanics ready to help.</p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mb-6">
              <FaCheckCircle className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">2. Compare</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">Review profiles, hourly rates, and verified customer feedback to choose the best professional.</p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-[12px] p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#FF6B35] flex items-center justify-center mb-6">
              <FaCalendarCheck className="text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">3. Book</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">Schedule your appointment instantly or request emergency roadside assistance with one click.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home