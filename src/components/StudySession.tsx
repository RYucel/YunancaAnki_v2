import { useState } from 'react';
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
  
  // Stats tracking
  const [reviewedCards, setReviewedCards] = useState<Set<string>>(new Set());
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());

  const currentCard = queue[currentIndex];
  
  if (cards.length === 0) {
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
    if (!currentCard) return;

    onRecordReview(currentCard.id, quality);
    setDirection(quality >= 3 ? 1 : -1);
    setIsFlipped(false);
    
    setReviewedCards(prev => new Set(prev).add(currentCard.id));
    if (quality >= 3) {
      setMasteredCards(prev => new Set(prev).add(currentCard.id));
    } else {
      setMasteredCards(prev => {
        const next = new Set(prev);
        next.delete(currentCard.id);
        return next;
      });
    }

    // If quality is poor (Tekrar et), push it back into the queue for today.
    if (quality < 3) {
      setQueue(prev => [...prev, currentCard]);
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  if (isFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 max-w-lg mx-auto w-full"
      >
        <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
          <Check className="w-12 h-12" />
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-white">Çalışma Tamamlandı!</h2>
          <p className="text-zinc-500">Bu oturumdaki performansın</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 text-center shadow-sm border border-zinc-100 dark:border-zinc-700/50">
            <div className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">{reviewedCards.size}</div>
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">İncelenen Kart</div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 text-center shadow-sm border border-zinc-100 dark:border-zinc-700/50">
            <div className="text-4xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400 mb-2">{masteredCards.size}</div>
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Öğrenilen</div>
          </div>
        </div>

        <button 
          onClick={onComplete}
          className="mt-12 px-8 py-3.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium active:scale-95 transition-all outline-none hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          Ana Ekrana Dön
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col overflow-hidden max-w-lg mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 mb-4">
        <button onClick={onBack} className="p-2 rounded-full z-10 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
        </button>
        <div className="absolute left-0 right-0 px-20">
           <div className="h-1.5 w-full max-w-[200px] mx-auto bg-zinc-200/50 dark:bg-zinc-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-300 ease-out rounded-full"
               style={{ width: `${(currentIndex / queue.length) * 100}%` }}
             />
           </div>
        </div>
        <div className="text-sm font-medium z-10 text-zinc-400 whitespace-nowrap">
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
