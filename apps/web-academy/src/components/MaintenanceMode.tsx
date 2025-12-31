'use client';

/**
 * Maintenance Mode Component
 * Displayed when NEXT_PUBLIC_MAINTENANCE_MODE=true
 */
export function MaintenanceMode() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center px-8">
        <div className="text-6xl mb-6">🐺</div>
        <h1 className="font-display text-4xl md:text-5xl text-[#00f6e0] mb-4 tracking-wide">
          WE&apos;RE UPGRADING
        </h1>
        <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
          The pack is making improvements to your training experience.
          We&apos;ll be back shortly with something even better.
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-[#00f6e0] rounded-full animate-pulse" />
          <span>Systems updating...</span>
        </div>
      </div>
    </div>
  );
}
