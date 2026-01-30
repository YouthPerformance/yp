"use client";

import { useState } from "react";
import { Cloud, Sun, Clock, MapPin, AlertTriangle, Bell, ChevronRight } from "lucide-react";
import { EventCard, Event } from "@/components/event-card";
import { FixItSheet, FixItButton, Conflict, Solution } from "@/components/fix-it-sheet";
import { cn, formatTime, getMinutesUntil, formatMinutes } from "@/lib/utils";

// Mock data - in production this comes from Convex
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Soccer Practice",
    athleteName: "Jake",
    athleteColor: "#3B82F6",
    eventType: "practice",
    startTime: Date.now() + 1000 * 60 * 78, // 78 min from now
    endTime: Date.now() + 1000 * 60 * 168,
    location: "Lincoln Fields",
    travelTimeMinutes: 12,
    prepStartTime: Date.now() + 1000 * 60 * 30,
    leaveTime: Date.now() + 1000 * 60 * 56,
    driverName: "Sarah",
    driverStatus: "confirmed",
  },
  {
    id: "2",
    title: "Volleyball",
    athleteName: "Emma",
    athleteColor: "#10B981",
    eventType: "practice",
    startTime: Date.now() + 1000 * 60 * 108,
    endTime: Date.now() + 1000 * 60 * 198,
    location: "Rec Center",
    travelTimeMinutes: 15,
    leaveTime: Date.now() + 1000 * 60 * 83,
    driverName: "Mike",
    driverStatus: "assigned",
  },
];

const mockConflict: Conflict = {
  id: "c1",
  type: "time_overlap",
  severity: "critical",
  description: "Soccer and VB Tournament both at 10:00am on Saturday",
  events: [
    {
      id: "3",
      title: "Soccer Game",
      athleteName: "Jake",
      athleteColor: "#3B82F6",
      eventType: "game",
      startTime: Date.now() + 1000 * 60 * 60 * 72, // Saturday
      endTime: Date.now() + 1000 * 60 * 60 * 74,
      location: "Riverside Park",
      travelTimeMinutes: 22,
      driverStatus: "unassigned",
    },
    {
      id: "4",
      title: "VB Tournament",
      athleteName: "Emma",
      athleteColor: "#10B981",
      eventType: "tournament",
      startTime: Date.now() + 1000 * 60 * 60 * 72,
      endTime: Date.now() + 1000 * 60 * 60 * 78,
      location: "Sports Complex",
      travelTimeMinutes: 18,
      driverStatus: "unassigned",
    },
  ],
  suggestedSolutions: [
    {
      rank: 1,
      type: "carpool_request",
      description: "Ask Martinez family to take Jake to soccer",
      suggestedFamilyName: "They're going to the same game (0.8 mi from you)",
      draftMessage:
        "Hi! Any chance Jake could catch a ride to soccer on Saturday? We have a conflict with Emma's tournament. Happy to return the favor anytime!",
    },
    {
      rank: 2,
      type: "reschedule",
      description: "Request to move Jake's game to 1:00pm slot",
      suggestedFamilyName: "3 teams have availability",
    },
    {
      rank: 3,
      type: "skip_event",
      description: "Mark Jake or Emma as unavailable",
    },
  ],
};

const mockChanges = [
  {
    id: "ch1",
    type: "location_change",
    description: "Practice moved to Field B",
    source: "TeamSnap",
    eventTitle: "Jake Soccer",
    timestamp: Date.now() - 1000 * 60 * 45,
  },
  {
    id: "ch2",
    type: "time_change",
    description: "Tournament schedule posted",
    source: "Email",
    eventTitle: "Emma VB",
    timestamp: Date.now() - 1000 * 60 * 120,
  },
];

export default function TodayPage() {
  const [isFixItOpen, setIsFixItOpen] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);

  const nextEvent = mockEvents[0];
  const minutesUntilLeave = nextEvent.leaveTime
    ? getMinutesUntil(nextEvent.leaveTime)
    : getMinutesUntil(nextEvent.startTime);

  const handleOpenConflict = () => {
    setSelectedConflict(mockConflict);
    setIsFixItOpen(true);
  };

  const handleSendMessage = (solution: Solution) => {
    console.log("Sending message:", solution.draftMessage);
    setIsFixItOpen(false);
    // In production: call Convex mutation to create carpool request
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Today</h1>
            <p className="text-xs text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Weather */}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>52°F</span>
            </div>
            {/* Notifications */}
            <button className="relative p-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Next Up - Hero Card */}
        <section>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-transparent">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Next Up
                </span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    minutesUntilLeave <= 30
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  Leave in {formatMinutes(minutesUntilLeave)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-1.5 rounded-full h-16"
                  style={{ backgroundColor: nextEvent.athleteColor }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 font-medium">
                    {nextEvent.athleteName}
                  </p>
                  <h2 className="text-lg font-bold mt-0.5">{nextEvent.title}</h2>
                  <p className="text-sm text-gray-600">
                    {formatTime(new Date(nextEvent.startTime))}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700 truncate">{nextEvent.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {formatMinutes(nextEvent.travelTimeMinutes!)} drive
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 py-2.5 bg-black text-white text-sm font-semibold rounded-xl">
                  Open Route
                </button>
                <button className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl">
                  Who's driving?
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Conflict Alert Banner */}
        {mockConflict && (
          <section>
            <button
              onClick={handleOpenConflict}
              className="w-full p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-left"
            >
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-900">1 Conflict Needs Attention</p>
                <p className="text-sm text-amber-700 truncate">
                  Saturday: Jake + Emma both have events at 10am
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400" />
            </button>
          </section>
        )}

        {/* Recent Changes */}
        {mockChanges.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Changes ({mockChanges.length})
            </h3>
            <div className="space-y-2">
              {mockChanges.map((change) => (
                <div
                  key={change.id}
                  className="p-3 bg-white rounded-xl border flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {change.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {change.eventTitle} · via {change.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Later Today Timeline */}
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Later Today
          </h3>
          <div className="space-y-0">
            {mockEvents.slice(1).map((event) => (
              <EventCard key={event.id} event={event} variant="timeline" />
            ))}
          </div>
        </section>
      </main>

      {/* Fix-It Button (floating) */}
      <FixItButton conflictCount={1} onClick={handleOpenConflict} />

      {/* Fix-It Sheet */}
      <FixItSheet
        conflict={selectedConflict}
        isOpen={isFixItOpen}
        onClose={() => setIsFixItOpen(false)}
        onSendMessage={handleSendMessage}
        onReschedule={(solution) => console.log("Reschedule:", solution)}
        onSkipEvent={(eventId) => console.log("Skip event:", eventId)}
      />
    </div>
  );
}
