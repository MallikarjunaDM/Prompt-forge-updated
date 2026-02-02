import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { AuthModal } from './components/AuthModal';
import { generateStructuredPrompt } from './services/geminiService';
import { StructuredPrompt, HistoryItem } from './types';
import { CloseIcon } from './components/icons';
import pako from 'pako';

const decodePrompt = (encoded: string): { idea: string, prompt: string } | null => {
  try {
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const jsonString = pako.inflate(bytes, { to: 'string' });
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to decode prompt:", error);
    return null;
  }
};

const App: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('forge_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('forge_theme', theme);
  }, [theme]);

  useEffect(() => {
    const savedUser = localStorage.getItem('forge_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const urlParams = new URLSearchParams(window.location.search);
    const sharedPromptData = urlParams.get('prompt');

    if (sharedPromptData) {
      const decoded = decodePrompt(sharedPromptData);
      if (decoded) {
        setIdea(decoded.idea);
        setJsonOutput(decoded.prompt);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleForge = async () => {
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setJsonOutput('');
    setSelectedHistoryId(null);

    try {
      const result = await generateStructuredPrompt(idea);
      setJsonOutput(result);
      
      try {
        const parsedResult: StructuredPrompt = JSON.parse(result);
        const newHistoryId = Date.now().toString();
        const newHistoryItem: HistoryItem = {
          id: newHistoryId,
          idea,
          structuredPrompt: parsedResult,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
        setSelectedHistoryId(newHistoryId);
      } catch (parseError) {
        console.error("Failed to parse result for history", parseError);
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthAction = (userData: { name: string; email: string } | null) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem('forge_user', JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem('forge_user');
    }
    setIsAuthModalOpen(false);
  };

  const handleToggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleClear = () => {
    setIdea('');
    setJsonOutput('');
    setError(null);
    setSelectedHistoryId(null);
  };
  
  const handleTemplateSelect = (templateText: string) => {
    setIdea(templateText);
  };
  
  const handleHistorySelect = (item: HistoryItem) => {
    setIdea(item.idea);
    setJsonOutput(JSON.stringify(item.structuredPrompt, null, 2));
    setError(null);
    setSelectedHistoryId(item.id);
    setIsHistoryOpen(false);
  };

  const handleSaveEdit = (editedJson: string) => {
    try {
      const parsedJson: StructuredPrompt = JSON.parse(editedJson);
      setJsonOutput(editedJson);
      
      // Update the main idea based on the edited task to keep context in sync
      if (parsedJson.task) {
        setIdea(parsedJson.task);
      }

      if (selectedHistoryId) {
        setHistory(prev =>
          prev.map(item =>
            item.id === selectedHistoryId
              ? { ...item, idea: parsedJson.task || item.idea, structuredPrompt: parsedJson }
              : item
          )
        );
      }
      setError(null);
    } catch (e) {
      setError("Failed to save: Invalid JSON format.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Header 
        user={user}
        theme={theme}
        onAuthClick={() => user ? handleAuthAction(null) : setIsAuthModalOpen(true)}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        onToggleTheme={handleToggleTheme}
        historyCount={history.length}
      />
      
      <main className="flex-grow container mx-auto px-6 py-12 lg:py-20 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-12 md:gap-24"
        >
          <section className="text-center flex flex-col items-center">
            <h2 className="vesper-hero text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-12">
              Prompt Forge
            </h2>
            <p className="max-w-4xl text-2xl md:text-3xl font-serif italic leading-[1.4] text-vesper-muted dark:text-zinc-400 mb-20 px-4">
              I'm an AI architect sharing my passion for structured logic, sustainable prompt design, and 
              the stories behind what we generate. From building capsule contexts to discovering 
              emerging workflows, this is where we celebrate engineering as a form of self-expression.
            </p>
            
            <div className="w-full max-w-3xl px-4">
              <InputPanel
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onForge={handleForge}
                isLoading={isLoading}
                onTemplateSelect={handleTemplateSelect}
                onClear={handleClear}
              />
            </div>
          </section>

          {(jsonOutput || isLoading || error) && (
            <motion.section 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <OutputPanel
                idea={idea}
                jsonOutput={jsonOutput}
                isLoading={isLoading}
                error={error}
                onSave={handleSaveEdit}
                theme={theme}
              />
            </motion.section>
          )}
        </motion.div>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onAuthSuccess={(data) => handleAuthAction(data)} 
      />

      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-vesper-cream dark:bg-zinc-950 border-l border-black dark:border-white/20 z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-8 border-b border-black dark:border-white/20">
                <h2 className="text-2xl font-serif italic">History</h2>
                <button 
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-grow overflow-hidden p-6">
                <HistoryPanel
                  history={history}
                  onSelect={handleHistorySelect}
                  selectedId={selectedHistoryId}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="py-12 border-t border-black/10 dark:border-white/10 text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-vesper-muted dark:text-zinc-500">
          &copy; {new Date().getFullYear()} PROMPT FORGE ARCHITECTURE
        </p>
      </footer>
    </div>
  );
};

export default App;
