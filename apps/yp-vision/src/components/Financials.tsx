"use client";

import { motion } from "framer-motion";
import { Clock, DollarSign, Percent, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COHORT_DATA, GROWTH_DATA, UNIT_ECONOMICS } from "@/lib/constants";

export function Financials() {
  const unitEconMetrics = [
    {
      icon: DollarSign,
      label: "CAC",
      value: `$${UNIT_ECONOMICS.cac}`,
      color: "text-wolf-orange",
    },
    {
      icon: TrendingUp,
      label: "LTV",
      value: `$${UNIT_ECONOMICS.ltv}`,
      color: "text-wolf-neon",
    },
    {
      icon: Clock,
      label: "Payback",
      value: `${UNIT_ECONOMICS.paybackMonths}mo`,
      color: "text-wolf-blue",
    },
    {
      icon: Percent,
      label: "Gross Margin",
      value: `${UNIT_ECONOMICS.grossMargin}%`,
      color: "text-purple-400",
    },
  ];

  return (
    <section className="section bg-wolf-black relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-wolf-neon font-mono text-sm tracking-[0.3em] uppercase mb-4">
            The Economics
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold">
            PROFITABLE <span className="text-wolf-neon">ACQUISITION</span>
          </h2>
        </motion.div>

        {/* Unit Economics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {unitEconMetrics.map((metric, _i) => (
            <div
              key={metric.label}
              className="bg-wolf-gray/30 border border-gray-800 rounded-xl p-4 text-center"
            >
              <metric.icon className={`w-5 h-5 ${metric.color} mx-auto mb-2`} />
              <p className={`text-2xl md:text-3xl font-bold ${metric.color}`}>{metric.value}</p>
              <p className="text-gray-500 text-sm">{metric.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* ARR Growth Chart */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-wolf-gray/20 border border-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-1">ARR Growth</h3>
            <p className="text-gray-500 text-sm mb-4">2024 YTD</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GROWTH_DATA}>
                  <defs>
                    <linearGradient id="arrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                    tickFormatter={(v) => `$${v / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`$${(value / 1000).toFixed(0)}K`, "ARR"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="arr"
                    stroke="#00ff88"
                    strokeWidth={2}
                    fill="url(#arrGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Cohort Retention Chart */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-wolf-gray/20 border border-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-1">Cohort Retention</h3>
            <p className="text-gray-500 text-sm mb-4">Hardware + Subscription Combo</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={COHORT_DATA}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                    tickFormatter={(v) => `M${v}`}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#666", fontSize: 12 }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Retention"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="retention"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={{ fill: "#00d4ff", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* LTV:CAC Ratio Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-wolf-neon/10 border border-wolf-neon/30 rounded-full px-6 py-3">
            <span className="text-gray-400">LTV:CAC Ratio</span>
            <span className="text-3xl font-bold text-wolf-neon">9:1</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
