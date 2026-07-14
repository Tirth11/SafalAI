"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Agent,
  APIConnection,
  LLMConnection,
  LLMProvider,
  LLMTestResult,
  MarketplaceAgent,
  MCPServer,
  MCPTool,
} from "@/types/ai-studio";

const newId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

// ---------- Provider metadata ----------

export const LLM_PROVIDERS: {
  value: LLMProvider;
  label: string;
  baseUrl: string;
  models: string[];
  contextWindow: number;
  costPer1k: number;
}[] = [
  {
    value: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    models: ["gpt-5", "gpt-4o", "gpt-4o-mini", "gpt-4.1", "o3-mini"],
    contextWindow: 128000,
    costPer1k: 0.005,
  },
  {
    value: "anthropic",
    label: "Anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    models: [
      "claude-fable-5",
      "claude-opus-4-8",
      "claude-sonnet-5",
      "claude-haiku-4-5",
    ],
    contextWindow: 200000,
    costPer1k: 0.008,
  },
  {
    value: "google",
    label: "Google Gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    models: ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    contextWindow: 1000000,
    costPer1k: 0.004,
  },
  {
    value: "grok",
    label: "Grok (xAI)",
    baseUrl: "https://api.x.ai/v1",
    models: ["grok-3", "grok-3-mini"],
    contextWindow: 131072,
    costPer1k: 0.005,
  },
  {
    value: "deepseek",
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    models: ["deepseek-chat", "deepseek-reasoner"],
    contextWindow: 64000,
    costPer1k: 0.0014,
  },
  {
    value: "mistral",
    label: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    models: ["mistral-large-latest", "mistral-small-latest", "codestral-latest"],
    contextWindow: 128000,
    costPer1k: 0.003,
  },
  {
    value: "cohere",
    label: "Cohere",
    baseUrl: "https://api.cohere.com/v2",
    models: ["command-r-plus", "command-r"],
    contextWindow: 128000,
    costPer1k: 0.0025,
  },
  {
    value: "openrouter",
    label: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    models: ["auto", "anthropic/claude-sonnet-5", "openai/gpt-4o"],
    contextWindow: 200000,
    costPer1k: 0.006,
  },
  {
    value: "azure-openai",
    label: "Azure OpenAI",
    baseUrl: "https://<resource>.openai.azure.com",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-35-turbo"],
    contextWindow: 128000,
    costPer1k: 0.005,
  },
  {
    value: "ollama",
    label: "Ollama (Local)",
    baseUrl: "http://localhost:11434/v1",
    models: ["llama3.3", "qwen2.5", "mistral"],
    contextWindow: 32000,
    costPer1k: 0,
  },
  {
    value: "custom",
    label: "Custom OpenAI Compatible",
    baseUrl: "",
    models: [],
    contextWindow: 32000,
    costPer1k: 0.002,
  },
];

export const providerMeta = (p: LLMProvider) =>
  LLM_PROVIDERS.find((x) => x.value === p) ?? LLM_PROVIDERS[LLM_PROVIDERS.length - 1];

export const MCP_CATEGORY_TOOLS: Record<string, { name: string; description: string }[]> = {
  filesystem: [
    { name: "Read File", description: "Read the contents of a file" },
    { name: "Write File", description: "Create or overwrite a file" },
    { name: "List Directory", description: "List files in a directory" },
    { name: "Search Files", description: "Search files by name or content" },
    { name: "Delete File", description: "Permanently delete a file" },
    { name: "Rename File", description: "Rename or move a file" },
  ],
  github: [
    { name: "Read Repository", description: "Read repository files and metadata" },
    { name: "Search Code", description: "Search code across repositories" },
    { name: "Create Issue", description: "Open a new issue" },
    { name: "Create Pull Request", description: "Open a pull request" },
    { name: "Delete Repository", description: "Permanently delete a repository" },
    { name: "Delete Branch", description: "Delete a branch" },
  ],
  jira: [
    { name: "Search Issues", description: "Search issues with JQL" },
    { name: "Create Issue", description: "Create a new Jira issue" },
    { name: "Update Issue", description: "Update fields on an issue" },
    { name: "Add Comment", description: "Comment on an issue" },
    { name: "Transition Issue", description: "Move an issue through workflow" },
  ],
  slack: [
    { name: "Send Message", description: "Post a message to a channel" },
    { name: "Read Channel", description: "Read channel history" },
    { name: "Search Messages", description: "Search across the workspace" },
    { name: "List Channels", description: "List available channels" },
  ],
  browser: [
    { name: "Navigate", description: "Open a URL" },
    { name: "Read Page", description: "Extract page content" },
    { name: "Click Element", description: "Click on a page element" },
    { name: "Fill Form", description: "Type into form fields" },
    { name: "Screenshot", description: "Capture a screenshot" },
  ],
  "google-drive": [
    { name: "Search Files", description: "Search Drive files" },
    { name: "Read Document", description: "Read a document's content" },
    { name: "Create Document", description: "Create a new document" },
    { name: "Share File", description: "Update sharing settings" },
  ],
  notion: [
    { name: "Search Pages", description: "Search across the workspace" },
    { name: "Read Page", description: "Read page blocks" },
    { name: "Create Page", description: "Create a new page" },
    { name: "Update Page", description: "Update page content" },
  ],
  database: [
    { name: "Run Query", description: "Execute a read-only SQL query" },
    { name: "List Tables", description: "List tables and schemas" },
    { name: "Describe Table", description: "Show table structure" },
    { name: "Insert Row", description: "Insert data into a table" },
    { name: "Delete Rows", description: "Delete rows matching a filter" },
  ],
  sharepoint: [
    { name: "Search Sites", description: "Search SharePoint sites" },
    { name: "Read Document", description: "Read a document" },
    { name: "Upload Document", description: "Upload a file to a library" },
    { name: "List Libraries", description: "List document libraries" },
  ],
  confluence: [
    { name: "Search Pages", description: "Search Confluence pages" },
    { name: "Read Page", description: "Read page content" },
    { name: "Create Page", description: "Create a new page" },
    { name: "Update Page", description: "Update an existing page" },
  ],
  custom: [
    { name: "Custom Tool", description: "Tool exposed by the custom server" },
  ],
};

// ---------- Seed data ----------

const now = new Date().toISOString();
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

const defaultModelConfig = {
  temperature: 0.7,
  topP: 1,
  presencePenalty: 0,
  frequencyPenalty: 0,
  maxTokens: 4096,
  streaming: true,
  jsonMode: false,
  visionEnabled: true,
  functionCalling: true,
  reasoningMode: "off" as const,
  timeoutSeconds: 60,
  retryCount: 2,
  rateLimitRpm: 60,
  fallbackModel: "",
};

const seedLLMs: LLMConnection[] = [
  {
    id: "llm_seed_gpt5",
    name: "GPT-5",
    description: "Next generation GPT-5 model connection",
    tags: ["production", "next-gen"],
    provider: "openai",
    apiKey: "sk-****************",
    organizationId: "",
    projectId: "",
    baseUrl: "https://api.openai.com/v1",
    keyValidated: true,
    config: { ...defaultModelConfig, defaultModel: "gpt-5" },
    status: "active",
    health: "healthy",
    contextWindow: 256000,
    lastTestedAt: daysAgo(1),
    estimatedCostPer1k: 0.01,
    usedByAgentIds: [],
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(5),
  },
  {
    id: "llm_seed_openai",
    name: "OpenAI Production",
    description: "Primary GPT-4o connection for production agents",
    tags: ["production"],
    provider: "openai",
    apiKey: "sk-****************",
    organizationId: "",
    projectId: "",
    baseUrl: "https://api.openai.com/v1",
    keyValidated: true,
    config: { ...defaultModelConfig, defaultModel: "gpt-4o" },
    status: "active",
    health: "healthy",
    contextWindow: 128000,
    lastTestedAt: daysAgo(1),
    estimatedCostPer1k: 0.005,
    usedByAgentIds: ["agent_seed_support"],
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(30),
  },
  {
    id: "llm_seed_anthropic",
    name: "Anthropic Claude",
    description: "Claude Sonnet for reasoning-heavy workloads",
    tags: ["production", "reasoning"],
    provider: "anthropic",
    apiKey: "sk-ant-****************",
    organizationId: "",
    projectId: "",
    baseUrl: "https://api.anthropic.com/v1",
    keyValidated: true,
    config: {
      ...defaultModelConfig,
      defaultModel: "claude-sonnet-5",
      reasoningMode: "medium",
    },
    status: "active",
    health: "healthy",
    contextWindow: 200000,
    lastTestedAt: daysAgo(2),
    estimatedCostPer1k: 0.008,
    usedByAgentIds: [],
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(21),
  },
  {
    id: "llm_seed_ollama",
    name: "Local Ollama",
    description: "Local Llama 3.3 for development and testing",
    tags: ["dev"],
    provider: "ollama",
    apiKey: "",
    organizationId: "",
    projectId: "",
    baseUrl: "http://localhost:11434/v1",
    keyValidated: false,
    config: { ...defaultModelConfig, defaultModel: "llama3.3", visionEnabled: false },
    status: "inactive",
    health: "unknown",
    contextWindow: 32000,
    lastTestedAt: null,
    estimatedCostPer1k: 0,
    usedByAgentIds: [],
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(10),
  },
];

const mkTools = (category: string, enabledCount = 4): MCPTool[] =>
  (MCP_CATEGORY_TOOLS[category] ?? []).map((t, i) => ({
    id: `tool_${category}_${i}`,
    name: t.name,
    description: t.description,
    enabled: i < enabledCount,
  }));

const seedMCPs: MCPServer[] = [
  {
    id: "mcp_seed_github",
    name: "GitHub MCP",
    description: "Access repositories, issues and pull requests",
    tags: ["engineering"],
    category: "github",
    transport: "stdio",
    serverUrl: "",
    command: "npx -y @modelcontextprotocol/server-github",
    workingDirectory: "",
    envVars: [],
    secretVars: [{ key: "GITHUB_TOKEN", value: "ghp_************" }],
    authType: "api_key",
    authValue: "ghp_************",
    headers: [],
    certificate: "",
    tools: mkTools("github", 4),
    status: "active",
    health: "healthy",
    usedByAgentIds: ["agent_seed_support"],
    lastConnectedAt: daysAgo(1),
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(14),
  },
  {
    id: "mcp_seed_fs",
    name: "Filesystem MCP",
    description: "Read and write files in the shared workspace",
    tags: ["core"],
    category: "filesystem",
    transport: "stdio",
    serverUrl: "",
    command: "npx -y @modelcontextprotocol/server-filesystem /workspace",
    workingDirectory: "/workspace",
    envVars: [],
    secretVars: [],
    authType: "none",
    authValue: "",
    headers: [],
    certificate: "",
    tools: mkTools("filesystem", 4),
    status: "active",
    health: "healthy",
    usedByAgentIds: [],
    lastConnectedAt: daysAgo(3),
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(20),
  },
];

const seedAPIs: APIConnection[] = [
  {
    id: "api_seed_stripe",
    name: "Stripe API",
    description: "Payments, refunds and customer management",
    category: "Payments",
    tags: ["finance"],
    baseUrl: "https://api.stripe.com/v1",
    authType: "bearer",
    authValue: "sk_live_************",
    headers: [],
    queryParams: [],
    secretVars: [],
    endpoints: [
      { id: "ep_stripe_1", method: "POST", path: "/payment_intents", description: "Create Payment", enabled: true },
      { id: "ep_stripe_2", method: "POST", path: "/refunds", description: "Refund Payment", enabled: true },
      { id: "ep_stripe_3", method: "GET", path: "/customers", description: "List Customers", enabled: true },
      { id: "ep_stripe_4", method: "DELETE", path: "/customers/{id}", description: "Delete Customer", enabled: false },
    ],
    status: "active",
    lastUsedAt: daysAgo(2),
    usedByAgentIds: [],
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(12),
  },
  {
    id: "api_seed_salesforce",
    name: "Salesforce API",
    description: "CRM data, leads, and opportunities",
    category: "CRM",
    tags: ["sales"],
    baseUrl: "https://your-instance.my.salesforce.com/services/data/v60.0",
    authType: "bearer",
    authValue: "00D************",
    headers: [],
    queryParams: [],
    secretVars: [],
    endpoints: [
      { id: "ep_sfdc_1", method: "GET", path: "/query", description: "Execute SOQL", enabled: true },
      { id: "ep_sfdc_2", method: "POST", path: "/sobjects/Lead", description: "Create Lead", enabled: true },
      { id: "ep_sfdc_3", method: "PATCH", path: "/sobjects/Opportunity/{id}", description: "Update Opportunity", enabled: true },
    ],
    status: "active",
    lastUsedAt: daysAgo(1),
    usedByAgentIds: [],
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(8),
  },
];

const seedAgents: Agent[] = [
  {
    id: "agent_seed_support",
    name: "Support Copilot",
    description: "Answers customer questions using docs and GitHub issues",
    category: "Customer Support",
    tags: ["support"],
    icon: "🤖",
    version: "1.2.0",
    status: "active",
    llmConnectionId: "llm_seed_openai",
    fallbackLLMConnectionId: null,
    mcpSelections: [
      { mcpServerId: "mcp_seed_github", toolIds: ["tool_github_0", "tool_github_1"] },
    ],
    apiSelections: [],
    instructions: {
      systemPrompt:
        "You are Support Copilot, a helpful assistant for SafalVir customers.",
      goal: "Resolve customer questions accurately on first contact.",
      persona: "Friendly support engineer",
      tone: "Professional and warm",
      instructions: "Always search GitHub issues before answering bug reports.",
      constraints: "Never share internal credentials or roadmap details.",
      responseFormat: "Short paragraphs with bullet points where helpful.",
      enableMemory: true,
      enableHistory: true,
      enableCitations: true,
      enableToolCalling: true,
    },
    visibility: "team",
    deploymentTargets: ["web-chat"],
    deployed: true,
    agentUrl: "https://agents.safalvir.com/a/support-copilot",
    apiEndpoint: "https://api.safalvir.com/v1/agents/support-copilot/invoke",
    embedCode: `<script src="https://agents.safalvir.com/embed.js" data-agent="support-copilot"></script>`,
    wizardStep: 7,
    totalRuns: 1284,
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
  },
];

const seedMarketplace: MarketplaceAgent[] = [
  {
    id: "mkt_1",
    name: "Code Review Assistant",
    description: "Reviews pull requests for bugs, style and security issues",
    creator: "SafalVir Labs",
    category: "Engineering",
    llmLabel: "Claude Sonnet",
    mcpLabels: ["GitHub"],
    apiLabels: [],
    downloads: 4820,
    rating: 4.8,
    updatedAt: daysAgo(3),
    verified: true,
    featured: true,
    isNew: false,
    icon: "🔍",
  },
  {
    id: "mkt_2",
    name: "Invoice Processor",
    description: "Extracts data from invoices and posts to your accounting API",
    creator: "FinTools",
    category: "Finance",
    llmLabel: "GPT-4o",
    mcpLabels: ["Filesystem"],
    apiLabels: ["QuickBooks"],
    downloads: 2310,
    rating: 4.5,
    updatedAt: daysAgo(6),
    verified: true,
    featured: false,
    isNew: false,
    icon: "🧾",
  },
  {
    id: "mkt_3",
    name: "Meeting Summarizer",
    description: "Turns meeting transcripts into action items in Notion",
    creator: "ProductiveAI",
    category: "Productivity",
    llmLabel: "Gemini 2.0 Flash",
    mcpLabels: ["Notion", "Google Drive"],
    apiLabels: [],
    downloads: 6150,
    rating: 4.7,
    updatedAt: daysAgo(1),
    verified: true,
    featured: true,
    isNew: false,
    icon: "📝",
  },
  {
    id: "mkt_4",
    name: "SQL Analyst",
    description: "Answers business questions by querying your database safely",
    creator: "DataWorks",
    category: "Analytics",
    llmLabel: "DeepSeek Reasoner",
    mcpLabels: ["Database"],
    apiLabels: [],
    downloads: 1890,
    rating: 4.3,
    updatedAt: daysAgo(9),
    verified: false,
    featured: false,
    isNew: false,
    icon: "📊",
  },
  {
    id: "mkt_5",
    name: "Jira Sprint Planner",
    description: "Plans sprints, grooms backlogs and drafts tickets in Jira",
    creator: "AgileBots",
    category: "Project Management",
    llmLabel: "GPT-4o",
    mcpLabels: ["Jira", "Slack"],
    apiLabels: [],
    downloads: 980,
    rating: 4.1,
    updatedAt: daysAgo(2),
    verified: false,
    featured: false,
    isNew: true,
    icon: "🗂️",
  },
  {
    id: "mkt_6",
    name: "Web Research Agent",
    description: "Browses the web, verifies sources and writes cited briefs",
    creator: "SafalVir Labs",
    category: "Research",
    llmLabel: "Claude Sonnet",
    mcpLabels: ["Browser"],
    apiLabels: [],
    downloads: 3540,
    rating: 4.6,
    updatedAt: daysAgo(4),
    verified: true,
    featured: false,
    isNew: true,
    icon: "🌐",
  },
];

// ---------- Store ----------

interface AIStudioState {
  llms: LLMConnection[];
  mcps: MCPServer[];
  apis: APIConnection[];
  agents: Agent[];
  marketplace: MarketplaceAgent[];

  // LLM actions
  addLLM: (llm: Omit<LLMConnection, "id" | "createdAt">) => LLMConnection;
  updateLLM: (id: string, patch: Partial<LLMConnection>) => void;
  removeLLM: (id: string) => void;
  duplicateLLM: (id: string) => void;
  testLLM: (id: string, prompt: string) => Promise<LLMTestResult>;

  // MCP actions
  addMCP: (mcp: Omit<MCPServer, "id" | "createdAt">) => MCPServer;
  updateMCP: (id: string, patch: Partial<MCPServer>) => void;
  removeMCP: (id: string) => void;
  testMCP: (id: string) => Promise<{ success: boolean; responseTimeMs: number; toolCount: number }>;

  // API actions
  addAPI: (api: Omit<APIConnection, "id" | "createdAt">) => APIConnection;
  updateAPI: (id: string, patch: Partial<APIConnection>) => void;
  removeAPI: (id: string) => void;
  duplicateAPI: (id: string) => void;

  // Agent actions
  addAgent: (agent: Omit<Agent, "id" | "createdAt" | "updatedAt">) => Agent;
  updateAgent: (id: string, patch: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  cloneAgent: (id: string) => Agent | null;
}

export const useAIStudioStore = create<AIStudioState>()(
  persist(
    (set, get) => ({
      llms: seedLLMs,
      mcps: seedMCPs,
      apis: seedAPIs,
      agents: seedAgents,
      marketplace: seedMarketplace,

      // ----- LLMs -----
      addLLM: (llm) => {
        const created: LLMConnection = { ...llm, id: newId("llm"), createdAt: now };
        set((s) => ({ llms: [created, ...s.llms] }));
        return created;
      },
      updateLLM: (id, patch) =>
        set((s) => ({
          llms: s.llms.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      removeLLM: (id) => set((s) => ({ llms: s.llms.filter((l) => l.id !== id) })),
      duplicateLLM: (id) => {
        const src = get().llms.find((l) => l.id === id);
        if (!src) return;
        const copy: LLMConnection = {
          ...src,
          id: newId("llm"),
          name: `${src.name} (Copy)`,
          usedByAgentIds: [],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ llms: [copy, ...s.llms] }));
      },
      testLLM: async (id, prompt) => {
        const llm = get().llms.find((l) => l.id === id);
        await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
        const ok = !!llm && (llm.provider === "ollama" || llm.apiKey.trim().length >= 8);
        const tokens = Math.floor(80 + Math.random() * 300);
        const result: LLMTestResult = {
          success: ok,
          response: ok
            ? `Hello! This is a simulated response from ${llm?.config.defaultModel ?? "the model"} to: "${prompt.slice(0, 80)}". The connection is working correctly.`
            : "Authentication failed. Please check your API key and try again.",
          modelUsed: llm?.config.defaultModel ?? "-",
          tokensUsed: ok ? tokens : 0,
          responseTimeMs: Math.floor(400 + Math.random() * 900),
          estimatedCost: ok ? +(tokens * (llm?.estimatedCostPer1k ?? 0.005) / 1000).toFixed(5) : 0,
          health: ok ? "healthy" : "down",
        };
        if (llm) {
          get().updateLLM(id, {
            lastTestedAt: new Date().toISOString(),
            health: result.health,
            status: ok ? "active" : "error",
          });
        }
        return result;
      },

      // ----- MCPs -----
      addMCP: (mcp) => {
        const created: MCPServer = { ...mcp, id: newId("mcp"), createdAt: now };
        set((s) => ({ mcps: [created, ...s.mcps] }));
        return created;
      },
      updateMCP: (id, patch) =>
        set((s) => ({
          mcps: s.mcps.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      removeMCP: (id) => set((s) => ({ mcps: s.mcps.filter((m) => m.id !== id) })),
      testMCP: async (id) => {
        const mcp = get().mcps.find((m) => m.id === id);
        await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
        const success = !!mcp && (mcp.transport === "stdio" ? !!mcp.command : !!mcp.serverUrl);
        if (mcp) {
          get().updateMCP(id, {
            lastConnectedAt: new Date().toISOString(),
            health: success ? "healthy" : "down",
            status: success ? "active" : "error",
          });
        }
        return {
          success,
          responseTimeMs: Math.floor(120 + Math.random() * 400),
          toolCount: mcp?.tools.filter((t) => t.enabled).length ?? 0,
        };
      },

      // ----- APIs -----
      addAPI: (api) => {
        const created: APIConnection = { ...api, id: newId("api"), createdAt: now };
        set((s) => ({ apis: [created, ...s.apis] }));
        return created;
      },
      updateAPI: (id, patch) =>
        set((s) => ({
          apis: s.apis.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      removeAPI: (id) => set((s) => ({ apis: s.apis.filter((a) => a.id !== id) })),
      duplicateAPI: (id) => {
        const src = get().apis.find((a) => a.id === id);
        if (!src) return;
        const copy: APIConnection = {
          ...src,
          id: newId("api"),
          name: `${src.name} (Copy)`,
          usedByAgentIds: [],
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ apis: [copy, ...s.apis] }));
      },

      // ----- Agents -----
      addAgent: (agent) => {
        const ts = new Date().toISOString();
        const created: Agent = { ...agent, id: newId("agent"), createdAt: ts, updatedAt: ts };
        set((s) => ({ agents: [created, ...s.agents] }));
        return created;
      },
      updateAgent: (id, patch) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
          ),
        })),
      removeAgent: (id) =>
        set((s) => ({ agents: s.agents.filter((a) => a.id !== id) })),
      cloneAgent: (id) => {
        const src = get().agents.find((a) => a.id === id);
        if (!src) return null;
        const ts = new Date().toISOString();
        const copy: Agent = {
          ...src,
          id: newId("agent"),
          name: `${src.name} (Copy)`,
          status: "draft",
          deployed: false,
          totalRuns: 0,
          createdAt: ts,
          updatedAt: ts,
        };
        set((s) => ({ agents: [copy, ...s.agents] }));
        return copy;
      },
    }),
    {
      name: "safal-ai-studio",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
