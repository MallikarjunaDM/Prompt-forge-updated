
import React from 'react';
import { motion } from 'framer-motion';
import { HistoryIcon } from './icons';

interface HeaderProps {
  user: { name: string } | null;
  theme: 'light' | 'dark';
  onAuthClick: () => void;
  onToggleHistory: () => void;
  onToggleTheme: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ user, theme, onAuthClick, onToggleHistory, historyCount }) => {
  return (
    <motion.header 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full border-b border-black/10 dark:border-white/10 bg-vesper-cream dark:bg-zinc-950/80 dark:backdrop-blur-md py-6 sticky top-0 z-50 transition-colors"
    >
      <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-3xl vesper-logo tracking-tight">
            Prompt Forge
          </h1>
          {user && (
            <span className="hidden md:inline text-xs font-medium text-vesper-muted dark:text-zinc-400">
              Hello {user.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-6 md:gap-8">
          <button 
            onClick={onToggleHistory}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-60 transition-all relative"
          >
            <HistoryIcon className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[14px] h-[14px] px-1 bg-black dark:bg-vesper-pink text-[8px] text-white dark:text-black rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>
          
          <button 
            onClick={onAuthClick}
            className={`vesper-button text-[10px] font-bold px-6 md:px-8 py-2.5 uppercase tracking-widest transition-all ${
              user 
                ? 'bg-black text-white dark:bg-white dark:text-black' 
                : 'bg-vesper-pink text-black'
            }`}
          >
            {user ? 'SIGN OUT' : 'SIGN IN'}
          </button>
        </div>
      </div>
    </motion.header>
  );
};
