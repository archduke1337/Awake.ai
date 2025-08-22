import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MoreVertical, ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import MessageInput from "./message-input";
import { Brain, Bot } from "lucide-react";
import type { Message, Conversation } from "@shared/schema";

interface ChatInterfaceProps {
  conversationId: string | null;
  onConversationCreate: (id: string) => void;
}

interface ConversationWithMessages {
  conversation: Conversation;
  messages: Message[];
}

interface QueryResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
  routing: any;
}

export default function ChatInterface({ conversationId, onConversationCreate }: ChatInterfaceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingConversation } = useQuery<ConversationWithMessages>({
    queryKey: ["/api/conversations", conversationId],
    enabled: !!conversationId,
  });

  const messages = data?.messages || [];

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversationId }),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return response.json() as Promise<QueryResponse>;
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      if (!conversationId) {
        onConversationCreate(data.conversationId);
      }
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
      }
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSendMessage = (message: string) => {
    sendMessageMutation.mutate(message);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 flex flex-col" data-testid="chat-interface-container">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-awake-text" data-testid="text-chat-title">AI Assistant</h2>
            <p className="text-sm text-awake-light-text" data-testid="text-chat-subtitle">Powered by multiple AI models</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* API Status Indicators */}
            <div className="flex items-center space-x-2" data-testid="api-status-indicators">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" data-testid="status-gpt"></div>
                <span className="text-xs text-awake-light-text">GPT</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" data-testid="status-gemini"></div>
                <span className="text-xs text-awake-light-text">Gemini</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full" data-testid="status-copilot"></div>
                <span className="text-xs text-awake-light-text">Copilot</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-awake-light-text hover:text-awake-text"
              data-testid="button-menu"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto" data-testid="messages-container">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          
          {/* Welcome Message */}
          {messages.length === 0 && !isLoadingConversation && (
            <div className="text-center py-8" data-testid="welcome-message">
              <div className="w-16 h-16 bg-gradient-to-br from-awake-blue to-awake-dark-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="text-white w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-awake-text mb-2" data-testid="text-welcome-title">Welcome to AWAKE</h3>
              <p className="text-awake-light-text max-w-md mx-auto" data-testid="text-welcome-description">
                I'm your unified AI assistant, powered by multiple intelligence models. I can help with coding, creativity, research, and more.
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.map((message) => (
            <div key={message.id} data-testid={`message-${message.id}`}>
              {message.role === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-xs lg:max-w-md">
                    <div className="bg-awake-blue text-white rounded-2xl rounded-br-md px-4 py-3">
                      <p className="text-sm whitespace-pre-wrap" data-testid={`text-user-message-${message.id}`}>
                        {message.content}
                      </p>
                    </div>
                    <div className="flex justify-end mt-1">
                      <span className="text-xs text-awake-light-text" data-testid={`text-user-time-${message.id}`}>
                        You • {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-2xl">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-awake-green to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="text-white w-4 h-4" />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        {message.metadata && (message.metadata as any)?.routingReason && (
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-medium text-awake-green" data-testid={`text-routing-info-${message.id}`}>
                              {(message.metadata as any).routingReason}
                            </span>
                          </div>
                        )}
                        <div className="text-sm text-awake-text whitespace-pre-wrap" data-testid={`text-assistant-message-${message.id}`}>
                          {message.content}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 ml-11">
                      <span className="text-xs text-awake-light-text" data-testid={`text-assistant-time-${message.id}`}>
                        AWAKE • {formatTime(message.timestamp)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-awake-light-text hover:text-awake-text p-1 h-auto"
                          data-testid={`button-thumbs-up-${message.id}`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-awake-light-text hover:text-awake-text p-1 h-auto"
                          data-testid={`button-thumbs-down-${message.id}`}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(message.content)}
                          className="text-awake-light-text hover:text-awake-text p-1 h-auto"
                          data-testid={`button-copy-${message.id}`}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-start" data-testid="loading-message">
              <div className="max-w-xs lg:max-w-md">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-awake-green to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="text-white w-4 h-4" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-awake-light-text rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-awake-light-text rounded-full animate-bounce-delay-1"></div>
                        <div className="w-2 h-2 bg-awake-light-text rounded-full animate-bounce-delay-2"></div>
                      </div>
                      <span className="text-xs text-awake-light-text" data-testid="text-processing">Processing your request...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        disabled={isLoading}
        data-testid="message-input"
      />
    </div>
  );
}
