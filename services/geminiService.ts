
import { GoogleGenAI, Type } from "@google/genai";
import type { StructuredPrompt } from '../types';

// Fix: Use process.env.API_KEY directly in the named parameter constructor as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Defined with a looser type to avoid potential transpilation or import issues 
// with complex generic types from the SDK in this environment.
const responseSchema: any = {
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
    // Fix: Use gemini-3-pro-preview for complex reasoning and structured generation tasks
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Transform the following simple prompt idea into a detailed, structured JSON prompt: "${idea}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
        systemInstruction: "You are an expert prompt engineering assistant. Your task is to take a user's simple, natural language prompt idea and transform it into a highly structured, detailed, and optimized JSON format. The JSON should be designed to elicit the best possible response from a large language model. Adhere strictly to the provided JSON schema."
      },
    });

    // Fix: Access the text property directly (not a method) and handle potential undefined values
    const text = response.text?.trim();
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
