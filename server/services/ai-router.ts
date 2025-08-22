import { querySchema } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

interface AIResponse {
  content: string;
  model: string;
  metadata?: any;
}

class AIRouter {
  private genai: GoogleGenAI;
  private disabled: boolean = false;
  
  constructor() {
    const key = process.env.GEMINI_API_KEY || "";
    if (!key) {
      console.warn('GEMINI_API_KEY not set — AI calls will be disabled');
      // Still construct client with empty key to avoid null errors in some environments
      this.genai = new GoogleGenAI({ apiKey: "" });
      this.disabled = true;
    } else {
      this.genai = new GoogleGenAI({ apiKey: key });
    }
  }

  async routeQuery(message: string): Promise<AIResponse> {
    try {
      if (this.disabled) {
        throw new Error('Gemini API key not configured');
      }
      // Simple routing logic: code-related queries use gemini-2.5-pro, others use gemini-2.5-flash
      const isCodeQuery = this.isCodeRelated(message);
      const model = isCodeQuery ? "gemini-2.5-pro" : "gemini-2.5-flash";
      
      const response = await this.callGemini(message, model);
      const humanizedResponse = this.humanizeResponse(response.content, isCodeQuery);
      
      return {
        content: humanizedResponse,
        model: model,
        metadata: {
          originalModel: model,
          isCodeQuery,
          routingReason: isCodeQuery ? "Code-related query routed to Gemini Pro" : "General query routed to Gemini Flash"
        }
      };
    } catch (error) {
      console.error("AI Router error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        content: "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment.",
        model: "fallback",
        metadata: { error: errorMessage }
      };
    }
  }

  private isCodeRelated(message: string): boolean {
    const codeKeywords = [
      'code', 'function', 'debug', 'programming', 'python', 'javascript', 'typescript',
      'react', 'html', 'css', 'algorithm', 'optimize', 'refactor', 'bug', 'error',
      'compile', 'syntax', 'variable', 'array', 'object', 'class', 'method',
      'api', 'database', 'sql', 'git', 'github', 'npm', 'package', 'import',
      'export', 'async', 'await', 'promise', 'callback', 'loop', 'condition'
    ];
    
    const lowerMessage = message.toLowerCase();
    return codeKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  private async callGemini(message: string, model: string): Promise<{ content: string }> {
    const systemPrompt = "You are AWAKE, a helpful AI assistant that provides clear, accurate, and friendly responses. When helping with code, provide practical solutions with explanations.";
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
    try {
      const response = await this.genai.models.generateContent({
        model: model,
        contents: fullPrompt,
      });

      // The genai client can return content in different shapes depending on SDK version.
      // Try common fields, then fall back to serializing the response for debugging.
      let content: string | undefined = undefined;
      // common text field
      if (response && typeof (response as any).text === 'string') content = (response as any).text;
      // some SDKs reply in `output` or `output_text`
      if (!content && (response as any).output_text) content = (response as any).output_text;
      // nested candidates/choices
      if (!content && Array.isArray((response as any).candidates) && (response as any).candidates[0]) {
        content = (response as any).candidates[0].content || (response as any).candidates[0].text;
      }
      // Deeply nested formats
      if (!content && (response as any).output && Array.isArray((response as any).output) && (response as any).output[0]) {
        content = ((response as any).output[0].content && (response as any).output[0].content[0] && (response as any).output[0].content[0].text) || undefined;
      }

      if (!content) {
        // Nothing useful found — log full response to aid debugging and return fallback text
        console.error('Unexpected Gemini response shape:', JSON.stringify(response));
        content = "I couldn't generate a response.";
      }

      return { content };
    } catch (err) {
      // Re-throw so outer handler wraps into a friendly error message
      console.error('callGemini failed:', err);
      throw err;
    }
  }

  private humanizeResponse(content: string, isCodeQuery: boolean): string {
    // Add a friendly, conversational tone
    let humanized = content;
    
    // Add context-appropriate introductions
    if (isCodeQuery) {
      if (!content.toLowerCase().includes("i'd") && !content.toLowerCase().includes("i can") && !content.toLowerCase().includes("let me")) {
        humanized = "I'd be happy to help you with that! " + content;
      }
    } else {
      if (!content.toLowerCase().includes("i'd") && !content.toLowerCase().includes("i can") && !content.toLowerCase().includes("here's")) {
        humanized = "Here's what I can tell you: " + content;
      }
    }
    
    return humanized;
  }
}

export const aiRouter = new AIRouter();
