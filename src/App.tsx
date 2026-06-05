/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Dashboard } from './components/Dashboard';
import { StudySession } from './components/StudySession';
import { useProgress } from './store';
import { categories, flashcards } from './data';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const { progress, updateCardStatus } = useProgress();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Compute stats
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; mastered: number }> = {};
    categories.forEach(cat => {
      stats[cat.id] = { total: 0, mastered: 0 };
    });
    
    flashcards.forEach(card => {
      if (stats[card.categoryId]) {
        stats[card.categoryId].total += 1;
        if (progress[card.id] === 'mastered') {
          stats[card.categoryId].mastered += 1;
        }
      }
    });
    return stats;
  }, [progress]);

  const activeCards = useMemo(() => {
    if (!activeCategoryId) return [];
    
    const catCards = flashcards.filter(c => c.categoryId === activeCategoryId);
    
    // Sort so un-mastered cards come first for repetitive learning
    return [...catCards].sort((a, b) => {
      const aStat = progress[a.id] === 'mastered' ? 1 : 0;
      const bStat = progress[b.id] === 'mastered' ? 1 : 0;
      return aStat - bStat;
    });
  }, [activeCategoryId, progress]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <AnimatePresence mode="wait">
        {!activeCategoryId ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full flex-1 flex"
          >
            <Dashboard 
              categories={categories} 
              categoryStats={categoryStats} 
              onSelectCategory={setActiveCategoryId} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="studysession"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full flex-1 flex flex-col"
          >
            <StudySession 
              cards={activeCards}
              onComplete={() => setActiveCategoryId(null)}
              onUpdateStatus={updateCardStatus}
              onBack={() => setActiveCategoryId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

