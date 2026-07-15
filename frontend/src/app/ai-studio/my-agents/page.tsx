"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DashboardLayout } from "@/components/layout";
import { Badge, Button, Card, Input, Modal, ModalBody, Select } from "@/components/ui";
import {
  ConfirmDialog,
  EmptyState,
  fmtDate,
  MetaCell,
  StatusBadge,
} from "@/components/ai-studio/shared";
import { providerMeta, useAIStudioStore } from "@/lib/ai-studio-store";
import { useAuthStore } from "@/lib/store";
import type { Agent } from "@/types/ai-studio";
import {
  Archive,
  BarChart3,
  Bot,
  Copy,
  Eye,
  FileText,
  FlaskConical,
  Globe,
  Pencil,
  Play,
  Plus,
  Rocket,
  Search,
  Trash2,
  Upload,
  Users,
} from "lucide-react";

export default function MyAgentsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { agents, llms, updateAgent, removeAgent, cloneAgent } = useAIStudioStore();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sort, setSort] = useState("updated");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Agent | null>(null);
  const [logsFor, setLogsFor] = useState<Agent | null>(null);
  const [analyticsFor, setAnalyticsFor] = useState<Agent | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && !isAuthenticated) router.push("/");
  }, [mounted, isAuthenticated, router]);

  const filtered = useMemo(() => {
    let list = agents.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q || a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchVis = visibilityFilter === "all" || a.visibility === visibilityFilter;
      return matchSearch && matchStatus && matchVis;
    });
    if (sort === "updated")
      list = [...list].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "runs") list = [...list].sort((a, b) => b.totalRuns - a.totalRuns);
    return list;
  }, [agents, search, statusFilter, visibilityFilter, sort]);

  const llmLabel = (a: Agent) => {
    const l = llms.find((x) => x.id === a.llmConnectionId);
    return l ? `${providerMeta(l.provider).label} · ${l.config.defaultModel}` : "No LLM";
  };

  const visBadge = (a: Agent) =>
    a.visibility === "public" ? (
      <Badge variant="info" dot>Public</Badge>
    ) : a.visibility === "team" ? (
      <Badge variant="secondary" dot>Organization</Badge>
    ) : (
      <Badge variant="gray" dot>Private</Badge>
    );

  if (!mounted) return null;

  return (
    <DashboardLayout
      activeKey="ai-studio:my-agents"
      onNavigate={(_key, path) => router.push(path)}
      headerTitle="My Agents"
      headerSubtitle="Manage, test and deploy the agents you've built"
      headerRight={
        <Button size="sm" onClick={() => router.push("/ai-studio/create-agent")}>
          <Plus className="w-4 h-4 mr-1.5" /> Create Agent
        </Button>
      }
    >
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Top actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search agents..."
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
                { value: "draft", label: "Draft" },
                { value: "archived", label: "Archived" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="!py-2.5"
            />
          </div>
          <div className="w-40 flex-shrink-0">
            <Select
              options={[
                { value: "all", label: "All Visibility" },
                { value: "private", label: "Private" },
                { value: "team", label: "Organization" },
                { value: "public", label: "Public" },
              ]}
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="!py-2.5"
            />
          </div>
          <div className="w-48 flex-shrink-0">
            <Select
              options={[
                { value: "updated", label: "Sort: Last Updated" },
                { value: "name", label: "Sort: Name" },
                { value: "runs", label: "Sort: Total Runs" },
              ]}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="!py-2.5"
            />
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <Card padding="none">
            <EmptyState
              icon={<Bot className="w-8 h-8" />}
              title="No agents yet"
              description="Create your first AI agent — connect an LLM, add tools and deploy in minutes."
              action={
                <Button size="sm" onClick={() => router.push("/ai-studio/create-agent")}>
                  <Plus className="w-4 h-4 mr-1.5" /> Create Agent
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <Card key={a.id} padding="sm" hover className="flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{a.name}</h3>
                      <span className="text-[10px] text-gray-400 font-mono">v{a.version}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{a.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <StatusBadge status={a.status} />
                  {visBadge(a)}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  <MetaCell label="LLM" value={llmLabel(a)} />
                  <MetaCell label="Total Runs" value={a.totalRuns.toLocaleString()} />
                  <MetaCell
                    label="Resources"
                    value={`${a.mcpSelections.length} MCP · ${a.apiSelections.length} API`}
                  />
                  <MetaCell label="Updated" value={fmtDate(a.updatedAt)} />
                </div>
                <div className="flex items-center gap-1 pt-3 border-t border-gray-100 mt-auto flex-wrap">
                  <button
                    title="Play"
                    onClick={() => router.push(`/chat?agentId=${a.id}`)}
                    className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    title="Edit"
                    onClick={() => router.push(`/ai-studio/create-agent?agentId=${a.id}&step=0`)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    title="Test"
                    onClick={() => router.push(`/ai-studio/create-agent?agentId=${a.id}&step=3`)}
                    className="p-2 text-gray-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                  >
                    <FlaskConical className="w-4 h-4" />
                  </button>
                  <button
                    title={a.visibility === "public" ? "Update Deployment" : "Deploy"}
                    onClick={() => {
                      updateAgent(a.id, { visibility: "public", status: "active", deployed: true });
                      toast.success(a.visibility === "public" ? "Deployment updated" : "Agent deployed to marketplace");
                    }}
                    className="p-2 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
                  >
                    <Rocket className="w-4 h-4" />
                  </button>
                  <button
                    title="View Analytics"
                    onClick={() => setAnalyticsFor(a)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    title="View Logs"
                    onClick={() => setLogsFor(a)}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    title="Clone"
                    onClick={() => {
                      cloneAgent(a.id);
                      toast.success("Agent cloned");
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
              </Card>
            ))}
          </div>
        )}

        {/* View modal */}
        <Modal
          isOpen={!!viewing}
          onClose={() => setViewing(null)}
          title={viewing ? `${viewing.icon} ${viewing.name}` : ""}
          description={viewing?.description}
          size="lg"
        >
          {viewing && (
            <ModalBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetaCell label="Status" value={<StatusBadge status={viewing.status} />} />
                <MetaCell label="Visibility" value={visBadge(viewing)} />
                <MetaCell label="LLM" value={llmLabel(viewing)} />
                <MetaCell label="Version" value={viewing.version} />
                <MetaCell label="Category" value={viewing.category} />
                <MetaCell label="Total Runs" value={viewing.totalRuns.toLocaleString()} />
              </div>
              {viewing.deployed && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Agent URL
                  </p>
                  <code className="block text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono">
                    {viewing.agentUrl}
                  </code>
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">
                  System Prompt
                </p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {viewing.instructions.systemPrompt || "Not set"}
                </p>
              </div>
            </ModalBody>
          )}
        </Modal>

        {/* Analytics modal (mock) */}
        <Modal
          isOpen={!!analyticsFor}
          onClose={() => setAnalyticsFor(null)}
          title={`Analytics — ${analyticsFor?.name}`}
          size="md"
        >
          {analyticsFor && (
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                <Card padding="sm" className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {analyticsFor.totalRuns.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Total Runs</p>
                </Card>
                <Card padding="sm" className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(analyticsFor.totalRuns * 0.92).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Successful</p>
                </Card>
                <Card padding="sm" className="text-center">
                  <p className="text-2xl font-bold text-gray-900">1.4s</p>
                  <p className="text-xs text-gray-500">Avg Response Time</p>
                </Card>
                <Card padding="sm" className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    ${(analyticsFor.totalRuns * 0.0021).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Est. Total Cost</p>
                </Card>
              </div>
            </ModalBody>
          )}
        </Modal>

        {/* Logs modal (mock) */}
        <Modal
          isOpen={!!logsFor}
          onClose={() => setLogsFor(null)}
          title={`Logs — ${logsFor?.name}`}
          size="lg"
        >
          {logsFor && (
            <ModalBody>
              <div className="font-mono text-xs bg-gray-900 text-gray-100 rounded-lg p-4 space-y-1 max-h-80 overflow-y-auto">
                {[
                  ["INFO", "Agent invoked via web-chat"],
                  ["INFO", `LLM request → ${llmLabel(logsFor)}`],
                  ...(logsFor.mcpSelections.length ? [["INFO", "MCP tool call executed"]] : []),
                  ["INFO", `Response generated in 1421ms (312 tokens)`],
                  ["INFO", "Conversation stored (memory enabled)"],
                  ["WARN", "Rate limit at 65% of configured threshold"],
                ].map(([level, msg], i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-gray-500">{new Date().toISOString().slice(0, 19)}</span>
                    <span className={level === "WARN" ? "text-yellow-400" : "text-green-400"}>
                      {level}
                    </span>
                    <span>{msg}</span>
                  </div>
                ))}
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
              removeAgent(deleteId);
              toast.success("Agent deleted");
            }
          }}
          title="Delete agent?"
          message="This permanently removes the agent, its configuration and deployment. This action cannot be undone."
        />
      </div>
    </DashboardLayout>
  );
}
