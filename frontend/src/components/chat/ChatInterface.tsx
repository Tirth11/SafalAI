"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AIGreeting } from "./AIGreeting";
import { PreviewCard } from "./PreviewCard";
import { useAuthStore, useChatStore } from "@/lib/store";
import type { ChatMessage as ChatMessageType } from "@/types";
import { generateId } from "@/lib/utils";

// Categories mapping for auto-categorization
const categoryMap: Record<string, { category: string; subcategory: string }> = {
  car: { category: "Vehicle / Automobile", subcategory: "Car Repair" },
  petrol: { category: "Vehicle / Automobile", subcategory: "Fuel" },
  fuel: { category: "Vehicle / Automobile", subcategory: "Fuel" },
  grocery: { category: "Daily Needs", subcategory: "Grocery" },
  groceries: { category: "Daily Needs", subcategory: "Grocery" },
  milk: { category: "Daily Needs", subcategory: "Grocery" },
  food: { category: "Food & Dining", subcategory: "Restaurant" },
  restaurant: { category: "Food & Dining", subcategory: "Restaurant" },
  dinner: { category: "Food & Dining", subcategory: "Restaurant" },
  lunch: { category: "Food & Dining", subcategory: "Restaurant" },
  medicine: { category: "Healthcare", subcategory: "Medicine" },
  doctor: { category: "Healthcare", subcategory: "Consultation" },
  rent: { category: "Home / Housing", subcategory: "Rent" },
  electricity: { category: "Utilities", subcategory: "Electricity" },
  internet: { category: "Utilities", subcategory: "Internet" },
  laptop: { category: "Electronics", subcategory: "Computer" },
  phone: { category: "Electronics", subcategory: "Mobile" },
  iphone: { category: "Electronics", subcategory: "Mobile" },
  headphones: { category: "Electronics", subcategory: "Audio" },
  tv: { category: "Electronics", subcategory: "Television" },
  fridge: { category: "Home Appliances", subcategory: "Refrigerator" },
  travel: { category: "Travel", subcategory: "General" },
  flight: { category: "Travel", subcategory: "Flight" },
  hotel: { category: "Travel", subcategory: "Accommodation" },
  education: { category: "Education", subcategory: "General" },
  book: { category: "Education", subcategory: "Books" },
  clothes: { category: "Shopping", subcategory: "Clothing" },
  shoes: { category: "Shopping", subcategory: "Footwear" },
};

// Known online stores
const onlineStores = ["amazon", "flipkart", "myntra", "swiggy", "zomato", "bigbasket", "blinkit"];
const inStoreShops = ["kroger", "walmart", "croma", "dmart", "reliance", "big bazaar", "costco"];

interface PendingRecord {
  type: "expense" | "purchase";
  fields: Record<string, string>;
}

// Guided AI responses per action
const guidedResponses: Record<string, string> = {
  add_expense:
    "Sure. Tell me the expense in one line.\n\nFor example: \"₹10,000 car repair today\" or \"Add ₹500 grocery expense.\"",
  add_purchase:
    "Sure. Tell me what you purchased in one line.\n\nFor example: \"Bought milk for ₹20 from Kroger, expiry tomorrow\" or \"Purchased laptop from Amazon for ₹60,000 with 1 year warranty.\"",
  upload_receipt:
    "Please upload your bill or receipt using the attachment button below. I will read it and show you the details before saving.",
  track_warranty:
    "Sure. Tell me the product name, purchase date, and warranty period.\n\nFor example: \"iPhone 15 Pro purchased Jan 15, 2024 with 1 year AppleCare warranty.\"",
  add_expiry:
    "Please tell me the item name and expiry date.\n\nFor example: \"Milk expires on June 5\" or \"Medicine expires Aug 2026.\"",
  generate_report:
    "What report would you like?\n\n• Monthly expense report\n• Category-wise spending\n• Family spending report\n• Event expense report\n\nPlease tell me the type and time period.",
  event_expense:
    "Please tell me the event name, budget, and participants.\n\nFor example: \"Create Goa Trip event with ₹50,000 budget and 5 participants.\"",
  family_expense:
    "Please tell me the family member name and expense details.\n\nFor example: \"Add ₹2,000 school expense for my son.\"",
};

export function ChatInterface() {
  const { user } = useAuthStore();
  const { messages, addMessage, isTyping, setTyping } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [pendingRecord, setPendingRecord] = useState<PendingRecord | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, pendingRecord]);

  const userName = user?.name || "User";

  // Auto-categorize based on keywords
  const autoCategory = (text: string): { category: string; subcategory: string } => {
    const lower = text.toLowerCase();
    for (const [keyword, cat] of Object.entries(categoryMap)) {
      if (lower.includes(keyword)) return cat;
    }
    return { category: "General", subcategory: "Other" };
  };

  // Detect store type
  const detectStoreType = (store: string): string => {
    const lower = store.toLowerCase();
    if (onlineStores.some((s) => lower.includes(s))) return "Online";
    if (inStoreShops.some((s) => lower.includes(s))) return "In-store";
    return "Unknown";
  };

  // Extract store name from text
  const extractStore = (text: string): string | null => {
    const lower = text.toLowerCase();
    const allStores = [...onlineStores, ...inStoreShops];
    for (const store of allStores) {
      if (lower.includes(store)) return store.charAt(0).toUpperCase() + store.slice(1);
    }
    const fromMatch = text.match(/from\s+([A-Za-z\s]+?)(?:\s*,|\s*\.|\s+for|\s+with|$)/i);
    if (fromMatch) return fromMatch[1].trim();
    return null;
  };

  // Extract date references
  const extractDate = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("yesterday")) {
      const d = new Date(); d.setDate(d.getDate() - 1);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }
    if (lower.includes("tomorrow")) {
      const d = new Date(); d.setDate(d.getDate() + 1);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }
    return "Today";
  };

  // Extract warranty info
  const extractWarranty = (text: string): string | null => {
    const match = text.match(/(\d+)\s*(year|month|yr|mo)s?\s*warranty/i);
    if (match) return `${match[1]} ${match[2]}${parseInt(match[1]) > 1 ? "s" : ""}`;
    if (text.toLowerCase().includes("warranty")) return "Yes (duration not specified)";
    return null;
  };

  // Extract expiry info
  const extractExpiry = (text: string): string | null => {
    const lower = text.toLowerCase();
    if (lower.includes("expiry tomorrow") || lower.includes("expiring tomorrow")) {
      const d = new Date(); d.setDate(d.getDate() + 1);
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    }
    const match = text.match(/expir(?:y|ing|es?)\s+(?:on\s+)?(.+?)(?:\.|,|$)/i);
    if (match) return match[1].trim();
    return null;
  };

  // Detect if purchase or expense
  const detectRecordType = (text: string): "expense" | "purchase" => {
    const lower = text.toLowerCase();
    if (lower.includes("bought") || lower.includes("purchased") || lower.includes("purchase")) return "purchase";
    if (lower.includes("expiry") || lower.includes("warranty")) return "purchase";
    return "expense";
  };

  // Main AI processing
  const processUserInput = (text: string): { response: string; record: PendingRecord | null } => {
    const lower = text.toLowerCase();

    // Handle edit commands on pending record
    if (pendingRecord) {
      if (lower.includes("save") || lower.includes("confirm")) {
        const saved = pendingRecord;
        setPendingRecord(null);
        return {
          response: `Done! Your ${saved.type} has been saved successfully. ✅\n\n• ${saved.fields["Expense Name"] || saved.fields["Item Name"]} — ${saved.fields["Amount"] || saved.fields["Price"]}`,
          record: null,
        };
      }
      if (lower.includes("cancel")) {
        setPendingRecord(null);
        return { response: "Cancelled. No record was saved. How else can I help?", record: null };
      }
      // Edit field
      if (lower.includes("change") || lower.includes("update") || lower.includes("make") || lower.includes("add store") || lower.includes("add image")) {
        const updatedRecord = { ...pendingRecord, fields: { ...pendingRecord.fields } };

        // Change amount
        const amountChange = text.match(/(?:amount|price)\s+(?:to\s+)?₹?\$?(\d+[\d,]*)/i);
        if (amountChange) {
          const key = pendingRecord.type === "expense" ? "Amount" : "Price";
          updatedRecord.fields[key] = `₹${parseInt(amountChange[1].replace(/,/g, "")).toLocaleString()}`;
        }

        // Change date
        if (lower.includes("date") && lower.includes("yesterday")) {
          const d = new Date(); d.setDate(d.getDate() - 1);
          updatedRecord.fields["Date"] = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        }

        // Change category
        const catMatch = text.match(/category\s+(?:to\s+)?(.+?)(?:\.|$)/i);
        if (catMatch) {
          updatedRecord.fields["Category"] = catMatch[1].trim();
        }

        // Add store
        const storeMatch = text.match(/(?:store|shop)\s+(?:name\s+)?(?:to\s+)?(.+?)(?:\.|$)/i);
        if (storeMatch) {
          updatedRecord.fields["Store"] = storeMatch[1].trim();
        }

        // Reimbursable
        if (lower.includes("reimbursable")) {
          updatedRecord.fields["Reimbursable"] = "Yes";
        }

        setPendingRecord(updatedRecord);
        return {
          response: "Updated! Here's the revised preview:",
          record: updatedRecord,
        };
      }
    }

    // Extract amount
    const amountMatch = text.match(/₹?\$?(\d+[\d,]*)/);
    if (!amountMatch) {
      // No amount found - ask for it
      const type = detectRecordType(text);
      if (type === "expense") {
        return { response: "Sure. What amount should I add for this expense?", record: null };
      }
      return { response: "Sure. What was the price for this purchase?", record: null };
    }

    const amount = parseInt(amountMatch[1].replace(/,/g, ""));
    const type = detectRecordType(text);
    const { category, subcategory } = autoCategory(text);
    const store = extractStore(text);
    const date = extractDate(text);
    const warranty = extractWarranty(text);
    const expiry = extractExpiry(text);

    // Build description from text (remove amounts, common words)
    let description = text
      .replace(/₹?\$?\d+[\d,]*/g, "")
      .replace(/\b(add|bought|purchased|expense|purchase|for|from|today|yesterday|tomorrow|with|item)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    if (!description || description.length < 2) description = category;

    if (type === "expense") {
      const record: PendingRecord = {
        type: "expense",
        fields: {
          "Expense Name": description.charAt(0).toUpperCase() + description.slice(1),
          "Amount": `₹${amount.toLocaleString()}`,
          "Date": date,
          "Category": category,
          "Subcategory": subcategory,
          "Store": store || "Not provided",
          "Purchased By": userName,
          "Reimbursable": "No",
          "Event / Outlay": "None",
        },
      };
      setPendingRecord(record);
      return {
        response: "I found these details. Please check before I save:",
        record,
      };
    } else {
      const record: PendingRecord = {
        type: "purchase",
        fields: {
          "Item Name": description.charAt(0).toUpperCase() + description.slice(1),
          "Price": `₹${amount.toLocaleString()}`,
          "Quantity": "1 Unit",
          "Store": store || "Not provided",
          "Store Type": store ? detectStoreType(store) : "Not provided",
          "Purchase Date": date,
          ...(expiry ? { "Expiry Date": expiry } : {}),
          "Category": category,
          "Subcategory": subcategory,
          ...(warranty ? { "Warranty": warranty } : {}),
          "Purchased By": userName,
        },
      };
      setPendingRecord(record);
      return {
        response: "I found these purchase details. Please check before I save:",
        record,
      };
    }
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

    setTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 600));

    try {
      const { response, record } = processUserInput(message);

      addMessage({
        id: generateId(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      });

      if (record) {
        setPendingRecord(record);
      }
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
    const guidedMessage = guidedResponses[actionId];
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

    setTimeout(() => {
      addMessage({
        id: generateId(),
        role: "assistant",
        content: guidedMessage || "How can I help?",
        timestamp: new Date().toISOString(),
      });
    }, 400);
  };

  const handlePreviewAction = (action: string) => {
    if (action === "confirm") {
      handleSend("Save it.");
    } else if (action === "cancel") {
      handleSend("Cancel");
    } else if (action === "edit") {
      addMessage({
        id: generateId(),
        role: "assistant",
        content: "What would you like to change? You can say:\n• \"Change amount to ₹12,000\"\n• \"Change category to Vehicle Repair\"\n• \"Change date to yesterday\"\n• \"Add store name Volkswagen\"\n• \"Make this reimbursable\"",
        timestamp: new Date().toISOString(),
      });
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

            {/* Preview Card */}
            {pendingRecord && (
              <div className="animate-fade-in">
                <PreviewCard
                  type={pendingRecord.type}
                  fields={pendingRecord.fields}
                  onAction={handlePreviewAction}
                />
              </div>
            )}

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
            placeholder={
              pendingRecord
                ? "Edit details, say 'Save it' to confirm, or 'Cancel'..."
                : "Type your request or describe what you need..."
            }
          />
        </div>
      </div>
    </div>
  );
}
