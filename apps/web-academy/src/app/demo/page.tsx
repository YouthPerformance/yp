// ===================================================================
// DEMO INDEX
// Lists available demo routes
// ===================================================================

import Link from "next/link";

const DEMO_ROUTES = [
  {
    slug: "bulletproof-ankles",
    title: "Bulletproof Ankles",
    description: "Interactive Learning Module - swipe card experience",
    type: "ILM",
  },
  {
    slug: "home",
    title: "Dashboard",
    description: "Main athlete dashboard with XP and progress",
    type: "Dashboard",
  },
];

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bebas uppercase tracking-wider mb-2">
          Demo Mode
        </h1>
        <p className="text-gray-400 mb-8">
          Shareable prototype links - no login required
        </p>

        <div className="space-y-4">
          {DEMO_ROUTES.map((route) => (
            <Link
              key={route.slug}
              href={`/demo/${route.slug}`}
              className="block p-6 rounded-xl border border-gray-700 hover:border-cyan-500
                       bg-gray-900/50 transition-all hover:bg-gray-800/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-medium">{route.title}</h2>
                <span className="text-xs px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">
                  {route.type}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{route.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl border border-gray-700 bg-gray-900/30">
          <h3 className="font-medium mb-2">How it works</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Demo routes bypass authentication</li>
            <li>• Uses mock user data (Pro subscription)</li>
            <li>• Safe to share with stakeholders</li>
            <li>• Not indexed by search engines</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
