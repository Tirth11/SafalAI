"use client";

import { cn } from "@/lib/utils";
import {
  PlusCircle,
  Receipt,
  ShoppingCart,
  ShieldCheck,
  Clock,
  Calendar,
  BarChart3,
  Search,
  Wallet,
  Users,
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  creditCost?: number;
}

const quickActions: QuickAction[] = [
  {
    id: "add_expense",
    label: "Add Expense",
    icon: <PlusCircle className="w-5 h-5" />,
    color: "bg-green-100 text-green-600 hover:bg-green-200",
    creditCost: 2,
  },
  {
    id: "upload_receipt",
    label: "Upload Receipt",
    icon: <Receipt className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    creditCost: 5,
  },
  {
    id: "add_purchase",
    label: "Add Purchase",
    icon: <ShoppingCart className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    creditCost: 2,
  },
  {
    id: "check_warranty",
    label: "Track Warranty",
    icon: <ShieldCheck className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-600 hover:bg-orange-200",
    creditCost: 1,
  },
  {
    id: "check_expiry",
    label: "Check Expiry",
    icon: <Clock className="w-5 h-5" />,
    color: "bg-red-100 text-red-600 hover:bg-red-200",
    creditCost: 1,
  },
  {
    id: "create_event",
    label: "Create Event",
    icon: <Calendar className="w-5 h-5" />,
    color: "bg-teal-100 text-teal-600 hover:bg-teal-200",
    creditCost: 3,
  },
  {
    id: "generate_report",
    label: "Generate Report",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
    creditCost: 10,
  },
  {
    id: "search",
    label: "Search Records",
    icon: <Search className="w-5 h-5" />,
    color: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    creditCost: 1,
  },
  {
    id: "check_budget",
    label: "Check Budget",
    icon: <Wallet className="w-5 h-5" />,
    color: "bg-yellow-100 text-yellow-600 hover:bg-yellow-200",
    creditCost: 1,
  },
  {
    id: "family_expenses",
    label: "Family Expenses",
    icon: <Users className="w-5 h-5" />,
    color: "bg-pink-100 text-pink-600 hover:bg-pink-200",
    creditCost: 2,
  },
];

interface QuickActionsProps {
  onAction: (actionId: string) => void;
  compact?: boolean;
}

export function QuickActions({ onAction, compact = false }: QuickActionsProps) {
  if (compact) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {quickActions.slice(0, 5).map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
              action.color
            )}
          >
            {action.icon}
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200",
            "hover:scale-105 hover:shadow-md",
            action.color
          )}
        >
          {action.icon}
          <span className="text-sm font-medium text-center">{action.label}</span>
          {action.creditCost && (
            <span className="text-xs opacity-60">{action.creditCost} credits</span>
          )}
        </button>
      ))}
    </div>
  );
}
