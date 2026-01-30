"use client";

import { MapPin, Clock, Car, AlertTriangle } from "lucide-react";
import { cn, formatTime, formatMinutes } from "@/lib/utils";

export interface Event {
  id: string;
  title: string;
  athleteName: string;
  athleteColor: string;
  eventType: "practice" | "game" | "tournament" | "meeting" | "other";
  startTime: number;
  endTime: number;
  location?: string;
  travelTimeMinutes?: number;
  prepStartTime?: number;
  leaveTime?: number;
  driverName?: string;
  driverStatus: "unassigned" | "assigned" | "confirmed" | "carpool_requested" | "carpool_confirmed";
  hasConflict?: boolean;
}

interface EventCardProps {
  event: Event;
  variant?: "compact" | "full" | "timeline";
  onRequestRide?: () => void;
}

const eventTypeIcons: Record<string, string> = {
  practice: "🏃",
  game: "🏆",
  tournament: "🎯",
  meeting: "📋",
  other: "📅",
};

export function EventCard({ event, variant = "full", onRequestRide }: EventCardProps) {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const leaveDate = event.leaveTime ? new Date(event.leaveTime) : null;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "p-3 rounded-lg border-l-4 bg-white shadow-sm",
          `border-l-[${event.athleteColor}]`,
          event.hasConflict && "ring-2 ring-amber-400"
        )}
        style={{ borderLeftColor: event.athleteColor }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">{event.athleteName}</p>
            <p className="font-semibold text-sm truncate">
              {eventTypeIcons[event.eventType]} {event.title}
            </p>
            <p className="text-xs text-gray-600">{formatTime(startDate)}</p>
          </div>
          {event.hasConflict && (
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          )}
        </div>
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: event.athleteColor }}
          />
          <div className="w-0.5 flex-1 bg-gray-200" />
        </div>
        <div className="flex-1 pb-4">
          <div
            className={cn(
              "p-3 rounded-lg bg-white shadow-sm border",
              event.hasConflict && "border-amber-400"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">{formatTime(startDate)}</span>
                  <span>{event.athleteName}</span>
                </div>
                <p className="font-semibold mt-0.5">
                  {eventTypeIcons[event.eventType]} {event.title}
                </p>
              </div>
              {event.hasConflict && (
                <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">
                  Conflict
                </span>
              )}
            </div>

            {event.location && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {(event.travelTimeMinutes || leaveDate) && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {leaveDate && `Leave ${formatTime(leaveDate)}`}
                  {event.travelTimeMinutes && ` · ${formatMinutes(event.travelTimeMinutes)} drive`}
                </span>
              </div>
            )}

            {event.driverName && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
                <Car className="w-3.5 h-3.5" />
                <span>{event.driverName} driving</span>
              </div>
            )}

            {event.driverStatus === "unassigned" && onRequestRide && (
              <button
                onClick={onRequestRide}
                className="mt-2 w-full py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                Request Ride
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div
      className={cn(
        "p-4 rounded-xl border-l-4 bg-white shadow-sm",
        event.hasConflict && "ring-2 ring-amber-400"
      )}
      style={{ borderLeftColor: event.athleteColor }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            {event.athleteName}
          </p>
          <h3 className="font-semibold text-lg mt-0.5">
            {eventTypeIcons[event.eventType]} {event.title}
          </h3>
          <p className="text-sm text-gray-700 mt-1">
            {formatTime(startDate)} - {formatTime(endDate)}
          </p>
        </div>
        {event.hasConflict && (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            Conflict
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {event.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{event.location}</span>
            {event.travelTimeMinutes && (
              <span className="text-gray-400">· {formatMinutes(event.travelTimeMinutes)}</span>
            )}
          </div>
        )}

        {leaveDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>
              Leave at <span className="font-medium">{formatTime(leaveDate)}</span>
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Car className="w-4 h-4 text-gray-400" />
          {event.driverName ? (
            <span>
              {event.driverName}{" "}
              <span className="text-gray-400">
                ({event.driverStatus === "confirmed" ? "confirmed" : "assigned"})
              </span>
            </span>
          ) : (
            <span className="text-amber-600">No driver assigned</span>
          )}
        </div>
      </div>

      {event.driverStatus === "unassigned" && onRequestRide && (
        <button
          onClick={onRequestRide}
          className="mt-3 w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Request Ride
        </button>
      )}
    </div>
  );
}
