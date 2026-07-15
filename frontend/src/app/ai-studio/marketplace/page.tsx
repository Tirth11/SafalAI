"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DashboardLayout } from "@/components/layout";
import { Badge, Button, Card, Input, Modal, ModalBody, ModalFooter, Select } from "@/components/ui";
import { EmptyState, fmtDate, MetaCell } from "@/components/ai-studio/shared";
import { useAIStudioStore } from "@/lib/ai-studio-store";
import { useAuthStore } from "@/lib/store";
import type { MarketplaceAgent } from "@/types/ai-studio";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  Copy,
  Download,
  FileText,
  Play,
  Plus,
  Search,
  Sparkles,
  Star,
  Store,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Engineering",
  "Finance",
  "Productivity",
  "Analytics",
  "Project Management",
  "Research",
  "Customer Support",
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"
          )}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function MarketplacePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { marketplace, agents, addAgent } = useAIStudioStore();

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popularity");
  const [filter, setFilter] = useState<"all" | "featured" | "new">("all");
  const [details, setDetails] = useState<MarketplaceAgent | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && !isAuthenticated) router.push("/");
  }, [mounted, isAuthenticated, router]);

  // Publicly published agents from this workspace also appear in the marketplace
  const publicOwn: MarketplaceAgent[] = useMemo(
    () =>
      agents
        .filter((a) => a.visibility === "public" && a.deployed)
        .map((a) => ({
          id: `own_${a.id}`,
          name: a.name,
          description: a.description,
          creator: "You",
          category: a.category,
          llmLabel: "Custom",
          mcpLabels: [],
          apiLabels: [],
          downloads: a.totalRuns,
          rating: 5,
          updatedAt: a.updatedAt,
          verified: false,
          featured: false,
          isNew: true,
          icon: a.icon,
        })),
    [agents]
  );

  const filtered = useMemo(() => {
    let list = [...publicOwn, ...marketplace].filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.creator.toLowerCase().includes(q);
      const matchCat = category === "All" || m.category === category;
      const matchFilter =
        filter === "all" || (filter === "featured" && m.featured) || (filter === "new" && m.isNew);
      return matchSearch && matchCat && matchFilter;
    });
    if (sort === "popularity") list.sort((a, b) => b.downloads - a.downloads);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "recent")
      list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return list;
  }, [marketplace, publicOwn, search, category, sort, filter]);

  const cloneToWorkspace = (m: MarketplaceAgent) => {
    addAgent({
      name: `${m.name} (from Marketplace)`,
      description: m.description,
      category: m.category,
      tags: [],
      icon: m.icon,
      version: "1.0.0",
      status: "draft",
      llmConnectionId: null,
      fallbackLLMConnectionId: null,
      resourceType: null,
      mcpSelections: [],
      apiSelections: [],
      instructions: {
        systemPrompt: `You are ${m.name}. ${m.description}`,
        goal: m.description,
        persona: "",
        tone: "",
        instructions: "",
        constraints: "",
        responseFormat: "",
        enableMemory: true,
        enableHistory: true,
        enableCitations: false,
        enableToolCalling: true,
      },
      visibility: "private",
      deploymentTargets: ["web-chat"],
      deployed: false,
      deploymentStatus: "draft",
      agentUrl: "",
      chatUrl: "",
      apiEndpoint: "",
      apiKey: "",
      embedCode: "",
      wizardStep: 0,
      totalRuns: 0,
      createdBy: "You",
    });
    toast.success(`"${m.name}" added to your workspace — connect an LLM to activate it`);
    router.push("/ai-studio/my-agents");
  };

  if (!mounted) return null;

  return (
    <DashboardLayout
      activeKey="ai-studio:marketplace"
      onNavigate={(_key, path) => router.push(path)}
      headerTitle="Agent Marketplace"
      headerSubtitle="Discover, try and clone publicly deployed agents"
    >
      <div className="p-6 max-w-7xl mx-auto w-full space-y-4">
        {/* Top actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search agents, creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="!py-2.5"
            />
          </div>
          <div className="w-48 flex-shrink-0">
            <Select
              options={CATEGORIES.map((c) => ({ value: c, label: c === "All" ? "All Categories" : c }))}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="!py-2.5"
            />
          </div>
          <div className="w-52 flex-shrink-0">
            <Select
              options={[
                { value: "popularity", label: "Sort: Popularity" },
                { value: "rating", label: "Sort: Rating" },
                { value: "recent", label: "Sort: Recently Updated" },
              ]}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="!py-2.5"
            />
          </div>
        </div>

        {/* Featured / New pills */}
        <div className="flex gap-2">
          {(
            [
              { v: "all", label: "All Agents" },
              { v: "featured", label: "⭐ Featured" },
              { v: "new", label: "🆕 New" },
            ] as { v: "all" | "featured" | "new"; label: string }[]
          ).map((p) => (
            <button
              key={p.v}
              onClick={() => setFilter(p.v)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all",
                filter === p.v
                  ? "bg-primary-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <Card padding="none">
            <EmptyState
              icon={<Store className="w-8 h-8" />}
              title="No agents found"
              description="Try a different search or category — or publish your own agent to the marketplace."
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <Card key={m.id} padding="sm" hover className="flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{m.name}</h3>
                      {m.verified && (
                        <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" aria-label="Verified" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">by {m.creator}</p>
                  </div>
                  {m.featured && (
                    <Badge variant="warning" size="sm">
                      <Sparkles className="w-3 h-3" /> Featured
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{m.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant="gray">{m.category}</Badge>
                  <Badge variant="primary">{m.llmLabel}</Badge>
                  {m.mcpLabels.map((l) => (
                    <Badge key={l} variant="secondary">
                      {l}
                    </Badge>
                  ))}
                  {m.apiLabels.map((l) => (
                    <Badge key={l} variant="info">
                      {l}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <Stars rating={m.rating} />
                  <span className="inline-flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {m.downloads.toLocaleString()}
                  </span>
                  <span>Updated {fmtDate(m.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setDetails(m)}>
                    <FileText className="w-4 h-4 mr-1" /> View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Try Agent"
                    onClick={() => router.push(`/chat?agentId=${m.id.startsWith("own_") ? m.id.replace("own_", "") : `marketplace_${m.id}`}`)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setDetails(m)}>
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Details modal */}
        <Modal
          isOpen={!!details}
          onClose={() => setDetails(null)}
          title={details ? `${details.icon} ${details.name}` : ""}
          description={details ? `by ${details.creator}` : ""}
          size="lg"
        >
          {details && (
            <>
              <ModalBody className="space-y-4">
                <p className="text-sm text-gray-700">{details.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <MetaCell label="Category" value={details.category} />
                  <MetaCell label="LLM" value={details.llmLabel} />
                  <MetaCell
                    label="Supported MCPs"
                    value={details.mcpLabels.length ? details.mcpLabels.join(", ") : "None"}
                  />
                  <MetaCell
                    label="Connected APIs"
                    value={details.apiLabels.length ? details.apiLabels.join(", ") : "None"}
                  />
                  <MetaCell label="Downloads" value={details.downloads.toLocaleString()} />
                  <MetaCell label="Rating" value={<Stars rating={details.rating} />} />
                  <MetaCell label="Last Updated" value={fmtDate(details.updatedAt)} />
                  <MetaCell
                    label="Verified"
                    value={
                      details.verified ? (
                        <span className="inline-flex items-center gap-1 text-blue-600">
                          <BadgeCheck className="w-4 h-4" /> Verified
                        </span>
                      ) : (
                        "No"
                      )
                    }
                  />
                  <div className="col-span-2 pt-4 border-t border-gray-100">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-3">API Integration</p>
                    <div className="space-y-4">
                      <MetaCell
                        label="REST API Endpoint"
                        value={
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800 break-all">
                            POST https://api.safalvir.com/v1/agents/{details.id.startsWith("own_") ? details.id.replace("own_", "") : `marketplace_${details.id}`}/chat
                          </code>
                        }
                      />
                      <MetaCell
                        label="API Key"
                        value={
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800">
                            ••••••••••••••••••••••••
                          </code>
                        }
                      />
                      <div>
                        <span className="text-xs text-gray-500 font-medium mb-1.5 block">cURL Example</span>
                        <div className="bg-gray-900 text-gray-100 p-3 rounded-lg text-[11px] font-mono overflow-x-auto whitespace-pre">
{`curl -X POST https://api.safalvir.com/v1/agents/${details.id.startsWith("own_") ? details.id.replace("own_", "") : `marketplace_${details.id}`}/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello"}'`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/chat?agentId=${details.id.startsWith("own_") ? details.id.replace("own_", "") : `marketplace_${details.id}`}`)}
                >
                  <Play className="w-4 h-4 mr-1.5" /> Try Agent
                </Button>
                <Button
                  size="sm"
                  onClick={() => setDetails(null)}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
