"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AIGreeting } from "./AIGreeting";
import { PreviewCard } from "./PreviewCard";
import { useAuthStore, useChatStore } from "@/lib/store";
import type { ChatMessage as ChatMessageType } from "@/types";
import { generateId } from "@/lib/utils";

// Categories mapping
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
  catering: { category: "Food & Dining", subcategory: "Catering" },
  medicine: { category: "Healthcare", subcategory: "Medicine" },
  rent: { category: "Home / Housing", subcategory: "Rent" },
  electricity: { category: "Utilities", subcategory: "Electricity" },
  laptop: { category: "Electronics", subcategory: "Computer" },
  phone: { category: "Electronics", subcategory: "Mobile" },
  headphones: { category: "Electronics", subcategory: "Audio" },
  fridge: { category: "Home Appliances", subcategory: "Refrigerator" },
  paint: { category: "Home / Office", subcategory: "Repair" },
  hotel: { category: "Travel", subcategory: "Accommodation" },
  flight: { category: "Travel", subcategory: "Flight" },
};

const onlineStores = ["amazon", "flipkart", "myntra", "swiggy", "zomato"];
const inStoreShops = ["kroger", "walmart", "croma", "dmart", "costco"];


interface PendingRecord {
  type: "expense" | "purchase" | "budget" | "outlay" | "event";
  fields: Record<string, string>;
}

const guidedResponses: Record<string, string> = {
  add_expense: "Sure. Tell me the expense in one line.\n\nFor example: \"₹10,000 car repair today\" or \"Add $500 grocery expense.\"",
  add_purchase: "Sure. Tell me what you purchased in one line.\n\nFor example: \"Bought milk for ₹20 from Kroger, expiry tomorrow\" or \"Purchased laptop from Amazon for $600 with 1 year warranty.\"",
  upload_receipt: "Please upload your bill or receipt using the attachment button below. I will read it and show you the details before saving.",
  create_budget: "Sure. Tell me the budget details.\n\nFor example: \"Create a 2026 yearly budget of $12,000 and split it equally monthly.\"",
  create_outlay: "Sure. Tell me the outlay details.\n\nFor example: \"Create an outlay for Office Renovation from 1 June to 30 June with a budget of $5,000.\"",
  create_event: "Sure. Tell me the event details.\n\nFor example: \"Create an event called Birthday Party on 10 July with a budget of $2,000.\"",
  add_event_expense: "Sure. Tell me the event expense.\n\nFor example: \"Add $300 catering expense to Birthday Party.\"",
  track_warranty: "Tell me the product name, purchase date, and warranty period.\n\nFor example: \"iPhone 15 Pro purchased Jan 15, 2024 with 1 year warranty.\"",
  add_expiry: "Tell me the item name and expiry date.\n\nFor example: \"Milk expires on June 5.\"",
  generate_report: "What report would you like?\n\n• Monthly expense report\n• Category-wise spending\n• Budget vs actual\n• Event expense report\n\nPlease tell me the type and time period.",
  family_expense: "Tell me the family member name and expense details.\n\nFor example: \"Add $200 school expense for my son.\"",
};

const actionLabels: Record<string, string> = {
  add_expense: "Add Expense",
  add_purchase: "Add Purchase Item",
  upload_receipt: "Upload Bill / Receipt",
  create_budget: "Create Budget",
  create_outlay: "Create Outlay",
  create_event: "Create Event",
  add_event_expense: "Add Event Expense",
  track_warranty: "Track Warranty",
  add_expiry: "Add Expiry Reminder",
  generate_report: "Generate Report",
  family_expense: "Family / Shared Expense",
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

  useEffect(() => { scrollToBottom(); }, [messages, pendingRecord]);

  const userName = user?.name || "User";

  const autoCategory = (text: string) => {
    const lower = text.toLowerCase();
    for (const [keyword, cat] of Object.entries(categoryMap)) {
      if (lower.includes(keyword)) return cat;
    }
    return { category: "General", subcategory: "Other" };
  };

  const detectStoreType = (store: string) => {
    const lower = store.toLowerCase();
    if (onlineStores.some((s) => lower.includes(s))) return "Online";
    if (inStoreShops.some((s) => lower.includes(s))) return "In-store";
    return "Unknown";
  };

  const extractStore = (text: string): string | null => {
    const lower = text.toLowerCase();
    const allStores = [...onlineStores, ...inStoreShops];
    for (const store of allStores) {
      if (lower.includes(store)) return store.charAt(0).toUpperCase() + store.slice(1);
    }
    const fromMatch = text.match(/from\s+([A-Za-z\s]+?)(?:\s*[,.]|\s+for|\s+with|$)/i);
    if (fromMatch) return fromMatch[1].trim();
    return null;
  };

  const extractDate = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("yesterday")) {
      const d = new Date(); d.setDate(d.getDate() - 1);
      return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    }
    if (lower.includes("tomorrow")) {
      const d = new Date(); d.setDate(d.getDate() + 1);
      return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    }
    return "Today";
  };

  const extractWarranty = (text: string): string | null => {
    const match = text.match(/(\d+)\s*(year|month|yr|mo)s?\s*warranty/i);
    if (match) return `${match[1]} ${match[2]}${parseInt(match[1]) > 1 ? "s" : ""}`;
    return null;
  };

  const extractExpiry = (text: string): string | null => {
    const lower = text.toLowerCase();
    if (lower.includes("expiry tomorrow") || lower.includes("expiring tomorrow")) {
      const d = new Date(); d.setDate(d.getDate() + 1);
      return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    }
    const match = text.match(/expir(?:y|ing|es?)\s+(?:on\s+)?(.+?)(?:\.|,|$)/i);
    if (match) return match[1].trim();
    return null;
  };


  // Budget, Outlay, Event detection
  const processBudget = (text: string): PendingRecord | null => {
    const amountMatch = text.match(/[\$₹]?\s?(\d+[\d,]*)/);
    const yearMatch = text.match(/(20\d{2})/);
    if (!amountMatch) return null;
    const amount = parseInt(amountMatch[1].replace(/,/g, ""));
    const year = yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
    const monthly = text.toLowerCase().includes("monthly") || text.toLowerCase().includes("split");
    return {
      type: "budget",
      fields: {
        "Year": year,
        "Total Budget": `$${amount.toLocaleString()}`,
        "From Date": `01/01/${year}`,
        "To Date": `12/31/${year}`,
        "Monthly Allocation": monthly ? `$${Math.round(amount / 12).toLocaleString()} per month` : "Not set",
        "Status": "Active",
        "Restrict if Exceeded": "Not selected",
      },
    };
  };

  const processOutlay = (text: string): PendingRecord | null => {
    const amountMatch = text.match(/[\$₹]\s?(\d+[\d,]*)/);
    const nameMatch = text.match(/(?:outlay\s+(?:for|called|named)\s+)(.+?)(?:\s+from|\s+with|\s+budget|$)/i)
      || text.match(/(?:create\s+)(.+?)(?:\s+outlay)/i);
    const dateRange = text.match(/from\s+(.+?)\s+to\s+(.+?)(?:\s+with|\s+budget|$)/i);
    const name = nameMatch ? nameMatch[1].trim() : "Untitled Outlay";
    const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;
    if (!amount) return null;
    return {
      type: "outlay",
      fields: {
        "Outlay Name": name,
        "Start Date": dateRange ? dateRange[1].trim() : "Not set",
        "End Date": dateRange ? dateRange[2].trim() : "Not set",
        "Budget": `$${amount.toLocaleString()}`,
        "Status": "Active",
        "Included in Budget": "Not selected",
      },
    };
  };

  const processEvent = (text: string): PendingRecord | null => {
    const amountMatch = text.match(/[\$₹]\s?(\d+[\d,]*)/);
    const nameMatch = text.match(/(?:event\s+(?:called|named|for)\s+)(.+?)(?:\s+on|\s+from|\s+with|\s+budget|$)/i)
      || text.match(/(?:create\s+)(.+?)(?:\s+event)/i);
    const dateMatch = text.match(/(?:on|from)\s+(\d{1,2}\s+\w+(?:\s+\d{4})?)/i);
    const name = nameMatch ? nameMatch[1].trim() : "";
    const amount = amountMatch ? parseInt(amountMatch[1].replace(/,/g, "")) : 0;
    if (!name) return null;
    return {
      type: "event",
      fields: {
        "Event Name": name,
        "Event Date": dateMatch ? dateMatch[1].trim() : "Not set",
        "Budget": amount ? `$${amount.toLocaleString()}` : "Not set",
        "Status": "Active",
        "Description": `${name} event`,
        "Image": "Not added",
      },
    };
  };


  // Main processing function
  const processUserInput = (text: string): { response: string; record: PendingRecord | null } => {
    const lower = text.toLowerCase();

    // Handle edit/confirm/cancel on pending record
    if (pendingRecord) {
      if (lower.includes("save") || lower.includes("confirm")) {
        const saved = pendingRecord;
        setPendingRecord(null);
        const label = saved.fields["Expense Name"] || saved.fields["Item Name"] || saved.fields["Event Name"] || saved.fields["Outlay Name"] || saved.fields["Year"] || "record";
        return { response: `Done! Your ${saved.type} "${label}" has been saved successfully. ✅`, record: null };
      }
      if (lower.includes("cancel")) {
        setPendingRecord(null);
        return { response: "Cancelled. No record was saved. How else can I help?", record: null };
      }
      // Edit commands
      const updatedRecord = { ...pendingRecord, fields: { ...pendingRecord.fields } };
      const amountChange = text.match(/(?:amount|price|budget)\s+(?:to\s+)?[\$₹]?(\d+[\d,]*)/i);
      if (amountChange) {
        const val = `$${parseInt(amountChange[1].replace(/,/g, "")).toLocaleString()}`;
        if (updatedRecord.fields["Amount"]) updatedRecord.fields["Amount"] = val;
        if (updatedRecord.fields["Price"]) updatedRecord.fields["Price"] = val;
        if (updatedRecord.fields["Total Budget"]) updatedRecord.fields["Total Budget"] = val;
        if (updatedRecord.fields["Budget"]) updatedRecord.fields["Budget"] = val;
      }
      if (lower.includes("date") && lower.includes("yesterday")) {
        const d = new Date(); d.setDate(d.getDate() - 1);
        const dateStr = d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
        if (updatedRecord.fields["Date"]) updatedRecord.fields["Date"] = dateStr;
      }
      const catMatch = text.match(/category\s+(?:to\s+)?(.+?)(?:\.|$)/i);
      if (catMatch) updatedRecord.fields["Category"] = catMatch[1].trim();
      const storeMatch = text.match(/store\s+(?:name\s+)?(?:to\s+)?(.+?)(?:\.|$)/i);
      if (storeMatch) updatedRecord.fields["Store"] = storeMatch[1].trim();
      if (lower.includes("reimbursable")) updatedRecord.fields["Reimbursable"] = "Yes";
      if (lower.includes("restrict") && lower.includes("exceeded")) updatedRecord.fields["Restrict if Exceeded"] = "Yes";
      if (lower.includes("included in budget") || lower.includes("include in budget")) updatedRecord.fields["Included in Budget"] = "Yes";
      if (lower.includes("status") && lower.includes("inactive")) updatedRecord.fields["Status"] = "Inactive";
      // Monthly allocation change
      const monthlyMatch = text.match(/(?:march|january|february|april|may|june|july|august|september|october|november|december)\s+(?:to\s+)?[\$₹]?(\d+[\d,]*)/i);
      if (monthlyMatch) updatedRecord.fields["Monthly Allocation"] = "Custom (updated)";
      if (lower.includes("split equally") || lower.includes("split monthly")) {
        const budgetStr = updatedRecord.fields["Total Budget"] || updatedRecord.fields["Budget"] || "";
        const budgetNum = parseInt(budgetStr.replace(/[\$₹,\s]/g, "")) || 0;
        if (budgetNum) updatedRecord.fields["Monthly Allocation"] = `$${Math.round(budgetNum / 12).toLocaleString()} per month`;
      }
      setPendingRecord(updatedRecord);
      return { response: "Updated! Here's the revised preview:", record: updatedRecord };
    }

    // Detect intent
    if (lower.includes("budget") && (lower.includes("create") || lower.includes("set"))) {
      const record = processBudget(text);
      if (record) { setPendingRecord(record); return { response: "I created a draft budget. Please review before saving:", record }; }
      return { response: "Sure. What total budget amount and year would you like to set?", record: null };
    }
    if (lower.includes("outlay") && (lower.includes("create") || lower.includes("set"))) {
      const record = processOutlay(text);
      if (record) { setPendingRecord(record); return { response: "I created a draft outlay. Please check before saving:", record }; }
      return { response: "Sure. What budget and date range should I set for this outlay?", record: null };
    }
    if (lower.includes("event") && (lower.includes("create") || lower.includes("add"))) {
      if (lower.includes("expense")) {
        // Event expense
        const amountMatch = text.match(/[\$₹]\s?(\d+[\d,]*)/);
        if (!amountMatch) return { response: "What amount should I add for this event expense?", record: null };
        const amount = parseInt(amountMatch[1].replace(/,/g, ""));
        const { category, subcategory } = autoCategory(text);
        const eventMatch = text.match(/to\s+(.+?)(?:\.|$)/i);
        const desc = text.replace(/[\$₹]?\d+[\d,]*/g, "").replace(/\b(add|expense|to|event)\b/gi, "").replace(/\s+/g, " ").trim();
        const record: PendingRecord = {
          type: "expense",
          fields: {
            "Expense Name": desc.charAt(0).toUpperCase() + desc.slice(1) || category,
            "Amount": `$${amount.toLocaleString()}`,
            "Event": eventMatch ? eventMatch[1].trim() : "Not specified",
            "Category": category,
            "Date": "Today",
            "Purchased By": userName,
          },
        };
        setPendingRecord(record);
        return { response: "I found these event expense details. Please check before I save:", record };
      }
      const record = processEvent(text);
      if (record) { setPendingRecord(record); return { response: "I created a draft event. Please review before saving:", record }; }
      return { response: "Sure. What is the event name, date, and budget?", record: null };
    }


    // Expense / Purchase detection
    const amountMatch = text.match(/[\$₹]?\s?(\d+[\d,]*)/);
    if (!amountMatch) {
      if (lower.includes("expense") || lower.includes("spent") || lower.includes("paid")) {
        return { response: "Sure. What amount should I add for this expense?", record: null };
      }
      if (lower.includes("bought") || lower.includes("purchased") || lower.includes("purchase")) {
        return { response: "Sure. What was the price for this purchase?", record: null };
      }
      return { response: "I can help with that! Please provide more details including the amount.", record: null };
    }

    const amount = parseInt(amountMatch[1].replace(/,/g, ""));
    const isPurchase = lower.includes("bought") || lower.includes("purchased") || lower.includes("purchase") || lower.includes("expiry") || lower.includes("warranty");
    const { category, subcategory } = autoCategory(text);
    const store = extractStore(text);
    const date = extractDate(text);
    const warranty = extractWarranty(text);
    const expiry = extractExpiry(text);
    let description = text.replace(/[\$₹]?\s?\d+[\d,]*/g, "").replace(/\b(add|bought|purchased|expense|purchase|for|from|today|yesterday|tomorrow|with|item)\b/gi, "").replace(/\s+/g, " ").trim();
    if (!description || description.length < 2) description = category;

    if (!isPurchase) {
      const record: PendingRecord = {
        type: "expense",
        fields: {
          "Expense Name": description.charAt(0).toUpperCase() + description.slice(1),
          "Amount": `$${amount.toLocaleString()}`,
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
      return { response: "I found these details. Please check before I save:", record };
    } else {
      const record: PendingRecord = {
        type: "purchase",
        fields: {
          "Item Name": description.charAt(0).toUpperCase() + description.slice(1),
          "Price": `$${amount.toLocaleString()}`,
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
      return { response: "I found these purchase details. Please check before I save:", record };
    }
  };


  const handleSend = async (message: string, attachments?: File[]) => {
    if (isSending) return;
    setIsSending(true);

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
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    try {
      const { response, record } = processUserInput(message);
      addMessage({ id: generateId(), role: "assistant", content: response, timestamp: new Date().toISOString() });
      if (record) setPendingRecord(record);
    } catch {
      addMessage({ id: generateId(), role: "assistant", content: "Sorry, something went wrong. Please try again.", timestamp: new Date().toISOString() });
    } finally {
      setTyping(false);
      setIsSending(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    addMessage({ id: generateId(), role: "user", content: actionLabels[actionId] || actionId, timestamp: new Date().toISOString() });
    setTimeout(() => {
      addMessage({ id: generateId(), role: "assistant", content: guidedResponses[actionId] || "How can I help?", timestamp: new Date().toISOString() });
    }, 400);
  };

  const handlePreviewAction = (action: string) => {
    if (action === "confirm") handleSend("Save it.");
    else if (action === "cancel") handleSend("Cancel");
    else if (action === "edit") {
      addMessage({ id: generateId(), role: "assistant", content: "What would you like to change? You can say:\n• \"Change amount to $12,000\"\n• \"Change category to Vehicle Repair\"\n• \"Change date to yesterday\"\n• \"Add store name Volkswagen\"\n• \"Make this reimbursable\"\n• \"Split equally across months\"\n• \"Include in budget\"", timestamp: new Date().toISOString() });
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
        {!hasMessages ? (
          <AIGreeting user={user} onQuickAction={handleQuickAction} />
        ) : (
          <div className="max-w-2xl mx-auto space-y-5">
            {messages.map((msg) => (<ChatMessage key={msg.id} message={msg} />))}
            {pendingRecord && (
              <div className="animate-fade-in">
                <PreviewCard type={pendingRecord.type} fields={pendingRecord.fields} onAction={handlePreviewAction} />
              </div>
            )}
            {isTyping && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
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

      <div className="flex-shrink-0 bg-white border-t border-gray-100 p-4 lg:px-6">
        <div className="max-w-2xl mx-auto">
          <ChatInput onSend={handleSend} disabled={isSending || isTyping} placeholder={pendingRecord ? "Edit details, say 'Save it' to confirm, or 'Cancel'..." : "Type your request or describe what you need..."} />
        </div>
      </div>
    </div>
  );
}
