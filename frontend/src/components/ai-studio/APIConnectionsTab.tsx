"use client";

import { useMemo, useRef, useState } from "react";
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
  KeyValueEditor,
  LogoAvatar,
  MetaCell,
  SecretInput,
  StatusBadge,
  TagsInput,
  Toggle,
  WizardProgress,
} from "./shared";
import { useAIStudioStore } from "@/lib/ai-studio-store";
import type {
  APIAuthType,
  APIConnection,
  APIEndpoint,
  HTTPMethod,
  KeyValuePair,
} from "@/types/ai-studio";
import {
  CheckCircle,
  Copy,
  Eye,
  FileUp,
  Globe,
  Pencil,
  Play,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

const WIZARD_STEPS = ["Basic Details", "Authentication", "Import Endpoints", "Test API"];

const AUTH_TYPES: { value: APIAuthType; label: string }[] = [
  { value: "api_key", label: "API Key" },
  { value: "bearer", label: "Bearer Token" },
  { value: "oauth", label: "OAuth" },
  { value: "jwt", label: "JWT" },
  { value: "basic", label: "Basic Authentication" },
];

const METHODS: HTTPMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const METHOD_COLORS: Record<HTTPMethod, string> = {
  GET: "bg-blue-100 text-blue-700",
  POST: "bg-green-100 text-green-700",
  PUT: "bg-amber-100 text-amber-700",
  PATCH: "bg-purple-100 text-purple-700",
  DELETE: "bg-red-100 text-red-700",
};

const API_CATEGORIES = [
  "Payments",
  "CRM",
  "Communication",
  "Analytics",
  "E-commerce",
  "Internal",
  "Other",
];

interface WizardState {
  name: string;
  description: string;
  category: string;
  tags: string[];
  baseUrl: string;
  authType: APIAuthType;
  authValue: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  secretVars: KeyValuePair[];
  endpoints: APIEndpoint[];
}

const emptyWizard = (): WizardState => ({
  name: "",
  description: "",
  category: "Other",
  tags: [],
  baseUrl: "",
  authType: "api_key",
  authValue: "",
  headers: [],
  queryParams: [],
  secretVars: [],
  endpoints: [],
});

const fromConnection = (c: APIConnection): WizardState => ({
  name: c.name,
  description: c.description,
  category: c.category,
  tags: c.tags,
  baseUrl: c.baseUrl,
  authType: c.authType,
  authValue: c.authValue,
  headers: c.headers,
  queryParams: c.queryParams,
  secretVars: c.secretVars,
  endpoints: c.endpoints,
});

let epCounter = 0;
const newEndpointId = () => `ep_${Date.now().toString(36)}_${epCounter++}`;

export function APIConnectionsTab() {
  const { apis, addAPI, updateAPI, removeAPI, duplicateAPI } = useAIStudioStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<APIConnection | null>(null);
  const [step, setStep] = useState(0);
  const [w, setW] = useState<WizardState>(emptyWizard());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // manual endpoint draft
  const [epMethod, setEpMethod] = useState<HTTPMethod>("GET");
  const [epPath, setEpPath] = useState("");
  const [epDesc, setEpDesc] = useState("");

  // test step
  const [testEndpointId, setTestEndpointId] = useState("");
  const [testMethod, setTestMethod] = useState<HTTPMethod>("GET");
  const [testBody, setTestBody] = useState("");
  const [testHeaders, setTestHeaders] = useState("");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | {
    statusCode: number;
    body: string;
    responseTimeMs: number;
  }>(null);

  const patch = (p: Partial<WizardState>) => setW((prev) => ({ ...prev, ...p }));

  const filtered = useMemo(
    () =>
      apis.filter((a) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || a.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [apis, search, statusFilter]
  );

  const openCreate = () => {
    setEditingId(null);
    setW(emptyWizard());
    setStep(0);
    setTestResult(null);
    setWizardOpen(true);
  };

  const openEdit = (c: APIConnection) => {
    setEditingId(c.id);
    setW(fromConnection(c));
    setStep(0);
    setTestResult(null);
    setWizardOpen(true);
  };

  const importOpenAPI = async (file: File) => {
    try {
      const text = await file.text();
      const doc = JSON.parse(text);
      const eps: APIEndpoint[] = [];
      if (doc.paths && typeof doc.paths === "object") {
        for (const [path, ops] of Object.entries<any>(doc.paths)) {
          for (const method of Object.keys(ops)) {
            const m = method.toUpperCase() as HTTPMethod;
            if (!METHODS.includes(m)) continue;
            eps.push({
              id: newEndpointId(),
              method: m,
              path,
              description: ops[method]?.summary || ops[method]?.description || "",
              enabled: true,
            });
          }
        }
      }
      if (eps.length === 0) {
        toast.error("No endpoints found in the file");
        return;
      }
      patch({ endpoints: [...w.endpoints, ...eps] });
      if (doc.servers?.[0]?.url && !w.baseUrl) patch({ baseUrl: doc.servers[0].url });
      toast.success(`Imported ${eps.length} endpoints`);
    } catch {
      toast.error("Could not parse file — expected an OpenAPI/Swagger JSON document");
    }
  };

  const addManualEndpoint = () => {
    if (!epPath.trim()) return;
    patch({
      endpoints: [
        ...w.endpoints,
        {
          id: newEndpointId(),
          method: epMethod,
          path: epPath.trim(),
          description: epDesc.trim(),
          enabled: true,
        },
      ],
    });
    setEpPath("");
    setEpDesc("");
  };

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
    const ok = w.baseUrl.trim().length > 0 && w.authValue.trim().length >= 4;
    setTestResult({
      statusCode: ok ? 200 : 401,
      body: ok
        ? JSON.stringify({ success: true, message: "Simulated response — connection OK" }, null, 2)
        : JSON.stringify({ error: "unauthorized", message: "Invalid or missing credentials" }, null, 2),
      responseTimeMs: Math.floor(90 + Math.random() * 400),
    });
    setTesting(false);
  };

  const buildPayload = () => ({
    name: w.name.trim(),
    description: w.description.trim(),
    category: w.category,
    tags: w.tags,
    baseUrl: w.baseUrl.trim(),
    authType: w.authType,
    authValue: w.authValue,
    headers: w.headers,
    queryParams: w.queryParams,
    secretVars: w.secretVars,
    endpoints: w.endpoints,
  });

  const saveAPI = () => {
    if (editingId) {
      updateAPI(editingId, buildPayload());
    } else {
      addAPI({
        ...buildPayload(),
        status: "active",
        lastUsedAt: null,
        usedByAgentIds: [],
        createdBy: "You",
      });
    }
    toast.success("API connection saved");
    setWizardOpen(false);
  };

  const canNext = () => {
    if (step === 0) return w.name.trim().length > 0 && w.baseUrl.trim().length > 0;
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Top actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search APIs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
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
          <Plus className="w-4 h-4 mr-1.5" /> Add API
        </Button>
      </div>

      {/* Listing */}
      {filtered.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={<Globe className="w-8 h-8" />}
            title="No API connections"
            description="Connect REST APIs so your agents can call external services like Stripe, HubSpot or internal systems."
            action={
              <Button onClick={openCreate} size="sm">
                <Plus className="w-4 h-4 mr-1.5" /> Add API
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <Card key={a.id} padding="sm" hover>
              <div className="flex items-start gap-4">
                <LogoAvatar label={a.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-gray-900">{a.name}</h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="text-xs text-gray-500 mb-3 truncate">
                    {a.description || "No description"}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
                    <MetaCell label="Category" value={a.category} />
                    <MetaCell label="Base URL" value={a.baseUrl} />
                    <MetaCell
                      label="Auth"
                      value={AUTH_TYPES.find((t) => t.value === a.authType)?.label}
                    />
                    <MetaCell
                      label="Endpoints"
                      value={`${a.endpoints.filter((e) => e.enabled).length} enabled`}
                    />
                    <MetaCell label="Last Used" value={fmtDate(a.lastUsedAt)} />
                    <MetaCell label="Used By" value={`${a.usedByAgentIds.length} agents`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    title="View"
                    onClick={() => setViewing(a)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => openEdit(a)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    title="Test"
                    onClick={() => {
                      openEdit(a);
                      setStep(3);
                    }}
                    className="p-2 text-gray-400 hover:text-primary-700 hover:bg-primary-50 rounded-lg"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    title="Duplicate"
                    onClick={() => {
                      duplicateAPI(a.id);
                      toast.success("API duplicated");
                    }}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setDeleteId(a.id)}
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
              <MetaCell label="Base URL" value={viewing.baseUrl} />
              <MetaCell
                label="Auth"
                value={AUTH_TYPES.find((t) => t.value === viewing.authType)?.label}
              />
              <MetaCell label="Category" value={viewing.category} />
              <MetaCell label="Credential" value="••••••••••••" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Endpoints</p>
              <div className="space-y-1.5">
                {viewing.endpoints.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50"
                  >
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${METHOD_COLORS[e.method]}`}
                    >
                      {e.method}
                    </span>
                    <span className="text-sm font-mono text-gray-800 flex-1 truncate">{e.path}</span>
                    <span className="text-xs text-gray-400 truncate max-w-[180px]">
                      {e.description}
                    </span>
                    {e.enabled ? (
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
            removeAPI(deleteId);
            toast.success("API connection deleted");
          }
        }}
        title="Delete API connection?"
        message="Agents using this API will lose access to its endpoints. This action cannot be undone."
      />

      {/* Wizard */}
      <Modal
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        title={editingId ? "Edit API Connection" : "Add API"}
        size="xl"
      >
        <ModalBody className="space-y-5">
          <WizardProgress steps={WIZARD_STEPS} current={step} onStepClick={setStep} />

          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="API Name *"
                  value={w.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="e.g. Stripe API"
                />
                <Select
                  label="Category"
                  options={API_CATEGORIES.map((c) => ({ value: c, label: c }))}
                  value={w.category}
                  onChange={(e) => patch({ category: e.target.value })}
                />
              </div>
              <Textarea
                label="Description"
                value={w.description}
                onChange={(e) => patch({ description: e.target.value })}
                rows={2}
              />
              <Input
                label="Base URL *"
                value={w.baseUrl}
                onChange={(e) => patch({ baseUrl: e.target.value })}
                placeholder="https://api.example.com/v1"
              />
              <TagsInput tags={w.tags} onChange={(tags) => patch({ tags })} />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <Select
                label="Authentication"
                options={AUTH_TYPES}
                value={w.authType}
                onChange={(e) => patch({ authType: e.target.value as APIAuthType })}
              />
              <SecretInput
                label={
                  w.authType === "basic"
                    ? "Credentials (user:password)"
                    : AUTH_TYPES.find((t) => t.value === w.authType)?.label ?? "Credential"
                }
                value={w.authValue}
                onChange={(authValue) => patch({ authValue })}
                placeholder="Enter credential"
              />
              <KeyValueEditor
                label="Headers"
                pairs={w.headers}
                onChange={(headers) => patch({ headers })}
                keyPlaceholder="Header-Name"
              />
              <KeyValueEditor
                label="Default Query Parameters"
                pairs={w.queryParams}
                onChange={(queryParams) => patch({ queryParams })}
                keyPlaceholder="param"
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
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) importOpenAPI(f);
                    e.target.value = "";
                  }}
                />
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <FileUp className="w-4 h-4 mr-1.5" /> Upload OpenAPI / Swagger
                </Button>
                <span className="text-xs text-gray-400">or add endpoints manually below</span>
              </div>

              <div className="flex gap-2 items-end">
                <div className="w-28">
                  <Select
                    label="Method"
                    options={METHODS.map((m) => ({ value: m, label: m }))}
                    value={epMethod}
                    onChange={(e) => setEpMethod(e.target.value as HTTPMethod)}
                    className="!py-2"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Path"
                    value={epPath}
                    onChange={(e) => setEpPath(e.target.value)}
                    placeholder="/customers/{id}"
                    className="!py-2 font-mono text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Description"
                    value={epDesc}
                    onChange={(e) => setEpDesc(e.target.value)}
                    placeholder="What it does"
                    className="!py-2"
                  />
                </div>
                <Button size="sm" variant="outline" onClick={addManualEndpoint} className="mb-0.5">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {w.endpoints.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-gray-500">
                    {w.endpoints.length} endpoints · toggle to enable/disable
                  </p>
                  {w.endpoints.map((e, i) => (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 bg-white"
                    >
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${METHOD_COLORS[e.method]}`}
                      >
                        {e.method}
                      </span>
                      <span className="text-sm font-mono text-gray-800 flex-1 truncate">
                        {e.path}
                      </span>
                      <span className="text-xs text-gray-400 truncate max-w-[160px]">
                        {e.description}
                      </span>
                      <Toggle
                        checked={e.enabled}
                        onChange={(v) =>
                          patch({
                            endpoints: w.endpoints.map((x, idx) =>
                              idx === i ? { ...x, enabled: v } : x
                            ),
                          })
                        }
                      />
                      <button
                        onClick={() =>
                          patch({ endpoints: w.endpoints.filter((_, idx) => idx !== i) })
                        }
                        className="p-1.5 text-gray-300 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Endpoint"
                  options={[
                    { value: "", label: w.endpoints.length ? "Select endpoint" : "No endpoints — test base URL" },
                    ...w.endpoints.map((e) => ({
                      value: e.id,
                      label: `${e.method} ${e.path}`,
                    })),
                  ]}
                  value={testEndpointId}
                  onChange={(e) => {
                    setTestEndpointId(e.target.value);
                    const ep = w.endpoints.find((x) => x.id === e.target.value);
                    if (ep) setTestMethod(ep.method);
                  }}
                />
                <Select
                  label="Method"
                  options={METHODS.map((m) => ({ value: m, label: m }))}
                  value={testMethod}
                  onChange={(e) => setTestMethod(e.target.value as HTTPMethod)}
                />
              </div>
              <Textarea
                label="Request Body"
                value={testBody}
                onChange={(e) => setTestBody(e.target.value)}
                rows={3}
                placeholder='{ "key": "value" }'
                className="font-mono text-sm"
              />
              <Textarea
                label="Headers (one per line)"
                value={testHeaders}
                onChange={(e) => setTestHeaders(e.target.value)}
                rows={2}
                placeholder="Content-Type: application/json"
                className="font-mono text-sm"
              />
              <Button size="sm" onClick={runTest} isLoading={testing}>
                <Play className="w-4 h-4 mr-1.5" /> Test API
              </Button>
              {testResult && (
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    testResult.statusCode < 400
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-bold ${
                        testResult.statusCode < 400 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {testResult.statusCode} {testResult.statusCode < 400 ? "OK" : "Unauthorized"}
                    </span>
                    <span className="text-xs text-gray-500">{testResult.responseTimeMs} ms</span>
                  </div>
                  <pre className="text-xs bg-white rounded-lg p-3 border border-gray-100 overflow-x-auto">
                    {testResult.body}
                  </pre>
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
            <Button size="sm" onClick={saveAPI}>
              Save API
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </div>
  );
}
