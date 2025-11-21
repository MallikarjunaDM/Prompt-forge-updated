import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { generateStructuredPrompt } from './services/geminiService';
import { StructuredPrompt, HistoryItem } from './types';
import pako from 'pako';

// Decodes and decompresses a shared prompt from a URL-safe string
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

  useEffect(() => {
    // Check for a shared prompt in the URL on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const sharedPromptData = urlParams.get('prompt');

    if (sharedPromptData) {
      const decoded = decodePrompt(sharedPromptData);
      if (decoded) {
        setIdea(decoded.idea);
        setJsonOutput(decoded.prompt);
      }
      // Clean the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleForge = async () => {
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setJsonOutput('');
    setSelectedHistoryId(null); // Clear selection on new forge

    try {
      const result = await generateStructuredPrompt(idea);
      setJsonOutput(result);
      
      try {
        const parsedResult: StructuredPrompt = JSON.parse(result);
        const newHistoryItem: HistoryItem = {
          id: new Date().toISOString(),
          idea,
          structuredPrompt: parsedResult,
          timestamp: new Date().toLocaleString(),
        };
        setHistory(prevHistory => [newHistoryItem, ...prevHistory].slice(0, 10)); // Keep last 10
        setSelectedHistoryId(newHistoryItem.id); // Set new item as selected for potential edits
      } catch (parseError) {
        console.error("Failed to parse structured prompt for history:", parseError);
        // Don't add to history if parsing fails, but the raw output is still shown
      }

    } catch (e) {
      console.error("An error occurred during the forging process:", e); // Log detailed error
      if (e instanceof Error) {
        // Provide more user-friendly messages based on the error type
        if (e.message.includes("API did not return a valid JSON object")) {
          setError("The AI returned data in an unexpected format. This can sometimes happen with complex requests. Please try rephrasing your idea or simplifying the request.");
        } else if (e.message.includes("Gemini API Error")) {
          setError(`There was an issue communicating with the AI service. Please check your connection and try again. (Details: ${e.message.replace('Gemini API Error: ', '')})`);
        } else {
          setError(`An application error occurred: ${e.message}`);
        }
      } else {
        setError('An unknown error occurred. Please check the console for more details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
  };

  const handleSaveEdit = (editedJson: string) => {
    try {
      const parsedJson: StructuredPrompt = JSON.parse(editedJson);
      setJsonOutput(editedJson);

      const targetId = selectedHistoryId;

      if (targetId) {
        setHistory(prevHistory =>
          prevHistory.map(item =>
            item.id === targetId
              ? { ...item, structuredPrompt: parsedJson, timestamp: `${new Date().toLocaleString()} (edited)` }
              : item
          )
        );
      }
      setError(null);
    } catch (e) {
      console.error("Invalid JSON on save:", e);
      setError("Could not save. The edited content is not valid JSON.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputPanel
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              onForge={handleForge}
              isLoading={isLoading}
              onTemplateSelect={handleTemplateSelect}
              onClear={handleClear}
            />
            <OutputPanel
              idea={idea}
              jsonOutput={jsonOutput}
              isLoading={isLoading}
              error={error}
              onSave={handleSaveEdit}
            />
          </div>
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
          />
        </div>
      </main>
    </div>
  );
};

export default App;