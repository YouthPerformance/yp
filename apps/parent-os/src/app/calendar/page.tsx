"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Filter } from "lucide-react";
import { EventCard, Event } from "@/components/event-card";
import { FixItSheet, FixItButton, Conflict } from "@/components/fix-it-sheet";
import { cn, formatDate } from "@/lib/utils";

// Mock data
const mockAthletes = [
  { id: "a1", name: "Jake", color: "#3B82F6", sports: ["Soccer", "Basketball"] },
  { id: "a2", name: "Emma", color: "#10B981", sports: ["Volleyball"] },
];

// Generate mock events for the week
const generateWeekEvents = (startDate: Date): Event[] => {
  const events: Event[] = [];
  const athletes = mockAthletes;

  // Add some events for each day
  for (let day = 0; day < 7; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);

    // Jake's events
    if (day !== 0 && day !== 6) {
      // Weekdays
      events.push({
        id: `jake-${day}-practice`,
        title: day % 2 === 0 ? "Soccer Practice" : "Basketball Practice",
        athleteName: "Jake",
        athleteColor: athletes[0].color,
        eventType: "practice",
        startTime: new Date(date.setHours(16, 30, 0, 0)).getTime(),
        endTime: new Date(date.setHours(18, 0, 0, 0)).getTime(),
        location: day % 2 === 0 ? "Lincoln Fields" : "YMCA Court 3",
        travelTimeMinutes: day % 2 === 0 ? 12 : 18,
        driverName: "Sarah",
        driverStatus: "confirmed",
      });
    }

    // Emma's events
    if (day === 1 || day === 3 || day === 5) {
      events.push({
        id: `emma-${day}-practice`,
        title: "Volleyball",
        athleteName: "Emma",
        athleteColor: athletes[1].color,
        eventType: "practice",
        startTime: new Date(date.setHours(17, 0, 0, 0)).getTime(),
        endTime: new Date(date.setHours(18, 30, 0, 0)).getTime(),
        location: "Rec Center",
        travelTimeMinutes: 15,
        driverName: "Mike",
        driverStatus: "assigned",
      });
    }

    // Saturday games (with conflict!)
    if (day === 6) {
      events.push({
        id: `jake-${day}-game`,
        title: "Soccer Game",
        athleteName: "Jake",
        athleteColor: athletes[0].color,
        eventType: "game",
        startTime: new Date(date.setHours(10, 0, 0, 0)).getTime(),
        endTime: new Date(date.setHours(11, 30, 0, 0)).getTime(),
        location: "Riverside Park",
        travelTimeMinutes: 22,
        driverStatus: "unassigned",
        hasConflict: true,
      });
      events.push({
        id: `emma-${day}-tournament`,
        title: "VB Tournament",
        athleteName: "Emma",
        athleteColor: athletes[1].color,
        eventType: "tournament",
        startTime: new Date(date.setHours(10, 0, 0, 0)).getTime(),
        endTime: new Date(date.setHours(16, 0, 0, 0)).getTime(),
        location: "Sports Complex",
        travelTimeMinutes: 18,
        driverStatus: "unassigned",
        hasConflict: true,
      });
    }
  }

  return events;
};

export default function CalendarPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday
    return new Date(today.setDate(diff));
  });

  const [selectedAthlete, setSelectedAthlete] = useState<string | null>(null);
  const [isFixItOpen, setIsFixItOpen] = useState(false);

  const events = generateWeekEvents(currentWeekStart);
  const filteredEvents = selectedAthlete
    ? events.filter((e) => e.athleteName === selectedAthlete)
    : events;

  // Group events by date
  const eventsByDate = filteredEvents.reduce(
    (acc, event) => {
      const dateKey = new Date(event.startTime).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
      return acc;
    },
    {} as Record<string, Event[]>
  );

  // Generate week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const conflictCount = events.filter((e) => e.hasConflict).length > 0 ? 1 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Pack Calendar</h1>
            <button className="p-2 text-gray-600">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => navigateWeek("prev")}
              className="p-1 text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-sm">
              {currentWeekStart.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {new Date(
                currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <button
              onClick={() => navigateWeek("next")}
              className="p-1 text-gray-600"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Athlete Filter */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedAthlete(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                selectedAthlete === null
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              )}
            >
              All
            </button>
            {mockAthletes.map((athlete) => (
              <button
                key={athlete.id}
                onClick={() => setSelectedAthlete(athlete.name)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
                  selectedAthlete === athlete.name
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: athlete.color }}
                />
                {athlete.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Week View */}
        <div className="space-y-4">
          {weekDates.map((date) => {
            const dateKey = date.toDateString();
            const dayEvents = eventsByDate[dateKey] || [];
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div key={dateKey}>
                {/* Day Header */}
                <div
                  className={cn(
                    "flex items-center gap-3 mb-2",
                    isToday && "text-blue-600"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex flex-col items-center justify-center text-xs",
                      isToday
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    <span className="font-bold text-sm">
                      {date.getDate()}
                    </span>
                    <span className="uppercase text-[10px] -mt-0.5">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Day Events */}
                {dayEvents.length > 0 ? (
                  <div className="space-y-2 ml-[52px]">
                    {dayEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        variant="compact"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 ml-[52px]">No events</p>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Fix-It Button */}
      <FixItButton conflictCount={conflictCount} onClick={() => setIsFixItOpen(true)} />

      {/* Fix-It Sheet */}
      <FixItSheet
        conflict={
          conflictCount > 0
            ? {
                id: "c1",
                type: "time_overlap",
                severity: "critical",
                description: "Soccer and VB Tournament both at 10:00am on Saturday",
                events: events.filter((e) => e.hasConflict),
                suggestedSolutions: [
                  {
                    rank: 1,
                    type: "carpool_request",
                    description: "Ask Martinez family to take Jake",
                    suggestedFamilyName: "Going to same game",
                    draftMessage: "Hi! Could Jake catch a ride to soccer Saturday?",
                  },
                  {
                    rank: 2,
                    type: "reschedule",
                    description: "Request game time change",
                  },
                ],
              }
            : null
        }
        isOpen={isFixItOpen}
        onClose={() => setIsFixItOpen(false)}
      />
    </div>
  );
}
