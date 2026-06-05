import { useState, useEffect } from 'react';
import { UserProgress, CardProgress } from './types';

const STORAGE_KEY = 'elinika_progress_v2'; // reset/migrate key for SR approach

export function calculateSpacedRepetition(
  quality: number,
  oldProgress?: CardProgress
): CardProgress {
  let repetition = oldProgress?.repetition ?? 0;
  let efactor = oldProgress?.efactor ?? 2.5;
  let interval = oldProgress?.interval ?? 0;

  if (quality >= 3) {
    if (repetition === 0) {
      interval = 1; // wait 1 day
    } else if (repetition === 1) {
      interval = 6; // wait 6 days
    } else {
      interval = Math.round(interval * efactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1; // reset streak
  }

  efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (efactor < 1.3) efactor = 1.3;

  const now = Date.now();
  
  // Apply next due date. If it was hard/again (<3), show again soon or next session.
  // We'll queue "again" instantly in the UI during session, but save it to reset interval for tomorrow.
  let dueDate = now;
  if (quality >= 3) {
     dueDate = now + interval * 24 * 60 * 60 * 1000;
  } else {
     // Needs repetition again today (after session expires)
     dueDate = now + 60 * 1000; 
  }

  return {
    status: quality >= 3 ? 'mastered' : 'learning',
    interval,
    repetition,
    efactor,
    dueDate,
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const itemV2 = window.localStorage.getItem(STORAGE_KEY);
      if (itemV2) return JSON.parse(itemV2);

      const itemV1 = window.localStorage.getItem('elinika_progress');
      if (itemV1) {
        const parsed = JSON.parse(itemV1);
        const migrated: UserProgress = {};
        for (const [key, value] of Object.entries(parsed)) {
            migrated[key] = {
               status: value as 'new' | 'learning' | 'mastered',
               interval: value === 'mastered' ? 3 : 0,
               repetition: value === 'mastered' ? 1 : 0,
               efactor: 2.5,
               dueDate: value === 'mastered' ? Date.now() + 3 * 24 * 60 * 60 * 1000 : Date.now()
            };
        }
        return migrated;
      }
      return {};
    } catch (error) {
      console.error(error);
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error(error);
    }
  }, [progress]);

  const recordReview = (cardId: string, quality: number) => {
    setProgress((prev) => {
      const current = prev[cardId];
      let oldProg: CardProgress | undefined;
      
      if (typeof current === 'object') {
         oldProg = current as CardProgress;
      } else if (typeof current === 'string') {
         oldProg = { status: current, interval: 0, repetition: 0, efactor: 2.5, dueDate: Date.now() };
      }

      const nextProgress = calculateSpacedRepetition(quality, oldProg);

      return {
        ...prev,
        [cardId]: nextProgress,
      };
    });
  };
  
  const resetProgress = () => {
    setProgress({});
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem('elinika_progress');
  };

  return { progress, recordReview, resetProgress };
}
