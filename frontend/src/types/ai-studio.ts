// ---------- AI Studio types ----------

export type ConnectionStatus = "active" | "inactive" | "error";
export type HealthStatus = "healthy" | "degraded" | "down" | "unknown";

// ---------- LLM Connections ----------

export type LLMProvider =
  | "openai"
  | "anthropic"
  | "google"
  | "grok"
  | "deepseek"
  | "mistral"
  | "cohere"
  | "openrouter"
  | "azure-openai"
  | "ollama"
  | "custom";

export interface LLMModelConfig {
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

export interface LLMConnection {
  id: string;
  name: string;
  description: string;
  tags: string[];
  provider: LLMProvider;
  // Auth
  apiKey: string;
  organizationId: string;
  projectId: string;
  baseUrl: string;
  keyValidated: boolean;
  // Model config
  config: LLMModelConfig;
  // Meta / status
  status: ConnectionStatus;
  health: HealthStatus;
  contextWindow: number;
  lastTestedAt: string | null;
  estimatedCostPer1k: number; // USD per 1K tokens (blended estimate)
  usedByAgentIds: string[];
  createdBy: string;
  createdAt: string;
}

// ---------- MCP Servers ----------

export type MCPCategory =
  | "filesystem"
  | "github"
  | "jira"
  | "slack"
  | "browser"
  | "google-drive"
  | "notion"
  | "database"
  | "sharepoint"
  | "confluence"
  | "custom";

export type MCPTransport = "stdio" | "http" | "https" | "sse" | "websocket";

export type MCPAuthType =
  | "none"
  | "api_key"
  | "bearer"
  | "oauth"
  | "jwt"
  | "basic";

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: MCPCategory;
  // Connection
  transport: MCPTransport;
  serverUrl: string;
  command: string;
  workingDirectory: string;
  envVars: KeyValuePair[];
  secretVars: KeyValuePair[];
  // Auth
  authType: MCPAuthType;
  authValue: string;
  headers: KeyValuePair[];
  certificate: string;
  // Tools
  tools: MCPTool[];
  // Meta / status
  status: ConnectionStatus;
  health: HealthStatus;
  usedByAgentIds: string[];
  lastConnectedAt: string | null;
  createdBy: string;
  createdAt: string;
}

// ---------- API Connections ----------

export type APIAuthType = "api_key" | "bearer" | "oauth" | "jwt" | "basic";

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface APIEndpoint {
  id: string;
  method: HTTPMethod;
  path: string;
  description: string;
  enabled: boolean;
}

export interface APIConnection {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  baseUrl: string;
  // Auth
  authType: APIAuthType;
  authValue: string;
  headers: KeyValuePair[];
  queryParams: KeyValuePair[];
  secretVars: KeyValuePair[];
  // Endpoints
  endpoints: APIEndpoint[];
  // Meta / status
  status: ConnectionStatus;
  lastUsedAt: string | null;
  usedByAgentIds: string[];
  createdBy: string;
  createdAt: string;
}

// ---------- Agents ----------

export type AgentVisibility = "private" | "team" | "public";
export type AgentStatus = "draft" | "active" | "inactive" | "archived";

export type DeploymentTarget =
  | "web-chat"
  | "rest-api"
  | "embed-widget"
  | "slack"
  | "ms-teams";

export interface AgentInstructions {
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
}

export interface AgentMCPSelection {
  mcpServerId: string;
  toolIds: string[]; // subset of the server's enabled tools
}

export interface AgentAPISelection {
  apiConnectionId: string;
  endpointIds: string[];
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  icon: string; // emoji
  version: string;
  status: AgentStatus;
  // Resources
  llmConnectionId: string | null;
  fallbackLLMConnectionId: string | null;
  mcpSelections: AgentMCPSelection[];
  apiSelections: AgentAPISelection[];
  // Intelligence
  instructions: AgentInstructions;
  // Deployment
  visibility: AgentVisibility;
  deploymentTargets: DeploymentTarget[];
  deployed: boolean;
  agentUrl: string;
  apiEndpoint: string;
  embedCode: string;
  // Wizard state (for resuming drafts)
  wizardStep: number;
  // Meta
  totalRuns: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- Marketplace ----------

export interface MarketplaceAgent {
  id: string;
  name: string;
  description: string;
  creator: string;
  category: string;
  llmLabel: string;
  mcpLabels: string[];
  apiLabels: string[];
  downloads: number;
  rating: number; // 0-5
  updatedAt: string;
  verified: boolean;
  featured: boolean;
  isNew: boolean;
  icon: string;
}

// ---------- Test / playground results ----------

export interface LLMTestResult {
  success: boolean;
  response: string;
  modelUsed: string;
  tokensUsed: number;
  responseTimeMs: number;
  estimatedCost: number;
  health: HealthStatus;
}

export interface AgentChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  // execution details (assistant messages only)
  llmLabel?: string;
  mcpCalls?: string[];
  apiCalls?: string[];
  timeline?: { step: string; ms: number }[];
  responseTimeMs?: number;
  tokensUsed?: number;
  estimatedCost?: number;
  error?: string;
}
