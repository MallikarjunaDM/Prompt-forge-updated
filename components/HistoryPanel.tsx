import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItem } from '../types';
import { ClockIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  selectedId: string | null;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, selectedId }) => {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-grow space-y-2 overflow-y-auto pr-2 scrollbar-thin">
        <AnimatePresence initial={false}>
          {history.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-black/10 dark:border-white/10 rounded-xl h-full flex flex-col justify-center">
              <p className="text-sm text-vesper-muted italic">No historical logs found.</p>
              <p className="text-[10px] text-vesper-muted mt-2 uppercase tracking-widest">Forge a prompt to start logging</p>
            </div>
          ) : (
            history.map((item, idx) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSelect(item)}
                className={`w-full group relative text-left p-4 rounded-xl border transition-all duration-300 overflow-hidden ${
                  selectedId === item.id 
                    ? 'bg-black/5 dark:bg-white/10 border-black dark:border-white shadow-lg' 
                    : 'bg-transparent border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white'
                }`}
              >
                {selectedId === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-black dark:bg-vesper-pink rounded-r-full" 
                  />
                )}
                
                <div className="flex flex-col gap-1">
                  <p className={`text-sm font-semibold transition-colors line-clamp-2 ${
                    selectedId === item.id ? 'text-black dark:text-vesper-pink' : 'text-vesper-muted dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white'
                  }`}>
                    {item.idea}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-vesper-muted mt-1.5">
                    <ClockIcon className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                    <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10"></span>
                    <span className="font-mono text-vesper-pink">{item.structuredPrompt.role.split(' ')[0]}</span>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};