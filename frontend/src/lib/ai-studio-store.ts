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
  MCPTestResult,
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

interface MCPToolDef {
  name: string;
  description: string;
  group: string;
  permission: "read" | "write" | "admin";
}

export const MCP_CATEGORY_TOOLS: Record<string, MCPToolDef[]> = {
  filesystem: [
    { name: "Read File", description: "Read the contents of a file", group: "Files", permission: "read" },
    { name: "List Directory", description: "List files in a directory", group: "Files", permission: "read" },
    { name: "Search Files", description: "Search files by name or content", group: "Files", permission: "read" },
    { name: "Write File", description: "Create or overwrite a file", group: "Files", permission: "write" },
    { name: "Rename File", description: "Rename or move a file", group: "Files", permission: "write" },
    { name: "Delete File", description: "Permanently delete a file", group: "Administration", permission: "admin" },
  ],
  github: [
    { name: "Search Repository", description: "Search repositories and metadata", group: "Repository", permission: "read" },
    { name: "Read Repository", description: "Read repository files and metadata", group: "Repository", permission: "read" },
    { name: "Read File", description: "Read a file from a repository", group: "Repository", permission: "read" },
    { name: "List Pull Requests", description: "List open pull requests", group: "Repository", permission: "read" },
    { name: "Create Issue", description: "Open a new issue", group: "Issue Management", permission: "write" },
    { name: "Update Issue", description: "Update an existing issue", group: "Issue Management", permission: "write" },
    { name: "Delete Issue", description: "Delete an issue", group: "Issue Management", permission: "admin" },
    { name: "List Branches", description: "List repository branches", group: "Administration", permission: "read" },
    { name: "Delete Branch", description: "Delete a branch", group: "Administration", permission: "admin" },
    { name: "Delete Repository", description: "Permanently delete a repository", group: "Administration", permission: "admin" },
  ],
  gitlab: [
    { name: "Search Projects", description: "Search GitLab projects", group: "Projects", permission: "read" },
    { name: "Read Repository", description: "Read repository files", group: "Projects", permission: "read" },
    { name: "List Merge Requests", description: "List open merge requests", group: "Projects", permission: "read" },
    { name: "Create Issue", description: "Open a new issue", group: "Issue Management", permission: "write" },
    { name: "Create Merge Request", description: "Open a merge request", group: "Projects", permission: "write" },
    { name: "Delete Project", description: "Permanently delete a project", group: "Administration", permission: "admin" },
  ],
  jira: [
    { name: "Search Issues", description: "Search issues with JQL", group: "Issues", permission: "read" },
    { name: "Read Issue", description: "Read issue details", group: "Issues", permission: "read" },
    { name: "Create Issue", description: "Create a new Jira issue", group: "Issues", permission: "write" },
    { name: "Update Issue", description: "Update fields on an issue", group: "Issues", permission: "write" },
    { name: "Add Comment", description: "Comment on an issue", group: "Issues", permission: "write" },
    { name: "Transition Issue", description: "Move an issue through workflow", group: "Workflow", permission: "write" },
    { name: "Delete Issue", description: "Delete an issue", group: "Administration", permission: "admin" },
  ],
  slack: [
    { name: "Read Channel", description: "Read channel history", group: "Messages", permission: "read" },
    { name: "Search Messages", description: "Search across the workspace", group: "Messages", permission: "read" },
    { name: "List Channels", description: "List available channels", group: "Channels", permission: "read" },
    { name: "Send Message", description: "Post a message to a channel", group: "Messages", permission: "write" },
    { name: "Archive Channel", description: "Archive a channel", group: "Administration", permission: "admin" },
  ],
  browser: [
    { name: "Navigate", description: "Open a URL", group: "Navigation", permission: "read" },
    { name: "Read Page", description: "Extract page content", group: "Navigation", permission: "read" },
    { name: "Screenshot", description: "Capture a screenshot", group: "Navigation", permission: "read" },
    { name: "Click Element", description: "Click on a page element", group: "Interaction", permission: "write" },
    { name: "Fill Form", description: "Type into form fields", group: "Interaction", permission: "write" },
  ],
  "google-drive": [
    { name: "Search Files", description: "Search Drive files", group: "Files", permission: "read" },
    { name: "Read Document", description: "Read a document's content", group: "Files", permission: "read" },
    { name: "Create Document", description: "Create a new document", group: "Files", permission: "write" },
    { name: "Share File", description: "Update sharing settings", group: "Administration", permission: "admin" },
  ],
  notion: [
    { name: "Search Pages", description: "Search across the workspace", group: "Pages", permission: "read" },
    { name: "Read Page", description: "Read page blocks", group: "Pages", permission: "read" },
    { name: "Create Page", description: "Create a new page", group: "Pages", permission: "write" },
    { name: "Update Page", description: "Update page content", group: "Pages", permission: "write" },
  ],
  sharepoint: [
    { name: "Search Sites", description: "Search SharePoint sites", group: "Sites", permission: "read" },
    { name: "Read Document", description: "Read a document", group: "Documents", permission: "read" },
    { name: "Upload Document", description: "Upload a file to a library", group: "Documents", permission: "write" },
    { name: "List Libraries", description: "List document libraries", group: "Sites", permission: "read" },
  ],
  database: [
    { name: "Run Query", description: "Execute a read-only SQL query", group: "Query", permission: "read" },
    { name: "List Tables", description: "List tables and schemas", group: "Schema", permission: "read" },
    { name: "Describe Table", description: "Show table structure", group: "Schema", permission: "read" },
    { name: "Insert Row", description: "Insert data into a table", group: "Data", permission: "write" },
    { name: "Update Rows", description: "Update rows matching a filter", group: "Data", permission: "write" },
    { name: "Delete Rows", description: "Delete rows matching a filter", group: "Administration", permission: "admin" },
  ],
  salesforce: [
    { name: "Search Records", description: "Search Salesforce records with SOQL", group: "Records", permission: "read" },
    { name: "Read Record", description: "Read a record's fields", group: "Records", permission: "read" },
    { name: "Create Record", description: "Create a new record", group: "Records", permission: "write" },
    { name: "Update Record", description: "Update record fields", group: "Records", permission: "write" },
    { name: "Delete Record", description: "Delete a record", group: "Administration", permission: "admin" },
  ],
  sap: [
    { name: "Read Business Object", description: "Read SAP business object data", group: "Business Objects", permission: "read" },
    { name: "Search Documents", description: "Search SAP documents", group: "Business Objects", permission: "read" },
    { name: "Create Document", description: "Create a business document", group: "Business Objects", permission: "write" },
    { name: "Post Transaction", description: "Post a financial transaction", group: "Transactions", permission: "admin" },
  ],
  "microsoft-365": [
    { name: "Search Mail", description: "Search Outlook mail", group: "Mail", permission: "read" },
    { name: "Read Calendar", description: "Read calendar events", group: "Calendar", permission: "read" },
    { name: "Send Mail", description: "Send an email", group: "Mail", permission: "write" },
    { name: "Create Event", description: "Create a calendar event", group: "Calendar", permission: "write" },
    { name: "Read OneDrive Files", description: "Read files from OneDrive", group: "Files", permission: "read" },
  ],
  aws: [
    { name: "List Resources", description: "List AWS resources", group: "Resources", permission: "read" },
    { name: "Read S3 Object", description: "Read an object from S3", group: "Storage", permission: "read" },
    { name: "Write S3 Object", description: "Upload an object to S3", group: "Storage", permission: "write" },
    { name: "Invoke Lambda", description: "Invoke a Lambda function", group: "Compute", permission: "write" },
    { name: "Terminate Instance", description: "Terminate an EC2 instance", group: "Administration", permission: "admin" },
  ],
  azure: [
    { name: "List Resources", description: "List Azure resources", group: "Resources", permission: "read" },
    { name: "Read Blob", description: "Read a blob from storage", group: "Storage", permission: "read" },
    { name: "Write Blob", description: "Upload a blob to storage", group: "Storage", permission: "write" },
    { name: "Run Function", description: "Invoke an Azure Function", group: "Compute", permission: "write" },
    { name: "Delete Resource", description: "Delete an Azure resource", group: "Administration", permission: "admin" },
  ],
  confluence: [
    { name: "Search Pages", description: "Search Confluence pages", group: "Pages", permission: "read" },
    { name: "Read Page", description: "Read page content", group: "Pages", permission: "read" },
    { name: "Create Page", description: "Create a new page", group: "Pages", permission: "write" },
    { name: "Update Page", description: "Update an existing page", group: "Pages", permission: "write" },
  ],
  custom: [
    { name: "Custom Tool", description: "Tool exposed by the custom server", group: "General", permission: "read" },
  ],
};

// ---------- MCP defaults ----------

export const defaultMCPCredentials = () => ({
  apiKey: "",
  bearerToken: "",
  username: "",
  password: "",
  clientId: "",
  clientSecret: "",
  accessToken: "",
  refreshToken: "",
});

export const defaultMCPSecurity = () => ({
  verifySSL: true,
  allowSelfSigned: false,
  encryptCredentials: true,
});

export const defaultMCPSettings = () => ({
  autoSyncTools: true,
  healthMonitoring: true,
  connectionLogging: true,
  autoRefreshToolList: true,
  toolUsageTracking: true,
  rateLimiting: false,
  maxConcurrentRequests: 10,
  maxToolCallsPerRequest: 20,
  connectionTimeoutSeconds: 30,
  retryStrategy: "exponential" as const,
  retryAttempts: 3,
});

export const defaultAgentAPIConfig = () => ({
  timeoutSeconds: 30,
  retryCount: 2,
  rateLimitRpm: 60,
});

export const defaultAgentMCPConfig = () => ({
  permissionMode: "read_write" as const,
  maxToolCalls: 20,
  toolTimeoutSeconds: 30,
  retryFailedCalls: true,
  parallelExecution: false,
  toolCaching: true,
  logToolCalls: true,
  approvalRules: { create: false, update: false, delete: true, admin: true },
  toolPriority: "medium" as const,
});

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

export const mkTools = (category: string): MCPTool[] =>
  (MCP_CATEGORY_TOOLS[category] ?? MCP_CATEGORY_TOOLS.custom).map((t, i) => ({
    id: `tool_${category}_${i}`,
    name: t.name,
    description: t.description,
    category: t.group,
    version: "1.0",
    permission: t.permission,
    enabled: t.permission !== "admin",
  }));

const seedMCPs: MCPServer[] = [
  {
    id: "mcp_seed_github",
    name: "github-mcp-prod",
    displayName: "GitHub MCP",
    description: "Access repositories, issues and pull requests",
    category: "github",
    tags: ["engineering"],
    version: "1.2.0",
    environment: "production",
    icon: "🐙",
    transport: "stdio",
    endpointUrl: "",
    baseUrl: "",
    healthCheckEndpoint: "",
    command: "npx -y @modelcontextprotocol/server-github",
    workingDirectory: "",
    port: "",
    timeoutSeconds: 30,
    retryCount: 3,
    autoReconnect: true,
    authType: "api_key",
    credentials: { ...defaultMCPCredentials(), apiKey: "ghp_************" },
    headersJson: "",
    envVars: [],
    secretVars: [{ key: "GITHUB_TOKEN", value: "ghp_************" }],
    security: defaultMCPSecurity(),
    certificate: "",
    settings: defaultMCPSettings(),
    tools: mkTools("github"),
    serverVersion: "1.2.3",
    protocolVersion: "MCP 2025.1",
    status: "active",
    health: "healthy",
    usedByAgentIds: ["agent_seed_support"],
    lastTestedAt: daysAgo(1),
    lastSyncedAt: daysAgo(1),
    lastConnectedAt: daysAgo(1),
    updatedAt: daysAgo(1),
    createdBy: "Tirth Thaker",
    createdAt: daysAgo(14),
  },
  {
    id: "mcp_seed_fs",
    name: "filesystem-mcp-dev",
    displayName: "Filesystem MCP",
    description: "Read and write files in the shared workspace",
    category: "filesystem",
    tags: ["core"],
    version: "1.0.0",
    environment: "development",
    icon: "📁",
    transport: "stdio",
    endpointUrl: "",
    baseUrl: "",
    healthCheckEndpoint: "",
    command: "npx -y @modelcontextprotocol/server-filesystem /workspace",
    workingDirectory: "/workspace",
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
    tools: mkTools("filesystem"),
    serverVersion: "1.0.4",
    protocolVersion: "MCP 2025.1",
    status: "active",
    health: "healthy",
    usedByAgentIds: [],
    lastTestedAt: daysAgo(3),
    lastSyncedAt: daysAgo(2),
    lastConnectedAt: daysAgo(3),
    updatedAt: daysAgo(2),
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
    resourceType: "mcp",
    mcpSelections: [
      {
        mcpServerId: "mcp_seed_github",
        toolIds: ["tool_github_0", "tool_github_1"],
        ...defaultAgentMCPConfig(),
      },
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
    deploymentStatus: "live",
    agentUrl: "https://ai.safalvir.com/agents/agt_seed_support",
    chatUrl: "https://ai.safalvir.com/chat/agt_seed_support",
    apiEndpoint: "POST /api/v1/agents/agt_seed_support/chat",
    apiKey: "sk_safal_************",
    embedCode: `<script src="https://agents.safalvir.com/embed.js" data-agent="support-copilot"></script>`,
    wizardStep: 5,
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
  duplicateMCP: (id: string) => void;
  syncMCPTools: (id: string) => Promise<number>;
  testMCP: (id: string) => Promise<MCPTestResult>;

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
      duplicateMCP: (id) => {
        const src = get().mcps.find((m) => m.id === id);
        if (!src) return;
        const ts = new Date().toISOString();
        const copy: MCPServer = {
          ...src,
          id: newId("mcp"),
          name: `${src.name}-copy`,
          displayName: `${src.displayName} (Copy)`,
          usedByAgentIds: [],
          createdAt: ts,
          updatedAt: ts,
        };
        set((s) => ({ mcps: [copy, ...s.mcps] }));
      },
      syncMCPTools: async (id) => {
        const mcp = get().mcps.find((m) => m.id === id);
        await new Promise((r) => setTimeout(r, 700 + Math.random() * 400));
        if (!mcp) return 0;
        const fresh = mkTools(mcp.category).map((t) => {
          const existing = mcp.tools.find((x) => x.name === t.name);
          return existing ? { ...t, enabled: existing.enabled } : t;
        });
        get().updateMCP(id, {
          tools: fresh,
          lastSyncedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        return fresh.length;
      },
      testMCP: async (id) => {
        const mcp = get().mcps.find((m) => m.id === id);
        await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));
        const connected =
          !!mcp && (mcp.transport === "stdio" ? !!mcp.command : !!mcp.endpointUrl);
        const authOk = connected && (mcp.authType === "none" || true);
        const ts = new Date().toISOString();
        if (mcp) {
          get().updateMCP(id, {
            lastTestedAt: ts,
            lastConnectedAt: connected ? ts : mcp.lastConnectedAt,
            health: connected ? "healthy" : "down",
            status: connected ? "active" : "error",
            serverVersion: connected ? mcp.serverVersion || "1.2.3" : mcp.serverVersion,
            protocolVersion: connected ? "MCP 2025.1" : mcp.protocolVersion,
          });
        }
        return {
          connected,
          serverVersion: connected ? mcp?.serverVersion || "1.2.3" : "-",
          protocolVersion: connected ? "MCP 2025.1" : "-",
          authSuccessful: authOk,
          toolCount: mcp?.tools.filter((t) => t.enabled).length ?? 0,
          latencyMs: Math.floor(120 + Math.random() * 300),
          executionTimeSec: +(0.2 + Math.random() * 0.5).toFixed(2),
          health: connected ? ("healthy" as const) : ("down" as const),
          logs: connected
            ? ["Connected Successfully", "Authentication Passed", "Tools Loaded", "Health Check Passed"]
            : ["Connection Failed", mcp?.transport === "stdio" ? "Command missing or invalid" : "Endpoint URL unreachable"],
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
      // v2: enterprise MCP fields — key bumped so stale persisted data doesn't
      // miss the new required fields
      name: "safal-ai-studio-v3",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
