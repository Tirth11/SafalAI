"use client";

import { Button } from "@/components/ui/Button";
import { Check, Edit, X } from "lucide-react";

interface PreviewCardProps {
  type: "expense" | "purchase" | "budget" | "outlay" | "event";
  fields: Record<string, string>;
  onAction: (action: "confirm" | "edit" | "cancel") => void;
}

const typeStyles: Record<string, { bg: string; text: string; label: string }> = {
  expense: { bg: "bg-green-50", text: "text-green-700", label: "Expense Preview" },
  purchase: { bg: "bg-purple-50", text: "text-purple-700", label: "Purchase Item Preview" },
  budget: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Budget Preview" },
  outlay: { bg: "bg-amber-50", text: "text-amber-700", label: "Outlay Preview" },
  event: { bg: "bg-rose-50", text: "text-rose-700", label: "Event Preview" },
};

export function PreviewCard({ type, fields, onAction }: PreviewCardProps) {
  const style = typeStyles[type] || typeStyles.expense;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ml-11">
      {/* Header */}
      <div className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide ${style.bg} ${style.text} border-b`}>
        {style.label}
      </div>

      {/* Fields */}
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-3">Please review before saving:</p>
        <table className="w-full">
          <tbody>
            {Object.entries(fields).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-50 last:border-0">
                <td className="py-1.5 pr-4 text-xs text-gray-500 whitespace-nowrap align-top">
                  {key}
                </td>
                <td className="py-1.5 text-sm text-gray-900 font-medium">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => onAction("confirm")} className="text-xs">
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Confirm & Save
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAction("edit")} className="text-xs">
          <Edit className="w-3.5 h-3.5 mr-1.5" />
          Edit Details
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onAction("cancel")} className="text-xs text-gray-500">
          <X className="w-3.5 h-3.5 mr-1.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
