import { Link } from 'react-router-dom'
import { FaWrench, FaShieldAlt, FaSearch, FaStar, FaArrowRight } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-bg-dark text-zinc-300">
      
      {/* Container max-w-[1200px] and centered */}
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        
        {/* Hero Section */}
        <div className="pt-28 pb-24 md:pt-36 md:pb-40 flex flex-col lg:flex-row items-center gap-16 animate-fade-in pl-0 lg:pl-12">
          <div className="flex-1 text-left w-full">

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight mb-10 drop-shadow-md">
              Your <span className="text-brand-red">Trusted</span> Auto Repair Provider.
            </h1>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-[600px] mb-12 font-light leading-loose">
              We offer reliable and efficient services to ensure your vehicle is always in top condition. Find and book trusted mechanics in seconds.
            </p>



            <div className="flex flex-col w-full max-w-2xl mt-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group flex items-center justify-center gap-3 bg-brand-red hover:bg-brand-red-light text-white px-10 py-5 rounded-full font-bold transition-all text-xl hover:-translate-y-0.5 shadow-[0_6px_25px_rgba(234,0,41,0.5)] w-full sm:w-max"
                >
                  Go to Dashboard
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div className="w-full relative z-20">
                  {/* Elite Premium Search Bar */}
                  <div className="flex items-center w-full shadow-[0_0_40px_rgba(234,0,41,0.15)] focus-within:shadow-[0_0_50px_rgba(234,0,41,0.3)] transition-all rounded-full group bg-zinc-950 border border-zinc-700 focus-within:border-brand-red p-2 z-20">
                    <div className="pl-6 pr-3 text-zinc-400 group-focus-within:text-brand-red transition-colors flex-shrink-0">
                      <FaSearch className="text-xl md:text-2xl" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="What does your car need today?" 
                      className="flex-1 bg-transparent text-white py-3 md:py-4 text-base md:text-lg focus:outline-none placeholder-zinc-500 font-medium tracking-wide min-w-0" 
                    />
                    <Link 
                      to="/register" 
                      className="bg-brand-red hover:bg-brand-red-light text-white px-6 md:px-10 py-3 md:py-4 rounded-full font-bold text-base md:text-lg flex items-center justify-center transition-all shadow-md hover:shadow-lg flex-shrink-0 ml-2"
                    >
                      Search
                    </Link>
                  </div>

                  {/* Popular Searches Conversion Booster */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 px-4 w-full">
                    <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-400">
                      <span>Popular:</span>
                      <span className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded-full cursor-pointer transition-colors border border-zinc-700 shadow-sm">Brake repair</span>
                      <span className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded-full cursor-pointer transition-colors border border-zinc-700 shadow-sm">Oil change</span>
                      <span className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2 rounded-full cursor-pointer transition-colors border border-zinc-700 shadow-sm hidden sm:inline-block">Diagnostics</span>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-sm font-medium ml-4">
                    <span className="text-zinc-500">Are you a mechanic?</span>
                    <Link to="/login" className="text-zinc-300 hover:text-white transition-colors border-b border-zinc-700 hover:border-white pb-0.5">
                      Login to workspace
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 w-full lg:w-auto relative px-4 sm:px-0">
            {/* Cinematic Car Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-zinc-800 group aspect-[4/3] lg:aspect-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-bg-dark via-transparent to-transparent z-10 w-1/3"></div>
              <img 
                src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200" 
                alt="Mechanic working in garage" 
                className="w-full h-full object-cover rounded-2xl opacity-80 transform group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </div>


        
      </div>
    </div>
  )
}

export default Home