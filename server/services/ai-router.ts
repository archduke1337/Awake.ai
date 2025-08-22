import { querySchema } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";

interface AIResponse {
  content: string;
  model: string;
  metadata?: any;
}

class AIRouter {
  private genai: GoogleGenAI;
  
  constructor() {
    this.genai = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
  }

  async routeQuery(message: string): Promise<AIResponse> {
    try {
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
      return {
        content: "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment.",
        model: "fallback",
        metadata: { error: error.message }
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
    
    const response = await this.genai.models.generateContent({
      model: model,
      contents: fullPrompt,
    });

    const content = response.text || "I couldn't generate a response.";
    return { content };
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
