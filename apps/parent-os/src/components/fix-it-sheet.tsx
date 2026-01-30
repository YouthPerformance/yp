"use client";

import { useState, useRef, useCallback } from "react";
import { X, AlertTriangle, Car, Calendar, XCircle, HelpCircle, Undo2 } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { Event } from "./event-card";

export interface Conflict {
  id: string;
  type: "time_overlap" | "travel_impossible" | "driver_unavailable" | "protected_time";
  severity: "critical" | "warning" | "info";
  events: Event[];
  description: string;
  suggestedSolutions: Solution[];
}

export interface Solution {
  rank: number;
  type: "split_drivers" | "carpool_request" | "reschedule" | "skip_event" | "manual";
  description: string;
  suggestedFamilyName?: string;
  draftMessage?: string;
}

interface FixItSheetProps {
  conflict: Conflict | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (solution: Solution) => void;
  onReschedule?: (solution: Solution) => void;
  onSkipEvent?: (eventId: string) => void;
}

export function FixItSheet({
  conflict,
  isOpen,
  onClose,
  onSendMessage,
  onReschedule,
  onSkipEvent,
}: FixItSheetProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartRef = useRef<number>(0);

  const handleHoldStart = useCallback((solution: Solution) => {
    setIsHolding(true);
    holdStartRef.current = Date.now();

    const updateProgress = () => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / 800, 1); // 800ms hold time
      setHoldProgress(progress);

      if (progress >= 1) {
        // Trigger action
        if (solution.type === "carpool_request" && onSendMessage) {
          onSendMessage(solution);
        } else if (solution.type === "reschedule" && onReschedule) {
          onReschedule(solution);
        }
        handleHoldEnd();
      } else {
        holdTimerRef.current = setTimeout(updateProgress, 16); // ~60fps
      }
    };

    holdTimerRef.current = setTimeout(updateProgress, 16);
  }, [onSendMessage, onReschedule]);

  const handleHoldEnd = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
    }
    setIsHolding(false);
    setHoldProgress(0);
  }, []);

  if (!isOpen || !conflict) return null;

  const recommendedSolution = conflict.suggestedSolutions.find((s) => s.rank === 1);
  const alternativeSolutions = conflict.suggestedSolutions.filter((s) => s.rank > 1);

  const getSolutionIcon = (type: Solution["type"]) => {
    switch (type) {
      case "carpool_request":
        return <Car className="w-5 h-5" />;
      case "reschedule":
        return <Calendar className="w-5 h-5" />;
      case "skip_event":
        return <XCircle className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  conflict.severity === "critical"
                    ? "bg-red-100 text-red-600"
                    : conflict.severity === "warning"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-blue-100 text-blue-600"
                )}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Fix It</h2>
                <p className="text-xs text-gray-500">
                  {conflict.severity === "critical" ? "Logistics impossible" : "Conflict detected"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conflict Details */}
          <div className="px-4 py-3 bg-gray-50 border-b">
            <p className="text-sm font-medium text-gray-900">{conflict.description}</p>
            <div className="mt-2 space-y-1">
              {conflict.events.map((event) => (
                <div key={event.id} className="flex items-center gap-2 text-sm text-gray-600">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: event.athleteColor }}
                  />
                  <span className="font-medium">{event.athleteName}:</span>
                  <span>{event.title}</span>
                  <span className="text-gray-400">
                    {formatTime(new Date(event.startTime))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Plan */}
          {recommendedSolution && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Recommended Plan
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
                    {getSolutionIcon(recommendedSolution.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {recommendedSolution.description}
                    </p>
                    {recommendedSolution.suggestedFamilyName && (
                      <p className="text-sm text-gray-600 mt-1">
                        {recommendedSolution.suggestedFamilyName}
                      </p>
                    )}
                    {recommendedSolution.draftMessage && (
                      <div className="mt-2 p-2 bg-white rounded-lg text-sm text-gray-600 italic">
                        "{recommendedSolution.draftMessage.slice(0, 100)}..."
                      </div>
                    )}
                  </div>
                </div>

                {/* Hold to Send Button */}
                {(recommendedSolution.type === "carpool_request" ||
                  recommendedSolution.type === "reschedule") && (
                  <button
                    className="mt-3 w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl relative overflow-hidden"
                    onMouseDown={() => handleHoldStart(recommendedSolution)}
                    onMouseUp={handleHoldEnd}
                    onMouseLeave={handleHoldEnd}
                    onTouchStart={() => handleHoldStart(recommendedSolution)}
                    onTouchEnd={handleHoldEnd}
                  >
                    <div
                      className="absolute inset-0 bg-emerald-700 origin-left transition-transform"
                      style={{ transform: `scaleX(${holdProgress})` }}
                    />
                    <span className="relative z-10">
                      {isHolding ? "Hold to Send..." : "Hold to Send Request"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Alternative Solutions */}
          {alternativeSolutions.length > 0 && (
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Plan B
              </div>
              <div className="space-y-2">
                {alternativeSolutions.map((solution) => (
                  <button
                    key={solution.rank}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-left hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      if (solution.type === "skip_event" && onSkipEvent && conflict.events[0]) {
                        onSkipEvent(conflict.events[0].id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                        {getSolutionIcon(solution.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {solution.description}
                        </p>
                        {solution.suggestedFamilyName && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {solution.suggestedFamilyName}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <HelpCircle className="w-4 h-4" />
              Why?
            </button>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
              <Undo2 className="w-4 h-4" />
              Undo history
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Floating Fix-It Button for use on other pages
export function FixItButton({
  conflictCount,
  onClick,
}: {
  conflictCount: number;
  onClick: () => void;
}) {
  if (conflictCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed right-4 bottom-24 z-30 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all",
        "bg-amber-500 text-white hover:bg-amber-600 active:scale-95"
      )}
    >
      <AlertTriangle className="w-5 h-5" />
      <span className="font-semibold">Fix It</span>
      <span className="ml-1 w-6 h-6 bg-white text-amber-600 rounded-full text-sm font-bold flex items-center justify-center">
        {conflictCount}
      </span>
    </button>
  );
}
