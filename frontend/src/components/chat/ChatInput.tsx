"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Paperclip, Mic, Send, X, Image as ImageIcon, FileText, Camera } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, attachments?: File[]) => void;
  onVoiceInput?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onVoiceInput,
  disabled = false,
  placeholder = "Ask anything about your finances...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if ((!message.trim() && attachments.length === 0) || disabled) return;

    onSend(message.trim(), attachments.length > 0 ? attachments : undefined);
    setMessage("");
    setAttachments([]);
    setShowAttachments(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    setShowAttachments(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="relative">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-200 rounded-t-xl">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
            >
              {file.type.startsWith("image/") ? (
                <ImageIcon className="w-4 h-4 text-blue-500" />
              ) : (
                <FileText className="w-4 h-4 text-gray-500" />
              )}
              <span className="max-w-[100px] truncate">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachments && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 animate-slide-up">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Upload Image</p>
              <p className="text-xs text-gray-500">Receipt, bill, or screenshot</p>
            </div>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Upload Document</p>
              <p className="text-xs text-gray-500">PDF or invoice</p>
            </div>
          </button>
          <button
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
          >
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Take Photo</p>
              <p className="text-xs text-gray-500">Capture receipt or bill</p>
            </div>
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2 p-3 bg-white border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
        {/* Attachment Button */}
        <button
          onClick={() => setShowAttachments(!showAttachments)}
          disabled={disabled}
          className={cn(
            "flex-shrink-0 p-2 rounded-lg transition-colors",
            showAttachments
              ? "bg-primary-100 text-primary-600"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          )}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "flex-1 resize-none outline-none text-sm placeholder:text-gray-400",
            "max-h-[200px] min-h-[24px]",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />

        {/* Voice Input Button */}
        {onVoiceInput && (
          <button
            onClick={onVoiceInput}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          size="sm"
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Credit Hint */}
      <div className="flex justify-between items-center mt-2 px-1">
        <p className="text-xs text-gray-400">
          Press Enter to send, Shift + Enter for new line
        </p>
        <p className="text-xs text-gray-400">
          ~1 credit per message
        </p>
      </div>
    </div>
  );
}
