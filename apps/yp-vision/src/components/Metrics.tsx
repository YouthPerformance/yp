"use client";

import { motion, useInView } from "framer-motion";
import { Globe, Repeat, TrendingUp, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LIVE_TICKER_ITEMS, METRICS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/utils";

function AnimatedCounter({
  value,
  format = "number",
  suffix = "",
  prefix = "",
}: {
  value: number;
  format?: "number" | "currency" | "percent";
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatted =
    format === "currency"
      ? formatCurrency(count)
      : format === "percent"
        ? `${count}%`
        : formatNumber(count);

  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

function LiveTicker() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-wolf-dark/80 backdrop-blur-sm border-t border-gray-800 py-3 overflow-hidden">
      <div className="animate-ticker flex whitespace-nowrap">
        {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, i) => (
          <span key={i} className="mx-8 text-sm text-gray-400">
            <span className="text-wolf-neon font-medium">LIVE:</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Metrics() {
  const metrics = [
    {
      icon: TrendingUp,
      label: "ARR",
      value: METRICS.arr,
      format: "currency" as const,
      color: "text-wolf-neon",
    },
    {
      icon: Users,
      label: "Active Users",
      value: METRICS.users,
      format: "number" as const,
      color: "text-wolf-blue",
    },
    {
      icon: Repeat,
      label: "3-Month Retention",
      value: METRICS.retention,
      format: "percent" as const,
      color: "text-wolf-orange",
    },
    {
      icon: Globe,
      label: "Countries",
      value: METRICS.countriesActive,
      format: "number" as const,
      color: "text-purple-400",
    },
  ];

  return (
    <section className="section bg-wolf-black relative">
      <div className="text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-wolf-neon font-mono text-sm tracking-[0.3em] uppercase mb-4">
            The Machine
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-12">
            WE ARE A <span className="text-wolf-neon">MACHINE</span>
          </h2>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-wolf-gray/30 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
            >
              <metric.icon className={`w-6 h-6 ${metric.color} mb-3`} />
              <p className={`text-4xl md:text-5xl font-bold ${metric.color} mb-1`}>
                <AnimatedCounter value={metric.value} format={metric.format} />
              </p>
              <p className="text-gray-500 text-sm">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center gap-12 text-center"
        >
          <div>
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter value={METRICS.workoutsToday} />
            </p>
            <p className="text-gray-500 text-sm">Workouts Today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter value={METRICS.ballsSold} suffix="+" />
            </p>
            <p className="text-gray-500 text-sm">Balls Sold</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              <AnimatedCounter value={METRICS.nps} />
            </p>
            <p className="text-gray-500 text-sm">NPS Score</p>
          </div>
        </motion.div>
      </div>

      <LiveTicker />
    </section>
  );
}
