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
  KeyValueEditor,
  LogoAvatar,
  MetaCell,
  SecretInput,
  StatusBadge,
  TagsInput,
  Toggle,
  WizardProgress,
} from "./shared";
import { MCP_CATEGORY_TOOLS, useAIStudioStore } from "@/lib/ai-studio-store";
import type {
  KeyValuePair,
  MCPAuthType,
  MCPCategory,
  MCPServer,
  MCPTool,
  MCPTransport,
} from "@/types/ai-studio";
import {
  CheckCircle,
  Eye,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  Server,
  Trash2,
  Wrench,
  XCircle,
} from "lucide-react";

const WIZARD_STEPS = ["Basic Details", "Connection", "Authentication", "Discover Tools", "Test Server"];

const CATEGORIES: { value: MCPCategory; label: string }[] = [
  { value: "filesystem", label: "Filesystem" },
  { value: "github", label: "GitHub" },
  { value: "jira", label: "Jira" },
  { value: "slack", label: "Slack" },
  { value: "browser", label: "Browser" },
  { value: "google-drive", label: "Google Drive" },
  { value: "notion", label: "Notion" },
  { value: "database", label: "Database" },
  { value: "sharepoint", label: "SharePoint" },
  { value: "confluence", label: "Confluence" },
  { value: "custom", label: "Custom" },
];

const TRANSPORTS: { value: MCPTransport; label: string }[] = [
  { value: "stdio", label: "stdio" },
  { value: "http", label: "HTTP" },
  { value: "https", label: "HTTPS" },
  { value: "sse", label: "SSE" },
  { value: "websocket", label: "WebSocket" },
];

const AUTH_TYPES: { value: MCPAuthType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "api_key", label: "API Key" },
  { value: "bearer", label: "Bearer Token" },
  { value: "oauth", label: "OAuth" },
  { value: "jwt", label: "JWT" },
  { value: "basic", label: "Basic Auth" },
];

interface WizardState {
  name: string;
  description: string;
  tags: string[];
  category: MCPCategory;
  transport: MCPTransport;
  serverUrl: string;
  command: string;
  workingDirectory: string;
  envVars: KeyValuePair[];
  secretVars: KeyValuePair[];
  authType: MCPAuthType;
  authValue: string;
  headers: KeyValuePair[];
  certificate: string;
  tools: MCPTool[];
}

const emptyWizard = (): WizardState => ({
  name: "",
  description: "",
  tags: [],
  category: "filesystem",
  transport: "stdio",
  serverUrl: "",
  command: "",
  workingDirectory: "",
  envVars: [],
  secretVars: [],
  authType: "none",
  authValue: "",
  headers: [],
  certificate: "",
  tools: [],
});

const fromServer = (s: MCPServer): WizardState => ({
  name: s.name,
  description: s.description,
  tags: s.tags,
  category: s.category,
  transport: s.transport,
  serverUrl: s.serverUrl,
  command: s.command,
  workingDirectory: s.workingDirectory,
  envVars: s.envVars,
  secretVars: s.secretVars,
  authType: s.authType,
  authValue: s.authValue,
  headers: s.headers,
  certificate: s.certificate,
  tools: s.tools,
});

export function MCPServersTab() {
  const { mcps, addMCP, updateMCP, removeMCP, testMCP } = useAIStudioStore();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<MCPServer | null>(null);
  const [step, setStep] = useState(0);
  const [w, setW] = useState<WizardState>(emptyWizard());
  const [discovering, setDiscovering] = useState(false);
  const [discovered, setDiscovered] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | {
    success: boolean;
    responseTimeMs: number;
    toolCount: number;
  }>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [rowBusy, setRowBusy] = useState<string | null>(null);

  const patch = (p: Partial<WizardState>) => setW((prev) => ({ ...prev, ...p }));

  const filtered = useMemo(
    () =>
      mcps.filter((m) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q || m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
        const matchCategory = categoryFilter === "all" || m.category === categoryFilter;
        const matchStatus = statusFilter === "all" || m.status === statusFilter;
        return matchSearch && matchCategory && matchStatus;
      }),
    [mcps, search, categoryFilter, statusFilter]
  );

  const openCreate = () => {
    setEditingId(null);
    setW(emptyWizard());
    setStep(0);
    setDiscovered(false);
    setTestResult(null);
    setWizardOpen(true);
  };

  const openEdit = (s: MCPServer) => {
    setEditingId(s.id);
    setW(fromServer(s));
    setStep(0);
    setDiscovered(s.tools.length > 0);
    setTestResult(null);
    setWizardOpen(true);
  };

  const discoverTools = async () => {
    setDiscovering(true);
    await new Promise((r) => setTimeout(r, 900));
    const defs = MCP_CATEGORY_TOOLS[w.category] ?? MCP_CATEGORY_TOOLS.custom;
    patch({
      tools: defs.map((t, i) => {
        const existing = w.tools.find((x) => x.name === t.name);
        return {
          id: `tool_${w.category}_${i}`,
          name: t.name,
          description: t.description,
          enabled: existing ? existing.enabled : !/delete|remove/i.test(t.name),
        };
      }),
    });
    setDiscovered(true);
    setDiscovering(false);
    toast.success(`Discovered ${defs.length} tools`);
  };

  const buildPayload = () => ({
    name: w.name.trim(),
    description: w.description.trim(),
    tags: w.tags,
    category: w.category,
    transport: w.transport,
    serverUrl: w.serverUrl,
    command: w.command,
    workingDirectory: w.workingDirectory,
    envVars: w.envVars,
    secretVars: w.secretVars,
    authType: w.authType,
    authValue: w.authValue,
    headers: w.headers,
    certificate: w.certificate,
    tools: w.tools,
  });

  const runWizardTest = async () => {
    setTesting(true);
    setTestResult(null);
    let id = editingId;
    if (id) {
      updateMCP(id, buildPayload());
    } else {
      const created = addMCP({
        ...buildPayload(),
        status: "inactive",
        health: "unknown",
        usedByAgentIds: [],
        lastConnectedAt: null,
        createdBy: "You",
      });
      id = created.id;
      setEditingId(created.id);
    }
    const result = await testMCP(id);
    setTestResult(result);
    setTesting(false);
  };

  const saveServer = () => {
    if (editingId) {
      updateMCP(editingId, buildPayload());
    } else {
      addMCP({
        ...buildPayload(),
        status: "inactive",
        health: "unknown",
        usedByAgentIds: [],
        lastConnectedAt: null,
        createdBy: "You",
      });
    }
    toast.success("MCP server saved");
    setWizardOpen(false);
  };

  const canNext = () => {
    if (step === 0) return w.name.trim().length > 0;
    if (step === 1) return w.transport === "stdio" ? w.command.trim().length > 0 : w.serverUrl.trim().length > 0;
    return true;
  };

  const rowTest = async (id: string) => {
    setRowBusy(id);
    const r = await testMCP(id);
    setRowBusy(null);
    if (r.success) toast.success("MCP server connected");
    else toast.error("MCP connection failed");
  };

  return (
    <div className="space-y-4">
      {/* Top actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search servers..."
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
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add MCP Server
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
                <Plus className="w-4 h-4 mr-1.5" /> Add MCP Server
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <Card key={m.id} padding="sm" hover>
              <div className="flex items-start gap-4">
                <LogoAvatar label={m.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900">{m.name}</h3>
                    <StatusBadge status={m.status} />
                    <HealthBadge health={m.health} />
                  </div>
                  <p className="text-xs text-gray-500 mb-3 truncate">
                    {m.description || "No description"}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2">
                    <MetaCell
                      label="Category"
                      value={CATEGORIES.find((c) => c.value === m.category)?.label ?? m.category}
                    />
                    <MetaCell label="Transport" value={m.transport} />
                    <MetaCell
                      label="Tools"
                      value={`${m.tools.filter((t) => t.enabled).length} of ${m.tools.length} enabled`}
                    />
                    <MetaCell label="Used By" value={`${m.usedByAgentIds.length} agents`} />
                    <MetaCell label="Last Connected" value={fmtDate(m.lastConnectedAt)} />
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
                    title="Discover Tools"
                    onClick={() => {
                      openEdit(m);
                      setStep(3);
                    }}
                    className="p-2 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg"
                  >
                    <Wrench className="w-4 h-4" />
                  </button>
                  <button
                    title="Test"
                    onClick={() => rowTest(m.id)}
                    disabled={rowBusy === m.id}
                    className="p-2 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg disabled:opacity-40"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    title="Refresh"
                    onClick={() => rowTest(m.id)}
                    disabled={rowBusy === m.id}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-40"
                  >
                    <RefreshCw className={`w-4 h-4 ${rowBusy === m.id ? "animate-spin" : ""}`} />
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
        title={viewing?.name}
        description={viewing?.description}
        size="lg"
      >
        {viewing && (
          <ModalBody className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <MetaCell label="Category" value={viewing.category} />
              <MetaCell label="Transport" value={viewing.transport} />
              <MetaCell
                label={viewing.transport === "stdio" ? "Command" : "Server URL"}
                value={viewing.transport === "stdio" ? viewing.command : viewing.serverUrl}
              />
              <MetaCell label="Auth" value={AUTH_TYPES.find((a) => a.value === viewing.authType)?.label} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Exposed Tools</p>
              <div className="space-y-1.5">
                {viewing.tools.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <div>
                      <p className="text-sm text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.description}</p>
                    </div>
                    {t.enabled ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-300" />
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

      {/* Wizard */}
      <Modal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title={editingId ? "Edit MCP Server" : "Add MCP Server"}
        size="xl"
      >
        <ModalBody className="space-y-5">
          <WizardProgress steps={WIZARD_STEPS} current={step} onStepClick={setStep} />

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Server Name *"
                  value={w.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. GitHub MCP"
                />
                <Select
                  label="Category"
                  options={CATEGORIES}
                  value={w.category}
                  onChange={(e) => patch({ category: e.target.value as MCPCategory })}
                />
              </div>
              <Textarea
                label="Description"
                value={w.description}
                onChange={(e) => patch({ description: e.target.value })}
                rows={2}
                placeholder="What does this server provide?"
              />
              <TagsInput tags={w.tags} onChange={(tags) => patch({ tags })} />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Select
                label="Transport"
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
                    placeholder="npx -y @modelcontextprotocol/server-filesystem /path"
                  />
                  <Input
                    label="Working Directory"
                    value={w.workingDirectory}
                    onChange={(e) => patch({ workingDirectory: e.target.value })}
                    placeholder="/workspace"
                  />
                </>
              ) : (
                <Input
                  label="Server URL *"
                  value={w.serverUrl}
                  onChange={(e) => patch({ serverUrl: e.target.value })}
                  placeholder="https://mcp.example.com/sse"
                />
              )}
              <KeyValueEditor
                label="Environment Variables"
                pairs={w.envVars}
                onChange={(envVars) => patch({ envVars })}
                keyPlaceholder="VAR_NAME"
              />
              <KeyValueEditor
                label="Secret Variables"
                pairs={w.secretVars}
                onChange={(secretVars) => patch({ secretVars })}
                keyPlaceholder="SECRET_NAME"
                secret
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Select
                label="Authentication"
                options={AUTH_TYPES}
                value={w.authType}
                onChange={(e) => patch({ authType: e.target.value as MCPAuthType })}
              />
              {w.authType !== "none" && (
                <SecretInput
                  label={AUTH_TYPES.find((a) => a.value === w.authType)?.label ?? "Credential"}
                  value={w.authValue}
                  onChange={(authValue) => patch({ authValue })}
                  placeholder="Enter credential"
                />
              )}
              <KeyValueEditor
                label="Headers"
                pairs={w.headers}
                onChange={(headers) => patch({ headers })}
                keyPlaceholder="Header-Name"
              />
              <Textarea
                label="Certificates (Optional)"
                value={w.certificate}
                onChange={(e) => patch({ certificate: e.target.value })}
                rows={3}
                placeholder="-----BEGIN CERTIFICATE-----"
                className="font-mono text-xs"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Button size="sm" onClick={discoverTools} isLoading={discovering}>
                  <Wrench className="w-4 h-4 mr-1.5" /> Discover Tools
                </Button>
                {discovered && (
                  <span className="text-sm text-gray-500">
                    {w.tools.length} tools found · {w.tools.filter((t) => t.enabled).length} enabled
                  </span>
                )}
              </div>
              {w.tools.length === 0 ? (
                <p className="text-sm text-gray-400 border border-dashed border-gray-200 rounded-lg px-4 py-6 text-center">
                  Click &quot;Discover Tools&quot; to list the tools exposed by this MCP server.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    Select only the tools this connection may expose to agents.
                  </p>
                  {w.tools.map((t, i) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between px-4 py-2.5 rounded-lg border border-gray-200 bg-white"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.description}</p>
                      </div>
                      <Toggle
                        checked={t.enabled}
                        onChange={(v) =>
                          patch({
                            tools: w.tools.map((x, idx) =>
                              idx === i ? { ...x, enabled: v } : x
                            ),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Button size="sm" onClick={runWizardTest} isLoading={testing}>
                <Play className="w-4 h-4 mr-1.5" /> Test MCP
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
                    <span
                      className={`text-sm font-semibold ${
                        testResult.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {testResult.success ? "Connected" : "Connection failed"}
                    </span>
                    <HealthBadge health={testResult.success ? "healthy" : "down"} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <MetaCell label="Available Tools" value={testResult.toolCount} />
                    <MetaCell label="Response Time" value={`${testResult.responseTimeMs} ms`} />
                    <MetaCell label="Transport" value={w.transport} />
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
            <Button size="sm" onClick={saveServer}>
              Save MCP
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
