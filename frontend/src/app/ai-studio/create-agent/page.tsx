"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { DashboardLayout } from "@/components/layout";
import { Badge, Button, Card, Input, Select, Textarea } from "@/components/ui";
import {
  fmtDate,
  HealthBadge,
  LogoAvatar,
  MetaCell,
  StatusBadge,
  TagsInput,
  Toggle,
  WizardProgress,
} from "@/components/ai-studio/shared";
import { EnvironmentBadge, PermissionBadge } from "@/components/ai-studio/MCPServersTab";
import {
  defaultAgentAPIConfig,
  defaultAgentMCPConfig,
  providerMeta,
  useAIStudioStore,
} from "@/lib/ai-studio-store";
import { useAuthStore } from "@/lib/store";
import type {
  Agent,
  AgentAPISelection,
  AgentChatMessage,
  AgentMCPPermissionMode,
  AgentMCPSelection,
  AgentResourceType,
  AgentVisibility,
  DeploymentStatus,
  MCPTool,
} from "@/types/ai-studio";
import { cn } from "@/lib/utils";
import {
  Check,
  CheckCircle,
  Copy,
  Eraser,
  ExternalLink,
  Globe,
  Lock,
  MessageSquare,
  PartyPopper,
  Rocket,
  Save,
  Send,
  Server,
  Sparkles,
  Users,
} from "lucide-react";

const STEPS = [
  "Agent Details",
  "Select LLM",
  "Connectivity",
  "Test Agent",
  "Deploy",
  "Success",
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

const TONES = ["Professional", "Friendly", "Technical", "Casual", "Custom"];

const RESPONSE_FORMATS = ["Text", "Markdown", "JSON", "HTML"];

interface Draft {
  // Step 1 — details
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: string;
  version: string;
  active: boolean;
  // Step 1 — instructions
  systemPrompt: string;
  goal: string;
  persona: string;
  tone: string;
  customTone: string;
  responseFormat: string;
  constraints: string;
  enableMemory: boolean;
  enableHistory: boolean;
  enableCitations: boolean;
  enableToolCalling: boolean;
  // Step 2 — LLM
  llmConnectionId: string | null;
  // Step 3 — one external resource
  resourceType: AgentResourceType;
  mcpSelections: AgentMCPSelection[];
  apiSelections: AgentAPISelection[];
  // Step 5 — deploy
  visibility: AgentVisibility;
}

const emptyDraft = (): Draft => ({
  name: "",
  description: "",
  category: "Other",
  tags: [],
  icon: "🤖",
  version: "1.0.0",
  active: true,
  systemPrompt: "",
  goal: "",
  persona: "",
  tone: "Professional",
  customTone: "",
  responseFormat: "Markdown",
  constraints: "",
  enableMemory: true,
  enableHistory: true,
  enableCitations: false,
  enableToolCalling: true,
  llmConnectionId: null,
  resourceType: null,
  mcpSelections: [],
  apiSelections: [],
  visibility: "private",
});

const draftFromAgent = (a: Agent): Draft => {
  const knownTone = TONES.includes(a.instructions.tone);
  return {
    name: a.name,
    description: a.description,
    category: a.category,
    tags: a.tags,
    icon: a.icon,
    version: a.version,
    active: a.status !== "inactive",
    systemPrompt: a.instructions.systemPrompt,
    goal: a.instructions.goal,
    persona: a.instructions.persona,
    tone: knownTone ? a.instructions.tone : a.instructions.tone ? "Custom" : "Professional",
    customTone: knownTone ? "" : a.instructions.tone,
    responseFormat: RESPONSE_FORMATS.includes(a.instructions.responseFormat)
      ? a.instructions.responseFormat
      : "Markdown",
    constraints: a.instructions.constraints,
    enableMemory: a.instructions.enableMemory,
    enableHistory: a.instructions.enableHistory,
    enableCitations: a.instructions.enableCitations,
    enableToolCalling: a.instructions.enableToolCalling,
    llmConnectionId: a.llmConnectionId,
    resourceType: a.resourceType,
    mcpSelections: a.mcpSelections,
    apiSelections: a.apiSelections,
    visibility: a.visibility,
  };
};

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

  // Test playground
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [lastExec, setLastExec] = useState<AgentChatMessage | null>(null);

  // Deploy
  const [deployStatus, setDeployStatus] = useState<DeploymentStatus>("draft");

  // Search
  const [resourceSearch, setResourceSearch] = useState("");

  const patch = (p: Partial<Draft>) => setD((prev) => ({ ...prev, ...p }));

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && !isAuthenticated) router.push("/");
  }, [mounted, isAuthenticated, router]);

  useEffect(() => {
    if (!mounted || loadedRef.current) return;
    if (editAgentId) {
      const a = agents.find((x) => x.id === editAgentId);
      if (a) {
        setD(draftFromAgent(a));
        setAgentId(a.id);
        setDeployStatus(a.deploymentStatus);
        setStep(
          initialStep !== null
            ? Math.min(Number(initialStep), STEPS.length - 1)
            : Math.min(a.wizardStep, STEPS.length - 2)
        );
      }
    }
    loadedRef.current = true;
  }, [mounted, editAgentId, agents, initialStep]);

  const selectedLLM = llms.find((l) => l.id === d.llmConnectionId) ?? null;
  const selectedMCP =
    d.resourceType === "mcp" && d.mcpSelections[0]
      ? mcps.find((m) => m.id === d.mcpSelections[0].mcpServerId) ?? null
      : null;
  const selectedAPI =
    d.resourceType === "api" && d.apiSelections[0]
      ? apis.find((a) => a.id === d.apiSelections[0].apiConnectionId) ?? null
      : null;

  // ----- Persistence -----
  const buildAgentPayload = (status: Agent["status"]) => ({
    name: d.name.trim() || "Untitled Agent",
    description: d.description.trim(),
    category: d.category,
    tags: d.tags,
    icon: d.icon,
    version: d.version,
    status,
    llmConnectionId: d.llmConnectionId,
    fallbackLLMConnectionId: null,
    resourceType: d.resourceType,
    mcpSelections: d.mcpSelections,
    apiSelections: d.apiSelections,
    instructions: {
      systemPrompt: d.systemPrompt,
      goal: d.goal,
      persona: d.persona,
      tone: d.tone === "Custom" ? d.customTone : d.tone,
      instructions: "",
      constraints: d.constraints,
      responseFormat: d.responseFormat,
      enableMemory: d.enableMemory,
      enableHistory: d.enableHistory,
      enableCitations: d.enableCitations,
      enableToolCalling: d.enableToolCalling,
    },
    visibility: d.visibility,
    wizardStep: step,
  });

  const saveDraft = (silent = false): string => {
    let id = agentId;
    if (id) {
      updateAgent(id, buildAgentPayload(deployStatus === "live" ? "active" : "draft"));
    } else {
      const created = addAgent({
        ...buildAgentPayload("draft"),
        deploymentTargets: ["web-chat"],
        deployed: false,
        deploymentStatus: "draft",
        agentUrl: "",
        chatUrl: "",
        apiEndpoint: "",
        apiKey: "",
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

  useEffect(() => {
    if (agentId && loadedRef.current && mounted) saveDraft(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const canNext = () => {
    if (step === 0) return d.name.trim().length > 0 && d.description.trim().length > 0;
    if (step === 1) return !!d.llmConnectionId;
    return true;
  };

  // ----- Step 3 helpers: one external resource -----
  const setResourceType = (type: AgentResourceType) => {
    patch({ resourceType: type, mcpSelections: [], apiSelections: [] });
    setResourceSearch("");
  };

  const selectMCP = (mcpId: string) => {
    const already = d.mcpSelections[0]?.mcpServerId === mcpId;
    if (already) {
      patch({ mcpSelections: [] });
      return;
    }
    const server = mcps.find((m) => m.id === mcpId);
    patch({
      mcpSelections: [
        {
          mcpServerId: mcpId,
          toolIds:
            server?.tools
              .filter((t) => t.enabled && t.permission !== "admin")
              .map((t) => t.id) ?? [],
          ...defaultAgentMCPConfig(),
        },
      ],
    });
  };

  const updateMCPSel = (p: Partial<AgentMCPSelection>) =>
    patch({ mcpSelections: d.mcpSelections.map((s) => ({ ...s, ...p })) });

  const toggleMCPTool = (toolId: string) => {
    const sel = d.mcpSelections[0];
    if (!sel) return;
    updateMCPSel({
      toolIds: sel.toolIds.includes(toolId)
        ? sel.toolIds.filter((t) => t !== toolId)
        : [...sel.toolIds, toolId],
    });
  };

  const setMCPPermissionMode = (mode: AgentMCPPermissionMode) => {
    if (!selectedMCP) return;
    let toolIds = d.mcpSelections[0]?.toolIds ?? [];
    if (mode === "read_only")
      toolIds = selectedMCP.tools
        .filter((t) => t.enabled && t.permission === "read")
        .map((t) => t.id);
    if (mode === "read_write")
      toolIds = selectedMCP.tools
        .filter((t) => t.enabled && t.permission !== "admin")
        .map((t) => t.id);
    updateMCPSel({ permissionMode: mode, toolIds });
  };

  const toolAllowedInMode = (tool: MCPTool, mode: AgentMCPPermissionMode) => {
    if (mode === "custom") return true;
    if (mode === "read_only") return tool.permission === "read";
    return tool.permission !== "admin";
  };

  const selectAPI = (apiId: string) => {
    const already = d.apiSelections[0]?.apiConnectionId === apiId;
    if (already) {
      patch({ apiSelections: [] });
      return;
    }
    const api = apis.find((a) => a.id === apiId);
    patch({
      apiSelections: [
        {
          apiConnectionId: apiId,
          endpointIds: api?.endpoints.filter((e) => e.enabled).map((e) => e.id) ?? [],
          ...defaultAgentAPIConfig(),
        },
      ],
    });
  };

  const updateAPISel = (p: Partial<AgentAPISelection>) =>
    patch({ apiSelections: d.apiSelections.map((s) => ({ ...s, ...p })) });

  const toggleAPIEndpoint = (epId: string) => {
    const sel = d.apiSelections[0];
    if (!sel) return;
    updateAPISel({
      endpointIds: sel.endpointIds.includes(epId)
        ? sel.endpointIds.filter((e) => e !== epId)
        : [...sel.endpointIds, epId],
    });
  };

  // ----- Step 4: test playground -----
  const sendTestMessage = async () => {
    const prompt = chatInput.trim();
    if (!prompt || thinking) return;
    setChatInput("");
    setMessages((m) => [...m, { id: newMsgId(), role: "user", content: prompt }]);
    setThinking(true);

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));

    const toolInvocations: { server: string; tool: string }[] = [];
    if (selectedMCP && d.mcpSelections[0]) {
      selectedMCP.tools
        .filter((t) => d.mcpSelections[0].toolIds.includes(t.id))
        .slice(0, 2)
        .forEach((t) =>
          toolInvocations.push({ server: selectedMCP.displayName, tool: t.name })
        );
    }
    const apiEndpointsInvoked =
      selectedAPI && d.apiSelections[0]
        ? selectedAPI.endpoints
            .filter((e) => d.apiSelections[0].endpointIds.includes(e.id))
            .slice(0, 2)
            .map((e) => `${e.method} ${e.path}`)
        : [];

    const tokens = Math.floor(150 + Math.random() * 400);
    const timeline: { step: string; ms: number }[] = [
      { step: "User prompt received", ms: 0 },
      { step: `LLM: ${selectedLLM ? selectedLLM.config.defaultModel : "no model"}`, ms: 120 },
      ...(d.enableToolCalling
        ? toolInvocations.map((x, i) => ({
            step: `${x.server} → ${x.tool}`,
            ms: 260 + i * 160,
          }))
        : []),
      ...(d.enableToolCalling
        ? apiEndpointsInvoked.map((e, i) => ({ step: `API: ${e}`, ms: 420 + i * 160 }))
        : []),
      { step: "LLM generation", ms: 780 },
      { step: "Response generated", ms: 1000 + Math.floor(Math.random() * 300) },
    ];

    const resourceLabel = selectedMCP
      ? selectedMCP.displayName
      : selectedAPI
      ? selectedAPI.name
      : null;

    const reply: AgentChatMessage = {
      id: newMsgId(),
      role: "assistant",
      content: selectedLLM
        ? `(Simulated) As ${d.name || "your agent"}, responding to "${prompt.slice(0, 60)}": I would ${
            d.goal ? `work toward: ${d.goal.slice(0, 80)}` : "assist based on my instructions"
          }${resourceLabel ? `, using ${resourceLabel}` : ""}.`
        : "No LLM selected — go back to Step 2 and choose an active LLM connection.",
      llmLabel: selectedLLM
        ? `${providerMeta(selectedLLM.provider).label} · ${selectedLLM.config.defaultModel}`
        : "None",
      mcpCalls: toolInvocations.map((x) => `${x.server} → ${x.tool}`),
      apiCalls: apiEndpointsInvoked,
      timeline,
      responseTimeMs: timeline[timeline.length - 1].ms,
      toolExecutionMs:
        toolInvocations.length || apiEndpointsInvoked.length
          ? Math.floor(120 + Math.random() * 250)
          : 0,
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

  // ----- Step 5: deploy -----
  const agtId = (agentId ?? "agent_xxxxxx").replace(/^agent_?/, "agt_");
  const agentUrl = `https://ai.safalvir.com/agents/${agtId}`;
  const chatUrl = `https://ai.safalvir.com/chat/${agtId}`;
  const apiEndpoint = `POST /api/v1/agents/${agtId}/chat`;
  const curlExample = `curl -X POST https://api.safalvir.com/v1/agents/${agtId}/chat \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"message":"Hello"}'`;

  const deployAgent = async () => {
    const id = saveDraft(true);
    setDeployStatus("deploying");
    updateAgent(id, { deploymentStatus: "deploying" });
    await new Promise((r) => setTimeout(r, 1400));
    updateAgent(id, {
      status: "active",
      deployed: true,
      deploymentStatus: "live",
      agentUrl,
      chatUrl,
      apiEndpoint,
      apiKey: `sk_safal_${Math.random().toString(36).slice(2, 14)}`,
      wizardStep: STEPS.length - 1,
    });
    setDeployStatus("live");
    toast.success("Agent deployed!");
    setStep(5);
  };

  const copyText = (t: string, label: string) => {
    navigator.clipboard.writeText(t);
    toast.success(`${label} copied`);
  };

  const enabledToolNames = selectedMCP
    ? selectedMCP.tools
        .filter((t) => d.mcpSelections[0]?.toolIds.includes(t.id))
        .map((t) => t.name)
    : selectedAPI
    ? selectedAPI.endpoints
        .filter((e) => d.apiSelections[0]?.endpointIds.includes(e.id))
        .map((e) => `${e.method} ${e.path}`)
    : [];

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

        {/* ===== Step 1 — Agent Details + Instructions ===== */}
        {step === 0 && (
          <div className="space-y-6">
            <Card>
              <h2 className="text-base font-semibold text-gray-900 mb-4">Agent Information</h2>
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

            <Card>
              <h2 className="text-base font-semibold text-gray-900 mb-1">Agent Instructions</h2>
              <p className="text-sm text-gray-500 mb-4">
                Define how the agent thinks and responds.
              </p>
              <div className="space-y-4">
                <Textarea
                  label="System Instruction (Primary Prompt)"
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
                    placeholder={"Never expose secrets.\nAlways cite sources.\nKeep answers below 500 words."}
                  />
                  <Input
                    label="Persona"
                    value={d.persona}
                    onChange={(e) => patch({ persona: e.target.value })}
                    placeholder="e.g. Friendly support engineer"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Response Tone"
                      options={TONES.map((t) => ({ value: t, label: t }))}
                      value={d.tone}
                      onChange={(e) => patch({ tone: e.target.value })}
                    />
                    <Select
                      label="Response Format"
                      options={RESPONSE_FORMATS.map((f) => ({ value: f, label: f }))}
                      value={d.responseFormat}
                      onChange={(e) => patch({ responseFormat: e.target.value })}
                    />
                  </div>
                </div>
                {d.tone === "Custom" && (
                  <Input
                    label="Custom Tone"
                    value={d.customTone}
                    onChange={(e) => patch({ customTone: e.target.value })}
                    placeholder="Describe the tone, e.g. Warm but concise"
                  />
                )}
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
          </div>
        )}

        {/* ===== Step 2 — Select LLM ===== */}
        {step === 1 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Select LLM</h2>
            <p className="text-sm text-gray-500 mb-4">
              Select one LLM. Inactive connections are disabled.
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
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={l.status} />
                        <HealthBadge health={l.health} />
                        <Badge variant="gray">{Math.round(l.contextWindow / 1000)}K ctx</Badge>
                        <Badge variant="gray">
                          {l.estimatedCostPer1k === 0 ? "Free" : `$${l.estimatedCostPer1k}/1K`}
                        </Badge>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* ===== Step 3 — Connect External Resource ===== */}
        {step === 2 && (
          <Card>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              Connectivity
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Choose your connectivity — an MCP server or an API connection.
            </p>

            {/* Connectivity type radio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-xl">
              {(
                [
                  { v: "mcp", label: "MCP Server", icon: <Server className="w-4 h-4" />, desc: "Give the agent tools via Model Context Protocol" },
                  { v: "api", label: "API Connection", icon: <Globe className="w-4 h-4" />, desc: "Let the agent call REST API endpoints" },
                ] as { v: AgentResourceType; label: string; icon: React.ReactNode; desc: string }[]
              ).map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setResourceType(o.v)}
                  className={cn(
                    "rounded-xl border-2 p-4 text-left transition-all",
                    d.resourceType === o.v
                      ? "border-primary-500 bg-primary-50/50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 text-gray-700">
                    <span
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        d.resourceType === o.v ? "border-primary-600" : "border-gray-300"
                      )}
                    >
                      {d.resourceType === o.v && (
                        <span className="w-2 h-2 rounded-full bg-primary-600" />
                      )}
                    </span>
                    {o.icon}
                    <span className="text-sm font-semibold">{o.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{o.desc}</p>
                </button>
              ))}
            </div>

            {/* MCP branch */}
            {d.resourceType === "mcp" && (
              <div className="space-y-3 mt-4">
                <Input
                  placeholder="Search MCP Servers..."
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  className="mb-4"
                />
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
                  mcps
                    .filter((m) => m.status === "active")
                    .filter((m) => m.displayName.toLowerCase().includes(resourceSearch.toLowerCase()) || m.description.toLowerCase().includes(resourceSearch.toLowerCase()))
                    .map((m) => {
                      const sel =
                        d.mcpSelections[0]?.mcpServerId === m.id ? d.mcpSelections[0] : null;
                      const enabledTools = m.tools.filter((t) => t.enabled);
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
                            onClick={() => selectMCP(m.id)}
                            className="w-full flex items-center gap-3 p-4 text-left"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                              {m.icon || "📦"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">
                                {m.displayName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{m.description}</p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                              <HealthBadge health={m.health} />
                              <Badge variant="gray">{m.category}</Badge>
                              <Badge variant="gray">{enabledTools.length} tools</Badge>
                              <span className="text-[11px] text-gray-400">
                                Synced {fmtDate(m.lastSyncedAt)}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                                sel ? "border-primary-600" : "border-gray-300"
                              )}
                            >
                              {sel && <span className="w-2 h-2 rounded-full bg-primary-600" />}
                            </span>
                          </button>

                          {sel && (
                            <div className="px-4 pb-4 space-y-4">
                              {/* Discovered tools */}
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                  Tools ({sel.toolIds.length} selected)
                                </p>
                                <div className="space-y-1">
                                  {enabledTools.map((t) => {
                                    const allowed = toolAllowedInMode(t, sel.permissionMode);
                                    return (
                                      <label
                                        key={t.id}
                                        className={cn(
                                          "flex items-center gap-2.5 text-sm",
                                          allowed
                                            ? "text-gray-700 cursor-pointer"
                                            : "text-gray-300 cursor-not-allowed"
                                        )}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={sel.toolIds.includes(t.id)}
                                          disabled={!allowed}
                                          onChange={() => toggleMCPTool(t.id)}
                                          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 disabled:opacity-40"
                                        />
                                        <span>{t.name}</span>
                                        <PermissionBadge permission={t.permission} />
                                        <span className="text-xs text-gray-400 truncate">
                                          {t.description}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Configure */}
                              <div className="pt-3 border-t border-gray-100">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                  Configure
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                                  <Input
                                    label="Maximum Tool Calls"
                                    type="number"
                                    min={1}
                                    value={sel.maxToolCalls}
                                    onChange={(e) =>
                                      updateMCPSel({ maxToolCalls: Number(e.target.value) })
                                    }
                                    className="!py-2 text-sm"
                                  />
                                  <Input
                                    label="Tool Timeout (sec)"
                                    type="number"
                                    min={1}
                                    value={sel.toolTimeoutSeconds}
                                    onChange={(e) =>
                                      updateMCPSel({
                                        toolTimeoutSeconds: Number(e.target.value),
                                      })
                                    }
                                    className="!py-2 text-sm"
                                  />
                                  <Select
                                    label="Tool Permissions"
                                    options={[
                                      { value: "read_only", label: "Read Only" },
                                      { value: "read_write", label: "Read & Write" },
                                      { value: "custom", label: "Custom" },
                                    ]}
                                    value={sel.permissionMode}
                                    onChange={(e) =>
                                      setMCPPermissionMode(
                                        e.target.value as AgentMCPPermissionMode
                                      )
                                    }
                                    className="!py-2 text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                  <Toggle
                                    label="Retry Failed Calls"
                                    checked={sel.retryFailedCalls}
                                    onChange={(v) => updateMCPSel({ retryFailedCalls: v })}
                                  />
                                  <Toggle
                                    label="Require Approval for Write/Delete"
                                    checked={sel.approvalRules.update && sel.approvalRules.delete}
                                    onChange={(v) =>
                                      updateMCPSel({
                                        approvalRules: {
                                          ...sel.approvalRules,
                                          create: v,
                                          update: v,
                                          delete: v,
                                        },
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            )}

            {/* API branch */}
            {d.resourceType === "api" && (
              <div className="space-y-3 mt-4">
                <Input
                  placeholder="Search API Connections..."
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  className="mb-4"
                />
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
                  apis
                    .filter((a) => a.name.toLowerCase().includes(resourceSearch.toLowerCase()) || a.description.toLowerCase().includes(resourceSearch.toLowerCase()))
                    .map((a) => {
                    const sel =
                      d.apiSelections[0]?.apiConnectionId === a.id ? d.apiSelections[0] : null;
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
                          onClick={() => selectAPI(a.id)}
                          className="w-full flex items-center gap-3 p-4 text-left"
                        >
                          <LogoAvatar label={a.name} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                            <p className="text-xs text-gray-500 truncate">{a.description}</p>
                          </div>
                          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            <Badge variant="gray">{a.category}</Badge>
                            <Badge variant="gray">{a.authType.replace("_", " ")}</Badge>
                            <StatusBadge status={a.status} />
                          </div>
                          <span
                            className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                              sel ? "border-primary-600" : "border-gray-300"
                            )}
                          >
                            {sel && <span className="w-2 h-2 rounded-full bg-primary-600" />}
                          </span>
                        </button>

                        {sel && (
                          <div className="px-4 pb-4 space-y-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Endpoints ({sel.endpointIds.length} selected)
                              </p>
                              <div className="space-y-1">
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
                                        onChange={() => toggleAPIEndpoint(e.id)}
                                        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                      />
                                      <span className="font-mono text-xs font-semibold text-gray-500">
                                        {e.method}
                                      </span>
                                      <span className="font-mono text-xs">{e.path}</span>
                                      <span className="text-xs text-gray-400 truncate">
                                        {e.description}
                                      </span>
                                    </label>
                                  ))}
                              </div>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                                Configure
                              </p>
                              <div className="grid grid-cols-3 gap-4">
                                <Input
                                  label="Timeout (sec)"
                                  type="number"
                                  min={1}
                                  value={sel.timeoutSeconds}
                                  onChange={(e) =>
                                    updateAPISel({ timeoutSeconds: Number(e.target.value) })
                                  }
                                  className="!py-2 text-sm"
                                />
                                <Input
                                  label="Retry"
                                  type="number"
                                  min={0}
                                  max={10}
                                  value={sel.retryCount}
                                  onChange={(e) =>
                                    updateAPISel({ retryCount: Number(e.target.value) })
                                  }
                                  className="!py-2 text-sm"
                                />
                                <Input
                                  label="Rate Limit (rpm)"
                                  type="number"
                                  min={1}
                                  value={sel.rateLimitRpm}
                                  onChange={(e) =>
                                    updateAPISel({ rateLimitRpm: Number(e.target.value) })
                                  }
                                  className="!py-2 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </Card>
        )}

        {/* ===== Step 4 — Test Agent ===== */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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
                      if (lastUser) setChatInput(lastUser.content);
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
                    title="Save test result"
                    onClick={() => {
                      saveDraft(true);
                      toast.success("Test result saved");
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
                    <MetaCell
                      label="Resource"
                      value={
                        selectedMCP
                          ? selectedMCP.displayName
                          : selectedAPI
                          ? selectedAPI.name
                          : "None"
                      }
                    />
                    <MetaCell label="Response Time" value={`${lastExec.responseTimeMs} ms`} />
                    <MetaCell
                      label="Tool Execution"
                      value={lastExec.toolExecutionMs ? `${lastExec.toolExecutionMs} ms` : "—"}
                    />
                    <MetaCell label="Tokens Used" value={lastExec.tokensUsed} />
                    <MetaCell label="Est. Cost" value={`$${lastExec.estimatedCost}`} />
                    <MetaCell label="Result" value={lastExec.error ? "Failure" : "Success"} />
                  </div>
                  {lastExec.error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
                      {lastExec.error}
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                      Tools Invoked
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
                      API Endpoints Invoked
                    </p>
                    {lastExec.apiCalls?.length ? (
                      lastExec.apiCalls.map((c) => (
                        <Badge key={c} variant="info" className="mr-1.5 mb-1.5 font-mono">
                          {c}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">None</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                      Execution Timeline
                    </p>
                    <div>
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
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                      Logs
                    </p>
                    <div className="font-mono text-[11px] bg-gray-900 text-gray-100 rounded-lg p-3 space-y-0.5">
                      {(lastExec.timeline ?? []).map((t, i) => (
                        <div key={i}>
                          <span className="text-green-400">INFO</span>{" "}
                          <span className="text-gray-400">+{t.ms}ms</span> {t.step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ===== Step 5 — Deploy ===== */}
        {step === 4 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Deploy</h2>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                  deployStatus === "live" && "bg-green-100 text-green-700",
                  deployStatus === "deploying" && "bg-blue-100 text-blue-700",
                  deployStatus === "draft" && "bg-gray-100 text-gray-600",
                  deployStatus === "failed" && "bg-red-100 text-red-700"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    deployStatus === "live" && "bg-green-500",
                    deployStatus === "deploying" && "bg-blue-500 animate-pulse",
                    deployStatus === "draft" && "bg-gray-400",
                    deployStatus === "failed" && "bg-red-500"
                  )}
                />
                {deployStatus === "live"
                  ? "Live"
                  : deployStatus === "deploying"
                  ? "Deploying…"
                  : deployStatus === "failed"
                  ? "Failed"
                  : "Draft"}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Visibility</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { v: "private", label: "🔒 Private", desc: "Only you can use this agent", icon: <Lock className="w-4 h-4" /> },
                      { v: "team", label: "👥 Organization", desc: "Everyone in your organization", icon: <Users className="w-4 h-4" /> },
                      { v: "public", label: "🌍 Public", desc: "Publish to the Agent Marketplace", icon: <Globe className="w-4 h-4" /> },
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
                        <span className="text-sm font-semibold">{o.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{o.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700">
                  Generated on deploy
                </p>
                {[
                  { label: "Agent ID", value: agtId },
                  { label: "Agent URL", value: agentUrl },
                  { label: "Chat URL", value: chatUrl },
                  { label: "REST API Endpoint", value: apiEndpoint },
                  { label: "API Key", value: deployStatus === "live" ? "sk_safal_••••••••••••" : "••••••••••••••• (generated on deploy)" },
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
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    cURL Example
                  </p>
                  <div className="flex items-start gap-2">
                    <pre className="flex-1 text-xs bg-gray-900 text-gray-100 rounded-lg px-3 py-2.5 font-mono overflow-x-auto">
                      {curlExample}
                    </pre>
                    <button
                      onClick={() => copyText(curlExample, "cURL example")}
                      className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={deployAgent} isLoading={deployStatus === "deploying"}>
                  <Rocket className="w-4 h-4 mr-1.5" /> Deploy Agent
                </Button>
                <Button variant="outline" onClick={() => saveDraft()}>
                  Save Draft
                </Button>
                <Button variant="ghost" onClick={() => router.push("/ai-studio/my-agents")}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ===== Step 6 — Success ===== */}
        {step === 5 && (
          <Card className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                <PartyPopper className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                🎉 Agent Successfully Created
              </h2>
              <p className="text-sm text-gray-500">
                {d.icon} {d.name || "Your agent"} is ready to use.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <MetaCell label="Agent Name" value={`${d.icon} ${d.name || "Untitled Agent"}`} />
              <MetaCell
                label="Status"
                value={
                  <span className="inline-flex items-center gap-1.5 text-green-700 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {deployStatus === "live" ? "Live" : "Draft"}
                  </span>
                }
              />
              <MetaCell
                label="Visibility"
                value={
                  d.visibility === "public"
                    ? "🌍 Public"
                    : d.visibility === "team"
                    ? "👥 Organization"
                    : "🔒 Private"
                }
              />
              <MetaCell
                label="LLM"
                value={
                  selectedLLM
                    ? `${providerMeta(selectedLLM.provider).label} · ${selectedLLM.config.defaultModel}`
                    : "None"
                }
              />
              <MetaCell
                label="Connectivity"
                value={
                  selectedMCP
                    ? `${selectedMCP.icon} ${selectedMCP.displayName}`
                    : selectedAPI
                    ? selectedAPI.name
                    : "None"
                }
              />
              <MetaCell label="Agent ID" value={<span className="font-mono">{agtId}</span>} />
            </div>

            {enabledToolNames.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Enabled {selectedMCP ? "Tools" : "Endpoints"}
                </p>
                <div className="space-y-1">
                  {enabledToolNames.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-green-600" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100">
              <Button size="sm" onClick={() => copyText(agentUrl, "Agent URL")}>
                <ExternalLink className="w-4 h-4 mr-1.5" /> Open Agent
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.success("Opening chat session (demo)")}
              >
                <MessageSquare className="w-4 h-4 mr-1.5" /> Chat with Agent
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push("/ai-studio/my-agents")}
              >
                View in My Agents
              </Button>
              {d.visibility === "public" && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (agentId) updateAgent(agentId, { visibility: "public" });
                    toast.success("Published to the Agent Marketplace!");
                    router.push("/ai-studio/marketplace");
                  }}
                >
                  <Globe className="w-4 h-4 mr-1.5" /> Publish to Marketplace
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Wizard nav (steps 1-4; Deploy and Success have their own buttons) */}
        {step < 4 && (
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
