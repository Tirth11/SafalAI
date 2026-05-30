"use client";

import { cn, formatRelativeTime } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { ChatMessage as ChatMessageType, AIAction } from "@/types";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Receipt,
  ShoppingCart,
  Calendar,
  BarChart3,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
  isLast?: boolean;
}

const actionIcons: Record<string, React.ReactNode> = {
  add_expense: <FileText className="w-4 h-4" />,
  upload_receipt: <Receipt className="w-4 h-4" />,
  add_purchase: <ShoppingCart className="w-4 h-4" />,
  create_event: <Calendar className="w-4 h-4" />,
  generate_report: <BarChart3 className="w-4 h-4" />,
};

const actionStatusStyles: Record<string, string> = {
  pending: "bg-yellow-50 border-yellow-200 text-yellow-700",
  completed: "bg-green-50 border-green-200 text-green-700",
  failed: "bg-red-50 border-red-200 text-red-700",
  requires_confirmation: "bg-blue-50 border-blue-200 text-blue-700",
};

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <Avatar name="You" size="sm" />
        ) : (
          <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex flex-col gap-2 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        {/* Message Bubble */}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl",
            isUser
              ? "bg-primary-600 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          )}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs",
                    isUser ? "bg-primary-500" : "bg-gray-200"
                  )}
                >
                  <FileText className="w-4 h-4" />
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Action Status */}
        {message.action && <ActionCard action={message.action} />}

        {/* Timestamp */}
        <span className="text-xs text-gray-400">
          {formatRelativeTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: AIAction }) {
  const icon = actionIcons[action.type] || <FileText className="w-4 h-4" />;
  const statusStyle = actionStatusStyles[action.status];

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    failed: <AlertCircle className="w-4 h-4" />,
    requires_confirmation: <AlertTriangle className="w-4 h-4" />,
  };

  return (
    <div className={cn("border rounded-lg p-3 text-sm", statusStyle)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium capitalize">{action.type.replace(/_/g, " ")}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              action.status === "completed"
                ? "success"
                : action.status === "failed"
                ? "danger"
                : action.status === "requires_confirmation"
                ? "warning"
                : "gray"
            }
            size="sm"
          >
            {action.status === "pending" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              statusIcons[action.status]
            )}
            <span className="ml-1 capitalize">{action.status.replace(/_/g, " ")}</span>
          </Badge>
        </div>
      </div>

      {/* Action Data Preview */}
      {action.data && action.status === "requires_confirmation" && (
        <div className="mt-2 p-2 bg-white/50 rounded text-xs">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(action.data, null, 2)}
          </pre>
        </div>
      )}

      {/* Credits Used */}
      <div className="mt-2 text-xs opacity-70">
        {action.creditsUsed} credit{action.creditsUsed !== 1 ? "s" : ""} used
      </div>
    </div>
  );
}
