"use client";

import { useState } from "react";
import { AlertTriangle, Check, ChevronRight, DollarSign, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Fee {
  id: string;
  title: string;
  athleteName: string;
  amount: number;
  dueDate: number;
  status: "upcoming" | "due_soon" | "overdue" | "paid";
  category: "registration" | "tournament" | "equipment" | "travel";
  paidAt?: number;
}

const mockFees: Fee[] = [
  {
    id: "1",
    title: "Soccer Tournament Entry",
    athleteName: "Jake",
    amount: 12500, // cents
    dueDate: Date.now() + 1000 * 60 * 60 * 24 * 3,
    status: "due_soon",
    category: "tournament",
  },
  {
    id: "2",
    title: "Spring VB League",
    athleteName: "Emma",
    amount: 45000,
    dueDate: Date.now() + 1000 * 60 * 60 * 24 * 18,
    status: "upcoming",
    category: "registration",
  },
  {
    id: "3",
    title: "Basketball League",
    athleteName: "Jake",
    amount: 20000,
    dueDate: Date.now() - 1000 * 60 * 60 * 24 * 13,
    status: "paid",
    category: "registration",
    paidAt: Date.now() - 1000 * 60 * 60 * 24 * 13,
  },
  {
    id: "4",
    title: "Soccer Cleats",
    athleteName: "Jake",
    amount: 8900,
    dueDate: Date.now() - 1000 * 60 * 60 * 24 * 30,
    status: "paid",
    category: "equipment",
    paidAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
];

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getDaysUntil = (timestamp: number) => {
  return Math.ceil((timestamp - Date.now()) / (1000 * 60 * 60 * 24));
};

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState<"due" | "paid">("due");

  const dueFees = mockFees.filter((f) => f.status !== "paid");
  const paidFees = mockFees.filter((f) => f.status === "paid");

  // Calculate totals
  const totalDue = dueFees.reduce((sum, f) => sum + f.amount, 0);
  const totalPaidThisYear = paidFees.reduce((sum, f) => sum + f.amount, 0);

  // Group by athlete
  const spendingByAthlete = mockFees.reduce(
    (acc, fee) => {
      if (fee.status === "paid") {
        acc[fee.athleteName] = (acc[fee.athleteName] || 0) + fee.amount;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Fees & Payments</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-t">
          <button
            onClick={() => setActiveTab("due")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === "due"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            )}
          >
            Due ({dueFees.length})
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={cn(
              "flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === "paid"
                ? "border-black text-black"
                : "border-transparent text-gray-500"
            )}
          >
            Paid
          </button>
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {activeTab === "due" ? (
          <>
            {/* Total Due Summary */}
            {totalDue > 0 && (
              <section className="p-4 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Total Due</p>
                    <p className="text-2xl font-bold text-amber-900">
                      {formatCurrency(totalDue)}
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-amber-400" />
                </div>
              </section>
            )}

            {/* Due Soon */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Due Soon
              </h2>
              <div className="space-y-2">
                {dueFees
                  .filter((f) => f.status === "due_soon" || f.status === "overdue")
                  .map((fee) => {
                    const daysUntil = getDaysUntil(fee.dueDate);
                    return (
                      <div
                        key={fee.id}
                        className="p-4 bg-white rounded-xl border border-amber-200 shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-medium text-amber-600">
                                {daysUntil > 0
                                  ? `Due in ${daysUntil} days`
                                  : "Overdue"}
                              </span>
                            </div>
                            <p className="font-semibold mt-1">{fee.title}</p>
                            <p className="text-sm text-gray-600">{fee.athleteName}</p>
                          </div>
                          <p className="text-lg font-bold">{formatCurrency(fee.amount)}</p>
                        </div>

                        <div className="mt-3 flex gap-2">
                          <button className="flex-1 py-2.5 bg-black text-white text-sm font-semibold rounded-xl">
                            Pay Now
                          </button>
                          <button className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl">
                            Remind Me
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>

            {/* Upcoming */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Upcoming
              </h2>
              <div className="space-y-2">
                {dueFees
                  .filter((f) => f.status === "upcoming")
                  .map((fee) => (
                    <div
                      key={fee.id}
                      className="p-4 bg-white rounded-xl border shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            Due {formatDate(fee.dueDate)}
                          </div>
                          <p className="font-semibold mt-1">{fee.title}</p>
                          <p className="text-sm text-gray-600">{fee.athleteName}</p>
                        </div>
                        <p className="text-lg font-bold">{formatCurrency(fee.amount)}</p>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl">
                          Pay Now
                        </button>
                        <button className="px-4 py-2 text-gray-500 text-sm rounded-xl">
                          Set Reminder
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* 2026 Spending Summary */}
            <section className="p-4 bg-white rounded-xl border shadow-sm">
              <h2 className="font-semibold mb-3">2026 Spending</h2>
              <p className="text-3xl font-bold">{formatCurrency(totalPaidThisYear)}</p>

              <div className="mt-4 space-y-2">
                {Object.entries(spendingByAthlete).map(([athlete, amount]) => (
                  <div key={athlete} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{athlete}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full py-2 text-sm text-blue-600 font-medium">
                View Full Breakdown →
              </button>
            </section>

            {/* Paid History */}
            <section>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Recently Paid
              </h2>
              <div className="space-y-2">
                {paidFees.map((fee) => (
                  <div
                    key={fee.id}
                    className="p-4 bg-white rounded-xl border shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium">{fee.title}</p>
                        <p className="text-xs text-gray-500">
                          {fee.athleteName} · Paid {formatDate(fee.paidAt!)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">{formatCurrency(fee.amount)}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
