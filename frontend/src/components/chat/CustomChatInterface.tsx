"use client";

import { useMemo, useRef, useState } from "react";
import {
  Bot,
  Plus,
  Sparkles,
  Send,
  Wand2,
  AlertCircle,
  Paperclip,
  Play,
  X,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useLLMStore } from "@/lib/store";
import type { CustomChatModelOption, LLMApiConfig } from "@/types";

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelLabel?: string;
}

const newId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Prompt templates shown as quick-start chips.
const promptTemplates = [
  { label: "Summarize document", prompt: "Summarize the uploaded document into a short, clear summary with the key points." },
  { label: "Extract data", prompt: "Extract the important data from the uploaded file and present it as a clean table." },
  { label: "Rewrite content", prompt: "Rewrite the following content to be clearer and more professional:" },
  { label: "Compare files", prompt: "Compare the uploaded files and list the key differences and similarities." },
  { label: "Generate report", prompt: "Analyze the uploaded file and generate a clear report with a summary, key points, and action items." },
  { label: "Create task", prompt: "Turn the following into a clear task with steps and a due date:" },
  { label: "Ask selected model", prompt: "Ask the selected model: " },
];

function pickAutoModel(apis: LLMApiConfig[]): LLMApiConfig | null {
  // Auto Mode: prefer an Active API, fall back to the first one.
  return apis.find((a) => a.status === "active") || apis[0] || null;
}

// Lightweight prompt-improvement (no network). Mirrors the spec example:
// "Make report from file" -> a clearer, structured instruction.
function improvePromptText(prompt: string): string {
  const trimmed = prompt.trim().replace(/\s+/g, " ");
  if (!trimmed) return trimmed;
  const base = trimmed.replace(/[.\s]+$/, "");
  return `Please ${base.charAt(0).toLowerCase()}${base.slice(
    1
  )}. Provide a clear result with a short summary, the key points, and any action items. Use simple language and keep it well structured.`;
}

function fakeAssistantReply(prompt: string, modelLabel: string): string {
  const trimmed = prompt.trim();
  return [
    `(${modelLabel}) Here's a quick take on what you said:`,
    "",
    `> ${trimmed.length > 200 ? trimmed.slice(0, 200) + "…" : trimmed}`,
    "",
    "Once your real model API is wired up, this answer will come from that model.",
  ].join("\n");
}

export function CustomChatInterface() {
  const { apis } = useLLMStore();
  const [selectedId, setSelectedId] = useState<string>("auto");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [improved, setImproved] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const options = useMemo<CustomChatModelOption[]>(() => {
    const list: CustomChatModelOption[] = [
      { id: "auto", label: "Auto Mode", isAuto: true },
    ];
    for (const a of apis) {
      list.push({ id: a.id, label: `${a.providerLabel} — ${a.modelName}` });
    }
    return list;
  }, [apis]);

  const noModels = apis.length === 0;

  const resolveModelLabel = (): { label: string; api: LLMApiConfig | null } => {
    if (selectedId === "auto") {
      const api = pickAutoModel(apis);
      return {
        api,
        label: api
          ? `Auto -> ${api.providerLabel} (${api.modelName})`
          : "Auto Mode (no model added yet)",
      };
    }
    const api = apis.find((a) => a.id === selectedId) || null;
    return {
      api,
      label: api ? `${api.providerLabel} — ${api.modelName}` : "Auto Mode",
    };
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text && !attachedFile) return;

    const { api, label } = resolveModelLabel();
    const userContent = attachedFile
      ? `${text || "(no prompt)"}\n\n📎 Attached: ${attachedFile}`
      : text;

    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "user", content: userContent },
    ]);
    setDraft("");
    setImproved(null);
    setAttachedFile(null);
    setIsThinking(true);

    await new Promise((r) => setTimeout(r, 700));

    setMessages((prev) => [
      ...prev,
      {
        id: newId(),
        role: "assistant",
        content: api
          ? fakeAssistantReply(text || "the attached file", label)
          : "No LLM model API has been added yet. Add one in Settings → LLM Model APIs and try again.",
        modelLabel: label,
      },
    ]);
    setIsThinking(false);
  };

  const handleImprove = () => {
    if (!draft.trim()) return;
    setImproved(improvePromptText(draft));
  };

  const applyImproved = () => {
    if (improved) setDraft(improved);
    setImproved(null);
  };

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file.name);
    // Reset so the same file can be re-selected later.
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar: model dropdown */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100 px-4 lg:px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Wand2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-green-500"
            aria-label="LLM model"
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>

          <Link
            href="/settings?tab=llm"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600"
          >
            <Plus className="w-3.5 h-3.5" />
            Add model API
          </Link>
        </div>
      </div>

      {/* Banner if no models */}
      {noModels && (
        <div className="flex-shrink-0 bg-yellow-50 border-b border-yellow-100 px-4 lg:px-6 py-2.5">
          <div className="max-w-2xl mx-auto flex items-start gap-2 text-xs text-yellow-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              No AI model connected yet. Add one in{" "}
              <Link href="/settings?tab=llm" className="underline font-medium">
                Settings → LLM Model APIs
              </Link>{" "}
              to power Custom Chat. Auto Mode will pick the best available model.
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4">
        <div className="max-w-2xl mx-auto space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Custom Chat</h3>
              <p className="text-sm text-gray-500 max-w-md mt-1">
                Use your own integrated AI models from one place. Pick a model
                from the dropdown — or let{" "}
                <span className="font-medium text-gray-700">Auto Mode</span>{" "}
                choose for you.
              </p>

              {/* Prompt templates */}
              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-lg">
                {promptTemplates.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setDraft(t.prompt)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={m.role === "user" ? "flex gap-3 justify-end" : "flex gap-3"}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={
                  m.role === "user"
                    ? "bg-green-600 text-white rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%] text-sm whitespace-pre-wrap"
                    : "bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%] text-sm text-gray-800 whitespace-pre-wrap"
                }
              >
                {m.role === "assistant" && m.modelLabel && (
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    {m.modelLabel}
                  </p>
                )}
                {m.content}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 p-4 lg:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Improve Prompt suggestion */}
          {improved && (
            <div className="mb-3 bg-purple-50 border border-purple-100 rounded-xl p-3">
              <p className="text-[11px] uppercase tracking-wider text-purple-500 font-semibold mb-1">
                Improved prompt
              </p>
              <p className="text-sm text-gray-700">{improved}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">Use improved prompt?</span>
                <button
                  onClick={applyImproved}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setDraft(improved);
                    setImproved(null);
                  }}
                  className="text-xs font-medium px-2.5 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => setImproved(null)}
                  className="text-xs font-medium px-2.5 py-1 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Use original
                </button>
              </div>
            </div>
          )}

          {/* Attached file chip */}
          {attachedFile && (
            <div className="mb-2 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600">
              <FileText className="w-3.5 h-3.5 text-green-600" />
              {attachedFile}
              <button
                onClick={() => setAttachedFile(null)}
                aria-label="Remove file"
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="Ask anything or upload a file..."
              className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 max-h-32"
            />
            <button
              onClick={handleSend}
              disabled={(!draft.trim() && !attachedFile) || isThinking}
              className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Action buttons */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFilePick}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <Paperclip className="w-3.5 h-3.5" />
              Upload File
            </button>
            <button
              onClick={handleImprove}
              disabled={!draft.trim()}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Improve Prompt
            </button>
            <button
              onClick={handleSend}
              disabled={(!draft.trim() && !attachedFile) || isThinking}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-3.5 h-3.5" />
              Run Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
