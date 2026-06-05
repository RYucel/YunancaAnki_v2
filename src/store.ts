import { useState, useEffect } from 'react';
import { UserProgress, CardKnowledgeStatus } from './types';

const STORAGE_KEY = 'elinika_progress';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : {};
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

  const updateCardStatus = (cardId: string, status: CardKnowledgeStatus) => {
    setProgress((prev) => ({
      ...prev,
      [cardId]: status,
    }));
  };
  
  const resetProgress = () => setProgress({});

  return { progress, updateCardStatus, resetProgress };
}
