"use client";

import { cn } from "@/lib/utils";
import { Badge, Button, Modal, ModalBody, ModalFooter } from "@/components/ui";
import type {
  ConnectionStatus,
  HealthStatus,
  KeyValuePair,
} from "@/types/ai-studio";
import { Check, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

// ---------- Status / health badges ----------

export function StatusBadge({ status }: { status: ConnectionStatus | string }) {
  const map: Record<string, { variant: "success" | "gray" | "danger" | "warning" | "info"; label: string }> = {
    active: { variant: "success", label: "Active" },
    inactive: { variant: "gray", label: "Inactive" },
    error: { variant: "danger", label: "Error" },
    draft: { variant: "warning", label: "Draft" },
    archived: { variant: "gray", label: "Archived" },
  };
  const m = map[status] ?? { variant: "gray" as const, label: status };
  return (
    <Badge variant={m.variant} dot>
      {m.label}
    </Badge>
  );
}

export function HealthBadge({ health }: { health: HealthStatus }) {
  const map: Record<HealthStatus, { variant: "success" | "warning" | "danger" | "gray"; label: string }> = {
    healthy: { variant: "success", label: "Healthy" },
    degraded: { variant: "warning", label: "Degraded" },
    down: { variant: "danger", label: "Down" },
    unknown: { variant: "gray", label: "Unknown" },
  };
  const m = map[health];
  return (
    <Badge variant={m.variant} dot>
      {m.label}
    </Badge>
  );
}

// ---------- Provider avatar (logo substitute) ----------

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-purple-100 text-purple-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

export function LogoAvatar({ label, size = "md" }: { label: string; size?: "sm" | "md" | "lg" }) {
  const initials = label
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[label.length % AVATAR_COLORS.length];
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm" };
  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center font-bold flex-shrink-0",
        color,
        sizes[size]
      )}
    >
      {initials}
    </div>
  );
}

// ---------- Wizard progress indicator ----------

export function WizardProgress({
  steps,
  current,
  onStepClick,
}: {
  steps: string[];
  current: number; // 0-based
  onStepClick?: (index: number) => void;
}) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-max py-1">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={label} className="flex items-center">
              <button
                type="button"
                disabled={!onStepClick || i > current}
                onClick={() => onStepClick?.(i)}
                className={cn(
                  "flex items-center gap-2",
                  onStepClick && i <= current ? "cursor-pointer" : "cursor-default"
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all",
                    done && "bg-primary-600 border-primary-600 text-white",
                    active && "border-primary-600 text-primary-700 bg-primary-50",
                    !done && !active && "border-gray-300 text-gray-400 bg-white"
                  )}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    active ? "text-primary-700" : done ? "text-gray-700" : "text-gray-400"
                  )}
                >
                  {label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 mx-2 rounded",
                    i < current ? "bg-primary-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Toggle switch ----------

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex items-center justify-between gap-3 py-1.5",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
    >
      {(label || description) && (
        <div className="min-w-0">
          {label && <p className="text-sm font-medium text-gray-700">{label}</p>}
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-10 h-6 rounded-full transition-colors flex-shrink-0",
          checked ? "bg-primary-600" : "bg-gray-300"
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </button>
    </label>
  );
}

// ---------- Secret input (masked) ----------

export function SecretInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 font-mono text-sm"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// ---------- Key/value list editor ----------

export function KeyValueEditor({
  label,
  pairs,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
  secret = false,
}: {
  label: string;
  pairs: KeyValuePair[];
  onChange: (pairs: KeyValuePair[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  secret?: boolean;
}) {
  const update = (i: number, patch: Partial<KeyValuePair>) =>
    onChange(pairs.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => onChange([...pairs, { key: "", value: "" }])}
          className="text-xs text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      {pairs.length === 0 && (
        <p className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-lg px-3 py-2.5">
          No entries. Click Add to create one.
        </p>
      )}
      <div className="space-y-2">
        {pairs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={p.key}
              onChange={(e) => update(i, { key: e.target.value })}
              placeholder={keyPlaceholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono"
            />
            <input
              type={secret ? "password" : "text"}
              value={p.value}
              onChange={(e) => update(i, { value: e.target.value })}
              placeholder={valuePlaceholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono"
            />
            <button
              type="button"
              onClick={() => onChange(pairs.filter((_, idx) => idx !== i))}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Tags input ----------

export function TagsInput({
  label = "Tags",
  tags,
  onChange,
}: {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const commit = () => {
    const t = draft.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setDraft("");
  };
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-primary-500">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="hover:text-primary-900"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          placeholder={tags.length === 0 ? "Type and press Enter" : ""}
          className="flex-1 min-w-[120px] py-1 text-sm outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

// ---------- Empty state ----------

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center text-primary-500 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-5">{description}</p>
      {action}
    </div>
  );
}

// ---------- Confirmation dialog ----------

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  danger = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <ModalBody>
        <p className="text-sm text-gray-600">{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={danger ? "danger" : "primary"}
          size="sm"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// ---------- Small stat / meta cell ----------

export function MetaCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</p>
      <div className="text-sm text-gray-800 truncate">{value}</div>
    </div>
  );
}

export const fmtDate = (iso: string | null | undefined) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Never";
