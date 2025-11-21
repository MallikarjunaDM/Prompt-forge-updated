import React, { useState, useEffect } from 'react';
import { LoadingSpinnerIcon, CopyIcon, CheckIcon, EditIcon, SaveIcon, CloseIcon, ShareIcon } from './icons';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import pako from 'pako';

interface OutputPanelProps {
  idea: string;
  jsonOutput: string;
  isLoading: boolean;
  error: string | null;
  onSave: (editedJson: string) => void;
}

// Compresses and encodes a prompt payload into a URL-safe string
const encodePrompt = (payload: { idea: string, prompt: string }): string => {
  const jsonString = JSON.stringify(payload);
  const compressed = pako.deflate(jsonString);
  let binary = '';
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const OutputPanel: React.FC<OutputPanelProps> = ({ idea, jsonOutput, isLoading, error, onSave }) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    // When the output changes from the parent, exit editing mode
    if (isEditing) {
      setIsEditing(false);
    }
    setValidationError(null);
    setCopied(false);
    setLinkCopied(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonOutput, isLoading, error]);
  
  useEffect(() => {
    let timer: number;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 2000);
    }
    if (linkCopied) {
      timer = setTimeout(() => setLinkCopied(false), 2000);
    }
    return () => clearTimeout(timer);
  }, [copied, linkCopied]);

  const handleCopy = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
    }
  };
  
  const handleShare = () => {
    if (idea && jsonOutput) {
      const encoded = encodePrompt({ idea, prompt: jsonOutput });
      const url = `${window.location.origin}${window.location.pathname}?prompt=${encoded}`;
      navigator.clipboard.writeText(url);
      setLinkCopied(true);
    }
  };

  const handleEditClick = () => {
    let prettyJson = jsonOutput;
    try {
      prettyJson = JSON.stringify(JSON.parse(jsonOutput), null, 2);
    } catch {
      // Use raw if it's not valid JSON
    }
    setEditedContent(prettyJson);
    setIsEditing(true);
    setValidationError(null);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent('');
    setValidationError(null);
  };

  const handleSaveClick = () => {
    try {
      // Validate that it's still valid JSON
      JSON.parse(editedContent);
      onSave(editedContent);
      setIsEditing(false);
      setValidationError(null);
    } catch (e) {
      setValidationError("Invalid JSON format. Please correct it before saving.");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <LoadingSpinnerIcon className="w-8 h-8 animate-spin mb-4" />
          <p>Generating structured prompt...</p>
        </div>
      );
    }

    if (error && !isEditing) { // Don't hide editor if an error occurs on save
      return (
        <div className="flex items-center justify-center h-full text-red-400 p-4">
            <div className="text-center">
                <p className="font-semibold">An error occurred:</p>
                <p className="text-sm mt-2 break-all">{error}</p>
            </div>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div className="flex flex-col h-full">
            <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full flex-grow p-4 bg-gray-900/70 border border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-shadow duration-200 text-gray-300 font-mono text-sm"
                aria-label="JSON editor"
            />
            {validationError && <p className="text-xs text-red-400 mt-2">{validationError}</p>}
        </div>
      )
    }

    if (jsonOutput) {
      let prettyJson;
      try {
        // Attempt to prettify the JSON. If it fails, use the raw string.
        prettyJson = JSON.stringify(JSON.parse(jsonOutput), null, 2);
      } catch (e) {
        prettyJson = jsonOutput;
      }

      return (
        <div className="w-full h-full bg-gray-900/70 border border-gray-600 rounded-md overflow-auto text-sm">
            <SyntaxHighlighter
              language="json"
              style={vscDarkPlus}
              customStyle={{ background: 'transparent', margin: 0, padding: '1rem', height: '100%', overflow: 'hidden' }}
              codeTagProps={{ style: { fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }}
            >
              {prettyJson}
            </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <p>Your structured prompt will appear here.</p>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 flex flex-col h-full shadow-lg relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Structured Output (JSON)</h2>
        {jsonOutput && !isLoading && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveClick}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600/80 text-white rounded-md hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500"
                  aria-label="Save changes"
                >
                  <SaveIcon className="w-4 h-4" /> Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-600 text-gray-300 rounded-md hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-gray-400"
                  aria-label="Cancel editing"
                >
                  <CloseIcon className="w-4 h-4" /> Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700/60 text-gray-300 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                  aria-label="Share prompt"
                  disabled={linkCopied}
                >
                  {linkCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ShareIcon className="w-4 h-4" />}
                  {linkCopied ? 'Link Copied!' : 'Share'}
                </button>
                 <button
                  onClick={handleEditClick}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700/60 text-gray-300 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                  aria-label="Edit JSON"
                >
                  <EditIcon className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-700/60 text-gray-300 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                  aria-label="Copy JSON to clipboard"
                  disabled={copied}
                >
                  {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex-grow relative min-h-[200px] md:min-h-0">
        {renderContent()}
      </div>
    </div>
  );
};