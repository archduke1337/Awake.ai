import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import type { Conversation } from "@shared/schema";
import logoImage from "@assets/download_1755887584877.png";

interface SidebarProps {
  currentConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewChat: () => void;
}

export default function Sidebar({
  currentConversationId,
  onConversationSelect,
  onNewChat,
}: SidebarProps) {
  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours =
      Math.abs(now.getTime() - d.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <div
      className="w-64 bg-white border-r border-gray-200 flex flex-col"
      data-testid="sidebar-container"
    >
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src={logoImage} alt="Awake" className="w-10 h-10 rounded-xl" data-testid="logo-icon" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-awake-text"
              data-testid="app-title"
            >
              AWAKE
            </h1>
            <p
              className="text-xs text-awake-light-text"
              data-testid="app-subtitle"
            >
              One Mind, Infinite Intelligences
            </p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className="w-full bg-awake-blue hover:bg-awake-dark-blue text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
          data-testid="button-new-chat"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4" data-testid="chat-history">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-awake-light-text mb-3">
            Recent Conversations
          </h3>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-gray-100 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <p
              className="text-sm text-awake-light-text text-center py-4"
              data-testid="text-no-conversations"
            >
              No conversations yet. Start a new chat!
            </p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={`p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                  currentConversationId === conversation.id
                    ? "border-l-2 border-awake-blue bg-blue-50"
                    : ""
                }`}
                data-testid={`conversation-item-${conversation.id}`}
              >
                <p
                  className="text-sm font-medium text-awake-text truncate"
                  data-testid={`text-conversation-title-${conversation.id}`}
                >
                  {conversation.title}
                </p>
                <p
                  className="text-xs text-awake-light-text mt-1"
                  data-testid={`text-conversation-time-${conversation.id}`}
                >
                  {formatTime(conversation.updatedAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span
              className="text-white text-sm font-medium"
              data-testid="text-user-initials"
            >
              JD
            </span>
          </div>
          <div className="flex-1">
            <p
              className="text-sm font-medium text-awake-text"
              data-testid="text-user-name"
            >
              IBM 
            </p>
            <p
              className="text-xs text-awake-light-text"
              data-testid="text-user-plan"
            >
              Free Plan
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-awake-light-text hover:text-awake-text p-2"
            data-testid="button-settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
