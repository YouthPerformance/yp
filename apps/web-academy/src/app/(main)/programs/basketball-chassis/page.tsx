// ═══════════════════════════════════════════════════════════
// BASKETBALL CHASSIS - Program Overview Page
// 8-Day workout program landing page
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Clock, Star } from 'lucide-react';
import { PROGRAM, DAYS, getThemeColor } from '@/data/programs/basketball-chassis';
import { useProgramAccess, getDayStatus } from '@/hooks/useProgramAccess';
import { DayCard } from '@/components/programs/DayCard';
import { ProgramProgress } from '@/components/programs/ProgramProgress';

export default function BasketballChassisPage() {
  const router = useRouter();
  const { hasAccess, completedDays, currentDay, isComplete, isLoading } =
    useProgramAccess('basketball-chassis');

  // Handle navigation to day
  const handleDayClick = (dayNumber: number) => {
    router.push(`/programs/basketball-chassis/day/${dayNumber}`);
  };

  // Show locked state if no access
  if (!isLoading && !hasAccess) {
    return (
      <main className="min-h-screen p-4 max-w-md mx-auto flex flex-col">
        {/* Back Button */}
        <motion.button
          onClick={() => router.push('/programs')}
          className="flex items-center gap-2 mb-6 text-sm"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Locked Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <Lock className="w-10 h-10" style={{ color: 'var(--text-tertiary)' }} />
          </motion.div>

          <h1
            className="font-bebas text-4xl tracking-wider mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {PROGRAM.name.toUpperCase()}
          </h1>

          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            {PROGRAM.description}
          </p>

          <motion.button
            onClick={() => window.open('https://shop.youthperformance.com', '_blank')}
            className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--bg-primary)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            GET ACCESS
          </motion.button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* Back Button */}
      <motion.button
        onClick={() => router.push('/programs')}
        className="flex items-center gap-2 mb-6 text-sm"
        style={{ color: 'var(--text-tertiary)' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div
          className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl mb-4"
          style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)' }}
        >
          🏀
        </div>

        <h1
          className="font-bebas text-4xl tracking-wider mb-2"
          style={{ color: 'var(--accent-primary)' }}
        >
          {PROGRAM.name.toUpperCase()}
        </h1>

        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {PROGRAM.totalDays}-Day Foundation Program
        </p>

        {/* Meta */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {PROGRAM.dailyDuration} min/day
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              +{PROGRAM.xpPerDay} XP/day
            </span>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <ProgramProgress
          completedDays={completedDays.length}
          totalDays={PROGRAM.totalDays}
        />
      </motion.div>

      {/* Day List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 mb-6"
      >
        {DAYS.map((day, index) => {
          const status = getDayStatus(day.dayNumber, completedDays, currentDay);
          return (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <DayCard
                dayNumber={day.dayNumber}
                theme={day.theme}
                title={day.title}
                status={status}
                themeColor={getThemeColor(day.theme)}
                onClick={() => handleDayClick(day.dayNumber)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Continue CTA */}
      {!isComplete && (
        <motion.button
          onClick={() => handleDayClick(currentDay)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full py-4 rounded-xl font-bebas text-lg tracking-wider flex items-center justify-center gap-2"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--bg-primary)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {completedDays.length === 0 ? 'START DAY 1' : `CONTINUE DAY ${currentDay}`}
        </motion.button>
      )}

      {/* Completed State */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-xl text-center"
          style={{
            backgroundColor: 'rgba(0,246,224,0.1)',
            border: '1px solid var(--accent-primary)',
          }}
        >
          <p className="font-bebas text-2xl" style={{ color: 'var(--accent-primary)' }}>
            PROGRAM COMPLETE! 🏆
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            You can replay any day to keep improving
          </p>
        </motion.div>
      )}
    </main>
  );
}
