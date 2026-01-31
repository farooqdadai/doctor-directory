import SearchBar from '../search/SearchBar';

interface HeroSectionProps {
  totalDoctors?: number;
}

export default function HeroSection({ totalDoctors = 0 }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
            <span className="text-white/90 text-sm font-medium">
              {totalDoctors > 0 ? `${totalDoctors.toLocaleString()} providers listed` : 'Directory now live'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find the Right{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
              Healthcare Provider
            </span>
          </h1>

          <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto">
            Search our comprehensive directory of verified healthcare professionals.
            Filter by specialty, location, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar size="large" />
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <a href="/specialty/cardiology" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 text-sm font-medium transition-colors border border-white/10">
              Cardiology
            </a>
            <a href="/specialty/dermatology" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 text-sm font-medium transition-colors border border-white/10">
              Dermatology
            </a>
            <a href="/specialty/orthopedics" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 text-sm font-medium transition-colors border border-white/10">
              Orthopedics
            </a>
            <a href="/specialty/pediatrics" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 text-sm font-medium transition-colors border border-white/10">
              Pediatrics
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">Verified</p>
              <p className="text-sm text-blue-200">Providers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">Nationwide</p>
              <p className="text-sm text-blue-200">Coverage</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">All</p>
              <p className="text-sm text-blue-200">Specialties</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">Real-time</p>
              <p className="text-sm text-blue-200">Updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-12 md:h-16 text-gray-50" preserveAspectRatio="none" viewBox="0 0 1440 54">
          <path fill="currentColor" d="M0,22L60,24.7C120,27,240,33,360,33C480,33,600,27,720,22C840,17,960,11,1080,16.5C1200,22,1320,39,1380,47.7L1440,54L1440,54L1380,54C1320,54,1200,54,1080,54C960,54,840,54,720,54C600,54,480,54,360,54C240,54,120,54,60,54L0,54Z"></path>
        </svg>
      </div>
    </section>
  );
}
