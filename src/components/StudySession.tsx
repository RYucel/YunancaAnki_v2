import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlashcardView } from './FlashcardView';
import { Flashcard, CardKnowledgeStatus } from '../types';
import { ArrowLeft, Check, X, Maximize2 } from 'lucide-react';

interface StudySessionProps {
  cards: Flashcard[];
  onComplete: () => void;
  onUpdateStatus: (cardId: string, status: CardKnowledgeStatus) => void;
  onBack: () => void;
}

export function StudySession({ cards, onComplete, onUpdateStatus, onBack }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // For swipe animation direction
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = cards[currentIndex];
  const isFinished = currentIndex >= cards.length;

  const handleNext = (status: CardKnowledgeStatus) => {
    onUpdateStatus(currentCard.id, status);
    setDirection(status === 'mastered' ? 1 : -1);
    setIsFlipped(false);
    
    if (currentIndex + 1 >= cards.length) {
      setTimeout(() => onComplete(), 500); // Wait for exit animation
    }
    setCurrentIndex(prev => prev + 1);
  };

  if (isFinished || !currentCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"
         >
           <Check className="w-12 h-12" />
         </motion.div>
         <h2 className="text-2xl font-light text-zinc-900 dark:text-white">Oturum Tamamlandı!</h2>
         <button 
           onClick={onBack}
           className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium active:scale-95 transition-transform"
         >
           Kategorilere Dön
         </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 mb-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <div className="flex-1 px-8">
           <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300 ease-out rounded-full"
               style={{ width: `${(currentIndex / cards.length) * 100}%` }}
             />
           </div>
        </div>
        <div className="text-sm font-medium text-zinc-400 whitespace-nowrap">
           {currentIndex + 1} / {cards.length}
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 relative px-4 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: direction * 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full absolute inset-x-0 px-4"
          >
            <FlashcardView 
              card={currentCard} 
              onFlip={(flipped) => setIsFlipped(flipped)} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className={`p-6 pb-12 flex items-center justify-center gap-6 transition-opacity duration-300 ${isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <button 
           onClick={() => handleNext('learning')}
           className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
         >
           <X className="w-8 h-8" />
         </button>
         
         <div className="text-xs font-medium uppercase tracking-widest text-zinc-400">Tekrar et</div>

         <button 
           onClick={() => handleNext('mastered')}
           className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm"
         >
           <Check className="w-8 h-8" />
         </button>
      </div>
    </div>
  );
}
