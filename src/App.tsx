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
  const { progress, recordReview } = useProgress();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Compute stats based on SM-2 progress
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; mastered: number; dueCards: number }> = {};
    categories.forEach(cat => {
      stats[cat.id] = { total: 0, mastered: 0, dueCards: 0 };
    });
    
    const now = Date.now();

    flashcards.forEach(card => {
      if (stats[card.categoryId]) {
        stats[card.categoryId].total += 1;
        
        const cardProg = progress[card.id];
        const status = typeof cardProg === 'object' ? cardProg.status : cardProg;
        const dueDate = typeof cardProg === 'object' ? cardProg.dueDate : 0;
        
        if (status === 'mastered') {
          stats[card.categoryId].mastered += 1;
        }

        // It is due if no progress yet, or dueDate is in the past
        if (!cardProg || typeof cardProg === 'string' || dueDate <= now) {
           stats[card.categoryId].dueCards += 1;
        }
      }
    });
    return stats;
  }, [progress]);

  const activeCards = useMemo(() => {
    if (!activeCategoryId) return [];
    
    const now = Date.now();
    const catCards = flashcards.filter(c => c.categoryId === activeCategoryId);
    
    // Sort so un-mastered and urgent cards come first
    let dueCards = catCards.filter(c => {
       const prog = progress[c.id];
       if (!prog) return true; // new
       if (typeof prog === 'string') return true; // untouched migration
       return prog.dueDate <= now;
    });

    dueCards.sort((a, b) => {
        const p1 = typeof progress[a.id] === 'object' ? (progress[a.id] as any).dueDate : 0;
        const p2 = typeof progress[b.id] === 'object' ? (progress[b.id] as any).dueDate : 0;
        return p1 - p2;
    });

    return dueCards;
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
              onRecordReview={recordReview}
              onBack={() => setActiveCategoryId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

