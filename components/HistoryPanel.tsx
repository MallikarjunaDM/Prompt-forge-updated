import React from 'react';
import { HistoryItem } from '../types';
import { HistoryIcon } from './icons';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 flex flex-col h-full shadow-lg">
      <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
        <HistoryIcon className="w-6 h-6" />
        History
      </h2>
      <div className="flex-grow overflow-y-auto -mr-3 pr-3">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm mt-2">Your generated prompts will appear here.</p>
        ) : (
          <ul className="space-y-3">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-700/50 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <p className="text-gray-300 font-medium truncate" title={item.idea}>
                    {item.idea}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
