"use client";

import { ChevronRight, Plus, RefreshCw, MapPin, Clock, Shield, Bell, Plug } from "lucide-react";
import { cn } from "@/lib/utils";

const mockPack = {
  name: "The Smith Family",
  members: [
    { id: "m1", name: "Sarah", role: "owner", email: "sarah@email.com", canDrive: true },
    { id: "m2", name: "Mike", role: "parent", email: "mike@email.com", canDrive: true },
  ],
  athletes: [
    { id: "a1", name: "Jake", age: 12, sports: ["Soccer", "Basketball"], color: "#3B82F6" },
    { id: "a2", name: "Emma", age: 9, sports: ["Volleyball"], color: "#10B981" },
  ],
  sources: [
    { id: "s1", name: "Google Calendar", type: "google_calendar", status: "connected", lastSync: "5 min ago" },
    { id: "s2", name: "TeamSnap", type: "teamsnap", status: "connected", lastSync: "5 min ago" },
    { id: "s3", name: "Lincoln Middle School", type: "ics_feed", status: "connected", lastSync: "1 hour ago" },
  ],
  preferences: {
    homeAddress: "123 Oak Street, Denver, CO 80202",
    prepTime: 30,
    arrivalBuffer: 10,
    timezone: "America/Denver",
  },
};

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Your Pack */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Your Pack
          </h2>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {mockPack.members.map((member, i) => (
              <button
                key={member.id}
                className={cn(
                  "w-full p-4 flex items-center justify-between text-left",
                  i < mockPack.members.length - 1 && "border-b"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {member.name}
                      {member.role === "owner" && (
                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}

            {/* Athletes */}
            <div className="border-t bg-gray-50 px-4 py-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Athletes</p>
            </div>
            {mockPack.athletes.map((athlete, i) => (
              <button
                key={athlete.id}
                className={cn(
                  "w-full p-4 flex items-center justify-between text-left",
                  i < mockPack.athletes.length - 1 && "border-b"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: athlete.color }}
                  >
                    {athlete.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">
                      {athlete.name}{" "}
                      <span className="text-gray-500">({athlete.age})</span>
                    </p>
                    <p className="text-xs text-gray-500">{athlete.sports.join(", ")}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}

            <button className="w-full p-4 flex items-center gap-3 text-blue-600 border-t">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add family member</span>
            </button>
          </div>
        </section>

        {/* Connected Sources */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Connected Sources
          </h2>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            {mockPack.sources.map((source, i) => (
              <button
                key={source.id}
                className={cn(
                  "w-full p-4 flex items-center justify-between text-left",
                  i < mockPack.sources.length - 1 && "border-b"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      source.type === "google_calendar"
                        ? "bg-blue-100 text-blue-600"
                        : source.type === "teamsnap"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <Plug className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{source.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Synced {source.lastSync}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}

            <button className="w-full p-4 flex items-center gap-3 text-blue-600 border-t">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Connect another source</span>
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Preferences
          </h2>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between text-left border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Home Address</p>
                  <p className="text-xs text-gray-500 truncate max-w-[200px]">
                    {mockPack.preferences.homeAddress}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full p-4 flex items-center justify-between text-left border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Prep Time</p>
                  <p className="text-xs text-gray-500">
                    {mockPack.preferences.prepTime} minutes before events
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full p-4 flex items-center justify-between text-left border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Protected Times</p>
                  <p className="text-xs text-gray-500">1 time blocked</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Notifications
          </h2>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <button className="w-full p-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Notification Settings</p>
                  <p className="text-xs text-gray-500">Conflicts, reminders, updates</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>

        {/* YP Academy Upsell */}
        <section>
          <div className="p-4 bg-gradient-to-r from-black to-gray-800 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🐺</span>
              <span className="font-semibold">YP Academy</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              Get personalized training tips and wellness insights for your athletes.
            </p>
            <button className="w-full py-2.5 bg-white text-black font-semibold rounded-xl">
              Connect →
            </button>
          </div>
        </section>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 py-4">
          YP Parent OS v0.1.0
        </p>
      </main>
    </div>
  );
}
