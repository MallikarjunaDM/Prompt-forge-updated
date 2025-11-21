
import { GoogleGenAI, Type } from "@google/genai";
import type { StructuredPrompt } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema: import("@google/genai").Schema<keyof StructuredPrompt> = {
  type: Type.OBJECT,
  properties: {
    role: {
      type: Type.STRING,
      description: "The persona or expertise the LLM should adopt, e.g., 'Expert Python Developer'."
    },
    task: {
      type: Type.STRING,
      description: "A clear and concise description of the main objective."
    },
    context: {
      type: Type.STRING,
      description: "Background information or context for the task, explaining the 'why'."
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A sequential, step-by-step breakdown of the tasks to be performed."
    },
    output_format: {
      type: Type.OBJECT,
      properties: {
        language: { type: Type.STRING, description: "The programming or markup language for the output, e.g., 'python'." },
        style: { type: Type.STRING, description: "Stylistic guidelines for the output, e.g., 'Clean, well-commented code'." },
        // FIX: Removed unsupported 'nullable' property from schema.
        executable: { type: Type.BOOLEAN, description: "Whether the output should be directly executable." }
      },
      required: ['language', 'style']
    },
    constraints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Specific limitations, rules, or negative constraints to follow."
    }
  },
  required: ['role', 'task', 'context', 'steps', 'output_format', 'constraints']
};

export const generateStructuredPrompt = async (idea: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Transform the following simple prompt idea into a detailed, structured JSON prompt: "${idea}"`,
      // FIX: Moved systemInstruction into the config object.
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        systemInstruction: "You are an expert prompt engineering assistant. Your task is to take a user's simple, natural language prompt idea and transform it into a highly structured, detailed, and optimized JSON format. The JSON should be designed to elicit the best possible response from a large language model. Adhere strictly to the provided JSON schema."
      },
    });

    const text = response.text.trim();
    if (!text) {
      throw new Error("Received an empty response from the API.");
    }
    
    // Basic validation to ensure it's a JSON object
    if (!text.startsWith('{') || !text.endsWith('}')) {
       throw new Error("API did not return a valid JSON object.");
    }

    return text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the Gemini API.");
  }
};
