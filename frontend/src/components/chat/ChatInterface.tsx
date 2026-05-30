"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AIGreeting } from "./AIGreeting";
import { QuickActions } from "./QuickActions";
import { useAuthStore, useChatStore } from "@/lib/store";
import type { ChatMessage as ChatMessageType, AIAction } from "@/types";
import { generateId } from "@/lib/utils";

export function ChatInterface() {
  const { user } = useAuthStore();
  const { messages, addMessage, isTyping, setTyping } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<ChatMessageType> => {
    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Simple intent detection for demo
    const lowerMessage = userMessage.toLowerCase();
    let response = "";
    let action: AIAction | undefined;

    if (lowerMessage.includes("expense") || lowerMessage.includes("spent")) {
      // Extract amount and category from message
      const amountMatch = userMessage.match(/₹?\$?(\d+[\d,]*)/);
      const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;

      response = `I've added your expense of ₹${amount.toLocaleString()}. Here's what I recorded:\n\n• Amount: ₹${amount.toLocaleString()}\n• Category: General\n• Date: Today\n\nIs this correct, or would you like to change the category?`;
      action = {
        type: "add_expense",
        status: "requires_confirmation",
        creditsUsed: 2,
        confirmationRequired: true,
        data: { amount, category: "general", date: new Date().toISOString() },
      };
    } else if (lowerMessage.includes("report") || lowerMessage.includes("spending")) {
      response = `Here's your spending summary for this month:\n\n💰 Total Expenses: ₹45,230\n📊 Top Category: Food & Dining (₹12,500)\n📈 vs Last Month: +8.5%\n\nWould you like a detailed breakdown by category?`;
      action = {
        type: "generate_report",
        status: "completed",
        creditsUsed: 1,
        confirmationRequired: false,
      };
    } else if (lowerMessage.includes("warranty")) {
      response = `I found 3 items with warranties:\n\n1. **iPhone 15** - Expires in 8 months\n2. **Samsung TV** - Expires in 11 months\n3. **MacBook Pro** - Expires in 6 months\n\nWould you like me to set reminders for any of these?`;
      action = {
        type: "track_warranty",
        status: "completed",
        creditsUsed: 1,
        confirmationRequired: false,
      };
    } else if (lowerMessage.includes("receipt") || lowerMessage.includes("upload")) {
      response = `I can help you scan and upload receipts! Here's what I can do:\n\n📸 Scan receipts from images\n📄 Extract data from PDFs\n🧾 Auto-categorize expenses\n\nJust upload an image or PDF and I'll process it for you (uses 5 credits).`;
    } else if (lowerMessage.includes("budget")) {
      response = `Here's your budget status:\n\n🎯 Monthly Budget: ₹50,000\n✅ Spent: ₹45,230 (90%)\n💰 Remaining: ₹4,770\n\n⚠️ You're close to your budget limit. Consider reducing discretionary spending.`;
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      response = `Hello! 👋 I'm Safal-AI, your financial assistant. I can help you with:\n\n• Adding expenses and purchases\n• Scanning receipts\n• Tracking warranties\n• Generating reports\n• Managing budgets\n\nWhat would you like to do today?`;
    } else {
      response = `I understand you want to: "${userMessage}"\n\nI'm still learning! For now, I can best help with:\n• Adding expenses (e.g., "Add ₹500 for groceries")\n• Checking reports (e.g., "Show my spending")\n• Tracking warranties (e.g., "Check my warranties")\n\nHow else can I assist you?`;
    }

    return {
      id: generateId(),
      role: "assistant",
      content: response,
      timestamp: new Date().toISOString(),
      action,
    };
  };

  const handleSend = async (message: string, attachments?: File[]) => {
    if (isSending) return;
    setIsSending(true);

    // Add user message
    const userMsg: ChatMessageType = {
      id: generateId(),
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
      attachments: attachments?.map((file) => ({
        id: generateId(),
        type: file.type.startsWith("image/") ? "image" : "document",
        url: URL.createObjectURL(file),
        name: file.name,
      })),
    };
    addMessage(userMsg);

    // Show typing indicator
    setTyping(true);

    try {
      // Simulate AI response
      const aiResponse = await simulateAIResponse(message);
      addMessage(aiResponse);
    } catch (error) {
      // Add error message
      addMessage({
        id: generateId(),
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setTyping(false);
      setIsSending(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    const actionMessages: Record<string, string> = {
      add_expense: "I want to add a new expense",
      upload_receipt: "I want to upload and scan a receipt",
      add_purchase: "I want to add a new purchase item",
      check_warranty: "Show me my warranty tracking",
      check_expiry: "What items are expiring soon?",
      create_event: "I want to create a new event budget",
      generate_report: "Generate my spending report",
      search: "I want to search my records",
      check_budget: "What's my budget status?",
      family_expenses: "Show family expenses",
    };

    handleSend(actionMessages[actionId] || actionId);
  };

  const handleVoiceInput = () => {
    // Voice input placeholder
    console.log("Voice input triggered");
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {!hasMessages ? (
          <AIGreeting user={user} onQuickAction={handleQuickAction} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Quick Actions Bar */}
            <div className="sticky top-0 bg-gray-50 py-2 z-10">
              <QuickActions onAction={handleQuickAction} compact />
            </div>

            {/* Messages */}
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-gray-50 p-4 lg:p-6 border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSend={handleSend}
            onVoiceInput={handleVoiceInput}
            disabled={isSending || isTyping}
          />
        </div>
      </div>
    </div>
  );
}
