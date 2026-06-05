import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlashcardView } from './FlashcardView';
import { Flashcard } from '../types';
import { ArrowLeft, Check, FastForward, Repeat, ThumbsUp } from 'lucide-react';

interface StudySessionProps {
  cards: Flashcard[];
  onComplete: () => void;
  onRecordReview: (cardId: string, quality: number) => void;
  onBack: () => void;
}

export function StudySession({ cards, onComplete, onRecordReview, onBack }: StudySessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // For swipe animation direction
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Local queue allows appending failed cards to the end of the batch
  const [queue, setQueue] = useState<Flashcard[]>(cards);

  const currentCard = queue[currentIndex];
  
  if (queue.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
         <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400"
         >
           <Check className="w-12 h-12" />
         </motion.div>
         <h2 className="text-2xl font-light text-zinc-900 dark:text-white text-center">
            Bugünlük bu kadar!
         </h2>
         <p className="text-zinc-500 text-center max-w-sm px-4">
            Bu kategorideki tüm tekrar kartlarını tamamladın. Geri kalan kartlar senin için en uygun zamanda tekrar karşına çıkacak.
         </p>
         <button 
           onClick={onBack}
           className="px-8 py-3 mt-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium active:scale-95 transition-transform"
         >
           Kategorilere Dön
         </button>
      </div>
    );
  }
  
  const isFinished = currentIndex >= queue.length;

  const handleNext = (quality: number) => {
    onRecordReview(currentCard.id, quality);
    setDirection(quality >= 3 ? 1 : -1);
    setIsFlipped(false);
    
    // If quality is poor (Tekrar et), push it back into the queue for today.
    if (quality < 3) {
      setQueue(prev => [...prev, currentCard]);
    }
    
    if (currentIndex + 1 >= queue.length && quality >= 3) {
      // Small timeout to allow transition exit
      setTimeout(() => onComplete(), 500);
    }
    setCurrentIndex(prev => prev + 1);
  };

  if (isFinished) {
    return null;
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
               style={{ width: `${(currentIndex / queue.length) * 100}%` }}
             />
           </div>
        </div>
        <div className="text-sm font-medium text-zinc-400 whitespace-nowrap">
           {currentIndex + 1} / {queue.length}
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 relative px-4 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${currentCard.id}-${currentIndex}`} // Force re-mount if same card reappears later
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
      <div className={`p-6 pb-12 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="flex items-center justify-center gap-3">
             <button 
               onClick={() => handleNext(1)}
               className="flex flex-col items-center gap-2 p-3 w-20 sm:w-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-500 hover:text-red-500 dark:hover:text-red-400 font-medium active:scale-95 transition-all outline-none"
             >
               <Repeat size={24} />
               <span className="text-xs uppercase tracking-wider">Tekrar</span>
             </button>

             <button 
               onClick={() => handleNext(4)}
               className="flex flex-col items-center gap-2 p-3 w-20 sm:w-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 font-medium active:scale-95 transition-all outline-none"
             >
               <ThumbsUp size={24} />
               <span className="text-xs uppercase tracking-wider">İyi</span>
             </button>

             <button 
               onClick={() => handleNext(5)}
               className="flex flex-col items-center gap-2 p-3 w-20 sm:w-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-400 font-medium active:scale-95 transition-all outline-none"
             >
               <FastForward size={24} />
               <span className="text-xs uppercase tracking-wider">Kolay</span>
             </button>
         </div>
      </div>
    </div>
  );
}
