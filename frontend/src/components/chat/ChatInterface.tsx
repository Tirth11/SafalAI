"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AIGreeting } from "./AIGreeting";
import { useAuthStore, useChatStore } from "@/lib/store";
import type { ChatMessage as ChatMessageType } from "@/types";
import { generateId } from "@/lib/utils";

// Guided AI responses per action - asks for details, never creates directly
const guidedResponses: Record<string, string> = {
  add_expense:
    "Sure. Please tell me the expense details.\n\nFor example: amount, category, date, and purpose.\n\nYou can say something like:\n\"Add ₹10,000 for car repair today.\"",
  add_purchase:
    "Sure. Please tell me what you purchased, the amount, purchase date, store name, and warranty details if available.\n\nFor example:\n\"I purchased a Samsung fridge for ₹45,000 from Croma with 1 year warranty.\"",
  upload_receipt:
    "Please upload your bill or receipt. I will read it and show you the details before saving.\n\nYou can upload an image or PDF using the attachment button below.",
  track_warranty:
    "Sure. Please tell me the product name, purchase date, and warranty period, or upload the invoice/warranty card.\n\nFor example:\n\"iPhone 15 Pro purchased on Jan 15, 2024 with 1 year AppleCare warranty.\"",
  add_expiry:
    "Please tell me the item name and expiry date, or upload a bill/product image if the expiry date is visible.\n\nFor example:\n\"Milk expires on June 5\" or \"Medicine expires Aug 2026.\"",
  generate_report:
    "Sure. What report would you like to generate?\n\nFor example:\n• Monthly expense report\n• Category-wise spending report\n• Warranty expiry report\n• Family spending report\n• Event expense report\n\nPlease tell me the type and date range.",
  event_expense:
    "Please tell me the event name, budget, participants, and expense details you want to track.\n\nFor example:\n\"Create a Goa Trip event with ₹50,000 budget and 5 participants.\"",
  family_expense:
    "Please tell me which family member or group this expense belongs to and the expense details.\n\nFor example:\n\"Add ₹2,000 school expense for my son.\"",
};

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

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 800));

    const lower = userMessage.toLowerCase();

    // Expense intent
    if (lower.includes("expense") || lower.includes("spent") || lower.includes("paid")) {
      const amountMatch = userMessage.match(/₹?\$?(\d+[\d,]*)/);
      if (amountMatch) {
        const amount = amountMatch[1].replace(/,/g, "");
        return `I understood:\n\n• **Amount:** ₹${parseInt(amount).toLocaleString()}\n• **Description:** ${userMessage}\n• **Date:** Today\n• **Category:** General\n\nShall I save this expense? Please confirm or tell me if you'd like to change anything.`;
      }
      return "Please provide the expense amount, category, and description. For example:\n\"₹500 for groceries today.\"";
    }

    // Purchase intent
    if (lower.includes("purchase") || lower.includes("bought") || lower.includes("buy")) {
      return "I can help with that! Please share:\n• Product name\n• Price\n• Store (optional)\n• Warranty period (optional)\n\nFor example: \"Bought Sony headphones for ₹3,500 from Amazon with 1 year warranty.\"";
    }

    // Report intent
    if (lower.includes("report") || lower.includes("summary") || lower.includes("spending")) {
      return "What type of report would you like?\n\n• Monthly expenses\n• Category breakdown\n• Family spending\n• Event expenses\n\nAlso, what time period? (e.g., this month, last 3 months, 2024)";
    }

    // Warranty intent
    if (lower.includes("warranty")) {
      return "I can help track warranties. Please tell me:\n• Product name\n• Purchase date\n• Warranty period\n\nOr upload the warranty card/invoice.";
    }

    // Budget/balance
    if (lower.includes("budget") || lower.includes("balance") || lower.includes("credit")) {
      return `Here's your current status:\n\n💰 **Credits Available:** ${user?.subscription?.creditsBalance || 0}\n📊 **Plan:** ${user?.subscription?.plan || "Free"}\n\nWould you like to buy more credits or see usage history?`;
    }

    // Greeting
    if (lower.includes("hello") || lower.includes("hi") || lower === "hey") {
      return `Hi ${user?.name?.split(" ")[0] || "there"}! 👋 How can I help you today?\n\nYou can ask me to add expenses, track purchases, scan receipts, check warranties, or generate reports.`;
    }

    // Default
    return `I understand. Could you provide more details?\n\nI can help with:\n• Adding expenses or purchases\n• Scanning receipts and bills\n• Tracking warranties and expiry dates\n• Generating spending reports\n\nJust tell me what you'd like to do!`;
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

    // Show typing
    setTyping(true);

    try {
      const response = await simulateAIResponse(message);

      addMessage({
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      addMessage({
        id: generateId(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setTyping(false);
      setIsSending(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    // Quick action starts a guided conversation — NOT immediate creation
    const guidedMessage = guidedResponses[actionId];

    if (guidedMessage) {
      // Add a user message showing what they clicked
      const actionLabels: Record<string, string> = {
        add_expense: "Add Expense",
        add_purchase: "Add Purchase Item",
        upload_receipt: "Upload Bill / Receipt",
        track_warranty: "Track Warranty",
        add_expiry: "Add Expiry Reminder",
        generate_report: "Generate Report",
        event_expense: "Create Event Expense",
        family_expense: "Manage Family / Shared Expense",
      };

      addMessage({
        id: generateId(),
        role: "user",
        content: actionLabels[actionId] || actionId,
        timestamp: new Date().toISOString(),
      });

      // AI responds with guided question — does NOT create any record
      setTimeout(() => {
        addMessage({
          id: generateId(),
          role: "assistant",
          content: guidedMessage,
          timestamp: new Date().toISOString(),
        });
      }, 500);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">SafalMyBuy Assistant</h1>
          <p className="text-xs text-gray-500">AI-powered expense & purchase management</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
          <span className="text-xs font-medium text-green-700">
            {user?.subscription?.creditsBalance || 0} credits
          </span>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
        {!hasMessages ? (
          <AIGreeting user={user} onQuickAction={handleQuickAction} />
        ) : (
          <div className="max-w-2xl mx-auto space-y-5">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
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
      <div className="flex-shrink-0 bg-white border-t border-gray-100 p-4 lg:px-6">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSend={handleSend}
            disabled={isSending || isTyping}
            placeholder="Type your request or describe what you need..."
          />
        </div>
      </div>
    </div>
  );
}
