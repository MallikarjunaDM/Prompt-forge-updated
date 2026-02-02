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
  magic_prompt?: {
    checklist: string[];
    formula: {
      context: string | null;
      task: string | null;
      instruction: string | null;
      data: string | null;
    };
  };
}

export interface HistoryItem {
  id: string;
  idea: string;
  structuredPrompt: StructuredPrompt;
  timestamp: string;
}