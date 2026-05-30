"use client";

import { Button } from "@/components/ui/Button";
import { Check, Edit, X, Image as ImageIcon, Store } from "lucide-react";

interface PreviewCardProps {
  type: "expense" | "purchase";
  fields: Record<string, string>;
  onAction: (action: "confirm" | "edit" | "cancel") => void;
}

export function PreviewCard({ type, fields, onAction }: PreviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden ml-11">
      {/* Header */}
      <div className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide ${
        type === "expense"
          ? "bg-green-50 text-green-700 border-b border-green-100"
          : "bg-purple-50 text-purple-700 border-b border-purple-100"
      }`}>
        {type === "expense" ? "Expense Preview" : "Purchase Item Preview"}
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
        <Button
          size="sm"
          onClick={() => onAction("confirm")}
          className="text-xs"
        >
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Confirm & Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction("edit")}
          className="text-xs"
        >
          <Edit className="w-3.5 h-3.5 mr-1.5" />
          Edit Details
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("cancel")}
          className="text-xs text-gray-500"
        >
          <X className="w-3.5 h-3.5 mr-1.5" />
          Cancel
        </Button>
      </div>
    </div>
  );
}
