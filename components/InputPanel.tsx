import React from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinnerIcon } from './icons';

interface InputPanelProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onForge: () => void;
  isLoading: boolean;
  onTemplateSelect: (templateText: string) => void;
  onClear: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ value, onChange, onForge, isLoading, onClear }) => {
  return (
    <div className="flex flex-col gap-8 w-full text-left">
      <div className="relative group">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-vesper-muted dark:text-zinc-500">
            Architectural Intent
          </label>
          {value && (
            <button 
              onClick={onClear} 
              className="text-[10px] font-bold uppercase tracking-widest text-vesper-muted hover:text-black dark:hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        
        <textarea
          value={value}
          onChange={onChange}
          placeholder="DESCRIBE YOUR ARCHITECTURAL INTENT..."
          className="vesper-input-line w-full pt-4 pb-2 text-xl md:text-2xl font-sans placeholder:uppercase placeholder:tracking-[0.2em] placeholder:text-black/10 dark:placeholder:text-white/10 resize-none min-h-[60px] focus:placeholder:opacity-0 transition-all dark:text-white leading-relaxed"
          disabled={isLoading}
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      </div>

      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onForge}
          disabled={isLoading || !value.trim()}
          className="vesper-button flex items-center gap-4 px-12 py-4 bg-transparent text-black dark:text-white disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <span className="text-base font-bold uppercase tracking-widest">
            {isLoading ? "FORGING..." : "FORGE ARCHITECTURE"}
          </span>
          {!isLoading && <span className="text-2xl leading-none">→</span>}
          {isLoading && <LoadingSpinnerIcon className="w-5 h-5 animate-spin" />}
        </motion.button>
      </div>
    </div>
  );
};