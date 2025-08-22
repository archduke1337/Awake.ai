import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Code, Lightbulb, Search, Mail } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message || disabled) return;
    
    onSendMessage(message);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [inputValue]);

  const quickSuggestions = [
    { icon: Code, text: "Help with code", prompt: "I need help with coding. Can you assist me with " },
    { icon: Lightbulb, text: "Creative writing", prompt: "I need help with creative writing. Can you help me " },
    { icon: Search, text: "Research topic", prompt: "I need to research " },
    { icon: Mail, text: "Draft email", prompt: "Can you help me draft an email about " }
  ];

  const handleSuggestionClick = (prompt: string) => {
    setInputValue(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4" data-testid="message-input-container">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex items-end space-x-4" data-testid="form-message">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything... I'll route your question to the best AI model"
              className="resize-none border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-awake-blue focus:border-transparent max-h-32 min-h-[48px]"
              rows={1}
              disabled={disabled}
              data-testid="input-message"
            />
            
            {/* Attachment Button */}
            <Button 
              type="button" 
              variant="ghost"
              size="sm"
              className="absolute right-3 bottom-3 text-awake-light-text hover:text-awake-text transition-colors duration-150 p-1 h-auto"
              disabled={disabled}
              data-testid="button-attachment"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Send Button */}
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || disabled}
            className="bg-awake-blue hover:bg-awake-dark-blue disabled:bg-gray-300 text-white rounded-2xl p-3 transition-colors duration-200 flex items-center justify-center"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {/* Quick Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2" data-testid="quick-suggestions">
          {quickSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion.prompt)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm text-awake-text rounded-full transition-colors duration-150 h-auto"
              disabled={disabled}
              data-testid={`button-suggestion-${index}`}
            >
              <suggestion.icon className="w-3 h-3 mr-1" />
              {suggestion.text}
            </Button>
          ))}
        </div>
        
        {/* Footer Text */}
        <p className="text-xs text-awake-light-text text-center mt-3" data-testid="text-footer">
          AWAKE intelligently routes your queries to the most suitable AI model for optimal responses.
        </p>
      </div>
    </div>
  );
}
