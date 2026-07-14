"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { DashboardLayout } from "@/components/layout";
import {
  Badge,
  Button,
  Card,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import {
  HealthBadge,
  LogoAvatar,
  MetaCell,
  StatusBadge,
  TagsInput,
  Toggle,
  WizardProgress,
} from "@/components/ai-studio/shared";
import { providerMeta, useAIStudioStore } from "@/lib/ai-studio-store";
import { useAuthStore } from "@/lib/store";
import type {
  Agent,
  AgentAPISelection,
  AgentChatMessage,
  AgentMCPSelection,
  AgentVisibility,
  DeploymentTarget,
} from "@/types/ai-studio";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle,
  Copy,
  Eraser,
  EyeOff,
  Globe,
  Rocket,
  Save,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

const STEPS = [
  "Agent Details",
  "Select LLM",
  "MCP Servers",
  "API Connections",
  "Instructions",
  "Test Agent",
  "Deploy",
];

const AGENT_CATEGORIES = [
  "Customer Support",
  "Engineering",
  "Sales & Marketing",
  "Finance",
  "Productivity",
  "Analytics",
  "Research",
  "Other",
];

const AGENT_ICONS = ["🤖", "🧠", "⚡", "🔍", "📊", "📝", "🛠️", "💬", "🌐", "🚀"];

const DEPLOY_TARGETS: { value: DeploymentTarget; label: string; icon: React.ReactNode }[] = [
  { value: "web-chat", label: "Web Chat", icon: <Globe className="w-4 h-4" /> },
  { value: "rest-api", label: "REST API", icon: <Rocket className="w-4 h-4" /> },
  { value: "embed-widget", label: "Embed Widget", icon: <Copy className="w-4 h-4" /> },
  { value: "slack", label: "Slack", icon: <Send className="w-4 h-4" /> },
  { value: "ms-teams", label: "Microsoft Teams", icon: <Users className="w-4 h-4" /> },
];

interface Draft {
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  version: string;
  active: boolean;
  llmConnectionId: string | null;
  fallbackLLMConnectionId: string | null;
  mcpSelections: AgentMCPSelection[];
  apiSelections: AgentAPISelection[];
  systemPrompt: string;
  goal: string;
  persona: string;
  tone: string;
  instructions: string;
  constraints: string;
  responseFormat: string;
  enableMemory: boolean;
  enableHistory: boolean;
  enableCitations: boolean;
  enableToolCalling: boolean;
  visibility: AgentVisibility;
  deploymentTargets: DeploymentTarget[];
}

const emptyDraft = (): Draft => ({
  name: "",
  description: "",
  category: "Other",
  tags: [],
  icon: "🤖",
  version: "1.0.0",
  active: true,
  llmConnectionId: null,
  fallbackLLMConnectionId: null,
  mcpSelections: [],
  apiSelections: [],
  systemPrompt: "",
  goal: "",
  persona: "",
  tone: "",
  instructions: "",
  constraints: "",
  responseFormat: "",
  enableMemory: true,
  enableHistory: true,
  enableCitations: false,
  enableToolCalling: true,
  visibility: "private",
  deploymentTargets: ["web-chat"],
});

const draftFromAgent = (a: Agent): Draft => ({
  name: a.name,
  description: a.description,
  category: a.category,
  tags: a.tags,
  icon: a.icon,
  version: a.version,
  active: a.status !== "inactive",
  llmConnectionId: a.llmConnectionId,
  fallbackLLMConnectionId: a.fallbackLLMConnectionId,
  mcpSelections: a.mcpSelections,
  apiSelections: a.apiSelections,
  systemPrompt: a.instructions.systemPrompt,
  goal: a.instructions.goal,
  persona: a.instructions.persona,
  tone: a.instructions.tone,
  instructions: a.instructions.instructions,
  constraints: a.instructions.constraints,
  responseFormat: a.instructions.responseFormat,
  enableMemory: a.instructions.enableMemory,
  enableHistory: a.instructions.enableHistory,
  enableCitations: a.instructions.enableCitations,
  enableToolCalling: a.instructions.enableToolCalling,
  visibility: a.visibility,
  deploymentTargets: a.deploymentTargets,
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "my-agent";

let msgCounter = 0;
const newMsgId = () => `msg_${Date.now().toString(36)}_${msgCounter++}`;

function CreateAgentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editAgentId = searchParams.get("agentId");
  const initialStep = searchParams.get("step");

  const { isAuthenticated } = useAuthStore();
  const { llms, mcps, apis, agents, addAgent, updateAgent } = useAIStudioStore();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [d, setD] = useState<Draft>(emptyDraft());
  const [agentId, setAgentId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const loadedRef = useRef(false);

  // Test playground state
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [lastExec, setLastExec] = useState<AgentChatMessage | null>(null);

  // Deploy state
  const [deployed, setDeployed] = useState(false);

  const patch = (p: Partial<Draft>) => setD((prev) => ({ ...prev, ...p }));

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && !isAuthenticated) router.push("/");
  }, [mounted, isAuthenticated, router]);

  // Load agent for editing / resume
  useEffect(() => {
    if (!mounted || loadedRef.current) return;
    if (editAgentId) {
      const a = agents.find((x) => x.id === editAgentId);
      if (a) {
        setD(draftFromAgent(a));
        setAgentId(a.id);
        setDeployed(a.deployed);
        setStep(initialStep ? Number(initialStep) : Math.min(a.wizardStep, STEPS.length - 1));
      }
    }
    loadedRef.current = true;
  }, [mounted, editAgentId, agents, initialStep]);

  const selectedLLM = llms.find((l) => l.id === d.llmConnectionId) ?? null;

  const buildAgentPayload = (status: Agent["status"]) => ({
    name: d.name.trim() || "Untitled Agent",
    description: d.description.trim(),
    category: d.category,
    tags: d.tags,
    icon: d.icon,
    version: d.version,
    status,
    llmConnectionId: d.llmConnectionId,
    fallbackLLMConnectionId: d.fallbackLLMConnectionId,
    mcpSelections: d.mcpSelections,
    apiSelections: d.apiSelections,
    instructions: {
      systemPrompt: d.systemPrompt,
      goal: d.goal,
      persona: d.persona,
      tone: d.tone,
      instructions: d.instructions,
      constraints: d.constraints,
      responseFormat: d.responseFormat,
      enableMemory: d.enableMemory,
      enableHistory: d.enableHistory,
      enableCitations: d.enableCitations,
      enableToolCalling: d.enableToolCalling,
    },
    visibility: d.visibility,
    deploymentTargets: d.deploymentTargets,
    wizardStep: step,
  });

  const saveDraft = (silent = false): string => {
    let id = agentId;
    if (id) {
      updateAgent(id, buildAgentPayload(deployed ? "active" : "draft"));
    } else {
      const created = addAgent({
        ...buildAgentPayload("draft"),
        deployed: false,
        agentUrl: "",
        apiEndpoint: "",
        embedCode: "",
        totalRuns: 0,
        createdBy: "You",
      });
      id = created.id;
      setAgentId(created.id);
    }
    setLastSaved(new Date().toLocaleTimeString());
    if (!silent) toast.success("Draft saved");
    return id;
  };

  // Autosave on step change (after the agent exists)
  useEffect(() => {
    if (agentId && loadedRef.current && mounted) saveDraft(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const canNext = () => {
    if (step === 0) return d.name.trim().length > 0 && d.description.trim().length > 0;
    if (step === 1) return !!d.llmConnectionId;
    return true;
  };

  const toggleMCP = (mcpId: string) => {
    const existing = d.mcpSelections.find((s) => s.mcpServerId === mcpId);
    if (existing) {
      patch({ mcpSelections: d.mcpSelections.filter((s) => s.mcpServerId !== mcpId) });
    } else {
      const server = mcps.find((m) => m.id === mcpId);
      patch({
        mcpSelections: [
          ...d.mcpSelections,
          {
            mcpServerId: mcpId,
            toolIds: server?.tools.filter((t) => t.enabled).map((t) => t.id) ?? [],
          },
        ],
      });
    }
  };

  const toggleMCPTool = (mcpId: string, toolId: string) => {
    patch({
      mcpSelections: d.mcpSelections.map((s) =>
        s.mcpServerId === mcpId
          ? {
              ...s,
              toolIds: s.toolIds.includes(toolId)
                ? s.toolIds.filter((t) => t !== toolId)
                : [...s.toolIds, toolId],
            }
          : s
      ),
    });
  };

  const toggleAPI = (apiId: string) => {
    const existing = d.apiSelections.find((s) => s.apiConnectionId === apiId);
    if (existing) {
      patch({ apiSelections: d.apiSelections.filter((s) => s.apiConnectionId !== apiId) });
    } else {
      const api = apis.find((a) => a.id === apiId);
      patch({
        apiSelections: [
          ...d.apiSelections,
          {
            apiConnectionId: apiId,
            endpointIds: api?.endpoints.filter((e) => e.enabled).map((e) => e.id) ?? [],
          },
        ],
      });
    }
  };

  const toggleAPIEndpoint = (apiId: string, epId: string) => {
    patch({
      apiSelections: d.apiSelections.map((s) =>
        s.apiConnectionId === apiId
          ? {
              ...s,
              endpointIds: s.endpointIds.includes(epId)
                ? s.endpointIds.filter((e) => e !== epId)
                : [...s.endpointIds, epId],
            }
          : s
      ),
    });
  };

  // ----- Test playground -----
  const sendTestMessage = async () => {
    const prompt = chatInput.trim();
    if (!prompt || thinking) return;
    setChatInput("");
    const userMsg: AgentChatMessage = { id: newMsgId(), role: "user", content: prompt };
    setMessages((m) => [...m, userMsg]);
    setThinking(true);

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));

    const mcpCalls = d.mcpSelections
      .map((s) => mcps.find((m) => m.id === s.mcpServerId)?.name)
      .filter(Boolean)
      .slice(0, 2) as string[];
    const apiCalls = d.apiSelections
      .map((s) => apis.find((a) => a.id === s.apiConnectionId)?.name)
      .filter(Boolean)
      .slice(0, 2) as string[];

    const tokens = Math.floor(150 + Math.random() * 400);
    const timeline: { step: string; ms: number }[] = [
      { step: "Prompt received", ms: 0 },
      ...(d.enableToolCalling && mcpCalls.length
        ? mcpCalls.map((c, i) => ({ step: `MCP call: ${c}`, ms: 180 + i * 140 }))
        : []),
      ...(d.enableToolCalling && apiCalls.length
        ? apiCalls.map((c, i) => ({ step: `API call: ${c}`, ms: 420 + i * 160 }))
        : []),
      { step: "LLM generation", ms: 650 },
      { step: "Response returned", ms: 900 + Math.floor(Math.random() * 300) },
    ];

    const reply: AgentChatMessage = {
      id: newMsgId(),
      role: "assistant",
      content: selectedLLM
        ? `(Simulated) As ${d.name || "your agent"}, here's my response to "${prompt.slice(0, 60)}": I would ${
            d.goal ? `work toward: ${d.goal.slice(0, 80)}` : "assist based on my instructions"
          }${mcpCalls.length ? `, using tools from ${mcpCalls.join(" and ")}` : ""}${
            apiCalls.length ? ` and calling ${apiCalls.join(", ")}` : ""
          }.`
        : "No LLM selected — go back to Step 2 and choose an active LLM connection.",
      llmLabel: selectedLLM
        ? `${providerMeta(selectedLLM.provider).label} · ${selectedLLM.config.defaultModel}`
        : "None",
      mcpCalls,
      apiCalls,
      timeline,
      responseTimeMs: timeline[timeline.length - 1].ms,
      tokensUsed: tokens,
      estimatedCost: selectedLLM
        ? +((tokens * selectedLLM.estimatedCostPer1k) / 1000).toFixed(5)
        : 0,
      error: selectedLLM ? undefined : "Missing LLM connection",
    };
    setMessages((m) => [...m, reply]);
    setLastExec(reply);
    setThinking(false);
  };

  // ----- Deploy -----
  const slug = slugify(d.name);
  const agentUrl = `https://agents.safalvir.com/a/${slug}`;
  const apiEndpoint = `https://api.safalvir.com/v1/agents/${slug}/invoke`;
  const embedCode = `<script src="https://agents.safalvir.com/embed.js" data-agent="${slug}"></script>`;

  const deploy = (publish: boolean) => {
    const id = saveDraft(true);
    updateAgent(id, {
      status: "active",
      deployed: true,
      visibility: publish ? "public" : d.visibility,
      agentUrl,
      apiEndpoint,
      embedCode,
      wizardStep: STEPS.length - 1,
    });
    setDeployed(true);
    toast.success(publish ? "Agent published to marketplace!" : "Agent deployed!");
    router.push("/ai-studio/my-agents");
  };

  const copyText = (t: string, label: string) => {
    navigator.clipboard.writeText(t);
    toast.success(`${label} copied`);
  };

  if (!mounted) return null;

  return (
    <DashboardLayout
      activeKey="ai-studio:create-agent"
      onNavigate={(_key, path) => router.push(path)}
      headerTitle={editAgentId ? "Edit Agent" : "Create Agent"}
      headerSubtitle="Build, test and deploy an AI agent step by step"
      headerRight={
        lastSaved ? (
          <span className="text-xs text-gray-400">Autosaved {lastSaved}</span>
        ) : undefined
      }
    >
      <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
        <Card padding="sm">
          <WizardProgress steps={STEPS} current={step} onStepClick={setStep} />
        </Card>

        {/* Step 1 — Agent Details */}
        {step === 0 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Agent Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Agent Name *"
                  value={d.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. Support Copilot"
                />
                <Select
                  label="Category"
                  options={AGENT_CATEGORIES.map((c) => ({ value: c, label: c }))}
                  value={d.category}
                  onChange={(e) => patch({ category: e.target.value })}
                />
              </div>
              <Textarea
                label="Description *"
                value={d.description}
                onChange={(e) => patch({ description: e.target.value })}
                rows={2}
                placeholder="What does this agent do?"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Agent Icon
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {AGENT_ICONS.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => patch({ icon: ic })}
                        className={cn(
                          "w-9 h-9 rounded-lg text-lg flex items-center justify-center border-2 transition-all",
                          d.icon === ic
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  label="Version"
                  value={d.version}
                  onChange={(e) => patch({ version: e.target.value })}
                  placeholder="1.0.0"
                />
                <Toggle
                  label="Status"
                  description={d.active ? "Active" : "Inactive"}
                  checked={d.active}
                  onChange={(active) => patch({ active })}
                />
              </div>
              <TagsInput tags={d.tags} onChange={(tags) => patch({ tags })} />
            </div>
          </Card>
        )}

        {/* Step 2 — Select LLM */}
        {step === 1 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Select LLM</h2>
            <p className="text-sm text-gray-500 mb-4">
              Choose the default model for this agent. Inactive connections are greyed out.
            </p>
            {llms.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center border border-dashed rounded-lg">
                No LLM connections yet.{" "}
                <button
                  className="text-primary-600 font-medium"
                  onClick={() => router.push("/ai-studio/connections")}
                >
                  Add one in AI Connections →
                </button>
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {llms.map((l) => {
                  const selectable = l.status === "active";
                  const selected = d.llmConnectionId === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      disabled={!selectable}
                      onClick={() => patch({ llmConnectionId: l.id })}
                      className={cn(
                        "text-left rounded-xl border-2 p-4 transition-all",
                        selected
                          ? "border-primary-500 bg-primary-50/50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 bg-white",
                        !selectable && "opacity-45 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <LogoAvatar label={providerMeta(l.provider).label} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{l.name}</p>
                          <p className="text-xs text-gray-500">
                            {providerMeta(l.provider).label} · {l.config.defaultModel}
                          </p>
                        </div>
                        {selected && <CheckCircle className="w-5 h-5 text-primary-600" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <StatusBadge status={l.status} />
                        <HealthBadge health={l.health} />
                        <Badge variant="gray">{Math.round(l.contextWindow / 1000)}K ctx</Badge>
                        <Badge variant="gray">
                          {l.estimatedCostPer1k === 0 ? "Free" : `$${l.estimatedCostPer1k}/1K`}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {l.config.visionEnabled && <Badge variant="info">Vision</Badge>}
                        {l.config.functionCalling && <Badge variant="secondary">Function Calling</Badge>}
                        {l.config.reasoningMode !== "off" && <Badge variant="primary">Reasoning</Badge>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {d.llmConnectionId && (
              <div className="mt-4 max-w-sm">
                <Select
                  label="Fallback LLM (optional)"
                  options={[
                    { value: "", label: "None" },
                    ...llms
                      .filter((l) => l.id !== d.llmConnectionId && l.status === "active")
                      .map((l) => ({ value: l.id, label: l.name })),
                  ]}
                  value={d.fallbackLLMConnectionId ?? ""}
                  onChange={(e) =>
                    patch({ fallbackLLMConnectionId: e.target.value || null })
                  }
                />
              </div>
            )}
          </Card>
        )}

        {/* Step 3 — Select MCP Servers */}
        {step === 2 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Select MCP Servers</h2>
            <p className="text-sm text-gray-500 mb-4">
              Pick the MCP servers this agent can use, then choose specific tools.
            </p>
            {mcps.filter((m) => m.status === "active").length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center border border-dashed rounded-lg">
                No active MCP servers.{" "}
                <button
                  className="text-primary-600 font-medium"
                  onClick={() => router.push("/ai-studio/connections")}
                >
                  Add one in AI Connections →
                </button>
              </p>
            ) : (
              <div className="space-y-3">
                {mcps
                  .filter((m) => m.status === "active")
                  .map((m) => {
                    const sel = d.mcpSelections.find((s) => s.mcpServerId === m.id);
                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "rounded-xl border-2 transition-all",
                          sel ? "border-primary-400 bg-primary-50/30" : "border-gray-200"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => toggleMCP(m.id)}
                          className="w-full flex items-center gap-3 p-4 text-left"
                        >
                          <LogoAvatar label={m.name} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                            <p className="text-xs text-gray-500 truncate">{m.description}</p>
                          </div>
                          <Badge variant="gray">{m.category}</Badge>
                          <Badge variant="gray">
                            {m.tools.filter((t) => t.enabled).length} tools
                          </Badge>
                          <StatusBadge status={m.status} />
                          <div
                            className={cn(
                              "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                              sel ? "bg-primary-600 border-primary-600" : "border-gray-300"
                            )}
                          >
                            {sel && <Check className="w-3.5 h-3.5 text-white" />}
                          </div>
                        </button>
                        {sel && (
                          <div className="px-4 pb-4 pl-16 space-y-1.5">
                            {m.tools
                              .filter((t) => t.enabled)
                              .map((t) => (
                                <label
                                  key={t.id}
                                  className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={sel.toolIds.includes(t.id)}
                                    onChange={() => toggleMCPTool(m.id, t.id)}
                                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span>{t.name}</span>
                                  <span className="text-xs text-gray-400">{t.description}</span>
                                </label>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>
        )}

        {/* Step 4 — Select API Connections */}
        {step === 3 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Select API Connections</h2>
            <p className="text-sm text-gray-500 mb-4">
              Give the agent access to external APIs and choose which endpoints it may call.
            </p>
            {apis.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center border border-dashed rounded-lg">
                No API connections.{" "}
                <button
                  className="text-primary-600 font-medium"
                  onClick={() => router.push("/ai-studio/connections")}
                >
                  Add one in AI Connections →
                </button>
              </p>
            ) : (
              <div className="space-y-3">
                {apis.map((a) => {
                  const sel = d.apiSelections.find((s) => s.apiConnectionId === a.id);
                  return (
                    <div
                      key={a.id}
                      className={cn(
                        "rounded-xl border-2 transition-all",
                        sel ? "border-primary-400 bg-primary-50/30" : "border-gray-200"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => toggleAPI(a.id)}
                        className="w-full flex items-center gap-3 p-4 text-left"
                      >
                        <LogoAvatar label={a.name} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                          <p className="text-xs text-gray-500 truncate">{a.description}</p>
                        </div>
                        <Badge variant="gray">{a.category}</Badge>
                        <StatusBadge status={a.status} />
                        <div
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                            sel ? "bg-primary-600 border-primary-600" : "border-gray-300"
                          )}
                        >
                          {sel && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                      {sel && a.endpoints.length > 0 && (
                        <div className="px-4 pb-4 pl-16 space-y-1.5">
                          {a.endpoints
                            .filter((e) => e.enabled)
                            .map((e) => (
                              <label
                                key={e.id}
                                className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={sel.endpointIds.includes(e.id)}
                                  onChange={() => toggleAPIEndpoint(a.id, e.id)}
                                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="font-mono text-xs font-semibold text-gray-500">
                                  {e.method}
                                </span>
                                <span className="font-mono text-xs">{e.path}</span>
                                <span className="text-xs text-gray-400">{e.description}</span>
                              </label>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* Step 5 — Instructions */}
        {step === 4 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Agent Instructions</h2>
            <p className="text-sm text-gray-500 mb-4">
              This is the intelligence of the agent — define how it thinks and responds.
            </p>
            <div className="space-y-4">
              <Textarea
                label="System Prompt"
                value={d.systemPrompt}
                onChange={(e) => patch({ systemPrompt: e.target.value })}
                rows={4}
                placeholder="You are a helpful assistant that..."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Textarea
                  label="Agent Goal"
                  value={d.goal}
                  onChange={(e) => patch({ goal: e.target.value })}
                  rows={2}
                  placeholder="What should this agent achieve?"
                />
                <Textarea
                  label="Constraints"
                  value={d.constraints}
                  onChange={(e) => patch({ constraints: e.target.value })}
                  rows={2}
                  placeholder="What must the agent never do?"
                />
                <Input
                  label="Persona"
                  value={d.persona}
                  onChange={(e) => patch({ persona: e.target.value })}
                  placeholder="e.g. Friendly support engineer"
                />
                <Input
                  label="Tone"
                  value={d.tone}
                  onChange={(e) => patch({ tone: e.target.value })}
                  placeholder="e.g. Professional and warm"
                />
              </div>
              <Textarea
                label="Instructions"
                value={d.instructions}
                onChange={(e) => patch({ instructions: e.target.value })}
                rows={3}
                placeholder="Step-by-step guidance for how the agent should work..."
              />
              <Input
                label="Response Format"
                value={d.responseFormat}
                onChange={(e) => patch({ responseFormat: e.target.value })}
                placeholder="e.g. Short paragraphs with bullet points"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 pt-2 border-t border-gray-100">
                <Toggle
                  label="Enable Memory"
                  description="Remember facts across conversations"
                  checked={d.enableMemory}
                  onChange={(v) => patch({ enableMemory: v })}
                />
                <Toggle
                  label="Enable Conversation History"
                  description="Keep chat context within a session"
                  checked={d.enableHistory}
                  onChange={(v) => patch({ enableHistory: v })}
                />
                <Toggle
                  label="Enable Citations"
                  description="Cite sources in responses"
                  checked={d.enableCitations}
                  onChange={(v) => patch({ enableCitations: v })}
                />
                <Toggle
                  label="Enable Tool Calling"
                  description="Allow MCP tools and API calls"
                  checked={d.enableToolCalling}
                  onChange={(v) => patch({ enableToolCalling: v })}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 6 — Test Agent */}
        {step === 5 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Chat window */}
            <Card padding="none" className="lg:col-span-3 flex flex-col h-[520px]">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{d.icon}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {d.name || "Test Agent"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    title="Retry last prompt"
                    onClick={() => {
                      const lastUser = [...messages].reverse().find((m) => m.role === "user");
                      if (lastUser) {
                        setChatInput(lastUser.content);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg text-xs font-medium px-2"
                  >
                    Retry
                  </button>
                  <button
                    title="Clear chat"
                    onClick={() => {
                      setMessages([]);
                      setLastExec(null);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                  <button
                    title="Save test"
                    onClick={() => {
                      saveDraft(true);
                      toast.success("Test session saved");
                    }}
                    className="p-1.5 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Sparkles className="w-8 h-8 text-primary-300 mb-2" />
                    <p className="text-sm text-gray-400">
                      Send a message to test your agent&apos;s behavior.
                    </p>
                  </div>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                        m.role === "user"
                          ? "bg-primary-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {thinking && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:120ms]" />
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:240ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 border-t border-gray-100 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendTestMessage()}
                  placeholder="Type a test prompt..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <Button size="sm" onClick={sendTestMessage} disabled={thinking || !chatInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Execution details */}
            <Card className="lg:col-span-2 h-[520px] overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Execution Details</h3>
              {!lastExec ? (
                <p className="text-sm text-gray-400">
                  Run a test to see LLM usage, tool calls, timing and cost.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <MetaCell label="LLM" value={lastExec.llmLabel} />
                    <MetaCell label="Response Time" value={`${lastExec.responseTimeMs} ms`} />
                    <MetaCell label="Tokens Used" value={lastExec.tokensUsed} />
                    <MetaCell label="Est. Cost" value={`$${lastExec.estimatedCost}`} />
                  </div>
                  {lastExec.error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                      {lastExec.error}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                      MCP Calls
                    </p>
                    {lastExec.mcpCalls?.length ? (
                      lastExec.mcpCalls.map((c) => (
                        <Badge key={c} variant="secondary" className="mr-1.5 mb-1.5">
                          {c}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">None</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                      API Calls
                    </p>
                    {lastExec.apiCalls?.length ? (
                      lastExec.apiCalls.map((c) => (
                        <Badge key={c} variant="info" className="mr-1.5 mb-1.5">
                          {c}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">None</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                      Tool Execution Timeline
                    </p>
                    <div className="space-y-0">
                      {lastExec.timeline?.map((t, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-primary-500 mt-1.5" />
                            {i < (lastExec.timeline?.length ?? 0) - 1 && (
                              <div className="w-px h-5 bg-gray-200" />
                            )}
                          </div>
                          <div className="flex-1 flex items-center justify-between pb-2">
                            <span className="text-xs text-gray-700">{t.step}</span>
                            <span className="text-[10px] text-gray-400 font-mono">+{t.ms}ms</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Step 7 — Deploy */}
        {step === 6 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Deploy</h2>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Visibility</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { v: "private", label: "Private", desc: "Only you can use this agent", icon: <EyeOff className="w-4 h-4" /> },
                      { v: "team", label: "Team", desc: "Everyone in your workspace", icon: <Users className="w-4 h-4" /> },
                      { v: "public", label: "Public Marketplace", desc: "Listed for all Safal AI users", icon: <Globe className="w-4 h-4" /> },
                    ] as { v: AgentVisibility; label: string; desc: string; icon: React.ReactNode }[]
                  ).map((o) => (
                    <button
                      key={o.v}
                      type="button"
                      onClick={() => patch({ visibility: o.v })}
                      className={cn(
                        "rounded-xl border-2 p-4 text-left transition-all",
                        d.visibility === o.v
                          ? "border-primary-500 bg-primary-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1 text-gray-700">
                        {o.icon}
                        <span className="text-sm font-semibold">{o.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{o.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Deployment Targets</p>
                <div className="flex flex-wrap gap-2">
                  {DEPLOY_TARGETS.map((t) => {
                    const on = d.deploymentTargets.includes(t.value);
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() =>
                          patch({
                            deploymentTargets: on
                              ? d.deploymentTargets.filter((x) => x !== t.value)
                              : [...d.deploymentTargets, t.value],
                          })
                        }
                        className={cn(
                          "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                          on
                            ? "border-primary-500 bg-primary-50 text-primary-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        )}
                      >
                        {t.icon}
                        {t.label}
                        {on && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                {[
                  { label: "Agent URL", value: agentUrl },
                  { label: "API Endpoint", value: apiEndpoint },
                  { label: "Embed Code", value: embedCode },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                      {row.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 font-mono text-gray-700 truncate">
                        {row.value}
                      </code>
                      <button
                        onClick={() => copyText(row.value, row.label)}
                        className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={() => deploy(false)}>
                  <Rocket className="w-4 h-4 mr-1.5" /> Deploy
                </Button>
                <Button variant="outline" onClick={() => saveDraft()}>
                  Save Draft
                </Button>
                <Button variant="secondary" onClick={() => deploy(true)}>
                  <Globe className="w-4 h-4 mr-1.5" /> Publish
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Wizard nav */}
        {step < 6 && (
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={() => saveDraft()}>
              <Save className="w-4 h-4 mr-1.5" /> Save Draft
            </Button>
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              <Button size="sm" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function CreateAgentPage() {
  return (
    <Suspense fallback={null}>
      <CreateAgentInner />
    </Suspense>
  );
}
