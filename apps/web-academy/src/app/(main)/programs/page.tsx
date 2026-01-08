// ═══════════════════════════════════════════════════════════
// PROGRAMS HUB PAGE
// List of available training programs
// ═══════════════════════════════════════════════════════════

'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Dumbbell, ChevronRight } from 'lucide-react';
import { PROGRAM } from '@/data/programs/basketball-chassis';
import { useProgramAccess } from '@/hooks/useProgramAccess';
import { ProgramProgress } from '@/components/programs/ProgramProgress';

export default function ProgramsPage() {
  const router = useRouter();
  const { hasAccess, completedDays, isLoading } = useProgramAccess('basketball-chassis');

  return (
    <main className="min-h-screen p-4 max-w-md mx-auto">
      {/* Back Button */}
      <motion.button
        onClick={() => router.push('/home')}
        className="flex items-center gap-2 mb-6 text-sm"
        style={{ color: 'var(--text-tertiary)' }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ color: 'var(--text-primary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1
          className="font-bebas text-4xl tracking-wider mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          TRAINING PROGRAMS
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Structured programs to level up your game
        </p>
      </motion.div>

      {/* Programs List */}
      <div className="space-y-4">
        {/* Basketball Chassis Card */}
        <motion.button
          onClick={() => router.push('/programs/basketball-chassis')}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full text-left rounded-xl overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Card Header with Icon */}
          <div
            className="p-6 flex items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, rgba(0,246,224,0.1) 0%, transparent 100%)',
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)' }}
            >
              🏀
            </div>
            <div className="flex-1">
              <h2
                className="font-bebas text-2xl tracking-wider"
                style={{ color: 'var(--text-primary)' }}
              >
                {PROGRAM.name.toUpperCase()}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {PROGRAM.totalDays}-Day Foundation Program
              </p>
            </div>
            <ChevronRight className="w-6 h-6" style={{ color: 'var(--text-tertiary)' }} />
          </div>

          {/* Card Content */}
          <div className="px-6 pb-6">
            {/* Meta Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {PROGRAM.dailyDuration} min/day
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {PROGRAM.equipment.length === 0 ? 'No equipment' : PROGRAM.equipment.join(', ')}
                </span>
              </div>
            </div>

            {/* Progress (if started) */}
            {hasAccess && completedDays.length > 0 && (
              <ProgramProgress
                completedDays={completedDays.length}
                totalDays={PROGRAM.totalDays}
              />
            )}

            {/* Locked State */}
            {!hasAccess && !isLoading && (
              <div
                className="px-4 py-2 rounded-lg text-center"
                style={{
                  backgroundColor: 'var(--bg-tertiary)',
                  color: 'var(--text-tertiary)',
                }}
              >
                <span className="text-xs font-medium">🔒 Premium Program</span>
              </div>
            )}

            {/* Not Started State */}
            {hasAccess && completedDays.length === 0 && (
              <div
                className="px-4 py-2 rounded-lg text-center"
                style={{
                  backgroundColor: 'rgba(0,246,224,0.1)',
                  color: 'var(--accent-primary)',
                }}
              >
                <span className="text-xs font-medium">Ready to Start</span>
              </div>
            )}
          </div>
        </motion.button>

        {/* Coming Soon Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl text-center"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px dashed var(--border-default)',
          }}
        >
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
            More programs coming soon...
          </p>
        </motion.div>
      </div>
    </main>
  );
}
