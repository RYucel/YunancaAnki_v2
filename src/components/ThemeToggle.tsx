import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as Theme;
    }
    return 'system';
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Handle system theme changes when in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;
    
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' && <Sun className="w-5 h-5" />}
        {theme === 'dark' && <Moon className="w-5 h-5" />}
        {theme === 'system' && <Monitor className="w-5 h-5" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 overflow-hidden z-50 flex flex-col p-1"
            >
              <button
                onClick={() => { setTheme('light'); setIsOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors ${
                  theme === 'light' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                }`}
              >
                <Sun className="w-4 h-4" /> <span>Açık</span>
              </button>
              <button
                onClick={() => { setTheme('dark'); setIsOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors ${
                  theme === 'dark' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                }`}
              >
                <Moon className="w-4 h-4" /> <span>Koyu</span>
              </button>
              <button
                onClick={() => { setTheme('system'); setIsOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors ${
                  theme === 'system' 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-medium' 
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                }`}
              >
                <Monitor className="w-4 h-4" /> <span>Sistem</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
