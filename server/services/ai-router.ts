import { querySchema } from "@shared/schema";

interface AIResponse {
  content: string;
  model: string;
  metadata?: any;
}

class AIRouter {
  private openRouterApiKey: string;
  
  constructor() {
    this.openRouterApiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || "sk-dummy-key";
  }

  async routeQuery(message: string): Promise<AIResponse> {
    try {
      // Simple routing logic: code-related queries go to OpenAI via OpenRouter
      const isCodeQuery = this.isCodeRelated(message);
      const model = isCodeQuery ? "openai/gpt-4o" : "openai/gpt-4o"; // Using OpenAI for both for now
      
      const response = await this.callOpenRouter(message, model);
      const humanizedResponse = this.humanizeResponse(response.content, isCodeQuery);
      
      return {
        content: humanizedResponse,
        model: model,
        metadata: {
          originalModel: model,
          isCodeQuery,
          routingReason: isCodeQuery ? "Code-related query routed to OpenAI" : "General query routed to OpenAI"
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

  private async callOpenRouter(message: string, model: string): Promise<{ content: string }> {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.REPLIT_DOMAINS || "http://localhost:5000",
        "X-Title": "AWAKE AI Assistant",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are AWAKE, a helpful AI assistant that provides clear, accurate, and friendly responses. When helping with code, provide practical solutions with explanations."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || "I couldn't generate a response."
    };
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
