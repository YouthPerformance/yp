"use client";

import { useState } from "react";
import { Plus, MapPin, Clock, Check, X, HelpCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarpoolRequest {
  id: string;
  type: "need" | "offer";
  status: "pending" | "accepted" | "declined";
  athleteName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  location: string;
  familyName?: string;
  message?: string;
  createdAt: number;
}

const mockRequests: CarpoolRequest[] = [
  {
    id: "1",
    type: "need",
    status: "pending",
    athleteName: "Jake",
    eventTitle: "Soccer Game",
    eventDate: "Sat 2/1",
    eventTime: "10:00am",
    location: "Riverside Park",
    familyName: "Martinez Family",
    message: "Sent 2 hours ago",
    createdAt: Date.now() - 1000 * 60 * 120,
  },
  {
    id: "2",
    type: "need",
    status: "accepted",
    athleteName: "Emma",
    eventTitle: "Volleyball",
    eventDate: "Thu 1/30",
    eventTime: "5:00pm",
    location: "Rec Center",
    familyName: "Lisa Chen",
    message: "Pickup at 4:15pm",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

const mockIncoming: CarpoolRequest[] = [
  {
    id: "3",
    type: "offer",
    status: "pending",
    athleteName: "Tommy Johnson",
    eventTitle: "Soccer Game",
    eventDate: "Sat 2/1",
    eventTime: "10:00am",
    location: "Riverside Park",
    familyName: "Johnson Family",
    message: "Same game as Jake",
    createdAt: Date.now() - 1000 * 60 * 30,
  },
];

const mockConnections = [
  { id: "c1", name: "Martinez Family", ridesGiven: 4, ridesReceived: 3 },
  { id: "c2", name: "Chen Family", ridesGiven: 2, ridesReceived: 5 },
  { id: "c3", name: "Johnson Family", ridesGiven: 1, ridesReceived: 0 },
];

export default function CarpoolPage() {
  const [activeTab, setActiveTab] = useState<"requests" | "history">("requests");

  const totalRidesGiven = mockConnections.reduce((sum, c) => sum + c.ridesGiven, 0);
  const totalRidesReceived = mockConnections.reduce((sum, c) => sum + c.ridesReceived, 0);
  const balance = totalRidesGiven - totalRidesReceived;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">Carpool Board</h1>
          <button className="p-2 text-gray-600">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-3 flex gap-2">
          <button className="flex-1 py-2.5 bg-black text-white text-sm font-semibold rounded-xl">
            Offer a Ride
          </button>
          <button className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl">
            Request a Ride
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-t">
          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === "requests"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            )}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === "history"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            )}
          >
            History
          </button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {activeTab === "requests" ? (
          <>
            {/* Incoming Requests */}
            {mockIncoming.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Requests for You
                </h2>
                <div className="space-y-2">
                  {mockIncoming.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm"
                    >
                      <div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        New Request
                      </div>
                      <p className="font-semibold">{request.athleteName} needs a ride</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.eventTitle} · {request.eventDate} {request.eventTime}
                      </p>
                      <p className="text-sm text-gray-500">{request.message}</p>

                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-1">
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg flex items-center justify-center gap-1">
                          <X className="w-4 h-4" />
                          Decline
                        </button>
                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                          <HelpCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Your Requests */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Your Requests
              </h2>
              <div className="space-y-2">
                {mockRequests.map((request) => (
                  <div key={request.id} className="p-4 bg-white rounded-xl border shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded-full text-xs font-medium",
                            request.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : request.status === "accepted"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {request.status === "pending"
                            ? "Pending"
                            : request.status === "accepted"
                              ? "Confirmed"
                              : "Declined"}
                        </span>
                        <p className="font-semibold mt-1">
                          {request.athleteName} → {request.eventTitle}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.eventDate} {request.eventTime}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {request.location}
                    </div>

                    {request.familyName && (
                      <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                        {request.status === "accepted" ? (
                          <span className="text-emerald-700">
                            Driver: <span className="font-medium">{request.familyName}</span>
                          </span>
                        ) : (
                          <span>
                            Sent to: <span className="font-medium">{request.familyName}</span>
                          </span>
                        )}
                        {request.message && (
                          <span className="text-gray-400"> · {request.message}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Balance Summary */}
            <section className="p-4 bg-white rounded-xl border shadow-sm">
              <h2 className="font-semibold mb-3">This Month</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">{totalRidesGiven}</p>
                  <p className="text-xs text-gray-500">You drove</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{totalRidesReceived}</p>
                  <p className="text-xs text-gray-500">Others drove</p>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      balance > 0
                        ? "text-emerald-600"
                        : balance < 0
                          ? "text-amber-600"
                          : "text-gray-600"
                    )}
                  >
                    {balance > 0 ? `+${balance}` : balance}
                  </p>
                  <p className="text-xs text-gray-500">Balance</p>
                </div>
              </div>
            </section>

            {/* Carpool Partners */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Carpool Partners
              </h2>
              <div className="space-y-2">
                {mockConnections.map((connection) => (
                  <button
                    key={connection.id}
                    className="w-full p-4 bg-white rounded-xl border shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                        {connection.name.charAt(0)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{connection.name}</p>
                        <p className="text-xs text-gray-500">
                          Given {connection.ridesGiven} · Received {connection.ridesReceived}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
