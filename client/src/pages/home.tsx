import { useState } from "react";
import ChatInterface from "@/components/chat-interface";
import Sidebar from "@/components/sidebar";

export default function Home() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  return (
    <div className="flex h-screen bg-awake-gray font-inter antialiased" data-testid="main-layout">
      <Sidebar 
        currentConversationId={currentConversationId}
        onConversationSelect={setCurrentConversationId}
        onNewChat={() => setCurrentConversationId(null)}
        data-testid="sidebar"
      />
      <ChatInterface 
        conversationId={currentConversationId}
        onConversationCreate={setCurrentConversationId}
        data-testid="chat-interface"
      />
    </div>
  );
}
