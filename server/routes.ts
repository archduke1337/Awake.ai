import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { querySchema } from "@shared/schema";
import { aiRouter } from "./services/ai-router";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get conversation with messages
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await storage.getMessages(id);
      res.json({ conversation, messages });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const { title } = req.body;
      const conversation = await storage.createConversation({ title });
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  // Main query endpoint - handles AI routing and responses
  app.post("/api/query", async (req, res) => {
    try {
      const validation = querySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid request",
          errors: validation.error.errors 
        });
      }

      const { message, conversationId } = validation.data;
      let currentConversationId = conversationId;

      // Create new conversation if none exists
      if (!currentConversationId) {
        const title = message.substring(0, 50) + (message.length > 50 ? "..." : "");
        const conversation = await storage.createConversation({ title });
        currentConversationId = conversation.id;
      }

      // Store user message
      const userMessage = await storage.createMessage({
        conversationId: currentConversationId,
        role: "user",
        content: message,
        model: null,
        metadata: null,
      });

      // Route to AI and get response
      const aiResponse = await aiRouter.routeQuery(message);

      // Store AI response
      const assistantMessage = await storage.createMessage({
        conversationId: currentConversationId,
        role: "assistant",
        content: aiResponse.content,
        model: aiResponse.model,
        metadata: aiResponse.metadata,
      });

      // Update conversation timestamp
      await storage.updateConversation(currentConversationId, { updatedAt: new Date() });

      res.json({
        conversationId: currentConversationId,
        userMessage,
        assistantMessage,
        routing: aiResponse.metadata
      });

    } catch (error) {
      console.error("Query endpoint error:", error);
      res.status(500).json({ message: "Failed to process query" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
