/**
 * Portal Frame Test Page
 *
 * "Layer Cake" Architecture Demo:
 * Layer 1: RetroGrid (Atmosphere)
 * Layer 2: Phone Chassis (Hardware)
 * Layer 3: Screen Slot (Software - swappable)
 * Layer 4: Hologram VFX
 */

import PortalFrame from "../../components/PortalFrame";
import RetroGrid from "../../components/RetroGrid";

// Example screen content - Dashboard UI
function DashboardScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0a1a1f] to-[#08090A] p-4 flex flex-col">
      {/* Status Bar */}
      <div className="flex justify-between items-center text-[10px] text-gray-500 mb-4">
        <span>9:41</span>
        <div className="flex gap-1">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-[10px] text-cyan-500 uppercase tracking-wider mb-1">Wolf Status</p>
        <h2 className="text-white text-lg font-bold">System Optimal</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-black/40 rounded-xl p-3 border border-cyan-500/20">
          <p className="text-cyan-500 text-2xl font-bold">94%</p>
          <p className="text-gray-500 text-[9px] uppercase">Movement Score</p>
        </div>
        <div className="bg-black/40 rounded-xl p-3 border border-cyan-500/20">
          <p className="text-cyan-500 text-2xl font-bold">12</p>
          <p className="text-gray-500 text-[9px] uppercase">Sessions</p>
        </div>
        <div className="bg-black/40 rounded-xl p-3 border border-cyan-500/20">
          <p className="text-green-400 text-2xl font-bold">+15%</p>
          <p className="text-gray-500 text-[9px] uppercase">This Week</p>
        </div>
        <div className="bg-black/40 rounded-xl p-3 border border-cyan-500/20">
          <p className="text-cyan-500 text-2xl font-bold">7</p>
          <p className="text-gray-500 text-[9px] uppercase">Day Streak</p>
        </div>
      </div>

      {/* Next Session Card */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-transparent rounded-xl p-4 border border-cyan-500/30 mb-4">
        <p className="text-[9px] text-cyan-500 uppercase mb-1">Next Up</p>
        <p className="text-white text-sm font-semibold">Ankle Stability Protocol</p>
        <p className="text-gray-400 text-[10px]">8 min • Beginner</p>
      </div>

      {/* Bottom Nav */}
      <div className="mt-auto flex justify-around py-2 border-t border-gray-800">
        <div className="text-center">
          <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <span className="text-cyan-500 text-xs">🏠</span>
          </div>
          <span className="text-[8px] text-cyan-500">Home</span>
        </div>
        <div className="text-center">
          <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-xs">📊</span>
          </div>
          <span className="text-[8px] text-gray-500">Stats</span>
        </div>
        <div className="text-center">
          <div className="w-6 h-6 mx-auto mb-1 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-xs">👤</span>
          </div>
          <span className="text-[8px] text-gray-500">Profile</span>
        </div>
      </div>
    </div>
  );
}

// Example screen content - Auth UI (from Playbook)
function AuthScreen() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-[#0a1a1f] via-[#08090A] to-[#08090A] p-4 flex flex-col justify-center relative overflow-hidden">
      {/* Subtle aurora glow effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-24 h-24 bg-emerald-500/15 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 left-0 w-28 h-28 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* YP Logo */}
        <div className="flex justify-center mb-4">
          <div className="flex bg-neutral-900/80 w-10 h-10 rounded-xl relative shadow-[0_0_0_1px_rgba(82,82,91,0.7)] items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#00f6e0"
            >
              <path
                d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35"
                opacity=".5"
              />
              <path d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-5">
          <h1 className="text-white text-base font-semibold">Welcome Back</h1>
          <p className="text-gray-500 text-[10px] mt-1">Train smarter. Play better. Every day.</p>
        </div>

        {/* Social Buttons Row */}
        <div className="flex gap-2 mb-4">
          <button className="flex-1 flex items-center justify-center gap-1 bg-neutral-900/80 border border-neutral-800 rounded-lg py-2 text-[9px] text-gray-300">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#00f6e0">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Apple
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 bg-neutral-900/80 border border-neutral-800 rounded-lg py-2 text-[9px] text-gray-300">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#00f6e0">
              <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.2 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09 0 .11a13.1 13.1 0 0 1-1.64.78c-.04.01-.05.06-.04.09c.31.61.66 1.19 1.07 1.74c.03.01.06.02.09.01c1.67-.53 3.4-1.33 5.2-2.65c.02-.01.03-.03.03-.05c.44-4.52-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12z" />
            </svg>
            Discord
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 bg-neutral-900/80 border border-neutral-800 rounded-lg py-2 text-[9px] text-gray-300">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#00f6e0">
              <path d="M12 5a7 7 0 1 0 6.93 8H13a1 1 0 1 1 0-2h7a1 1 0 0 1 1 1a9 9 0 1 1-2.654-6.381a1 1 0 0 1-1.41 1.418A6.98 6.98 0 0 0 12 5" />
            </svg>
            Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-[8px] text-neutral-500">or</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Input Fields */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[8px] text-neutral-500 uppercase tracking-wider">
              Email address or username
            </span>
            <span className="text-[8px] text-[#00f6e0]">Use phone</span>
          </div>
          <input
            type="text"
            placeholder="Enter email or username"
            className="w-full bg-neutral-950/60 border border-neutral-800 rounded-lg px-3 py-2.5 text-white text-[10px] placeholder-neutral-600 focus:border-[#00f6e0] outline-none"
          />
        </div>

        {/* Continue Button */}
        <button className="w-full bg-[#00f6e0] text-black font-semibold py-2.5 rounded-full text-[11px] shadow-[0_8px_20px_rgba(0,246,224,0.3)] flex items-center justify-center gap-1">
          Continue
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>

        {/* Footer */}
        <p className="text-center text-neutral-500 text-[9px] mt-4">
          Don't have an account? <span className="text-[#00f6e0]">Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default function PortalFrameTest() {
  return (
    <div className="relative min-h-screen bg-[#08090A] overflow-hidden">
      {/* LAYER 1: RetroGrid Background */}
      <RetroGrid />

      {/* Content */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-cyan-500 text-xs uppercase tracking-[0.3em] mb-4">
              Portal Frame Architecture
            </p>
            <h1 className="text-4xl md:text-5xl font-yp-display uppercase text-white mb-4">
              The Pro Academy
              <span className="block text-cyan-500">In Your Pocket</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Modular "Layer Cake" architecture. Swap screen content without breaking 3D lighting or
              layout.
            </p>
          </div>

          {/* Phone Mockups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            {/* Dashboard Version */}
            <div>
              <PortalFrame
                screenContent={<DashboardScreen />}
                hologram="court"
                caption="System Status: Optimal"
              />
            </div>

            {/* Auth Version (from Playbook) */}
            <div>
              <PortalFrame screenContent={<AuthScreen />} hologram="data" caption="Welcome Back" />
            </div>
          </div>

          {/* Architecture Info */}
          <div className="bg-black/50 border border-gray-800 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-white font-bold mb-4">Layer Architecture</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center text-cyan-500 font-mono text-xs">
                  L1
                </span>
                <span className="text-gray-400">RetroGrid - Atmosphere background</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center text-cyan-500 font-mono text-xs">
                  L2
                </span>
                <span className="text-gray-400">
                  Phone Chassis - Static frame (transparent screen)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center text-cyan-500 font-mono text-xs">
                  L3
                </span>
                <span className="text-gray-400">
                  Screen Slot - Swappable content (image/video/code)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center text-cyan-500 font-mono text-xs">
                  L4
                </span>
                <span className="text-gray-400">
                  Hologram VFX - Floating elements (Z-Index: 50)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
