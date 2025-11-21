import React from 'react';
import { ForgeIcon, LoadingSpinnerIcon } from './icons';

interface InputPanelProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onForge: () => void;
  isLoading: boolean;
  onTemplateSelect: (templateText: string) => void;
  onClear: () => void;
}

const templateLibrary = [
    {
        name: "Code Generation",
        templates: [
            {
                title: "Python Script",
                prompt: "Create a Python script that [describe the script's function, e.g., 'reads a CSV file and calculates the average of a specific column'] and handles errors like [mention a potential error, e.g., 'the file not being found']."
            },
            {
                title: "SQL Query",
                prompt: "Write an SQL query for a table named `[table_name]` to select [specify columns] where [specify condition, e.g., 'the creation_date is within the last 30 days']."
            },
            {
                title: "JavaScript Function",
                prompt: "Write a JavaScript function that [describe the function's purpose, e.g., 'fetches data from an API endpoint and displays it on the page']. Include comments explaining the code."
            }
        ]
    },
    {
        name: "Marketing & Sales",
        templates: [
            {
                title: "Ad Copy",
                prompt: "Generate 3 variations of ad copy for a [product/service type, e.g., 'new mobile game'] targeting [target audience, e.g., 'casual gamers aged 25-40']. The tone should be [desired tone, e.g., 'energetic and exciting']."
            },
            {
                title: "Blog Post Ideas",
                prompt: "Brainstorm 5 blog post titles about [your topic, e.g., 'the benefits of remote work']. Each title should be engaging and SEO-friendly."
            },
            {
                title: "Cold Email Outreach",
                prompt: "Write a cold email to a potential client in the [client's industry] industry. The goal is to introduce my company's [product/service] and book a 15-minute call. The email should be concise and persuasive."
            }
        ]
    },
    {
        name: "Creative Content",
        templates: [
            {
                title: "Short Story Idea",
                prompt: "Write a short story opening about a character who is a [character archetype, e.g., 'skeptical detective'] and discovers a [mysterious object, e.g., 'a compass that points to lost memories']."
            },
            {
                title: "Video Script Hook",
                prompt: "Generate 3 compelling hooks for a YouTube video about [your video topic, e.g., 'the history of ancient Rome']."
            },
            {
                title: "Character Profile",
                prompt: "Create a detailed character profile for a fantasy novel. The character is a [character role, e.g., 'young apprentice mage'] from [origin, e.g., 'a reclusive mountain monastery']."
            }
        ]
    },
    {
        name: "Data Analysis",
        templates: [
            {
                title: "Analyze Dataset",
                prompt: "I have a dataset in CSV format with the following columns: [list column names]. Analyze this data to find [specific insight, e.g., 'the correlation between user engagement and purchase frequency']. Provide a summary of your findings."
            },
            {
                title: "Generate Sample Data",
                prompt: "Generate a sample JSON array of 10 items representing [data type, e.g., 'user profiles']. Each item should include fields for [field 1, e.g., 'name'], [field 2, e.g., 'email'], and [field 3, e.g., 'signup_date']."
            }
        ]
    }
];

export const InputPanel: React.FC<InputPanelProps> = ({ value, onChange, onForge, isLoading, onTemplateSelect, onClear }) => {
  
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPrompt = event.target.value;
    if (selectedPrompt) {
      onTemplateSelect(selectedPrompt);
      event.target.value = ""; // Reset dropdown after selection
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 flex flex-col h-full shadow-lg">
      <h2 className="text-lg font-semibold text-gray-200 mb-4">Your Prompt Idea</h2>
      <textarea
        value={value}
        onChange={onChange}
        placeholder="e.g., 'Write a python script that takes a folder path and renames all .jpg files to have a timestamp prefix.'"
        className="flex-grow w-full p-4 bg-gray-900/70 border border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow duration-200 text-gray-300"
        rows={12}
        disabled={isLoading}
      />
      <div className="mt-4">
        <label htmlFor="template-select" className="block text-sm text-gray-400 mb-2">Or start with a template:</label>
        <select
          id="template-select"
          onChange={handleSelectChange}
          disabled={isLoading}
          className="w-full px-3 py-2 bg-gray-700/60 border border-gray-600 text-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors disabled:opacity-50"
        >
          <option value="">Select a template...</option>
          {templateLibrary.map(category => (
            <optgroup key={category.name} label={category.name}>
              {category.templates.map(template => (
                <option key={template.title} value={template.prompt}>
                  {template.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onForge}
          disabled={isLoading || !value.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-indigo-800/50 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          {isLoading ? (
            <>
              <LoadingSpinnerIcon className="w-5 h-5 animate-spin" />
              Forging...
            </>
          ) : (
            <>
              <ForgeIcon className="w-5 h-5" />
              Forge Prompt
            </>
          )}
        </button>
        <button
          onClick={onClear}
          disabled={isLoading || !value.trim()}
          className="px-4 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed disabled:text-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
          aria-label="Clear input"
        >
          Clear
        </button>
      </div>
    </div>
  );
};