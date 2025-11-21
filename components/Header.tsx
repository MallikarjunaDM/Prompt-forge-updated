
import React from 'react';
import { ForgeIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="py-5 px-4 md:px-8 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center gap-3">
        <ForgeIcon className="w-8 h-8 text-indigo-400" />
        <div>
          <h1 className="text-2xl font-bold text-white">PromptForge</h1>
          <p className="text-sm text-gray-400">Crafting Perfect Prompts from Simple Ideas</p>
        </div>
      </div>
    </header>
  );
};
