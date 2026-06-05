import { motion } from 'motion/react';
import { Category } from '../types';
import { getCategoryIcon } from '../lib/icons';

interface DashboardProps {
  categories: Category[];
  categoryStats: Record<string, { total: number; mastered: number; dueCards: number }>;
  onSelectCategory: (categoryId: string) => void;
}

export function Dashboard({ categories, categoryStats, onSelectCategory }: DashboardProps) {
  const totalCards = Object.values(categoryStats).reduce((sum, s) => sum + s.total, 0);
  const totalMastered = Object.values(categoryStats).reduce((sum, s) => sum + s.mastered, 0);
  const totalDue = Object.values(categoryStats).reduce((sum, s) => sum + s.dueCards, 0);
  const totalProgress = totalCards === 0 ? 0 : Math.round((totalMastered / totalCards) * 100);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Header & Global Stats */}
      <header className="mb-10">
        <h1 className="text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
          Elinika
        </h1>
        <p className="text-zinc-500 mb-6">Akıllı Tekrar Sistemi (SM-2)</p>
        
        <div className="bg-zinc-900 dark:bg-zinc-100 rounded-3xl p-6 text-white dark:text-zinc-900 flex items-center justify-between">
           <div>
             <span className="block text-sm font-medium opacity-80 mb-1">Bekleyen Tekrar</span>
             <div className="text-4xl font-light">{totalDue}</div>
           </div>
           <div className="text-right">
             <span className="block text-sm font-medium opacity-80 mb-1">Öğrenilen</span>
             <div className="text-xl font-medium">%{totalProgress} <span className="opacity-60 text-sm">/ {totalMastered}</span></div>
           </div>
        </div>
      </header>

      {/* Categories Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-white px-1">Kategoriler</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat, index) => {
            const stats = categoryStats[cat.id] || { total: 0, mastered: 0, dueCards: 0 };
            const progress = stats.total === 0 ? 0 : (stats.mastered / stats.total) * 100;
            const Icon = getCategoryIcon(cat.iconName);
            
            return (
              <motion.button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-full text-left bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-4">
                   <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl relative">
                     <Icon className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
                     {stats.dueCards > 0 && (
                       <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                     )}
                   </div>
                   <div className="text-xs font-medium text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded-full whitespace-nowrap overflow-hidden text-ellipsis">
                     {stats.dueCards > 0 ? `${stats.dueCards} Tekrar` : (stats.mastered > 0 ? 'Tamam' : 'Başla')}
                   </div>
                </div>
                
                <h3 className="font-medium text-zinc-900 dark:text-white mb-1">{cat.title}</h3>
                <p className="text-xs text-zinc-500 line-clamp-1 mb-4">{cat.description}</p>
                
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-900 dark:bg-zinc-100 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
