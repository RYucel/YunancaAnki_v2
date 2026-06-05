import { useState } from 'react';
import { motion } from 'motion/react';
import { Flashcard } from '../types';

interface FlashcardViewProps {
  card: Flashcard;
  onFlip?: (isFlipped: boolean) => void;
}

export function FlashcardView({ card, onFlip }: FlashcardViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    const newState = !isFlipped;
    setIsFlipped(newState);
    if (onFlip) onFlip(newState);
  };

  return (
    <div 
      className="relative w-full aspect-[4/5] max-h-[600px] perspective-1000 cursor-pointer"
      onClick={handleFlip}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center p-8">
          <span className="text-zinc-400 text-sm font-medium tracking-widest uppercase mb-auto">Yunanca</span>
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 w-full">
             <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-center text-zinc-900 dark:text-zinc-100">
               {card.greek}
             </h2>
             <p className="text-xl sm:text-2xl text-zinc-500 dark:text-zinc-400 font-light italic text-center">
               [{card.pronunciation}]
             </p>
          </div>
          <span className="text-zinc-400 text-xs mt-auto">Çevirmek için dokun</span>
        </div>

        {/* Back */}
        <div 
          className="absolute w-full h-full backface-hidden bg-zinc-900 dark:bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium tracking-widest uppercase mb-auto">Türkçe / Okunuş</span>
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 w-full">
            <h2 className="text-3xl sm:text-4xl text-center text-white dark:text-zinc-900 font-medium">
              {card.turkish}
            </h2>
            <div className="w-full max-w-xs h-px bg-zinc-800 dark:bg-zinc-200" />
            <div className="text-center">
               <span className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block mb-2">Telaffuz</span>
               <p className="text-xl sm:text-2xl text-zinc-300 dark:text-zinc-700 font-light italic">
                 {card.pronunciation}
               </p>
            </div>
          </div>
          <span className="text-zinc-600 dark:text-zinc-300 text-xs mt-auto">Sonraki karta geç</span>
        </div>
      </motion.div>
    </div>
  );
}
