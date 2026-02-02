
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LoadingSpinnerIcon, 
  CodeIcon
} from './icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface OutputPanelProps {
  idea: string;
  jsonOutput: string;
  isLoading: boolean;
  error: string | null;
  onSave: (editedJson: string) => void;
  theme: 'light' | 'dark';
}

const getPropertyColor = (key: string, isDark: boolean): string => {
  const k = key.replace(/"/g, '').toLowerCase();
  if (isDark) {
    switch (k) {
      case 'role': return '#818CF8';
      case 'task': return '#60A5FA';
      case 'context': return '#34D399';
      case 'steps': return '#FBBF24';
      case 'constraints': return '#F87171';
      case 'output_format': return '#22D3EE';
      default: return '#F8F0E5';
    }
  }
  switch (k) {
    case 'role': return '#4F46E5';
    case 'task': return '#2563EB';
    case 'context': return '#059669';
    case 'steps': return '#D97706';
    case 'constraints': return '#DC2626';
    case 'output_format': return '#0891B2';
    default: return '#111827';
  }
};

const getThemeStyles = (isDark: boolean): any => ({
  'code[class*="language-"]': { color: isDark ? '#F8F0E5' : '#000000', fontFamily: 'inherit', lineHeight: '1.9', WebkitFontSmoothing: 'antialiased' },
  'pre[class*="language-"]': { color: isDark ? '#F8F0E5' : '#000000', fontFamily: 'inherit', lineHeight: '1.9', background: 'transparent' },
  'comment': { color: '#71717A', fontStyle: 'italic' },
  'punctuation': { color: '#A1A1AA' },
  'property': { color: isDark ? '#F8F0E5' : '#000000', fontWeight: 'bold' },
  'string': { color: isDark ? '#D4D4D8' : '#3F3F46' },
  'boolean': { color: isDark ? '#EAB8D3' : '#111827', fontWeight: 'bold' },
  'number': { color: isDark ? '#EAB8D3' : '#111827', fontWeight: 'bold' },
});

export const OutputPanel: React.FC<OutputPanelProps> = ({ jsonOutput, isLoading, error, theme }) => {
  const [copied, setCopied] = useState(false);
  const isDark = theme === 'dark';

  const parsedData = useMemo(() => {
    try {
      return jsonOutput ? JSON.parse(jsonOutput) : null;
    } catch (e) {
      return null;
    }
  }, [jsonOutput]);

  useEffect(() => {
    setCopied(false);
  }, [jsonOutput]);
  
  useEffect(() => {
    let timer: number;
    if (copied) timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
  };

  return (
    <div className="border-[1.5px] border-black dark:border-white/20 rounded-3xl bg-white dark:bg-[#0A0A0A] overflow-hidden min-h-[600px] flex flex-col transition-all duration-500 shadow-xl">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between border-b border-black/10 dark:border-white/10 bg-vesper-cream/50 dark:bg-black/40">
        <div className="flex items-center gap-3 px-8 py-6">
          <CodeIcon className="w-4 h-4 text-black dark:text-white" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black dark:text-white">JSON ARCHITECTURE</span>
        </div>
        
        <div className="flex items-center gap-6 px-8 py-4 md:py-0">
          {jsonOutput && !isLoading && (
            <button onClick={handleCopy} className="text-[10px] font-bold uppercase tracking-widest text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white">
              {copied ? "COPIED" : "COPY"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-grow relative bg-white dark:bg-[#0A0A0A] h-[550px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
            >
              <LoadingSpinnerIcon className="w-12 h-12 animate-spin text-black dark:text-vesper-pink" />
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-black/40 dark:text-white/40">Analyzing Formula</p>
            </motion.div>
          ) : parsedData ? (
            <motion.div 
              key={`json-${jsonOutput}`} 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-8 md:p-12 overflow-auto h-full scrollbar-light"
            >
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600">{error}</p>
                </div>
              )}
              <SyntaxHighlighter
                language="json"
                style={getThemeStyles(isDark)}
                useInlineStyles={true}
                renderer={({ rows }) => {
                  return rows.map((row, i) => (
                    <div key={i} style={row.properties?.style}>
                      {row.children?.map((token, j) => {
                        const isProperty = token.properties?.className?.includes('property');
                        const value = token.children?.[0]?.value || '';
                        const customStyle = isProperty 
                          ? { ...token.properties.style, color: getPropertyColor(String(value), isDark) }
                          : token.properties?.style;
                        return <span key={j} style={customStyle}>{value}</span>;
                      })}
                    </div>
                  ));
                }}
                customStyle={{ background: 'transparent', margin: 0, padding: 0, fontSize: '0.92rem', lineHeight: '1.9' }}
              >
                {JSON.stringify(parsedData, null, 2)}
              </SyntaxHighlighter>
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
              <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-black dark:text-white">Forge an architectural intent</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
