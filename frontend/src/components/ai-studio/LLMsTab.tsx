"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Select,
  Textarea,
} from "@/components/ui";
import {
  ConfirmDialog,
  EmptyState,
  fmtDate,
  HealthBadge,
  LogoAvatar,
  MetaCell,
  SecretInput,
  StatusBadge,
  TagsInput,
  Toggle,
  WizardProgress,
} from "./shared";
import { LLM_PROVIDERS, providerMeta, useAIStudioStore } from "@/lib/ai-studio-store";
import type { LLMConnection, LLMProvider, LLMTestResult } from "@/types/ai-studio";
import {
  Brain,
  CheckCircle,
  Copy,
  Pencil,
  Play,
  Plus,
  Power,
  Search,
  Trash2,
  XCircle,
  Eye,
} from "lucide-react";

const WIZARD_STEPS = ["Basic Details", "Authentication", "Model Configuration", "Test Connection"];

interface WizardState {
  name: string;
  description: string;
  tags: string[];
  provider: LLMProvider;
  apiKey: string;
  organizationId: string;
  projectId: string;
  baseUrl: string;
  keyValidated: boolean;
  defaultModel: string;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  maxTokens: number;
  streaming: boolean;
  jsonMode: boolean;
  visionEnabled: boolean;
  functionCalling: boolean;
  reasoningMode: "off" | "low" | "medium" | "high";
  timeoutSeconds: number;
  retryCount: number;
  rateLimitRpm: number;
  fallbackModel: string;
}

const emptyWizard = (): WizardState => ({
  name: "",
  description: "",
  tags: [],
  provider: "openai",
  apiKey: "",
  organizationId: "",
  projectId: "",
  baseUrl: providerMeta("openai").baseUrl,
  keyValidated: false,
  defaultModel: providerMeta("openai").models[0] ?? "",
  temperature: 0.7,
  topP: 1,
  presencePenalty: 0,
  frequencyPenalty: 0,
  maxTokens: 4096,
  streaming: true,
  jsonMode: false,
  visionEnabled: false,
  functionCalling: true,
  reasoningMode: "off",
  timeoutSeconds: 60,
  retryCount: 2,
  rateLimitRpm: 60,
  fallbackModel: "",
});

const fromConnection = (c: LLMConnection): WizardState => ({
  name: c.name,
  description: c.description,
  tags: c.tags,
  provider: c.provider,
  apiKey: c.apiKey,
  organizationId: c.organizationId,
  projectId: c.projectId,
  baseUrl: c.baseUrl,
  keyValidated: c.keyValidated,
  defaultModel: c.config.defaultModel,
  temperature: c.config.temperature,
  topP: c.config.topP,
  presencePenalty: c.config.presencePenalty,
  frequencyPenalty: c.config.frequencyPenalty,
  maxTokens: c.config.maxTokens,
  streaming: c.config.streaming,
  jsonMode: c.config.jsonMode,
  visionEnabled: c.config.visionEnabled,
  functionCalling: c.config.functionCalling,
  reasoningMode: c.config.reasoningMode,
  timeoutSeconds: c.config.timeoutSeconds,
  retryCount: c.config.retryCount,
  rateLimitRpm: c.config.rateLimitRpm,
  fallbackModel: c.config.fallbackModel,
});

function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <Input
      label={label}
      type="number"
      value={value}
      step={step}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

export function LLMsTab() {
  const {
    llms,
    addLLM,
    updateLLM,
    removeLLM,
    duplicateLLM,
    testLLM,
  } = useAIStudioStore();

  // list controls
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortByTested, setSortByTested] = useState(true);

  // wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<LLMConnection | null>(null);
  const [step, setStep] = useState(0);
  const [w, setW] = useState<WizardState>(emptyWizard());
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<null | boolean>(null);
  const [testPrompt, setTestPrompt] = useState("Say hello and confirm you are working.");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<LLMTestResult | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rowTesting, setRowTesting] = useState<string | null>(null);

  const patch = (p: Partial<WizardState>) => setW((prev) => ({ ...prev, ...p }));

  const filtered = useMemo(() => {
    let list = llms.filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q || l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
      const matchProvider = providerFilter === "all" || l.provider === providerFilter;
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      return matchSearch && matchProvider && matchStatus;
    });
    if (sortByTested) {
      list = [...list].sort(
        (a, b) =>
          new Date(b.lastTestedAt ?? 0).getTime() - new Date(a.lastTestedAt ?? 0).getTime()
      );
    }
    return list;
  }, [llms, search, providerFilter, statusFilter, sortByTested]);

  const openCreate = () => {
    setEditingId(null);
    setW(emptyWizard());
    setStep(0);
    setValidationResult(null);
    setTestResult(null);
    setWizardOpen(true);
  };

  const openEdit = (c: LLMConnection) => {
    setEditingId(c.id);
    setW(fromConnection(c));
    setStep(0);
    setValidationResult(c.keyValidated ? true : null);
    setTestResult(null);
    setWizardOpen(true);
  };

  const validateKey = async () => {
    setValidating(true);
    setValidationResult(null);
    await new Promise((r) => setTimeout(r, 700));
    const ok = w.provider === "ollama" || w.apiKey.trim().length >= 8;
    setValidationResult(ok);
    patch({ keyValidated: ok });
    setValidating(false);
    if (ok) toast.success("API key validated");
    else toast.error("API key validation failed");
  };

  const canNext = () => {
    if (step === 0) return w.name.trim().length > 0;
    if (step === 1) return w.provider === "ollama" || w.apiKey.trim().length > 0;
    return true;
  };

  const buildPayload = () => {
    const meta = providerMeta(w.provider);
    return {
      name: w.name.trim(),
      description: w.description.trim(),
      tags: w.tags,
      provider: w.provider,
      apiKey: w.apiKey,
      organizationId: w.organizationId,
      projectId: w.projectId,
      baseUrl: w.baseUrl,
      keyValidated: w.keyValidated,
      config: {
        defaultModel: w.defaultModel,
        temperature: w.temperature,
        topP: w.topP,
        presencePenalty: w.presencePenalty,
        frequencyPenalty: w.frequencyPenalty,
        maxTokens: w.maxTokens,
        streaming: w.streaming,
        jsonMode: w.jsonMode,
        visionEnabled: w.visionEnabled,
        functionCalling: w.functionCalling,
        reasoningMode: w.reasoningMode,
        timeoutSeconds: w.timeoutSeconds,
        retryCount: w.retryCount,
        rateLimitRpm: w.rateLimitRpm,
        fallbackModel: w.fallbackModel,
      },
      contextWindow: meta.contextWindow,
      estimatedCostPer1k: meta.costPer1k,
    };
  };

  const runWizardTest = async () => {
    setTesting(true);
    setTestResult(null);
    // Persist first (draft) so testLLM can find it
    let id = editingId;
    const payload = buildPayload();
    if (id) {
      updateLLM(id, payload);
    } else {
      const created = addLLM({
        ...payload,
        status: "inactive",
        health: "unknown",
        lastTestedAt: null,
        usedByAgentIds: [],
        createdBy: "You",
      });
      id = created.id;
      setEditingId(created.id);
    }
    const result = await testLLM(id, testPrompt);
    setTestResult(result);
    setTesting(false);
  };

  const saveConnection = () => {
    const payload = buildPayload();
    if (editingId) {
      updateLLM(editingId, payload);
    } else {
      addLLM({
        ...payload,
        status: "inactive",
        health: "unknown",
        lastTestedAt: null,
        usedByAgentIds: [],
        createdBy: "You",
      });
    }
    toast.success("LLM connection saved");
    setWizardOpen(false);
  };

  const rowTest = async (id: string) => {
    setRowTesting(id);
    const r = await testLLM(id, "Health check");
    setRowTesting(null);
    if (r.success) toast.success("Connection healthy");
    else toast.error("Connection test failed");
  };

  const providerOptions = [
    { value: "all", label: "All Providers" },
    ...LLM_PROVIDERS.map((p) => ({ value: p.value, label: p.label })),
  ];

  const modelsForProvider = providerMeta(w.provider).models;

  return (
    <div className="space-y-4">
      {/* Top actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="!py-2.5"
          />
        </div>
        <div className="w-44 flex-shrink-0">
          <Select
            options={providerOptions}
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="!py-2.5"
          />
        </div>
        <div className="w-40 flex-shrink-0">
          <Select
            options={[
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "error", label: "Error" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="!py-2.5"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSortByTested((s) => !s)}
          className={sortByTested ? "border-primary-300 text-primary-700" : ""}
        >
          Sort: Last Tested
        </Button>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add New LLM
        </Button>
      </div>

      {/* Listing */}
      {filtered.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={<Brain className="w-8 h-8" />}
            title="No LLM connections"
            description="Connect your first LLM provider to start building AI agents."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus className="w-4 h-4 mr-1.5" /> Add New LLM
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <Card key={l.id} padding="sm" hover>
              <div className="flex items-start gap-4">
                <LogoAvatar label={providerMeta(l.provider).label} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900">{l.name}</h3>
                    <StatusBadge status={l.status} />
                    <HealthBadge health={l.health} />
                  </div>
                  <p className="text-xs text-gray-500 mb-3 truncate">
                    {l.description || "No description"}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-2">
                    <MetaCell label="Provider" value={providerMeta(l.provider).label} />
                    <MetaCell label="Model" value={l.config.defaultModel} />
                    <MetaCell
                      label="Context"
                      value={`${Math.round(l.contextWindow / 1000)}K`}
                    />
                    <MetaCell label="Last Tested" value={fmtDate(l.lastTestedAt)} />
                    <MetaCell
                      label="Est. Cost"
                      value={l.estimatedCostPer1k === 0 ? "Free" : `$${l.estimatedCostPer1k}/1K`}
                    />
                    <MetaCell label="Used By" value={`${l.usedByAgentIds.length} agents`} />
                    <MetaCell label="Created" value={`${l.createdBy} · ${fmtDate(l.createdAt)}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    title="View"
                    onClick={() => setViewing(l)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => openEdit(l)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    title="Test"
                    onClick={() => rowTest(l.id)}
                    disabled={rowTesting === l.id}
                    className="p-2 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg disabled:opacity-40"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    title={l.status === "active" ? "Disable" : "Enable"}
                    onClick={() =>
                      updateLLM(l.id, {
                        status: l.status === "active" ? "inactive" : "active",
                      })
                    }
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    title="Duplicate"
                    onClick={() => {
                      duplicateLLM(l.id);
                      toast.success("Connection duplicated");
                    }}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setDeleteId(l.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View drawer (modal) */}
      <Modal
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name}
        description={viewing?.description}
        size="lg"
      >
        {viewing && (
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <MetaCell label="Provider" value={providerMeta(viewing.provider).label} />
              <MetaCell label="Default Model" value={viewing.config.defaultModel} />
              <MetaCell label="Base URL" value={viewing.baseUrl || "-"} />
              <MetaCell label="API Key" value="••••••••••••" />
              <MetaCell label="Temperature" value={viewing.config.temperature} />
              <MetaCell label="Max Tokens" value={viewing.config.maxTokens} />
              <MetaCell label="Streaming" value={viewing.config.streaming ? "On" : "Off"} />
              <MetaCell label="JSON Mode" value={viewing.config.jsonMode ? "On" : "Off"} />
              <MetaCell label="Vision" value={viewing.config.visionEnabled ? "Enabled" : "Disabled"} />
              <MetaCell label="Function Calling" value={viewing.config.functionCalling ? "Enabled" : "Disabled"} />
              <MetaCell label="Reasoning Mode" value={viewing.config.reasoningMode} />
              <MetaCell label="Fallback Model" value={viewing.config.fallbackModel || "None"} />
              <MetaCell label="Timeout" value={`${viewing.config.timeoutSeconds}s`} />
              <MetaCell label="Rate Limit" value={`${viewing.config.rateLimitRpm} rpm`} />
            </div>
          </ModalBody>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            removeLLM(deleteId);
            toast.success("Connection deleted");
          }
        }}
        title="Delete LLM connection?"
        message="Agents using this connection will stop working until you assign a new LLM. This action cannot be undone."
      />

      {/* Add / Edit wizard */}
      <Modal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title={editingId ? "Edit LLM Connection" : "Add New LLM"}
        size="xl"
      >
        <ModalBody className="space-y-5">
          <WizardProgress steps={WIZARD_STEPS} current={step} onStepClick={setStep} />

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Connection Name *"
                  value={w.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. OpenAI Production"
                />
                <Select
                  label="Provider *"
                  options={LLM_PROVIDERS.map((p) => ({ value: p.value, label: p.label }))}
                  value={w.provider}
                  onChange={(e) => {
                    const provider = e.target.value as LLMProvider;
                    const meta = providerMeta(provider);
                    patch({
                      provider,
                      baseUrl: meta.baseUrl,
                      defaultModel: meta.models[0] ?? "",
                      keyValidated: false,
                    });
                    setValidationResult(null);
                  }}
                />
              </div>
              <Textarea
                label="Description"
                value={w.description}
                onChange={(e) => patch({ description: e.target.value })}
                placeholder="What will this connection be used for?"
                rows={2}
              />
              <TagsInput tags={w.tags} onChange={(tags) => patch({ tags })} />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <SecretInput
                label="API Key"
                required={w.provider !== "ollama"}
                value={w.apiKey}
                onChange={(v) => {
                  patch({ apiKey: v, keyValidated: false });
                  setValidationResult(null);
                }}
                placeholder="sk-..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Organization ID"
                  value={w.organizationId}
                  onChange={(e) => patch({ organizationId: e.target.value })}
                  placeholder="Optional"
                />
                <Input
                  label="Project ID"
                  value={w.projectId}
                  onChange={(e) => patch({ projectId: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <Input
                label="Base URL"
                value={w.baseUrl}
                onChange={(e) => patch({ baseUrl: e.target.value })}
                placeholder="https://api.example.com/v1"
              />
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={validateKey} isLoading={validating}>
                  Validate API Key
                </Button>
                {validationResult === true && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" /> Key is valid
                  </span>
                )}
                {validationResult === false && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-red-600 font-medium">
                    <XCircle className="w-4 h-4" /> Validation failed
                  </span>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modelsForProvider.length > 0 ? (
                  <Select
                    label="Default Model"
                    options={modelsForProvider.map((m) => ({ value: m, label: m }))}
                    value={w.defaultModel}
                    onChange={(e) => patch({ defaultModel: e.target.value })}
                  />
                ) : (
                  <Input
                    label="Default Model"
                    value={w.defaultModel}
                    onChange={(e) => patch({ defaultModel: e.target.value })}
                    placeholder="model-name"
                  />
                )}
                <Select
                  label="Fallback Model"
                  options={[
                    { value: "", label: "None" },
                    ...modelsForProvider
                      .filter((m) => m !== w.defaultModel)
                      .map((m) => ({ value: m, label: m })),
                  ]}
                  value={w.fallbackModel}
                  onChange={(e) => patch({ fallbackModel: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <NumberField label="Temperature" value={w.temperature} step={0.1} min={0} max={2} onChange={(v) => patch({ temperature: v })} />
                <NumberField label="Top-P" value={w.topP} step={0.05} min={0} max={1} onChange={(v) => patch({ topP: v })} />
                <NumberField label="Presence Penalty" value={w.presencePenalty} step={0.1} min={-2} max={2} onChange={(v) => patch({ presencePenalty: v })} />
                <NumberField label="Frequency Penalty" value={w.frequencyPenalty} step={0.1} min={-2} max={2} onChange={(v) => patch({ frequencyPenalty: v })} />
                <NumberField label="Max Tokens" value={w.maxTokens} min={1} onChange={(v) => patch({ maxTokens: v })} />
                <NumberField label="Timeout (sec)" value={w.timeoutSeconds} min={1} onChange={(v) => patch({ timeoutSeconds: v })} />
                <NumberField label="Retry Count" value={w.retryCount} min={0} max={10} onChange={(v) => patch({ retryCount: v })} />
                <NumberField label="Rate Limit (rpm)" value={w.rateLimitRpm} min={1} onChange={(v) => patch({ rateLimitRpm: v })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <Toggle label="Streaming" checked={w.streaming} onChange={(v) => patch({ streaming: v })} />
                <Toggle label="JSON Mode" checked={w.jsonMode} onChange={(v) => patch({ jsonMode: v })} />
                <Toggle label="Vision Enabled" checked={w.visionEnabled} onChange={(v) => patch({ visionEnabled: v })} />
                <Toggle label="Function Calling" checked={w.functionCalling} onChange={(v) => patch({ functionCalling: v })} />
              </div>
              <Select
                label="Reasoning Mode"
                options={[
                  { value: "off", label: "Off" },
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
                value={w.reasoningMode}
                onChange={(e) => patch({ reasoningMode: e.target.value as WizardState["reasoningMode"] })}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Textarea
                label="Test Prompt"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                rows={2}
              />
              <Button size="sm" onClick={runWizardTest} isLoading={testing}>
                <Play className="w-4 h-4 mr-1.5" /> Test Connection
              </Button>
              {testResult && (
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    testResult.success
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {testResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`text-sm font-semibold ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                      {testResult.success ? "Connection successful" : "Connection failed"}
                    </span>
                    <HealthBadge health={testResult.health} />
                  </div>
                  <p className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100">
                    {testResult.response}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <MetaCell label="Model Used" value={testResult.modelUsed} />
                    <MetaCell label="Tokens" value={testResult.tokensUsed} />
                    <MetaCell label="Response Time" value={`${testResult.responseTimeMs} ms`} />
                    <MetaCell label="Est. Cost" value={`$${testResult.estimatedCost}`} />
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {step > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          )}
          {step < WIZARD_STEPS.length - 1 ? (
            <Button size="sm" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
              Next
            </Button>
          ) : (
            <Button size="sm" onClick={saveConnection}>
              Save Connection
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
