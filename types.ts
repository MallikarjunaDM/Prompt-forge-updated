export interface StructuredPrompt {
  role: string;
  task: string;
  context: string;
  steps: string[];
  output_format: {
    language: string;
    style: string;
    executable?: boolean;
  };
  constraints: string[];
}

export interface HistoryItem {
  id: string;
  idea: string;
  structuredPrompt: StructuredPrompt;
  timestamp: string;
}
