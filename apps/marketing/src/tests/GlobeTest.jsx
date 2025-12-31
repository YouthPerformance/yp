import WolfNetworkGlobe from './WolfNetworkGlobe'

export default function GlobeTest() {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-4xl md:text-6xl font-bebas text-white tracking-wide mb-2">
          THE <span className="text-[#00F6E0]">PACK</span> IS GLOBAL
        </h1>
        <p className="text-[#A0A0A0] text-lg">
          Live training network - watch kids connect worldwide
        </p>
      </div>

      {/* Globe */}
      <WolfNetworkGlobe />

      {/* Stats */}
      <div className="mt-4 flex gap-8 md:gap-12 text-center">
        <div>
          <p className="text-3xl font-bebas text-[#00F6E0]">12,847</p>
          <p className="text-[#666666] text-sm uppercase tracking-wider">Active Today</p>
        </div>
        <div>
          <p className="text-3xl font-bebas text-white">156</p>
          <p className="text-[#666666] text-sm uppercase tracking-wider">Countries</p>
        </div>
        <div>
          <p className="text-3xl font-bebas text-[#FBBF24]">2.4M</p>
          <p className="text-[#666666] text-sm uppercase tracking-wider">Workouts Done</p>
        </div>
      </div>
    </div>
  )
}
