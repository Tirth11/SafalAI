"use client";

import { PlusCircle, ShoppingCart, Receipt, BarChart3, RotateCcw } from "lucide-react";

interface FollowUpActionsProps {
  onAction: (actionId: string) => void;
  onNewChat: () => void;
}

export function FollowUpActions({ onAction, onNewChat }: FollowUpActionsProps) {
  return (
    <div className="ml-11 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
      <p className="text-xs text-gray-500 font-medium">What would you like to do next?</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onAction("add_expense")}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add Another Expense
        </button>
        <button
          onClick={() => onAction("add_purchase")}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add Purchase
        </button>
        <button
          onClick={() => onAction("upload_receipt")}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Receipt className="w-3.5 h-3.5" />
          Upload Bill
        </button>
        <button
          onClick={() => onAction("generate_report")}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Generate Report
        </button>
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Start New Chat
        </button>
      </div>
    </div>
  );
}
