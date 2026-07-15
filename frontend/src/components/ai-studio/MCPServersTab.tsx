"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Badge,
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
  KeyValueEditor,
  MetaCell,
  SecretInput,
  StatusBadge,
  TagsInput,
  Toggle,
  WizardProgress,
} from "./shared";
import {
  defaultMCPCredentials,
  defaultMCPSecurity,
  defaultMCPSettings,
  MCP_CATEGORY_TOOLS,
  mkTools,
  useAIStudioStore,
} from "@/lib/ai-studio-store";
import type {
  KeyValuePair,
  MCPAuthCredentials,
  MCPAuthType,
  MCPCategory,
  MCPConnectionSettings,
  MCPEnvironment,
  MCPRetryStrategy,
  MCPSecurityOptions,
  MCPServer,
  MCPTestResult,
  MCPTool,
  MCPToolPermission,
  MCPTransport,
} from "@/types/ai-studio";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Copy,
  Eye,
  Pencil,
  Play,
  Plus,
  Power,
  RefreshCw,
  Search,
  Server,
  Trash2,
  Wrench,
  XCircle,
} from "lucide-react";

const WIZARD_STEPS = [
  "Basic Information",
  "Connection",
  "Auth & Security",
  "Connection Settings",
  "Discover Tools",
  "Test & Save",
];

const CATEGORIES: { value: MCPCategory; label: string }[] = [
  { value: "filesystem", label: "Filesystem" },
  { value: "github", label: "GitHub" },
  { value: "gitlab", label: "GitLab" },
  { value: "slack", label: "Slack" },
  { value: "jira", label: "Jira" },
  { value: "browser", label: "Browser" },
  { value: "google-drive", label: "Google Drive" },
  { value: "notion", label: "Notion" },
  { value: "sharepoint", label: "SharePoint" },
  { value: "database", label: "Database" },
  { value: "salesforce", label: "Salesforce" },
  { value: "sap", label: "SAP" },
  { value: "microsoft-365", label: "Microsoft 365" },
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "confluence", label: "Confluence" },
  { value: "custom", label: "Custom" },
];

const TRANSPORTS: { value: MCPTransport; label: string }[] = [
  { value: "stdio", label: "stdio" },
  { value: "http", label: "HTTP" },
  { value: "https", label: "HTTPS" },
  { value: "sse", label: "SSE (Server Sent Events)" },
  { value: "websocket", label: "WebSocket" },
];

const AUTH_TYPES: { value: MCPAuthType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "api_key", label: "API Key" },
  { value: "bearer", label: "Bearer Token" },
  { value: "oauth", label: "OAuth 2.0" },
  { value: "jwt", label: "JWT" },
  { value: "basic", label: "Basic Authentication" },
  { value: "client_cert", label: "Client Certificate" },
];

const ENVIRONMENTS: { value: MCPEnvironment; label: string }[] = [
  { value: "development", label: "Development" },
  { value: "qa", label: "QA" },
  { value: "production", label: "Production" },
];

const RETRY_STRATEGIES: { value: MCPRetryStrategy; label: string }[] = [
  { value: "none", label: "None" },
  { value: "fixed", label: "Fixed" },
  { value: "exponential", label: "Exponential Backoff" },
];

const SERVER_ICONS = ["📦", "🐙", "📁", "💬", "🧭", "🗄️", "☁️", "🧩", "🔧", "🌐"];

const PERMISSION_STYLES: Record<MCPToolPermission, string> = {
  read: "bg-blue-100 text-blue-700",
  write: "bg-amber-100 text-amber-700",
  admin: "bg-red-100 text-red-700",
};

export function EnvironmentBadge({ env }: { env: MCPEnvironment }) {
  const map: Record<MCPEnvironment, { cls: string; label: string }> = {
    development: { cls: "bg-cyan-100 text-cyan-700", label: "Development" },
    qa: { cls: "bg-violet-100 text-violet-700", label: "QA" },
    production: { cls: "bg-emerald-100 text-emerald-700", label: "Production" },
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[env].cls}`}>
      {map[env].label}
    </span>
  );
}

export function PermissionBadge({ permission }: { permission: MCPToolPermission }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PERMISSION_STYLES[permission]}`}>
      {permission}
    </span>
  );
}

interface WizardState {
  // Step 1 — Basic Information
  name: string;
  displayName: string;
  description: string;
  category: MCPCategory;
  tags: string[];
  version: string;
  environment: MCPEnvironment;
  active: boolean;
  icon: string;
  // Step 2 — Connection
  transport: MCPTransport;
  endpointUrl: string;
  baseUrl: string;
  healthCheckEndpoint: string;
  command: string;
  workingDirectory: string;
  port: string;
  timeoutSeconds: number;
  retryCount: number;
  autoReconnect: boolean;
  // Step 3 — Auth & Security
  authType: MCPAuthType;
  credentials: MCPAuthCredentials;
  headersJson: string;
  envVars: KeyValuePair[];
  secretVars: KeyValuePair[];
  security: MCPSecurityOptions;
  certificate: string;
  // Step 4 — Connection Settings
  settings: MCPConnectionSettings;
  // Step 5 — Tools
  tools: MCPTool[];
}

const emptyWizard = (): WizardState => ({
  name: "",
  displayName: "",
  description: "",
  category: "filesystem",
  tags: [],
  version: "1.0.0",
  environment: "development",
  active: true,
  icon: "📦",
  transport: "stdio",
  endpointUrl: "",
  baseUrl: "",
  healthCheckEndpoint: "",
  command: "",
  workingDirectory: "",
  port: "",
  timeoutSeconds: 30,
  retryCount: 3,
  autoReconnect: true,
  authType: "none",
  credentials: defaultMCPCredentials(),
  headersJson: "",
  envVars: [],
  secretVars: [],
  security: defaultMCPSecurity(),
  certificate: "",
  settings: defaultMCPSettings(),
  tools: [],
});

const fromServer = (s: MCPServer): WizardState => ({
  name: s.name,
  displayName: s.displayName,
  description: s.description,
  category: s.category,
  tags: s.tags,
  version: s.version,
  environment: s.environment,
  active: s.status === "active",
  icon: s.icon,
  transport: s.transport,
  endpointUrl: s.endpointUrl,
  baseUrl: s.baseUrl,
  healthCheckEndpoint: s.healthCheckEndpoint,
  command: s.command,
  workingDirectory: s.workingDirectory,
  port: s.port,
  timeoutSeconds: s.timeoutSeconds,
  retryCount: s.retryCount,
  autoReconnect: s.autoReconnect,
  authType: s.authType,
  credentials: s.credentials,
  headersJson: s.headersJson,
  envVars: s.envVars,
  secretVars: s.secretVars,
  security: s.security,
  certificate: s.certificate,
  settings: s.settings,
  tools: s.tools,
});

export function MCPServersTab() {
  const { mcps, addMCP, updateMCP, removeMCP, duplicateMCP, syncMCPTools, testMCP } =
    useAIStudioStore();

  // Listing controls
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [envFilter, setEnvFilter] = useState("all");

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<MCPServer | null>(null);
  const [step, setStep] = useState(0);
  const [w, setW] = useState<WizardState>(emptyWizard());
  const [discovering, setDiscovering] = useState(false);
  const [discovered, setDiscovered] = useState(false);
  const [toolSearch, setToolSearch] = useState("");
  const [permFilter, setPermFilter] = useState<"all" | MCPToolPermission>("all");
  const [testPrompt, setTestPrompt] = useState("Find README.md in repository safal-ai.");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<MCPTestResult | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rowBusy, setRowBusy] = useState<string | null>(null);

  const patch = (p: Partial<WizardState>) => setW((prev) => ({ ...prev, ...p }));
  const patchCreds = (p: Partial<MCPAuthCredentials>) =>
    setW((prev) => ({ ...prev, credentials: { ...prev.credentials, ...p } }));
  const patchSecurity = (p: Partial<MCPSecurityOptions>) =>
    setW((prev) => ({ ...prev, security: { ...prev.security, ...p } }));
  const patchSettings = (p: Partial<MCPConnectionSettings>) =>
    setW((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }));

  const filtered = useMemo(
    () =>
      mcps.filter((m) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.displayName.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q);
        const matchCategory = categoryFilter === "all" || m.category === categoryFilter;
        const matchStatus = statusFilter === "all" || m.status === statusFilter;
        const matchEnv = envFilter === "all" || m.environment === envFilter;
        return matchSearch && matchCategory && matchStatus && matchEnv;
      }),
    [mcps, search, categoryFilter, statusFilter, envFilter]
  );

  const openCreate = () => {
    setEditingId(null);
    setW(emptyWizard());
    setStep(0);
    setDiscovered(false);
    setTestResult(null);
    setToolSearch("");
    setPermFilter("all");
    setWizardOpen(true);
  };

  const openEdit = (s: MCPServer, atStep = 0) => {
    setEditingId(s.id);
    setW(fromServer(s));
    setStep(atStep);
    setDiscovered(s.tools.length > 0);
    setTestResult(null);
    setToolSearch("");
    setPermFilter("all");
    setWizardOpen(true);
  };

  const resetWizard = () => {
    setW(editingId ? emptyWizard() : emptyWizard());
    setEditingId(null);
    setStep(0);
    setDiscovered(false);
    setTestResult(null);
    toast("Form reset", { icon: "↩️" });
  };

  // ----- Discover tools -----
  const discoverTools = async () => {
    setDiscovering(true);
    await new Promise((r) => setTimeout(r, 900));
    const fresh = mkTools(w.category).map((t) => {
      const existing = w.tools.find((x) => x.name === t.name);
      return existing ? { ...t, enabled: existing.enabled } : t;
    });
    patch({ tools: fresh });
    setDiscovered(true);
    setDiscovering(false);
    toast.success(`Discovered ${fresh.length} tools`);
  };

  const setAllTools = (enabled: boolean) =>
    patch({ tools: w.tools.map((t) => ({ ...t, enabled })) });

  const toggleTool = (toolId: string, enabled: boolean) =>
    patch({ tools: w.tools.map((t) => (t.id === toolId ? { ...t, enabled } : t)) });

  const visibleTools = useMemo(() => {
    const q = toolSearch.toLowerCase();
    return w.tools.filter(
      (t) =>
        (permFilter === "all" || t.permission === permFilter) &&
        (!q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    );
  }, [w.tools, toolSearch, permFilter]);

  const toolGroups = useMemo(() => {
    const groups: Record<string, MCPTool[]> = {};
    visibleTools.forEach((t) => {
      (groups[t.category] = groups[t.category] ?? []).push(t);
    });
    return groups;
  }, [visibleTools]);

  // ----- Validation -----
  const headersJsonValid = useMemo(() => {
    if (!w.headersJson.trim()) return true;
    try {
      JSON.parse(w.headersJson);
      return true;
    } catch {
      return false;
    }
  }, [w.headersJson]);

  const canNext = () => {
    if (step === 0)
      return (
        w.name.trim().length > 0 &&
        w.displayName.trim().length > 0 &&
        w.description.trim().length > 0
      );
    if (step === 1)
      return w.transport === "stdio"
        ? w.command.trim().length > 0
        : w.endpointUrl.trim().length > 0;
    if (step === 2) return headersJsonValid;
    return true;
  };

  // ----- Save -----
  const buildPayload = () => ({
    name: w.name.trim(),
    displayName: w.displayName.trim(),
    description: w.description.trim(),
    category: w.category,
    tags: w.tags,
    version: w.version,
    environment: w.environment,
    icon: w.icon,
    transport: w.transport,
    endpointUrl: w.endpointUrl.trim(),
    baseUrl: w.baseUrl.trim(),
    healthCheckEndpoint: w.healthCheckEndpoint.trim(),
    command: w.command.trim(),
    workingDirectory: w.workingDirectory.trim(),
    port: w.port,
    timeoutSeconds: w.timeoutSeconds,
    retryCount: w.retryCount,
    autoReconnect: w.autoReconnect,
    authType: w.authType,
    credentials: w.credentials,
    headersJson: w.headersJson,
    envVars: w.envVars,
    secretVars: w.secretVars,
    security: w.security,
    certificate: w.certificate,
    settings: w.settings,
    tools: w.tools,
    updatedAt: new Date().toISOString(),
  });

  const persistDraft = (): string => {
    let id = editingId;
    if (id) {
      updateMCP(id, buildPayload());
    } else {
      const created = addMCP({
        ...buildPayload(),
        serverVersion: "",
        protocolVersion: "",
        status: "inactive",
        health: "unknown",
        usedByAgentIds: [],
        lastTestedAt: null,
        lastSyncedAt: null,
        lastConnectedAt: null,
        createdBy: "You",
      });
      id = created.id;
      setEditingId(created.id);
    }
    return id;
  };

  const runWizardTest = async () => {
    setTesting(true);
    setTestResult(null);
    const id = persistDraft();
    const result = await testMCP(id);
    setTestResult(result);
    setTesting(false);
  };

  const saveServer = (asDraft = false) => {
    const id = persistDraft();
    if (asDraft) {
      updateMCP(id, { status: "inactive" });
      toast.success("MCP server saved as draft");
    } else {
      updateMCP(id, { status: w.active ? "active" : "inactive" });
      toast.success("MCP server saved");
    }
    setWizardOpen(false);
  };

  // ----- Row actions -----
  const rowTest = async (id: string) => {
    setRowBusy(id);
    const r = await testMCP(id);
    setRowBusy(null);
    if (r.connected) toast.success("MCP server connected");
    else toast.error("MCP connection failed");
  };

  const rowSync = async (id: string) => {
    setRowBusy(id);
    const count = await syncMCPTools(id);
    setRowBusy(null);
    toast.success(`Synced ${count} tools`);
  };

  return (
    <div className="space-y-4">
      {/* Top actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search MCP servers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            className="!py-2.5"
          />
        </div>
        <div className="w-44 flex-shrink-0">
          <Select
            options={[{ value: "all", label: "All Categories" }, ...CATEGORIES]}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
        <div className="w-44 flex-shrink-0">
          <Select
            options={[{ value: "all", label: "All Environments" }, ...ENVIRONMENTS]}
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="!py-2.5"
          />
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add New MCP Server
        </Button>
      </div>

      {/* Listing */}
      {filtered.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={<Server className="w-8 h-8" />}
            title="No MCP servers"
            description="Connect MCP servers to give your agents tools like file access, GitHub, Slack and more."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus className="w-4 h-4 mr-1.5" /> Add New MCP Server
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <Card key={m.id} padding="sm" hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {m.icon || "📦"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900">{m.displayName}</h3>
                    <span className="text-[11px] text-gray-400 font-mono">{m.name}</span>
                    <StatusBadge status={m.status} />
                    <HealthBadge health={m.health} />
                    <EnvironmentBadge env={m.environment} />
                  </div>
                  <p className="text-xs text-gray-500 mb-3 truncate">
                    {m.description || "No description"}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-4 gap-y-2">
                    <MetaCell
                      label="Category"
                      value={CATEGORIES.find((c) => c.value === m.category)?.label ?? m.category}
                    />
                    <MetaCell label="Transport" value={m.transport} />
                    <MetaCell
                      label="Auth"
                      value={AUTH_TYPES.find((a) => a.value === m.authType)?.label}
                    />
                    <MetaCell
                      label="Tools"
                      value={`${m.tools.filter((t) => t.enabled).length} of ${m.tools.length}`}
                    />
                    <MetaCell label="Used By" value={`${m.usedByAgentIds.length} agents`} />
                    <MetaCell label="Last Tested" value={fmtDate(m.lastTestedAt)} />
                    <MetaCell label="Last Synced" value={fmtDate(m.lastSyncedAt)} />
                    <MetaCell label="Updated" value={fmtDate(m.updatedAt)} />
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    title="View"
                    onClick={() => setViewing(m)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => openEdit(m)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    title="Test Connection"
                    onClick={() => rowTest(m.id)}
                    disabled={rowBusy === m.id}
                    className="p-2 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg disabled:opacity-40"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    title="Sync Tools"
                    onClick={() => rowSync(m.id)}
                    disabled={rowBusy === m.id}
                    className="p-2 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg disabled:opacity-40"
                  >
                    <RefreshCw className={`w-4 h-4 ${rowBusy === m.id ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    title={m.status === "active" ? "Disable" : "Enable"}
                    onClick={() =>
                      updateMCP(m.id, {
                        status: m.status === "active" ? "inactive" : "active",
                        updatedAt: new Date().toISOString(),
                      })
                    }
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    title="Duplicate"
                    onClick={() => {
                      duplicateMCP(m.id);
                      toast.success("MCP server duplicated");
                    }}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setDeleteId(m.id)}
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

      {/* View modal */}
      <Modal
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `${viewing.icon} ${viewing.displayName}` : ""}
        description={viewing?.description}
        size="lg"
      >
        {viewing && (
          <ModalBody className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <MetaCell label="Internal Name" value={viewing.name} />
              <MetaCell label="Version" value={viewing.version || "-"} />
              <MetaCell label="Environment" value={<EnvironmentBadge env={viewing.environment} />} />
              <MetaCell label="Category" value={viewing.category} />
              <MetaCell label="Transport" value={viewing.transport} />
              <MetaCell
                label="Auth"
                value={AUTH_TYPES.find((a) => a.value === viewing.authType)?.label}
              />
              <MetaCell
                label={viewing.transport === "stdio" ? "Command" : "Endpoint URL"}
                value={viewing.transport === "stdio" ? viewing.command : viewing.endpointUrl}
              />
              <MetaCell label="Server Version" value={viewing.serverVersion || "-"} />
              <MetaCell label="Protocol" value={viewing.protocolVersion || "-"} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Exposed Tools ({viewing.tools.filter((t) => t.enabled).length} of{" "}
                {viewing.tools.length} enabled)
              </p>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {viewing.tools.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400 truncate">{t.description}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">{t.category}</span>
                    <PermissionBadge permission={t.permission} />
                    {t.enabled ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
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
            removeMCP(deleteId);
            toast.success("MCP server deleted");
          }
        }}
        title="Delete MCP server?"
        message="Agents using this server will lose access to its tools. This action cannot be undone."
      />

      {/* ===== 6-step wizard ===== */}
      <Modal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title={editingId ? "Edit MCP Server" : "Add New MCP Server"}
        size="xl"
      >
        <ModalBody className="space-y-5">
          <WizardProgress steps={WIZARD_STEPS} current={step} onStepClick={setStep} />

          {/* Step 1 — Basic Information */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Internal Server Name *"
                  value={w.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. github-mcp-prod"
                  className="font-mono text-sm"
                />
                <Input
                  label="Display Name *"
                  value={w.displayName}
                  onChange={(e) => patch({ displayName: e.target.value })}
                  placeholder="e.g. GitHub MCP"
                />
              </div>
              <Textarea
                label="Description *"
                value={w.description}
                onChange={(e) => patch({ description: e.target.value })}
                rows={2}
                placeholder="What does this server provide?"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Category *"
                  options={CATEGORIES}
                  value={w.category}
                  onChange={(e) => patch({ category: e.target.value as MCPCategory })}
                />
                <Input
                  label="Version"
                  value={w.version}
                  onChange={(e) => patch({ version: e.target.value })}
                  placeholder="1.0.0"
                />
                <Select
                  label="Environment *"
                  options={ENVIRONMENTS}
                  value={w.environment}
                  onChange={(e) => patch({ environment: e.target.value as MCPEnvironment })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Server Icon
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SERVER_ICONS.map((ic) => (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => patch({ icon: ic })}
                        className={cn(
                          "w-9 h-9 rounded-lg text-lg flex items-center justify-center border-2 transition-all",
                          w.icon === ic
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {ic}
                      </button>
                    ))}
                  </div>
                </div>
                <Toggle
                  label="Status *"
                  description={w.active ? "Active" : "Inactive"}
                  checked={w.active}
                  onChange={(active) => patch({ active })}
                />
              </div>
              <TagsInput tags={w.tags} onChange={(tags) => patch({ tags })} />
            </div>
          )}

          {/* Step 2 — Connection Configuration */}
          {step === 1 && (
            <div className="space-y-4">
              <Select
                label="Transport Type"
                options={TRANSPORTS}
                value={w.transport}
                onChange={(e) => patch({ transport: e.target.value as MCPTransport })}
              />
              {w.transport === "stdio" ? (
                <>
                  <Input
                    label="Command *"
                    value={w.command}
                    onChange={(e) => patch({ command: e.target.value })}
                    placeholder="python server.py — or — docker run github-mcp"
                    className="font-mono text-sm"
                  />
                  <Input
                    label="Working Directory"
                    value={w.workingDirectory}
                    onChange={(e) => patch({ workingDirectory: e.target.value })}
                    placeholder="/workspace"
                    className="font-mono text-sm"
                  />
                </>
              ) : (
                <Input
                  label="MCP Endpoint URL *"
                  value={w.endpointUrl}
                  onChange={(e) => patch({ endpointUrl: e.target.value })}
                  placeholder="https://company.com/mcp"
                  className="font-mono text-sm"
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Base URL"
                  value={w.baseUrl}
                  onChange={(e) => patch({ baseUrl: e.target.value })}
                  placeholder="Optional"
                  className="font-mono text-sm"
                />
                <Input
                  label="Health Check Endpoint"
                  value={w.healthCheckEndpoint}
                  onChange={(e) => patch({ healthCheckEndpoint: e.target.value })}
                  placeholder="/health (optional)"
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Port"
                  value={w.port}
                  onChange={(e) => patch({ port: e.target.value })}
                  placeholder="Optional"
                />
                <Input
                  label="Timeout (seconds)"
                  type="number"
                  value={w.timeoutSeconds}
                  min={1}
                  onChange={(e) => patch({ timeoutSeconds: Number(e.target.value) })}
                />
                <Input
                  label="Retry Count"
                  type="number"
                  value={w.retryCount}
                  min={0}
                  max={10}
                  onChange={(e) => patch({ retryCount: Number(e.target.value) })}
                />
              </div>
              <Toggle
                label="Auto Reconnect"
                description="Reconnect automatically if the connection drops"
                checked={w.autoReconnect}
                onChange={(autoReconnect) => patch({ autoReconnect })}
              />
            </div>
          )}

          {/* Step 3 — Authentication & Security */}
          {step === 2 && (
            <div className="space-y-4">
              <Select
                label="Authentication Type"
                options={AUTH_TYPES}
                value={w.authType}
                onChange={(e) => patch({ authType: e.target.value as MCPAuthType })}
              />

              {/* Dynamic auth fields */}
              {w.authType === "api_key" && (
                <SecretInput
                  label="API Key"
                  required
                  value={w.credentials.apiKey}
                  onChange={(apiKey) => patchCreds({ apiKey })}
                  placeholder="Enter API key"
                />
              )}
              {(w.authType === "bearer" || w.authType === "jwt") && (
                <SecretInput
                  label={w.authType === "jwt" ? "JWT Token" : "Bearer Token"}
                  required
                  value={w.credentials.bearerToken}
                  onChange={(bearerToken) => patchCreds({ bearerToken })}
                  placeholder="Enter token"
                />
              )}
              {w.authType === "basic" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Username"
                    value={w.credentials.username}
                    onChange={(e) => patchCreds({ username: e.target.value })}
                  />
                  <SecretInput
                    label="Password"
                    value={w.credentials.password}
                    onChange={(password) => patchCreds({ password })}
                  />
                </div>
              )}
              {w.authType === "oauth" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Client ID"
                    value={w.credentials.clientId}
                    onChange={(e) => patchCreds({ clientId: e.target.value })}
                  />
                  <SecretInput
                    label="Client Secret"
                    value={w.credentials.clientSecret}
                    onChange={(clientSecret) => patchCreds({ clientSecret })}
                  />
                  <SecretInput
                    label="Access Token"
                    value={w.credentials.accessToken}
                    onChange={(accessToken) => patchCreds({ accessToken })}
                  />
                  <SecretInput
                    label="Refresh Token"
                    value={w.credentials.refreshToken}
                    onChange={(refreshToken) => patchCreds({ refreshToken })}
                  />
                </div>
              )}
              {w.authType === "client_cert" && (
                <Textarea
                  label="Client Certificate (PEM)"
                  value={w.certificate}
                  onChange={(e) => patch({ certificate: e.target.value })}
                  rows={4}
                  placeholder="-----BEGIN CERTIFICATE-----"
                  className="font-mono text-xs"
                />
              )}

              <div>
                <Textarea
                  label="Additional Headers (JSON)"
                  value={w.headersJson}
                  onChange={(e) => patch({ headersJson: e.target.value })}
                  rows={3}
                  placeholder={`{\n  "x-api-key": "******",\n  "tenant": "production"\n}`}
                  className="font-mono text-xs"
                />
                {!headersJsonValid && (
                  <p className="mt-1 text-xs text-red-600">Invalid JSON</p>
                )}
              </div>

              <KeyValueEditor
                label="Environment Variables"
                pairs={w.envVars}
                onChange={(envVars) => patch({ envVars })}
                keyPlaceholder="DATABASE_URL"
              />
              <KeyValueEditor
                label="Secret Variables (encrypted)"
                pairs={w.secretVars}
                onChange={(secretVars) => patch({ secretVars })}
                keyPlaceholder="GITHUB_TOKEN"
                secret
              />

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-1">Security Options</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6">
                  <Toggle
                    label="Verify SSL Certificates"
                    checked={w.security.verifySSL}
                    onChange={(verifySSL) => patchSecurity({ verifySSL })}
                  />
                  <Toggle
                    label="Allow Self-Signed Certificates"
                    checked={w.security.allowSelfSigned}
                    onChange={(allowSelfSigned) => patchSecurity({ allowSelfSigned })}
                  />
                  <Toggle
                    label="Encrypt Stored Credentials"
                    checked={w.security.encryptCredentials}
                    onChange={(encryptCredentials) => patchSecurity({ encryptCredentials })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Connection Settings */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Advanced Configuration</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <Toggle
                    label="Auto Sync Tools on Connection"
                    checked={w.settings.autoSyncTools}
                    onChange={(autoSyncTools) => patchSettings({ autoSyncTools })}
                  />
                  <Toggle
                    label="Enable Health Monitoring"
                    checked={w.settings.healthMonitoring}
                    onChange={(healthMonitoring) => patchSettings({ healthMonitoring })}
                  />
                  <Toggle
                    label="Enable Connection Logging"
                    checked={w.settings.connectionLogging}
                    onChange={(connectionLogging) => patchSettings({ connectionLogging })}
                  />
                  <Toggle
                    label="Automatically Refresh Tool List"
                    checked={w.settings.autoRefreshToolList}
                    onChange={(autoRefreshToolList) => patchSettings({ autoRefreshToolList })}
                  />
                  <Toggle
                    label="Enable Tool Usage Tracking"
                    checked={w.settings.toolUsageTracking}
                    onChange={(toolUsageTracking) => patchSettings({ toolUsageTracking })}
                  />
                  <Toggle
                    label="Enable Rate Limiting"
                    checked={w.settings.rateLimiting}
                    onChange={(rateLimiting) => patchSettings({ rateLimiting })}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-3">Connection Limits</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input
                    label="Max Concurrent Requests"
                    type="number"
                    value={w.settings.maxConcurrentRequests}
                    min={1}
                    onChange={(e) =>
                      patchSettings({ maxConcurrentRequests: Number(e.target.value) })
                    }
                  />
                  <Input
                    label="Max Tool Calls / Request"
                    type="number"
                    value={w.settings.maxToolCallsPerRequest}
                    min={1}
                    onChange={(e) =>
                      patchSettings({ maxToolCallsPerRequest: Number(e.target.value) })
                    }
                  />
                  <Input
                    label="Connection Timeout (sec)"
                    type="number"
                    value={w.settings.connectionTimeoutSeconds}
                    min={1}
                    onChange={(e) =>
                      patchSettings({ connectionTimeoutSeconds: Number(e.target.value) })
                    }
                  />
                  <Select
                    label="Retry Strategy"
                    options={RETRY_STRATEGIES}
                    value={w.settings.retryStrategy}
                    onChange={(e) =>
                      patchSettings({ retryStrategy: e.target.value as MCPRetryStrategy })
                    }
                  />
                  <Input
                    label="Retry Attempts"
                    type="number"
                    value={w.settings.retryAttempts}
                    min={0}
                    max={10}
                    onChange={(e) => patchSettings({ retryAttempts: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Discover Tools */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" onClick={discoverTools} isLoading={discovering}>
                  <Wrench className="w-4 h-4 mr-1.5" /> Discover Tools
                </Button>
                {discovered && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-gray-800">
                      {w.icon} {w.displayName || "MCP Server"}
                    </span>
                    <Badge variant="gray">v{w.version || "1.0.0"}</Badge>
                    <HealthBadge health="healthy" />
                    <span className="text-gray-500">{w.tools.length} tools available</span>
                  </div>
                )}
              </div>

              {w.tools.length === 0 ? (
                <p className="text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg px-4 py-6 text-center">
                  Click &quot;Discover Tools&quot; — Safal AI connects to the MCP server and
                  retrieves all available tools automatically.
                </p>
              ) : (
                <>
                  {/* Tool actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex-1 min-w-[160px]">
                      <Input
                        placeholder="Search tools..."
                        value={toolSearch}
                        onChange={(e) => setToolSearch(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                        className="!py-2 text-sm"
                      />
                    </div>
                    {(["all", "read", "write", "admin"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPermFilter(p)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize",
                          permFilter === p
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {p === "all" ? "All" : p}
                      </button>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setAllTools(true)}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setAllTools(false)}>
                      Deselect All
                    </Button>
                  </div>

                  {/* Grouped tool table */}
                  <div className="space-y-4">
                    {Object.entries(toolGroups).map(([group, tools]) => (
                      <div key={group}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                          {group}
                        </p>
                        <div className="space-y-1.5">
                          {tools.map((t) => (
                            <div
                              key={t.id}
                              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 bg-white"
                            >
                              <input
                                type="checkbox"
                                checked={t.enabled}
                                onChange={(e) => toggleTool(t.id, e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">{t.name}</p>
                                <p className="text-xs text-gray-400 truncate">{t.description}</p>
                              </div>
                              <span className="text-[11px] text-gray-400 font-mono hidden sm:block">
                                v{t.version}
                              </span>
                              <PermissionBadge permission={t.permission} />
                              <span
                                className={cn(
                                  "text-[10px] font-semibold rounded-full px-2 py-0.5",
                                  t.enabled
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                                )}
                              >
                                {t.enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {visibleTools.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No tools match your search.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 6 — Test & Save */}
          {step === 5 && (
            <div className="space-y-4">
              <Textarea
                label="Test Prompt"
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                rows={2}
              />
              <Button size="sm" onClick={runWizardTest} isLoading={testing}>
                <Play className="w-4 h-4 mr-1.5" />
                {testResult ? "Test Again" : "Test Connection"}
              </Button>

              {testResult && (
                <div
                  className={cn(
                    "rounded-xl border p-4 space-y-4",
                    testResult.connected
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {testResult.connected ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        testResult.connected ? "text-green-800" : "text-red-800"
                      )}
                    >
                      {testResult.connected ? "Connected" : "Connection failed"}
                    </span>
                    <HealthBadge health={testResult.health} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <MetaCell label="Server Version" value={testResult.serverVersion} />
                    <MetaCell label="Protocol Version" value={testResult.protocolVersion} />
                    <MetaCell
                      label="Authentication"
                      value={testResult.authSuccessful ? "Successful" : "Failed"}
                    />
                    <MetaCell label="Available Tools" value={testResult.toolCount} />
                    <MetaCell label="Latency" value={`${testResult.latencyMs} ms`} />
                    <MetaCell label="Execution Time" value={`${testResult.executionTimeSec} sec`} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                      Connection Logs
                    </p>
                    <div className="font-mono text-xs bg-gray-900 text-gray-100 rounded-lg p-3 space-y-1">
                      {testResult.logs.map((log, i) => (
                        <div key={i} className="flex gap-2">
                          <span className={testResult.connected ? "text-green-400" : "text-red-400"}>
                            {testResult.connected ? "✓" : "✗"}
                          </span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          {step === WIZARD_STEPS.length - 1 ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => setWizardOpen(false)}>
                Cancel
              </Button>
              <Button variant="ghost" size="sm" onClick={resetWizard}>
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={() => saveServer(true)}>
                Save as Draft
              </Button>
              <Button size="sm" onClick={() => saveServer(false)}>
                Save Server
              </Button>
            </>
          ) : (
            <>
              {step > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              <Button size="sm" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                Next
              </Button>
            </>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
